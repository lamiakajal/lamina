"use client";

import { useEffect, useRef } from "react";
import { hasVideo } from "@/lib/media";
import { store } from "@/lib/store";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Optional looping videos that sit between the 3D scene and the text.
 * Each one only renders if its file was added with `npm run media`.
 *  - hero-surface: the sunlit water at the very top, fading out as you dive
 *  - marine-snow, biolight: drifting specks, blended in over the dark zones
 */
export default function VideoLayers() {
  const hero = useRef<HTMLVideoElement>(null);
  const snow = useRef<HTMLVideoElement>(null);
  const glow = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = [hero.current, snow.current, glow.current];
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => videos.forEach((v) => (media.matches ? v?.pause() : void v?.play().catch(() => {})));
    sync();
    media.addEventListener("change", sync);

    let raf = 0;
    const loop = () => {
      const t = store.current;
      if (hero.current) hero.current.style.opacity = String(1 - clamp01(t / 0.9));
      if (snow.current) snow.current.style.opacity = String(0.55 * clamp01((t - 0.8) / 1.2));
      if (glow.current) glow.current.style.opacity = String(0.7 * clamp01((t - 1.8) / 1.2));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      media.removeEventListener("change", sync);
    };
  }, []);

  const base = "pointer-events-none fixed inset-0 z-[1] h-full w-full object-cover";
  const common = { muted: true, loop: true, playsInline: true, autoPlay: true, preload: "metadata" as const, "aria-hidden": true };

  return (
    <>
      {hasVideo("hero-surface") && <video ref={hero} src="/video/hero-surface.mp4" className={base} {...common} />}
      {hasVideo("marine-snow") && (
        <video ref={snow} src="/video/marine-snow.mp4" className={`${base} opacity-0 mix-blend-screen`} {...common} />
      )}
      {hasVideo("biolight") && (
        <video ref={glow} src="/video/biolight.mp4" className={`${base} opacity-0 mix-blend-screen`} {...common} />
      )}
    </>
  );
}
