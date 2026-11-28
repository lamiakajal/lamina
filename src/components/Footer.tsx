import { SITE } from "@/lib/site";
import { ZONES } from "@/lib/zones";
import LaminaLogo from "./LaminaLogo";

const ELSEWHERE = [
  { label: "Portfolio", href: SITE.author.url },
  { label: "GitHub", href: "https://github.com/lamiakajal" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lamiakajal" },
  { label: "Behance", href: "https://www.behance.net/lamiakajal" },
  { label: "Medium", href: "https://medium.com/@lamiakajal" },
];

const link = "text-pearl/65 transition hover:text-aqua";

export default function Footer() {
  return (
    <footer className="relative border-t border-pearl/15 px-6 pb-10 pt-20 sm:px-14 lg:px-24">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <LaminaLogo size={34} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-pearl/60">
            A scroll-driven descent through the ocean&apos;s five layers. A concept project, built by{" "}
            <a className="text-pearl underline-offset-4 hover:underline" href={SITE.author.url}>
              {SITE.author.name}
            </a>
            .
          </p>
        </div>

        <nav aria-label="Zones">
          <p className="eyebrow text-[0.65rem] text-brass">The dive</p>
          <ul className="mt-5 space-y-3 text-sm">
            {ZONES.map((z, i) => (
              <li key={z.id}>
                <a className={link} href={`#zone-${i}`}>
                  {z.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Page">
          <p className="eyebrow text-[0.65rem] text-brass">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><a className={link} href="#intro">The idea</a></li>
            <li><a className={link} href="#field-guide">Field guide</a></li>
            <li><a className={link} href="#programme">The programme</a></li>
            <li><a className={link} href="#finale">Join</a></li>
          </ul>
        </nav>

        <nav aria-label="Elsewhere">
          <p className="eyebrow text-[0.65rem] text-brass">Elsewhere</p>
          <ul className="mt-5 space-y-3 text-sm">
            {ELSEWHERE.map((l) => (
              <li key={l.label}>
                <a className={link} href={l.href} rel="noopener">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-4 border-t border-pearl/10 pt-6 text-xs leading-relaxed text-pearl/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.author.name}. Lamina is fictional. Facts are simplified for storytelling;
          for the science, see{" "}
          <a className="underline underline-offset-4 hover:text-aqua" href="https://oceanexplorer.noaa.gov" rel="noopener">
            NOAA Ocean Exploration
          </a>
          . Marine imagery is AI-generated.
        </p>
        <a href="#top" className="eyebrow shrink-0 text-[0.65rem] text-pearl/60 transition hover:text-aqua">
          Back to the surface ↑
        </a>
      </div>
    </footer>
  );
}
