// Single place for the name, copy and links used by metadata and the page.
export const SITE = {
  name: "Lamina",
  tagline: "A descent through the ocean's layers",
  title: "Lamina: an interactive ocean descent by Lamia Kajal",
  description:
    "Scroll to dive from the sunlit surface to 11,000 metres. Lamina is an immersive 3D concept website about the ocean's five layers, built by Lamia Kajal with Next.js, TypeScript and React Three Fiber.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamina.lamiakajal.com").replace(/\/$/, ""),
  keywords: [
    "Lamina",
    "Lamia Kajal",
    "ocean descent",
    "deep sea",
    "interactive 3D website",
    "scrollytelling",
    "React Three Fiber",
    "Next.js",
    "ocean zones",
  ],
  author: {
    name: "Lamia Kajal",
    url: "https://lamiakajal.com",
    handle: "@lamiakajal",
    jobTitle: "Full-Stack Developer",
    sameAs: [
      "https://lamiakajal.com",
      "https://github.com/lamiakajal",
      "https://www.linkedin.com/in/lamiakajal",
      "https://www.youtube.com/@lamiakajal",
      "https://medium.com/@lamiakajal",
      "https://www.behance.net/lamiakajal",
      "https://x.com/lamiakajal",
      "https://www.instagram.com/lamiakajal",
    ],
  },
} as const;
