// Turns your generated images and videos into site-ready files.
//
//   media-src/creatures/<name>.(png|jpg|webp)  ->  public/creatures/<name>.webp
//   media-src/video/<name>.mp4                 ->  public/video/<name>.mp4
//
// then writes src/lib/media.generated.json so the scene knows what exists.
// Run it with:  npm run media
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, parse, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "media-src");
const pub = join(root, "public");

// Photos on white need a transparent background. Glowing deep-sea animals are
// shot on black and blended additively, so they do not.
const CUTOUT = ["sardine", "yellow-snapper", "manta-ray", "bluefin-tuna", "lanternfish"];
const ON_BLACK = ["pelagia-jelly", "atolla-jelly", "anglerfish", "vampire-squid", "gulper-eel", "snailfish", "amphipod"];
const VIDEOS = ["hero-surface", "marine-snow", "biolight", "sunbeams"];

const list = (dir, re) => (existsSync(dir) ? readdirSync(dir).filter((f) => re.test(f)) : []);

mkdirSync(join(pub, "creatures"), { recursive: true });
mkdirSync(join(pub, "video"), { recursive: true });

for (const file of list(join(src, "creatures"), /\.(png|jpe?g|webp|avif)$/i)) {
  const name = parse(file).name.toLowerCase();
  if (![...CUTOUT, ...ON_BLACK].includes(name)) {
    console.log(`SKIP  ${file}: unknown name. Use one of: ${[...CUTOUT, ...ON_BLACK].join(", ")}`);
    continue;
  }
  try {
    const input = join(src, "creatures", file);
    if (CUTOUT.includes(name)) {
      const meta = await sharp(input).metadata();
      let transparent = false;
      if (meta.hasAlpha) {
        const st = await sharp(input).stats();
        transparent = st.channels[st.channels.length - 1].min < 255;
      }
      if (!transparent) console.log(`WARN  ${file}: no transparent pixels. Remove the white background first.`);
    }
    await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 86, alphaQuality: 92 })
      .toFile(join(pub, "creatures", `${name}.webp`));
    console.log(`OK    ${file} -> public/creatures/${name}.webp`);
  } catch (e) {
    console.log(`FAIL  ${file}: ${e.message}`);
  }
}

for (const file of list(join(src, "video"), /\.mp4$/i)) {
  const name = parse(file).name.toLowerCase();
  if (!VIDEOS.includes(name)) {
    console.log(`SKIP  ${file}: unknown name. Use one of: ${VIDEOS.join(", ")}`);
    continue;
  }
  copyFileSync(join(src, "video", file), join(pub, "video", `${name}.mp4`));
  console.log(`OK    ${file} -> public/video/${name}.mp4`);
}

const manifest = {
  creatures: list(join(pub, "creatures"), /\.webp$/).map((f) => parse(f).name).sort(),
  video: list(join(pub, "video"), /\.mp4$/).map((f) => parse(f).name).sort(),
};
writeFileSync(join(root, "src", "lib", "media.generated.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nManifest: ${manifest.creatures.length} creature(s), ${manifest.video.length} video(s).`);
