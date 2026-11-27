"use client";

import { useEffect, useRef, useState } from "react";
import { hasVideo } from "@/lib/media";

/**
 * A short loop of the shallows, framed above the sunlight-zone entries.
 * It only plays while it is on screen, and not at all for people who asked
 * for reduced motion or less data (the still frame is shown instead).
 */
export default function ReefReel() {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (conn?.saveData || reduced) {
      setStill(true);
      return;
    }
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (!hasVideo("reef")) return null;

  return (
    <figure className="relative mt-10 overflow-hidden rounded-2xl border border-pearl/10">
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/scenes/reef-poster.jpg" alt="Sunlight falling on a shallow reef" className="aspect-[16/8] w-full object-cover" />
      ) : (
        <video
          ref={ref}
          className="aspect-[16/8] w-full object-cover"
          src="/video/reef.mp4"
          poster="/scenes/reef-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          aria-label="Sunlight falling on a shallow reef"
        />
      )}
      <figcaption className="eyebrow absolute bottom-3 left-4 text-[0.65rem] text-pearl/80 text-shadow">
        The shallows · about 10 m
      </figcaption>
    </figure>
  );
}
