import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-white/60 sm:px-12">
      <p>
        {SITE.name} is a fictional concept project by{" "}
        <a className="text-white underline-offset-4 hover:underline" href={SITE.author.url}>
          {SITE.author.name}
        </a>
        . Facts are simplified for storytelling; for the science, see{" "}
        <a className="text-white underline-offset-4 hover:underline" href="https://oceanexplorer.noaa.gov">
          NOAA Ocean Exploration
        </a>
        .
      </p>
      <p className="mt-3">
        <a className="underline-offset-4 hover:underline" href="https://github.com/lamiakajal">
          GitHub
        </a>
        {" · "}
        <a className="underline-offset-4 hover:underline" href="https://www.linkedin.com/in/lamiakajal">
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
