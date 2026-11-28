"use client";

import { useEffect, useRef, useState } from "react";
import LaminaLogo from "./LaminaLogo";
import { depthAt, pressureAt, store, zoneIndexAt } from "@/lib/store";
import { wavePath } from "@/lib/wave";
import { ZONES } from "@/lib/zones";

const fmt = new Intl.NumberFormat("en-US");

/** Fixed overlay: brand, live depth and pressure, current zone. */
export default function Hud() {
  const depthRef = useRef<HTMLSpanElement>(null);
  const pressureRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const [zone, setZone] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      const t = store.current;
      const depth = depthAt(t);
      // write straight to the DOM, a React render every frame would be wasteful
      if (depthRef.current) depthRef.current.textContent = fmt.format(Math.round(depth));
      if (pressureRef.current) pressureRef.current.textContent = fmt.format(Math.round(pressureAt(depth)));
      if (barRef.current) barRef.current.style.transform = `scaleY(${t / ZONES.length})`;
      // the small wave on the meter flattens as the water goes still
      if (waveRef.current) waveRef.current.style.transform = `scaleY(${Math.max(0.08, 1 - t / 3.2)})`;
      const z = zoneIndexAt(t);
      if (z !== last) {
        last = z;
        setZone(z);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] text-shadow sm:p-6">
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: store.reduced ? "auto" : "smooth" });
        }}
        className="glass pointer-events-auto !rounded-full px-4 py-2"
        aria-label="Lamina, back to the top"
      >
        <LaminaLogo size={26} className="sm:[&_svg]:h-[30px] sm:[&_svg]:w-[30px]" />
      </a>

      <div className="text-right" aria-live="off">
        <p className="eyebrow text-white/60">Depth</p>
        <p className="font-display text-4xl leading-none tabular-nums sm:text-5xl">
          <span ref={depthRef}>0</span>
          <span className="ml-1 text-base text-white/70">m</span>
        </p>
        <div ref={waveRef} aria-hidden className="mt-2 ml-auto h-3 w-28 origin-center overflow-hidden text-aqua">
          <svg
            className="wave-drift h-full w-[200%]"
            viewBox="0 0 400 12"
            preserveAspectRatio="none"
            style={{ "--wave-speed": "6s" } as React.CSSProperties}
          >
            <path d={wavePath(400, 6, 4, 100, 0, 10)} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <p className="mt-1.5 font-mono text-[0.7rem] tracking-wide text-white/70">
          <span ref={pressureRef}>1</span> atm · {ZONES[zone].name}
        </p>
      </div>

      {/* thin progress line down the right edge */}
      <div aria-hidden className="fixed bottom-[18%] right-0 top-[18%] w-[2px] bg-white/10">
        <div ref={barRef} className="h-full origin-top scale-y-0 bg-aqua/70" />
      </div>

      {/* zone navigation, hidden on small screens */}
      <nav
        aria-label="Ocean zones"
        className="pointer-events-auto fixed left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-4 sm:flex sm:left-6"
      >
        {ZONES.map((z, i) => (
          <button
            key={z.id}
            type="button"
            aria-label={`Go to ${z.name}`}
            aria-current={i === zone ? "true" : undefined}
            onClick={() =>
              document
                .getElementById(`zone-${i}`)
                ?.scrollIntoView({ behavior: store.reduced ? "auto" : "smooth", block: "center" })
            }
            className="group flex items-center gap-3"
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full border border-white/70 transition ${
                i === zone ? "scale-125 bg-white" : "bg-transparent group-hover:bg-white/50"
              }`}
            />
            <span className="eyebrow text-[0.62rem] text-white/0 transition group-hover:text-white/80 group-focus-visible:text-white/80">
              {z.technical}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
