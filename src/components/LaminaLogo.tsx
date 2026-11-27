import type { SVGProps } from "react";

/**
 * Three stacked waves inside a ring. The waves get calmer toward the bottom,
 * the same way the water does on the way down.
 */
export function LaminaMark({ size = 30, ...rest }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden {...rest}>
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M7 14q3.25-5 6.5 0t6.5 0 6.5 0 6.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 21q3.25-3.2 6.5 0t6.5 0 6.5 0 6.5 0" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 28q3.25-1.6 6.5 0t6.5 0 6.5 0 6.5 0" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LaminaLogo({ size = 30, word = true, className = "" }: { size?: number; word?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LaminaMark size={size} className="text-aqua" />
      {word && <span className="font-display text-[1.65rem] leading-none tracking-tight">Lamina</span>}
    </span>
  );
}
