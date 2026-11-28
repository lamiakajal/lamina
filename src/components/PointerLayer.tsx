"use client";

import { useEffect, useRef } from "react";
import { dropFood, pointer } from "@/lib/store";

const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button']";

/**
 * Listens to the mouse and touch, hands the position to the 3D scene, and draws
 * the soft halo, the click ripple and the small hint / fed counter.
 */
export default function PointerLayer() {
  const halo = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const note = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const born = performance.now();
    let px = -100;
    let py = -100;
    let hx = -100;
    let hy = -100;

    const setPos = (cx: number, cy: number) => {
      pointer.x = (cx / window.innerWidth) * 2 - 1;
      pointer.y = -((cy / window.innerHeight) * 2 - 1);
      pointer.last = performance.now();
      pointer.seen = true;
      px = cx;
      py = cy;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch has its own handler below
      pointer.touch = false;
      setPos(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      pointer.touch = true;
      setPos(t.clientX, t.clientY);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) return;
      setPos(e.clientX, e.clientY);
      for (let i = 0; i < 4; i++) {
        dropFood(pointer.x + (Math.random() - 0.5) * 0.06, pointer.y + (Math.random() - 0.5) * 0.06);
      }
      if (!reduced) {
        const ring = document.createElement("span");
        ring.className = "food-ripple";
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
        ring.addEventListener("animationend", () => ring.remove());
        document.body.appendChild(ring);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("click", onClick);

    let raf = 0;
    const loop = (now: number) => {
      hx += (px - hx) * 0.16;
      hy += (py - hy) * 0.16;
      const live = fine && pointer.seen && now - pointer.last < 3500;
      if (halo.current) {
        halo.current.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
        halo.current.style.opacity = live ? "1" : "0";
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        dot.current.style.opacity = live ? "1" : "0";
      }

      if (note.current) {
        const showCount = pointer.fed > 0 && now - pointer.lastFed < 7000;
        const showHint = pointer.fed === 0 && now - born > 3000 && now - born < 22000;
        note.current.style.opacity = showCount || showHint ? "1" : "0";
        const text = showCount
          ? `Fish fed · ${pointer.fed}`
          : pointer.touch
            ? "Touch the screen · tap to feed the fish"
            : "Move your cursor · click to feed the fish";
        if (note.current.textContent !== text) note.current.textContent = text;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <div
        ref={halo}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-5 -mt-5 h-10 w-10 rounded-full border border-aqua/70 opacity-0 mix-blend-screen transition-opacity duration-500"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-aqua opacity-0 transition-opacity duration-500"
      />
      <div
        ref={note}
        role="note"
        className="eyebrow pointer-events-none fixed bottom-4 left-4 z-[60] rounded-full border border-pearl/20 bg-ink/50 px-4 py-2 text-[0.62rem] text-pearl/80 opacity-0 backdrop-blur-sm transition-opacity duration-700 sm:bottom-6 sm:left-6"
      />
    </>
  );
}
