import { SITE } from "@/lib/site";
import WaveMark from "./WaveMark";

export default function Hero() {
  return (
    <header className="relative flex min-h-svh items-end px-6 pb-24 sm:px-12 sm:pb-28">
      <div className="max-w-4xl text-shadow">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/80">
          A concept by {SITE.author.name}
        </p>
        <h1 className="mt-4 font-display text-[clamp(4.5rem,15vw,12rem)] leading-[0.9] tracking-tight">
          <WaveMark />
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
          {SITE.tagline}. Scroll to dive from the sunlit surface down to 11,000 metres.
        </p>
        <div className="animate-bob mt-12 text-sm tracking-[0.2em] text-white/70" aria-hidden>
          SCROLL
        </div>
      </div>
    </header>
  );
}
