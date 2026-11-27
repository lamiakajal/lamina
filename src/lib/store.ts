import { ZONE_COUNT } from "./zones";

// Shared scroll state. Plain object on purpose: the 3D loop and the HUD read it
// every frame, so it must not trigger React renders.
export const store = {
  target: 0, // 0 to ZONE_COUNT, straight from the scroll position
  current: 0, // eased value that the camera and HUD follow
  reduced: false, // prefers-reduced-motion
};

// Depth in metres at the start of each zone, plus the final depth.
export const DEPTH_STOPS = [0, 200, 1000, 4000, 6000, 11000] as const;

/** Depth in metres for a zone position t (0 to 5). */
export function depthAt(t: number): number {
  const c = Math.min(ZONE_COUNT, Math.max(0, t));
  const i = Math.min(ZONE_COUNT - 1, Math.floor(c));
  const f = c - i;
  return DEPTH_STOPS[i] + (DEPTH_STOPS[i + 1] - DEPTH_STOPS[i]) * f;
}

export function zoneIndexAt(t: number): number {
  return Math.min(ZONE_COUNT - 1, Math.max(0, Math.floor(t)));
}

/** Roughly 1 atm at the surface plus 1 atm for every 10 m. */
export function pressureAt(depth: number): number {
  return 1 + depth / 10;
}

// Where the cursor or finger is, shared with the 3D scene and the cursor effects.
export const pointer = {
  x: 0, // -1 to 1, left to right
  y: 0, // -1 to 1, bottom to top
  sx: 0, // eased copies, used for the camera parallax
  sy: 0,
  last: 0, // performance.now() of the latest move
  seen: false, // has the pointer moved at all yet
  touch: false, // last input came from a finger
  food: [] as { x: number; y: number }[], // drops waiting to be turned into pellets
  fed: 0, // pellets eaten so far
  lastFed: 0,
};

/** Queues a few pellets at a screen position (normalised -1 to 1). */
export function dropFood(x: number, y: number): void {
  if (pointer.food.length > 12) return;
  pointer.food.push({ x, y });
}
