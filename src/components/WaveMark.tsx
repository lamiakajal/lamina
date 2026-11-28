import { wavePath } from "@/lib/wave";
import { SITE } from "@/lib/site";

const W = 1200;
const H = 24;

/** The name with a slowly drifting wave underneath. The text stays real text. */
export default function WaveMark() {
  return (
    <span className="relative inline-block pb-[0.12em]">
      {SITE.name}
      <span aria-hidden className="absolute inset-x-0 bottom-0 block h-[0.14em] overflow-hidden text-aqua">
        <svg
          className="wave-drift absolute left-0 top-0 h-full w-[200%]"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ "--wave-speed": "9s" } as React.CSSProperties}
        >
          <path d={wavePath(W, H / 2, 7, 200)} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
    </span>
  );
}
