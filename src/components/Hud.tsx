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
    </div>
  );
}
