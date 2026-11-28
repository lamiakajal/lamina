import type { Zone } from "@/lib/zones";
import WaveDivider from "./WaveDivider";

const fmt = new Intl.NumberFormat("en-US");

type Props = { zone: Zone; index: number };

export default function ZoneSection({ zone, index }: Props) {
  const right = index % 2 === 1;

  return (
    <section
      id={`zone-${index}`}
      aria-labelledby={`zone-${index}-title`}
      className={`relative flex min-h-[135vh] items-center px-6 sm:px-12 ${right ? "sm:justify-end" : "sm:justify-start"}`}
    >
      <WaveDivider level={index} />
      <article className="max-w-xl rounded-2xl border border-white/10 bg-[#020b12]/55 p-6 backdrop-blur-md sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
          Zone 0{index + 1} · {zone.technical}
        </p>
        <h2 id={`zone-${index}-title`} className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
          {zone.title}
        </h2>
        <p className="mt-2 text-sm text-cyan-100/70">
          {fmt.format(zone.from)} to {fmt.format(zone.to)} m · {zone.name}
        </p>
        <p className="mt-5 leading-relaxed text-white/85">{zone.body}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-white/50">Pressure</dt>
            <dd className="mt-1 text-white/90">{zone.pressure}</dd>
          </div>
          <div>
            <dt className="text-white/50">Light</dt>
            <dd className="mt-1 text-white/90">{zone.light}</dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-2 text-sm">
          {zone.species.map((s) => (
            <li key={s.name} className="text-white/80">
              <strong className="font-medium text-white">{s.name}</strong>
              <span className="text-white/60"> · {s.note}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
