import Reveal from "./Reveal";

/**
 * A full-width photograph that breaks up the long scroll. The edges fade out so
 * it melts into the scene behind it instead of sitting in a box.
 */
export default function Plate({ src, alt, caption, place }: { src: string; alt: string; caption: string; place: string }) {
  return (
    <section aria-label={alt} className="relative py-10 sm:py-20">
      <Reveal>
        <div
          className="relative mx-auto w-full max-w-[1500px]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]" />
        </div>
        <p className="eyebrow mx-auto mt-2 max-w-6xl px-6 text-[0.65rem] text-pearl/60 sm:px-14">
          <span className="text-brass">{place}</span> · {caption}
        </p>
      </Reveal>
    </section>
  );
}
