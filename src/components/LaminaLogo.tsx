import type { SVGProps } from "react";

/**
 * A round window onto the water: the sun, the surface wave, and three thin layers
 * that shorten and fade as you go down. "Lamina" is Latin for a thin layer.
 */
export function LaminaMark({ size = 30, ...rest }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden {...rest}>
      <defs>
        <linearGradient id="lm-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cf0e0" />
          <stop offset="0.55" stopColor="#1b86a6" />
          <stop offset="1" stopColor="#082a40" />
        </linearGradient>
        <clipPath id="lm-clip">
          <circle cx="20" cy="20" r="17.5" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="17.5" fill="url(#lm-water)" />
      <g clipPath="url(#lm-clip)" fill="none" strokeLinecap="round">
        <path d="M0 14.5q5-4.6 10 0t10 0 10 0 10 0" stroke="#fff" strokeWidth="2.2" strokeOpacity="0.95" />
        <path d="M8 22h24" stroke="#fff" strokeWidth="2" strokeOpacity="0.62" />
        <path d="M12 27.5h16" stroke="#fff" strokeWidth="2" strokeOpacity="0.38" />
        <path d="M16 33h8" stroke="#fff" strokeWidth="2" strokeOpacity="0.2" />
      </g>
      <circle cx="29" cy="8.6" r="2.1" fill="#f0cf8c" />
      <circle cx="20" cy="20" r="17.5" fill="none" stroke="#fff" strokeOpacity="0.28" />
    </svg>
  );
}

export default function LaminaLogo({ size = 30, word = true, className = "" }: { size?: number; word?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LaminaMark size={size} />
      {word && <span className="font-display text-[1.65rem] leading-none tracking-tight">Lamina</span>}
    </span>
  );
}
