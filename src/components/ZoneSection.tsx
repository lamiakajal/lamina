import type { Zone } from "@/lib/zones";
import Reveal from "./Reveal";
import WaveDivider from "./WaveDivider";

const fmt = new Intl.NumberFormat("en-US");

type Props = { zone: Zone; index: number };

export default function ZoneSection({ zone, index }: Props) {
  const right = index % 2 === 1;
  const n = String(index + 1).padStart(2, "0");

  return (
    <section
      id={`zone-${index}`}
      aria-labelledby={`zone-${index}-title`}
      className={`relative flex min-h-[125svh] items-center px-6 sm:min-h-[140vh] sm:px-14 lg:px-24 ${right ? "sm:justify-end" : "sm:justify-start"}`}
    >
      <WaveDivider level={index} />
      <Reveal className="glass relative w-full max-w-xl p-7 text-shadow sm:p-10">
        <span
          aria-hidden
          className="outline-num pointer-events-none absolute -top-20 -left-2 select-none font-display text-[8rem] leading-none sm:-top-32 sm:-left-3 sm:text-[15rem]"
        >
          {n}
        </span>

        <p className="eyebrow relative text-brass">
          Zone {n} · {zone.technical}
        </p>
        <h2
          id={`zone-${index}-title`}
          className="relative mt-4 font-display text-[clamp(2.8rem,7vw,5rem)] leading-[1.02]"
        >
          {zone.title}
        </h2>
        <p className="relative mt-3 font-display text-xl italic text-aqua sm:text-2xl">{zone.kicker}</p>

        <p className="eyebrow mt-8 flex items-center gap-4 text-[0.68rem] text-pearl/70">
          <span>{fmt.format(zone.from)} m</span>
          <span aria-hidden className="h-px flex-1 bg-pearl/30" />
          <span>{fmt.format(zone.to)} m</span>
        </p>

        <p className="mt-6 text-base leading-relaxed text-pearl/90 sm:text-lg">{zone.body}</p>

        <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-pearl/20 pt-6 text-sm sm:grid-cols-3">
          {[
            ["Light", zone.light],
            ["Pressure", zone.pressure],
            ["Temperature", zone.temperature],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-[0.62rem] text-pearl/55">{k}</dt>
              <dd className="mt-1.5 leading-snug text-pearl">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 border-l-2 border-brass/70 pl-4 text-sm leading-relaxed text-pearl/80">{zone.fact}</p>

        <ul className="mt-8 divide-y divide-pearl/15 border-y border-pearl/15 text-sm">
          {zone.species.slice(0, 3).map((s) => (
            <li key={s.name} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="font-medium text-pearl sm:w-40 sm:shrink-0">{s.name}</span>
              <span className="text-pearl/65">{s.note}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
