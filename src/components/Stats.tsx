import Reveal from "./Reveal";

const STATS = [
  { value: "71%", label: "of Earth's surface is ocean" },
  { value: "5", label: "layers, each with its own light" },
  { value: "11,000 m", label: "to the deepest trenches" },
  { value: "80%+", label: "of the ocean is still unexplored" },
];

export default function Stats() {
  return (
    <section aria-label="The ocean in numbers" className="relative px-6 pb-40 sm:px-14 lg:px-24">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 text-shadow lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="glass p-5 sm:p-6">
            <dd className="font-display text-5xl leading-none sm:text-6xl">{s.value}</dd>
            <dt className="mt-3 max-w-[14rem] text-sm leading-snug text-pearl/70">{s.label}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
