"use client";

import { useEffect, useRef, useState } from "react";
import { wavePath } from "@/lib/wave";
import { LaminaMark } from "./LaminaLogo";

const MIN_MS = 1700; // long enough to read, short enough not to annoy
const FINAL_DEPTH = 11000;
const fmt = new Intl.NumberFormat("en-US");

const W = 1200;
const H = 40;
const crest = `${wavePath(W, 20, 8, 300)} L${W} ${H} L0 ${H} Z`;
const crestBack = `${wavePath(W, 20, 10, 190)} L${W} ${H} L0 ${H} Z`;

// which layer of the ocean the counter has reached
const LAYERS: [number, string][] = [
  [0, "Sunlight zone"],
  [200, "Twilight zone"],
  [1000, "Midnight zone"],
  [4000, "The abyss"],
  [6000, "Hadal trench"],
];

// fixed numbers, so the server and the browser draw the same bubbles
const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 8) % 96}%`,
  size: 6 + ((i * 7) % 5) * 4,
  dur: 5 + ((i * 3) % 6),
  delay: -((i * 1.7) % 7),
  dx: ((i % 2 ? 1 : -1) * (10 + ((i * 11) % 30))),
}));

/**
 * Full-screen loader. The water rises while the page gets ready, and the
 * counter "dives" from 0 to 11,000 m. Then the curtain lifts.
 */
export default function Preloader() {
  const fillRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduced ? 300 : MIN_MS;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const started = performance.now();
    let pageReady = document.readyState === "complete";
    let fontsReady = false;
    const onLoad = () => {
      pageReady = true;
    };
    if (!pageReady) window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => (fontsReady = true)).catch(() => (fontsReady = true));
    if (!document.fonts) fontsReady = true;

    // never trap someone on the loader
    const failSafe = window.setTimeout(() => {
      pageReady = true;
      fontsReady = true;
    }, 6000);

    let shown = 0;
    let raf = 0;
    let exitTimer = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const ready = pageReady && fontsReady && now - started >= minMs;
      // creep toward 88% while waiting, then finish the last stretch
      const target = ready ? 100 : Math.min(88, ((now - started) / minMs) * 88);
      shown += (target - shown) * (1 - Math.exp(-dt * (ready ? 7 : 4)));

      // starts just below the screen and ends above it, so the water fills every pixel
      if (fillRef.current) fillRef.current.style.transform = `translateY(${(100 - shown) * 1.2 - 12}%)`;
      const depth = Math.round((shown / 100) * FINAL_DEPTH);
      if (depthRef.current) depthRef.current.textContent = fmt.format(depth);
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown / 100})`;
      if (layerRef.current) {
        const name = [...LAYERS].reverse().find(([from]) => depth >= from)![1];
        if (layerRef.current.textContent !== name) layerRef.current.textContent = name;
      }

      if (ready && shown > 99.4) {
        setLeaving(true);
        root.style.overflow = "";
        exitTimer = window.setTimeout(() => setGone(true), 1000);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(failSafe);
      window.removeEventListener("load", onLoad);
      root.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-label="Loading Lamina"
      className={`preloader fixed inset-0 z-[100] overflow-hidden bg-ink transition-[transform,opacity] duration-[950ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
        leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {/* rising water */}
      <div ref={fillRef} aria-hidden className="absolute inset-x-0 bottom-0 top-0 translate-y-[108%] will-change-transform">
        <svg
          className="wave-drift absolute -top-[52px] left-0 h-[54px] w-[200%] text-[#1aa7c4]/45"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ "--wave-speed": "9s", animationDirection: "reverse" } as React.CSSProperties}
        >
          <path d={crestBack} fill="currentColor" />
        </svg>
        <svg
          className="wave-drift absolute -top-[39px] left-0 h-[40px] w-[200%] text-[#1190ad]"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ "--wave-speed": "5s" } as React.CSSProperties}
        >
          <path d={crest} fill="currentColor" />
        </svg>
        <div className="h-full bg-gradient-to-b from-[#1190ad] via-[#0a4a68] to-[#03121e]" />
        {/* soft light from the surface */}
        <div className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(180_240_250/0.28),transparent_70%)]" />
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{ left: b.left, width: b.size, height: b.size, "--dur": `${b.dur}s`, "--delay": `${b.delay}s`, "--dx": `${b.dx}px` } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
        <LaminaMark size={64} className="text-aqua" />
        <div>
          <p className="font-display text-7xl leading-none tabular-nums text-shadow sm:text-8xl">
            <span ref={depthRef}>0</span>
            <span className="ml-2 text-3xl text-pearl/70 sm:text-4xl">m</span>
          </p>
          <p ref={layerRef} className="eyebrow mt-5 text-[0.72rem] text-pearl/85">Sunlight zone</p>
          <div className="mx-auto mt-6 h-px w-48 overflow-hidden bg-pearl/20 sm:w-64">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-aqua" />
          </div>
        </div>
        <p className="eyebrow absolute bottom-8 text-[0.62rem] text-pearl/45">Lamina · an ocean descent</p>
      </div>
    </div>
  );
}
