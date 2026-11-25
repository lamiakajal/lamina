"use client";

import { useEffect } from "react";
import { store } from "@/lib/store";
import { ZONE_COUNT } from "@/lib/zones";

/**
 * Turns the page scroll into store.target and eases store.current toward it.
 * The zones block (#zones) is mapped onto 0..ZONE_COUNT, so the middle of
 * zone i sits at exactly i + 0.5.
 */
export default function ScrollDriver() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    store.reduced = media.matches;
    const onMedia = () => {
      store.reduced = media.matches;
    };
    media.addEventListener("change", onMedia);

    const update = () => {
      const zones = document.getElementById("zones");
      if (!zones) return;
      const y = window.scrollY;
      const half = window.innerHeight * 0.5;
      const start = zones.getBoundingClientRect().top + y - half;
      const end = start + zones.offsetHeight;
      const p = Math.min(1, Math.max(0, (y - start) / (end - start)));
      store.target = p * ZONE_COUNT;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (store.reduced) store.current = store.target;
      else store.current += (store.target - store.current) * (1 - Math.exp(-dt * 3.5));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      media.removeEventListener("change", onMedia);
    };
  }, []);

  return null;
}
