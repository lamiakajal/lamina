# Lamina

An immersive, scroll-driven 3D descent through the ocean's five layers, from the surface to 11,000 m.

> **Status: work in progress.** Lamina is a concept project. The brand, the expedition and the programme in it are fictional.

Scroll down and the camera sinks: sunlit shallows, twilight, the midnight zone, the abyss and finally the hadal trench. Light fades, the water gets colder and darker, pressure climbs, and the animals change at every depth.

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS v4
- three.js with React Three Fiber for the scene
- MongoDB with Mongoose for the join form (optional)
- Deployed on Vercel

## How it works

- `src/lib/zones.ts` holds the copy and facts for each zone.
- `src/components/scene/` is the 3D scene: water surface, light rays, marine snow, fog and colour that change with depth, and the animals.
- A single `store` object carries the eased scroll depth. The 3D loop and the HUD read it every frame, so scrolling never triggers React renders.
- Waves appear as SVG dividers that calm down with depth, an animated wordmark underline and a wave in the depth meter.
- Every animal exists as code-drawn geometry. If a photographic image is added for it, the scene uses that instead.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

`MONGODB_URI` is optional. Without it the join form runs in demo mode and stores nothing.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Connection string for saving sign-ups |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, sitemap and social previews |

## Photographic media

Images and video loops are generated separately and are not committed. See [docs/ASSET-PROMPTS.md](docs/ASSET-PROMPTS.md) for the prompts and file names. Put the files in `media-src/` and run:

```bash
npm run media
```

The script resizes them into `public/` and writes the manifest the scene reads. Anything missing falls back to the code-drawn version. Imagery made this way is AI-generated.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm run media` | Process images and video from `media-src/` |

## Roadmap

- [ ] Add the photographic animals and video loops
- [ ] Ambient sound that deepens with the dive
- [ ] Per-zone species pages
- [ ] Performance pass on low-end phones

## Notes

- Depth and pressure figures are rounded for storytelling. For real data see [NOAA Ocean Exploration](https://oceanexplorer.noaa.gov).
- The scene needs WebGL. Without it, the page still shows all the content.

## Author

Made by [Lamia Kajal](https://lamiakajal.com), full-stack developer.

## License

[MIT](LICENSE)
