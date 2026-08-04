import { AnimatedGradientText } from "~/components/ui/animated-gradient-text";

const greeting = "hello!";

export function Welcome() {
  return (
    <main className="relative flex justify-center items-center min-h-dvh overflow-hidden">
      {/* ambient glow that breathes behind the text */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="animate-glow absolute left-[22%] top-[28%] size-72 rounded-full bg-[#00a6fb] blur-[110px]" />
        <div
          className="animate-glow absolute right-[22%] bottom-[28%] size-72 rounded-full bg-[#f94144] blur-[110px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <h1 className="flex items-center gap-3 text-3xl">
          <span
            aria-hidden
            className="animate-wave inline-block origin-[70%_75%]"
            style={{ animationDelay: "0.9s" }}
          >
            👋
          </span>
          <span className="sr-only">{greeting}</span>
          <span aria-hidden className="flex">
            {[...greeting].map((char, i) => (
              <span
                key={i}
                className="animate-fade-up inline-block"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* inline-flex blockifies the gradient span so bg-clip-text has a box to paint */}
        <div className="animate-reveal inline-flex" style={{ animationDelay: "600ms" }}>
          <AnimatedGradientText
            speed={2}
            colorFrom="#00a6fb"
            colorTo="#f94144"
            className="font-semibold text-6xl tracking-tight"
          >
            Arif Bhai
          </AnimatedGradientText>
        </div>

        <div
          className="animate-grow-line bg-linear-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent w-56 h-px"
          style={{ animationDelay: "1.3s" }}
        />

        <p
          className="animate-fade-up text-muted-foreground text-sm tracking-wide"
          style={{ animationDelay: "1.5s" }}
        >
          so glad you dropped by
        </p>
      </div>
    </main>
  );
}
