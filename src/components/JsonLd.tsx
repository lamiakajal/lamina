import { SITE } from "@/lib/site";

/** Structured data that ties the site to its author, so search engines can connect the two. */
export default function JsonLd() {
  const personId = `${SITE.author.url}/#person`;

  const graph = [
    {
      "@type": "Person",
      "@id": personId,
      name: SITE.author.name,
      url: SITE.author.url,
      jobTitle: SITE.author.jobTitle,
      sameAs: SITE.author.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en",
      author: { "@id": personId },
      publisher: { "@id": personId },
    },
    {
      "@type": "CreativeWork",
      "@id": `${SITE.url}/#work`,
      name: SITE.title,
      url: SITE.url,
      description: SITE.description,
      keywords: SITE.keywords.join(", "),
      author: { "@id": personId },
      isPartOf: { "@id": `${SITE.url}/#website` },
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
