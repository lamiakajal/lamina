# Media prompts (images and video)

Prompts for the photographic images and video loops. You do not need all of it on day one. **Start with the five marked [START]** to test the pipeline, then do the rest.

## Rules for every prompt

- Photorealistic, natural colour, no text, no logos, no watermark, no people.
- Animals always **face right**, full body in frame, nothing cropped, soft light from above, as if photographed underwater.
- Generate 3 to 4 versions of each and keep the sharpest, most natural one.
- Save with the exact file name below. Any format is fine (png, jpg, webp).

## Part A: surface and mid-water animals (plain white background)

Add this to the end of each prompt: *"isolated on a plain pure white background, no shadow, no reflection, sharp focus, ultra detailed, 8k"*. Then remove the background (remove.bg or Photopea) and save as transparent PNG.

| File | Prompt |
|---|---|
| `sardine.png` [START] | Photorealistic side profile of a single European sardine (Sardina pilchardus) facing right, silver scales with a blue-green back, small dark spots along the side, full body in frame, lit from above underwater |
| `yellow-snapper.png` | Photorealistic side profile of a yellowtail snapper (Ocyurus chrysurus) facing right, bright yellow stripe along a pink-silver body, forked tail, full body in frame, lit from above underwater |
| `manta-ray.png` [START] | Photorealistic giant oceanic manta ray (Mobula birostris) gliding, seen from slightly below and the side, wings spread wide, pale belly with dark spots, cephalic fins visible, lit from above underwater |
| `bluefin-tuna.png` | Photorealistic side profile of an Atlantic bluefin tuna (Thunnus thynnus) facing right, dark blue back, silver flanks, crescent tail, full body in frame, lit from above underwater |
| `lanternfish.png` | Photorealistic side profile of a lanternfish (Myctophum punctatum) facing right, silvery body with rows of small glowing photophores along the belly, large eyes, lit by faint blue light |

## Part B: deep-sea animals (pure black background)

These are glowing or ghostly, so no cut-out is needed. Add to the end of each prompt: *"on a pure solid black background, deep sea, dark and moody, sharp focus, ultra detailed, 8k"*. In the scene the black will vanish.

| File | Prompt |
|---|---|
| `pelagia-jelly.png` [START] | Photorealistic glowing jellyfish (Pelagia noctiluca) seen from the side, translucent bell with soft mauve and blue bioluminescence, long trailing tentacles, ghostly and delicate |
| `atolla-jelly.png` | Photorealistic deep-sea jellyfish (Atolla wyvillei), deep red bell with a glowing blue ring of bioluminescence around the rim, short tentacles |
| `anglerfish.png` [START] | Photorealistic deep-sea anglerfish (Melanocetus johnsonii) facing right, dark skin, large mouth with sharp translucent teeth, a glowing cyan lure on a stalk above the mouth |
| `vampire-squid.png` | Photorealistic vampire squid (Vampyroteuthis infernalis) with its webbed arms spread like a cloak, dark red-black skin, glowing blue-white eyes, faint bioluminescent tips on the arms |
| `gulper-eel.png` | Photorealistic gulper eel (Eurypharynx pelecanoides) facing right, long thin black body, huge loose mouth open, a long whip-like tail ending in a glowing pink-red light |
| `snailfish.png` | Photorealistic hadal snailfish (Pseudoliparis swirei) facing right, translucent pale pink-white body, soft gelatinous skin, small eyes, delicate fins, faint rim light |
| `amphipod.png` | Photorealistic deep-sea amphipod crustacean (Hirondellea gigas) from the side, translucent pale body with fine segments and long antennae |

## Part C: video loops

Settings: **1920 x 1080, 16:9, 6 to 8 seconds, slow camera, no text, no audio needed.** Ask for a "seamless loop". Convert later to WebM and MP4.

| File | Where it is used | Prompt |
|---|---|---|
| `hero-surface.mp4` [START] | Top of the page | Looking straight up from just below the ocean surface, bright turquoise water, soft shafts of sunlight, gentle ripples and caustic light patterns moving slowly, a few tiny bubbles, calm and cinematic, seamless loop |
| `marine-snow.mp4` | Deep zones overlay | Pure black background, tiny pale particles drifting slowly downward and sideways like marine snow in deep water, soft focus, very subtle, seamless loop |
| `biolight.mp4` | Deep zones overlay | Pure black background, small drifting points of cyan, green and violet bioluminescent light twinkling slowly in deep water, soft glow, seamless loop |
| `sunbeams.mp4` | Optional | Underwater sunbeams cutting diagonally through clear blue water, particles floating in the light, slow motion, seamless loop |

For a preview GIF (for the README), export a 5 second clip of the hero at 800 px wide, 12 fps.

## Part D: stills for sharing

| File | Size | Prompt |
|---|---|---|
| `social-preview.jpg` [START] | 1280 x 640 | Cinematic underwater scene, sunlit turquoise water at the top fading into deep blue and then black at the bottom, a lone glowing jellyfish and shafts of light, wide composition with calm empty space in the centre, photorealistic, no text |
| `og-image.jpg` | 1200 x 630 | Same look as above, slightly closer, a manta ray silhouette in the light above and a glowing anglerfish lure far below, no text |

## Where the files go

```
media-src/creatures/   everything from Parts A and B
media-src/video/       the loops from Part C
public/og/             the stills from Part D (optional)
```

Then run `npm run media`. It resizes and converts everything, copies it to `public/`, and updates the list the scene reads. Animals without a file keep their code-drawn version, so you can add them one at a time.

Photos are shown as flat pictures that always face the camera, so keep every animal strictly side-on (swimmers) or front-on (jellyfish).
