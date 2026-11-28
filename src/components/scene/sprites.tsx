"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rand";
import { store } from "@/lib/store";
import { ZONE_H, zoneY } from "./config";
import { glowU, sstep, sunU, timeU } from "./fx";

type Props = {
  file: string; // name in public/creatures, without extension
  mode: "alpha" | "additive"; // cut-outs are blended normally, glowing animals additively
  zone: number;
  count: number;
  height?: number; // world height of one sprite (jellies and other tall animals)
  length?: number; // world width of one sprite; wins over height, so long fish keep their proportions
  speed: number;
  rx: number;
  rz: number;
  cx?: number;
  cz?: number;
  spreadY: number;
  spreadA?: number;
  dir?: 1 | -1;
  seed?: number;
  flip?: boolean; // mirror the picture when the animal turns around (swimmers)
  pulse?: number; // gentle squash and stretch (jellyfish)
  fixed?: boolean; // keep to the spreadY band instead of roaming the whole zone (used near the surface)
};

// how far from the middle of a zone a roaming animal may be, so every scroll position has company
const ROAM = ZONE_H / 2 - 3;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/**
 * Photographic animals as flat pictures that float through the scene.
 * They always face the camera, so the pictures should be shot side-on (swimmers)
 * or front-on (jellyfish).
 */
export function SpriteSchool(p: Props) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const texture = useLoader(THREE.TextureLoader, `/creatures/${p.file}.webp`);

  const { geometry, material, items, aspect } = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const img = texture.image as { width: number; height: number };
    const aspect = img.width / img.height;

    const r = mulberry32(p.seed ?? 1);
    // the zone is tall, so roaming animals are multiplied to keep it from feeling empty
    const big = (p.length ?? 0) > 6;
    const mult = p.fixed ? 1 : p.zone === 0 ? 1.6 : big ? 2 : 2.5;
    const total = p.fixed ? p.count : Math.max(2, Math.ceil(p.count * mult));
    // schools stay loosely together, singles and pairs spread all the way round
    const wide = p.fixed ? (p.spreadA ?? 0.5) : total <= 3 ? Math.PI * 2 : Math.max(p.spreadA ?? 0.5, 3);
    const items = Array.from({ length: total }, () => ({
      off: (r() - 0.5) * wide,
      dr: 0.75 + r() * 0.5,
      dy: (r() - 0.5) * 2 * (p.fixed ? p.spreadY : ROAM),
      dz: (r() - 0.5) * 4,
      sp: 0.8 + r() * 0.45,
      s: 0.85 + r() * 0.3,
      bob: r() * Math.PI * 2,
    }));

    const additive = p.mode === "additive";
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      alphaTest: additive ? 0 : 0.02,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      fog: !additive, // distance fog would only wash out a glowing animal
    });
    return { geometry: new THREE.PlaneGeometry(1, 1), material, items, aspect };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const o = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = timeU.value;
    const dir = p.dir ?? 1;
    const a0 = dir * t * p.speed * 1.8;
    const cy = zoneY(p.zone);
    const swimmer = p.flip !== false;

    // pictures are unlit, so dim them by hand as the light goes away
    if (p.mode === "alpha") {
      const b = Math.min(1, 0.1 + sunU.value + 0.55 * sstep(1.0, 2.4, store.current));
      material.color.setScalar(b);
    } else {
      material.color.setScalar(0.35 + 0.65 * Math.max(glowU.value, 0.4));
    }

    for (let i = 0; i < items.length; i++) {
      const f = items[i];
      const a = a0 * f.sp + f.off;
      // the path breathes in and out a little, so no two laps are the same
      const rr = p.rx * f.dr * (1 + 0.1 * Math.sin(t * 0.35 + f.bob));
      const vx = -Math.sin(a) * rr * dir;
      const squash = p.pulse ? 1 + p.pulse * Math.sin(t * 1.6 + f.bob) : 1;
      const h = (p.length ? p.length / aspect : (p.height ?? 1)) * f.s;
      // turn round smoothly: the picture narrows to an edge and widens the other way
      const facing = swimmer ? clamp(vx * 0.8, -1, 1) : 1;

      // rise and fall while swimming, and lean into the climb
      const vy = 0.6 * Math.cos(t * 0.5 + f.bob) + 0.45 * Math.cos(t * 0.9 + f.bob * 2);
      const lean = clamp(vy * 0.12, -0.25, 0.25) * (vx >= 0 ? 1 : -1);
      const wiggle = swimmer ? Math.sin(t * (4 + p.speed * 20) + f.bob) * 0.03 : Math.sin(t * 0.7 + f.bob) * 0.05;

      o.position.set(
        (p.cx ?? 0) + Math.cos(a) * rr,
        cy + f.dy + Math.sin(t * 0.5 + f.bob) * 1.2 + Math.sin(t * 0.9 + f.bob * 2) * 0.5,
        (p.cz ?? -2) + f.dz + Math.sin(a) * p.rz * f.dr,
      );
      o.rotation.set(0, 0, swimmer ? lean + wiggle : wiggle);
      o.scale.set(h * aspect * facing * (2 - squash), h * squash, 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <instancedMesh ref={ref} args={[geometry, material, items.length]} frustumCulled={false} />;
}
