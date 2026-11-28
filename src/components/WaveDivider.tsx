import type { CSSProperties } from "react";
import { wavePath } from "@/lib/wave";

// Rough at the surface, flat in the deep: one entry per zone.
const AMP = [18, 12, 7, 3, 0.8];
const SPEED = [10, 14, 20, 30, 42]; // seconds per loop

type Props = { level: number };

const W = 2400;
const H = 64;
const MID = H / 2;

export default function WaveDivider({ level }: Props) {
  const i = Math.min(AMP.length - 1, Math.max(0, level));
  const style = (speed: number) => ({ "--wave-speed": `${speed}s` }) as CSSProperties;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden text-aqua">
      <svg
        className="wave-drift absolute left-0 top-0 h-full w-[200%] opacity-40"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={style(SPEED[i])}
      >
        <path d={wavePath(W, MID, AMP[i], 400)} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <svg
        className="wave-drift absolute left-0 top-0 h-full w-[200%] opacity-20"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={style(SPEED[i] * 1.4)}
      >
        <path d={wavePath(W, MID, AMP[i] * 0.7, 300, 120)} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
