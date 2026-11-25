import * as THREE from "three";

// Uniform objects shared by every shader. The rig updates them once per frame,
// so no material has to be touched individually.
export const timeU = { value: 0 };
export const sunU = { value: 1 }; // 1 at the surface, 0 once the sun is gone
export const glowU = { value: 0 }; // strength of the bioluminescence
export const snowU = { value: 0.3 }; // opacity of the marine snow

export function sstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Phones and small laptops get fewer particles and animals. */
export function isLowEnd(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 720 || (navigator.hardwareConcurrency ?? 8) <= 4;
}

let glowTexture: THREE.CanvasTexture | null = null;

/** Soft round blob used for glows. Built once, on first use. */
export function getGlowTexture(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}
