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

/**
 * Full-screen loader. The water rises while the page gets ready, and the
 * counter "dives" from 0 to 11,000 m. Then the curtain lifts.
 */
export default function Preloader() {
  const fillRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
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

      if (fillRef.current) fillRef.current.style.transform = `translateY(${100 - shown}%)`;
      if (depthRef.current) depthRef.current.textContent = fmt.format(Math.round((shown / 100) * FINAL_DEPTH));

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
      <div ref={fillRef} aria-hidden className="absolute inset-x-0 bottom-0 top-0 translate-y-full will-change-transform">
        <svg
          className="wave-drift absolute -top-[39px] left-0 h-[40px] w-[200%] text-[#0b6f8a]"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ "--wave-speed": "5s" } as React.CSSProperties}
        >
          <path d={crest} fill="currentColor" />
        </svg>
        <div className="h-full bg-gradient-to-b from-[#0b6f8a] via-[#073a52] to-ink" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
        <LaminaMark size={64} className="text-aqua" />
        <div>
          <p className="font-display text-7xl leading-none tabular-nums sm:text-8xl">
            <span ref={depthRef}>0</span>
            <span className="ml-2 text-3xl text-pearl/70 sm:text-4xl">m</span>
          </p>
          <p className="eyebrow mt-5 text-[0.7rem] text-pearl/70">Descending</p>
        </div>
        <p className="eyebrow absolute bottom-8 text-[0.62rem] text-pearl/45">Lamina · an ocean descent</p>
      </div>
    </div>
  );
}
