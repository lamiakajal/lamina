import { SITE } from "@/lib/site";
import WaveMark from "./WaveMark";

export default function Hero() {
  return (
    <header className="relative flex min-h-svh items-end px-6 pb-20 pt-32 sm:px-14 sm:pb-28 lg:px-24">
      <div className="max-w-5xl text-shadow">
        <p className="eyebrow text-brass">An ocean descent · 0 to 11,000 m</p>
        <h1 className="mt-5 font-display text-[clamp(5rem,17vw,14rem)] leading-[0.86] tracking-tight">
          <WaveMark />
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-pearl/90 sm:text-xl">
          Everything the ocean keeps beneath its surface. One scroll, five layers, and eleven thousand metres of water,
          light and life.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#intro"
            className="group inline-flex items-center gap-3 rounded-full border border-pearl/40 px-6 py-3 text-sm tracking-wide transition hover:border-aqua hover:bg-aqua/10"
          >
            Begin the descent
            <span aria-hidden className="transition group-hover:translate-y-0.5">↓</span>
          </a>
          <p className="eyebrow text-[0.65rem] text-pearl/60">Move your cursor. Click to feed the fish.</p>
        </div>
        <p className="eyebrow mt-16 text-[0.65rem] text-pearl/50">A concept by {SITE.author.name}</p>
      </div>
    </header>
  );
}
