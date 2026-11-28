"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rand";
import { store } from "@/lib/store";
import { zoneY } from "./config";
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
};

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
    const items = Array.from({ length: p.count }, () => ({
      off: (r() - 0.5) * (p.spreadA ?? 0.5),
      dr: 0.75 + r() * 0.5,
      dy: (r() - 0.5) * 2 * p.spreadY,
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
    const a0 = dir * t * p.speed;
    const cy = zoneY(p.zone);

    // pictures are unlit, so dim them by hand as the light goes away
    if (p.mode === "alpha") {
      const b = Math.min(1, 0.1 + sunU.value + 0.55 * sstep(1.0, 2.4, store.current));
      material.color.setScalar(b);
    } else {
      material.color.setScalar(0.35 + 0.65 * Math.max(glowU.value, 0.4));
    }

    for (let i = 0; i < items.length; i++) {
      const f = items[i];
      const a = a0 + f.off;
      const vx = -Math.sin(a) * p.rx * f.dr * dir;
      const squash = p.pulse ? 1 + p.pulse * Math.sin(t * 1.6 + f.bob) : 1;
      const h = (p.length ? p.length / aspect : (p.height ?? 1)) * f.s;
      const facing = p.flip === false ? 1 : vx >= 0 ? 1 : -1;

      o.position.set(
        (p.cx ?? 0) + Math.cos(a) * p.rx * f.dr,
        cy + f.dy + Math.sin(t * 0.5 + f.bob) * 0.6,
        (p.cz ?? -2) + Math.sin(a) * p.rz * f.dr,
      );
      o.rotation.set(0, 0, Math.sin(t * 0.7 + f.bob) * 0.05);
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

  return <instancedMesh ref={ref} args={[geometry, material, p.count]} frustumCulled={false} />;
}
