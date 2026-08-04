pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    environment {
        COMPOSE_PROJECT_NAME = 'devops-demo'
        APP_URL = 'http://127.0.0.1:8088'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Files') {
            steps {
                sh '''
                    set -eu

                    test -s Dockerfile
                    test -s compose.yaml
                    test -s nginx/default.conf
                    test -s package.json
                    test -s package-lock.json

                    docker compose config
                    echo "Project files are valid."
                '''
            }
        }

        stage('Typecheck') {
            steps {
                sh '''
                    set -eu

                    # Reuses the Dockerfile's dev-dependency stage, so this shares
                    # its npm ci layer with the image build below instead of
                    # installing twice. Nothing runs on the agent itself.
                    docker build \
                        --target development-dependencies-env \
                        --tag "${COMPOSE_PROJECT_NAME}-typecheck" \
                        .

                    docker run --rm "${COMPOSE_PROJECT_NAME}-typecheck" npm run typecheck
                '''
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                    docker compose build --pull
                '''
            }
        }

        stage('Validate Nginx') {
            steps {
                sh '''
                    docker compose run --rm --no-deps web nginx -t
                '''
            }
        }

        stage('Deploy Stack') {
            steps {
                sh '''
                    set -eu

                    # --wait blocks until app reports healthy and web is running,
                    # so the smoke test below is testing a settled stack.
                    docker compose up -d --remove-orphans --wait --wait-timeout 150
                    docker compose ps
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    set -eu

                    attempt=1

                    while [ "$attempt" -le 10 ]; do
                        if curl --fail --silent \
                            "${APP_URL}/health" | grep -q healthy; then
                            echo "Reverse proxy is healthy."
                            break
                        fi

                        if [ "$attempt" -eq 10 ]; then
                            echo "Reverse proxy health check failed."
                            exit 1
                        fi

                        echo "Waiting for web server: attempt ${attempt}/10"
                        attempt=$((attempt + 1))
                        sleep 3
                    done

                    # This app server-renders every response, so the HTML checks
                    # run against the live page instead of a static index.html.
                    body=$(curl --fail --silent --show-error "${APP_URL}/")

                    printf '%s' "$body" | grep -qi '<html'
                    printf '%s' "$body" | grep -qi '</html>'

                    # Structural marker React Router injects for hydration. Keyed
                    # on this rather than page copy, so editing the welcome text
                    # cannot break the build.
                    printf '%s' "$body" | grep -q '__reactRouterContext'
                    echo "Server-rendered page is correct."

                    # Confirms the /assets/ location block actually proxies, using
                    # a hashed filename taken from the page we just fetched.
                    asset=$(printf '%s' "$body" \
                        | grep -o '/assets/[A-Za-z0-9._-]*\\.js' \
                        | head -n 1)

                    if [ -n "$asset" ]; then
                        curl --fail --silent --output /dev/null "${APP_URL}${asset}"
                        echo "Client assets are served: ${asset}"
                    else
                        echo "No hashed asset found in the page markup."
                        exit 1
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo "Stack deployed successfully at ${APP_URL}"
        }

        failure {
            echo 'Deployment failed. Review the console output.'
            sh 'docker compose ps || true'
            sh 'docker compose logs --tail=100 app || true'
            sh 'docker compose logs --tail=100 web || true'
        }

        always {
            sh 'docker image prune -f || true'
        }
    }
}
