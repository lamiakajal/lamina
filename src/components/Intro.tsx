import Reveal from "./Reveal";

export default function Intro() {
  return (
    <section id="intro" className="relative px-6 py-36 sm:px-14 lg:px-24">
      <div className="mx-auto grid max-w-6xl gap-12 text-shadow lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
        <Reveal>
          <p className="eyebrow text-brass">The idea</p>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.04]">
            Lamina is Latin for a <em className="text-aqua">thin layer</em>. The ocean is built from them.
          </h2>
        </Reveal>
        <Reveal delay={150} className="space-y-5 text-lg leading-relaxed text-pearl/85">
          <p>
            The sea is not one body of water. Light, warmth and pressure change with every metre you sink, and each
            layer has its own animals, its own rules and its own kind of quiet.
          </p>
          <p>
            Scroll to go down through all five. Watch the light fade, feel the water calm, and meet the animals that
            live there. They will notice you, too.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
