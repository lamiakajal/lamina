// Photo-only animals: they appear once their file is in public/creatures (no drawn fallback).
// `mode: alpha` blends normally (every cut-out); `additive` is for glow-only effects.
export type Species = {
  file: string;
  mode: "alpha" | "additive";
  zone: number;
  count: number;
  height?: number; // world height (tall animals)
  length?: number; // world width (long fish); wins over height
  speed: number;
  rx: number;
  rz: number;
  cz: number;
  spreadY: number;
  spreadA?: number;
  dir?: 1 | -1;
  flip?: boolean;
  pulse?: number;
  fixed?: boolean;
  seed?: number;
};

export const SPECIES: Species[] = [
  // sunlight: open water
  { file: "mahi-mahi", mode: "alpha", zone: 0, count: 4, length: 2.2, speed: 0.2, rx: 12, rz: 6, cz: -6, spreadY: 6, spreadA: 0.8 },
  { file: "hammerhead-shark", mode: "alpha", zone: 0, count: 2, length: 4.6, speed: 0.09, rx: 15, rz: 8, cz: -9, spreadY: 5, spreadA: 2.5, dir: -1 },
  { file: "sea-turtle", mode: "alpha", zone: 0, count: 3, length: 3.2, speed: 0.07, rx: 10, rz: 5, cz: -5, spreadY: 4, spreadA: 3 },
  { file: "whale-shark", mode: "alpha", zone: 0, count: 1, length: 9, speed: 0.04, rx: 16, rz: 8, cz: -12, spreadY: 3, spreadA: 0.1, dir: -1 },
  { file: "dolphin", mode: "alpha", zone: 0, count: 3, length: 3.4, speed: 0.13, rx: 15, rz: 7, cz: -8, spreadY: 5, spreadA: 0.7 },
  // sunlight: reef fish
  { file: "clownfish", mode: "alpha", zone: 0, count: 6, length: 0.9, speed: 0.1, rx: 8, rz: 4, cz: -3, spreadY: 4, spreadA: 1.5 },
  { file: "blue-tang", mode: "alpha", zone: 0, count: 8, length: 1.1, speed: 0.12, rx: 9, rz: 5, cz: -4, spreadY: 5, spreadA: 1, dir: -1 },
  { file: "moorish-idol", mode: "alpha", zone: 0, count: 4, length: 1, speed: 0.09, rx: 8, rz: 4, cz: -4, spreadY: 4, spreadA: 2 },
  { file: "mandarin-fish", mode: "alpha", zone: 0, count: 3, length: 0.8, speed: 0.07, rx: 7, rz: 4, cz: -3, spreadY: 3, spreadA: 2.4, dir: -1 },
  { file: "flame-angelfish", mode: "alpha", zone: 0, count: 4, length: 0.9, speed: 0.08, rx: 8, rz: 4, cz: -3, spreadY: 4, spreadA: 2 },
  { file: "royal-gramma", mode: "alpha", zone: 0, count: 8, length: 0.8, speed: 0.11, rx: 9, rz: 5, cz: -5, spreadY: 5, spreadA: 1, dir: -1 },
  { file: "emperor-angelfish", mode: "alpha", zone: 0, count: 3, length: 1.3, speed: 0.07, rx: 9, rz: 5, cz: -4, spreadY: 4, spreadA: 2.8 },
  { file: "copperband-butterflyfish", mode: "alpha", zone: 0, count: 5, length: 0.95, speed: 0.09, rx: 8, rz: 4, cz: -4, spreadY: 4, spreadA: 1.6 },
  // twilight
  { file: "swordfish", mode: "alpha", zone: 1, count: 2, length: 3.8, speed: 0.17, rx: 14, rz: 7, cz: -7, spreadY: 5, spreadA: 1.5 },
  { file: "sunfish", mode: "alpha", zone: 1, count: 1, length: 2.4, speed: 0.04, rx: 9, rz: 5, cz: -6, spreadY: 3, spreadA: 0.1, dir: -1 },
  { file: "blue-whale", mode: "alpha", zone: 0, count: 1, length: 14, speed: 0.025, rx: 16, rz: 8, cz: -16, spreadY: 2, spreadA: 0.1 },
  { file: "hatchetfish", mode: "alpha", zone: 1, count: 20, length: 0.95, speed: 0.1, rx: 10, rz: 5, cz: -5, spreadY: 7, spreadA: 1.2 },
  { file: "oarfish", mode: "alpha", zone: 1, count: 1, length: 8, speed: 0.03, rx: 9, rz: 5, cz: -8, spreadY: 3, spreadA: 0.1, dir: -1 },
  // midnight
  { file: "viperfish", mode: "alpha", zone: 2, count: 5, length: 2.6, speed: 0.08, rx: 10, rz: 5, cz: -6, spreadY: 6, spreadA: 2, dir: -1 },
  { file: "fangtooth", mode: "alpha", zone: 2, count: 6, length: 1.6, speed: 0.07, rx: 8, rz: 4, cz: -4, spreadY: 7, spreadA: 2 },
  { file: "giant-squid", mode: "alpha", zone: 2, count: 1, length: 9, speed: 0.02, rx: 8, rz: 4, cz: -10, spreadY: 2, spreadA: 0.1, pulse: 0.03 },
  // abyss
  { file: "dumbo-octopus", mode: "alpha", zone: 3, count: 5, length: 1.8, speed: 0.04, rx: 9, rz: 5, cz: -5, spreadY: 6, spreadA: 3, flip: false, pulse: 0.07 },
  { file: "grenadier", mode: "alpha", zone: 3, count: 5, length: 3.6, speed: 0.05, rx: 10, rz: 5, cz: -5, spreadY: 6, spreadA: 2, dir: -1 },
  // the top of the water, for the hero: what you would see floating near the surface
  { file: "sardine", mode: "alpha", zone: -0.37, count: 16, length: 1.2, speed: 0.2, rx: 12, rz: 6, cz: -4, spreadY: 4, spreadA: 0.8, fixed: true, seed: 101 },
  { file: "mahi-mahi", mode: "alpha", zone: -0.37, count: 3, length: 2.2, speed: 0.17, rx: 13, rz: 6, cz: -6, spreadY: 4, spreadA: 2, dir: -1, fixed: true, seed: 102 },
  { file: "yellow-snapper", mode: "alpha", zone: -0.37, count: 7, length: 1.4, speed: 0.14, rx: 11, rz: 6, cz: -5, spreadY: 4, spreadA: 1, dir: -1, fixed: true, seed: 103 },
  { file: "dolphin", mode: "alpha", zone: -0.37, count: 2, length: 3.2, speed: 0.12, rx: 14, rz: 7, cz: -8, spreadY: 3, spreadA: 2.5, fixed: true, seed: 104 },
  { file: "sea-turtle", mode: "alpha", zone: -0.37, count: 1, length: 3, speed: 0.05, rx: 9, rz: 5, cz: -5, spreadY: 2, spreadA: 0.1, fixed: true, seed: 105 },
  { file: "blue-tang", mode: "alpha", zone: -0.37, count: 5, length: 1, speed: 0.12, rx: 9, rz: 5, cz: -4, spreadY: 4, spreadA: 1.2, dir: -1, fixed: true, seed: 106 },
  { file: "clownfish", mode: "alpha", zone: -0.37, count: 4, length: 0.85, speed: 0.1, rx: 8, rz: 4, cz: -3, spreadY: 4, spreadA: 1.5, fixed: true, seed: 107 },
];
