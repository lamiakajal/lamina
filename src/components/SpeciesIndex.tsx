import { hasCreature } from "@/lib/media";
import { ZONES } from "@/lib/zones";
import { LaminaMark } from "./LaminaLogo";
import Reveal from "./Reveal";

/** Every animal from the dive, grouped by layer. Uses the photo when one exists. */
export default function SpeciesIndex() {
  return (
    <section id="field-guide" aria-labelledby="guide-title" className="relative px-6 py-32 sm:px-14 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl text-shadow">
          <p className="eyebrow text-brass">Field guide</p>
          <h2 id="guide-title" className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04]">
            Who you passed on the way down
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-pearl/80">
            Twenty-four animals, from the shallows to the trench floor. The depth tells you where to look.
          </p>
        </Reveal>

        <div className="mt-20 space-y-24">
          {ZONES.map((z, zi) => (
            <div key={z.id}>
              <Reveal className="flex items-baseline justify-between gap-6 border-b border-pearl/20 pb-4">
                <h3 className="font-display text-3xl sm:text-4xl">
                  <span className="mr-4 font-mono text-sm text-brass">0{zi + 1}</span>
                  {z.name}
                </h3>
                <p className="eyebrow hidden text-[0.65rem] text-pearl/55 sm:block">
                  {z.from.toLocaleString("en-US")} to {z.to.toLocaleString("en-US")} m
                </p>
              </Reveal>

              <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {z.species.map((s, i) => (
                  <li key={s.name}>
                    <Reveal delay={(i % 3) * 80}>
                      <figure className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-pearl/10 bg-gradient-to-b from-pearl/[0.04] to-transparent">
                        {s.file && hasCreature(s.file) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/creatures/${s.file}.webp`}
                            alt={s.name}
                            loading="lazy"
                            className="h-full w-full object-contain p-4"
                          />
                        ) : (
                          <LaminaMark size={44} className="text-pearl/20" />
                        )}
                      </figure>
                      <h4 className="mt-4 text-lg font-medium text-pearl">{s.name}</h4>
                      <p className="font-display text-base italic text-aqua/90">{s.latin}</p>
                      <p className="mt-2 text-sm leading-relaxed text-pearl/65">{s.note}</p>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
