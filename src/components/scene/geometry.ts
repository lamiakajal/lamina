import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { sstep } from "./fx";

export type FishShape = {
  H: number; // half height of the body
  W: number; // half width of the body
  tail: number; // how tall the tail fin flares, relative to H
  dorsal?: number; // height of the dorsal fin above the back
  eye?: number; // eye radius
  head?: number; // extra bulk toward the head
  back: THREE.ColorRepresentation;
  belly: THREE.ColorRepresentation;
  fins?: THREE.ColorRepresentation;
};

// Fish are modelled nose-first along +x, from u = +1 (nose) to u = -1 (tail tip).
function profile(u: number, s: FishShape) {
  let body: number;
  if (u >= 0.2) {
    const k = (u - 0.2) / 0.8;
    body = Math.sqrt(Math.max(0, 1 - k * k)); // rounded nose
  } else {
    body = 0.22 + 0.78 * sstep(-0.6, 0.2, u); // taper into the tail stalk
  }
  body *= 1 + (s.head ?? 0) * sstep(0, 0.75, u);

  const fin = sstep(-0.6, -1, u); // 0 on the body, 1 at the tail tip
  return {
    ry: s.H * (body * (1 - fin) + fin * s.tail),
    rz: s.W * body * (1 - fin) + fin * 0.03,
    fin,
  };
}

function paint(g: THREE.BufferGeometry, c: THREE.Color): THREE.BufferGeometry {
  const n = g.attributes.position.count;
  const a: number[] = [];
  for (let i = 0; i < n; i++) a.push(c.r, c.g, c.b);
  g.setAttribute("color", new THREE.Float32BufferAttribute(a, 3));
  return g;
}

const NX = 44; // rings along the body
const NR = 18; // vertices per ring

export function makeFishGeometry(s: FishShape): THREE.BufferGeometry {
  const back = new THREE.Color(s.back);
  const belly = new THREE.Color(s.belly);
  const finColor = new THREE.Color(s.fins ?? s.back).multiplyScalar(0.85);

  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];

  for (let i = 0; i <= NX; i++) {
    const u = 1 - (2 * i) / NX;
    const { ry, rz, fin } = profile(u, s);
    for (let j = 0; j < NR; j++) {
      const a = (j / NR) * Math.PI * 2;
      const cy = Math.cos(a);
      const sz = Math.sin(a);
      pos.push(u, ry * cy, rz * sz);
      // darker back, lighter belly, fins take the fin colour
      const c = back.clone().lerp(belly, sstep(0.15, -0.35, cy) * (1 - fin)).lerp(finColor, fin);
      col.push(c.r, c.g, c.b);
    }
  }

  for (let i = 0; i < NX; i++) {
    for (let j = 0; j < NR; j++) {
      const a = i * NR + j;
      const b = i * NR + ((j + 1) % NR);
      const c = (i + 1) * NR + j;
      const d = (i + 1) * NR + ((j + 1) % NR);
      idx.push(a, c, b, b, c, d);
    }
  }

  const body = new THREE.BufferGeometry();
  body.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  body.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  body.setIndex(idx);
  body.computeVertexNormals();

  const parts: THREE.BufferGeometry[] = [body];

  // eyes, one on each side
  const eye = profile(0.7, s);
  const eyeColor = new THREE.Color("#06080c");
  for (const side of [1, -1]) {
    const e = new THREE.SphereGeometry(s.eye ?? 0.05, 10, 8);
    e.deleteAttribute("uv");
    e.translate(0.7, eye.ry * 0.35, side * eye.rz * 0.92);
    parts.push(paint(e, eyeColor));
  }

  // dorsal fin: one flat triangle, drawn double-sided by the material
  if (s.dorsal) {
    const root = profile(-0.35, s);
    const d = new THREE.BufferGeometry();
    d.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0.3, s.H * 0.97, 0, -0.35, root.ry * 0.98, 0, -0.02, s.H + s.dorsal, 0], 3),
    );
    d.setAttribute("normal", new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3));
    d.setIndex([0, 1, 2]);
    parts.push(paint(d, finColor));
  }

  return mergeGeometries(parts, false) ?? body;
}

/** Vertex code for a swimming fish: the tail end sweeps from side to side. */
export const swimSnippet = (wave = 3.4): string => /* glsl */ `
  float k = clamp((0.35 - position.x) * 0.72, 0.0, 1.0);
  transformed.z += sin(uTime * uSpeed + aPhase - position.x * ${wave.toFixed(1)}) * uAmp * k * k;
  transformed.z += sin(uTime * uSpeed + aPhase + 1.1) * uAmp * 0.10;
`;
