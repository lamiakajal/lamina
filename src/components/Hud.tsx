"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { depthAt, pressureAt, store, zoneIndexAt } from "@/lib/store";
import { ZONES } from "@/lib/zones";

const fmt = new Intl.NumberFormat("en-US");

/** Fixed overlay: brand, live depth and pressure, current zone. */
export default function Hud() {
  const depthRef = useRef<HTMLSpanElement>(null);
  const pressureRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-4 text-shadow sm:p-6">
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: store.reduced ? "auto" : "smooth" });
        }}
        className="pointer-events-auto font-display text-2xl tracking-tight"
      >
        {SITE.name}
      </a>

      <div className="text-right" aria-live="off">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/60">Depth</p>
        <p className="font-display text-3xl leading-none tabular-nums sm:text-4xl">
          <span ref={depthRef}>0</span>
          <span className="ml-1 text-base text-white/70">m</span>
        </p>
        <p className="mt-1 text-xs text-white/70">
          <span ref={pressureRef}>1</span> atm · {ZONES[zone].name}
        </p>
      </div>

      {/* thin progress line down the right edge */}
      <div aria-hidden className="fixed bottom-[18%] right-0 top-[18%] w-[2px] bg-white/10">
        <div ref={barRef} className="h-full origin-top scale-y-0 bg-cyan-200/70" />
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
            <span className="text-[0.7rem] uppercase tracking-[0.2em] text-white/0 transition group-hover:text-white/80 group-focus-visible:text-white/80">
              {z.technical}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
