import manifest from "./media.generated.json";

// Written by `npm run media`. It lists the photographic files that exist, so the
// scene can fall back to the drawn-in-code version for anything that is missing.
type Manifest = { creatures: string[]; video: string[] };
const m = manifest as Manifest;

export const hasCreature = (name: string): boolean => m.creatures.includes(name);
export const hasVideo = (name: string): boolean => m.video.includes(name);
