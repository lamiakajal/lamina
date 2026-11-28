import Reveal from "./Reveal";

const PILLARS = [
  {
    n: "01",
    title: "Dive",
    text: "Small crewed expeditions that follow the same path as this page, from reef shallows to the edge of the twilight.",
  },
  {
    n: "02",
    title: "Learn",
    text: "Classroom kits and live sessions that turn depth, light and pressure into things students can measure themselves.",
  },
  {
    n: "03",
    title: "Protect",
    text: "A share of every expedition goes to mapping and protecting the habitats the dive passes through.",
  },
];

export default function Programme() {
  return (
    <section id="programme" aria-labelledby="programme-title" className="relative px-6 py-32 sm:px-14 lg:px-24">
      <div className="mx-auto max-w-6xl text-shadow">
        <Reveal className="glass max-w-2xl p-6 sm:p-8">
          <p className="eyebrow text-brass">The programme</p>
          <h2 id="programme-title" className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04]">
            Three ways to go deeper
          </h2>
          <p className="mt-4 text-sm text-pearl/55">Lamina is a fictional programme, written to show how the site could work.</p>
        </Reveal>

        <ul className="mt-16 grid gap-10 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <li key={p.n}>
              <Reveal delay={i * 110} className="glass h-full p-6 sm:p-8">
                <span className="font-mono text-sm text-brass">{p.n}</span>
                <h3 className="mt-3 font-display text-4xl">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-pearl/75">{p.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
