import { AnimatedGradientText } from "~/components/ui/animated-gradient-text";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome() {
  return (
    <main className="flex flex-col justify-center items-center min-h-dvh">
      <h1 className="text-3xl">hello!</h1>
      <AnimatedGradientText
      speed={2}
      colorFrom="#00a6fb"
      colorTo="#003459"
      className="text-4xl font-semibold tracking-tight"
    >
      <h3 className="text-6xl">Arif Bhai</h3>
    </AnimatedGradientText>
    </main>
  );
}
