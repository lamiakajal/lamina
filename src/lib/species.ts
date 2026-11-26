// Extra animals that only appear once their photo exists (no drawn fallback).
// `mode: alpha` is for cut-outs on white, `additive` for glowing animals shot on black.
export type Species = {
  file: string;
  mode: "alpha" | "additive";
  zone: number;
  count: number;
  height: number;
  speed: number;
  rx: number;
  rz: number;
  cz: number;
  spreadY: number;
  spreadA?: number;
  dir?: 1 | -1;
  flip?: boolean;
  pulse?: number;
};

export const SPECIES: Species[] = [
  // sunlight
  { file: "mahi-mahi", mode: "alpha", zone: 0, count: 4, height: 0.9, speed: 0.2, rx: 12, rz: 6, cz: -6, spreadY: 6, spreadA: 0.8 },
  { file: "hammerhead-shark", mode: "alpha", zone: 0, count: 2, height: 2.2, speed: 0.09, rx: 15, rz: 8, cz: -9, spreadY: 5, spreadA: 2.5, dir: -1 },
  { file: "sea-turtle", mode: "alpha", zone: 0, count: 2, height: 1.6, speed: 0.05, rx: 10, rz: 5, cz: -5, spreadY: 4, spreadA: 3 },
  { file: "whale-shark", mode: "alpha", zone: 0, count: 1, height: 4.2, speed: 0.04, rx: 16, rz: 8, cz: -12, spreadY: 3, spreadA: 0.1, dir: -1 },
  // twilight
  { file: "swordfish", mode: "alpha", zone: 1, count: 2, height: 1.4, speed: 0.17, rx: 14, rz: 7, cz: -7, spreadY: 5, spreadA: 1.5 },
  { file: "sunfish", mode: "alpha", zone: 1, count: 1, height: 2.6, speed: 0.04, rx: 9, rz: 5, cz: -6, spreadY: 3, spreadA: 0.1, dir: -1 },
  { file: "hatchetfish", mode: "additive", zone: 1, count: 14, height: 0.45, speed: 0.1, rx: 10, rz: 5, cz: -5, spreadY: 7, spreadA: 1.2 },
  { file: "oarfish", mode: "additive", zone: 1, count: 1, height: 3.4, speed: 0.03, rx: 9, rz: 5, cz: -8, spreadY: 3, spreadA: 0.1, dir: -1 },
  // midnight
  { file: "viperfish", mode: "additive", zone: 2, count: 2, height: 1.3, speed: 0.08, rx: 10, rz: 5, cz: -6, spreadY: 6, spreadA: 2, dir: -1 },
  { file: "fangtooth", mode: "additive", zone: 2, count: 3, height: 0.9, speed: 0.07, rx: 8, rz: 4, cz: -4, spreadY: 7, spreadA: 2 },
  { file: "giant-squid", mode: "additive", zone: 2, count: 1, height: 5, speed: 0.02, rx: 8, rz: 4, cz: -10, spreadY: 2, spreadA: 0.1, flip: false, pulse: 0.03 },
  // abyss
  { file: "dumbo-octopus", mode: "additive", zone: 3, count: 3, height: 1.5, speed: 0.04, rx: 9, rz: 5, cz: -5, spreadY: 6, spreadA: 3, flip: false, pulse: 0.07 },
  { file: "grenadier", mode: "additive", zone: 3, count: 3, height: 1.4, speed: 0.05, rx: 10, rz: 5, cz: -5, spreadY: 6, spreadA: 2, dir: -1 },
];
