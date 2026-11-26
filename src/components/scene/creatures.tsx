"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rand";
import { zoneY } from "./config";
import { getGlowTexture, timeU } from "./fx";
import {
  JELLY_SNIPPET,
  MANTA_SNIPPET,
  makeFishGeometry,
  makeMantaGeometry,
  swimSnippet,
  type FishShape,
} from "./geometry";
import { makeAnimatedMaterial } from "./materials";

type OrbitOpts = {
  zone: number;
  rx: number;
  rz: number;
  cx?: number;
  cz?: number;
  dy?: number;
  speed: number; // radians per second
  phase: number;
  dir?: 1 | -1;
};

/** Moves a single creature around a flat ellipse and turns it to face where it swims. */
function useOrbit(ref: RefObject<THREE.Group | null>, o: OrbitOpts) {
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const t = timeU.value;
    const dir = o.dir ?? 1;
    const a = dir * t * o.speed + o.phase;
    g.position.set(
      (o.cx ?? 0) + Math.cos(a) * o.rx,
      zoneY(o.zone) + (o.dy ?? 0) + Math.sin(t * 0.4 + o.phase) * 0.8,
      (o.cz ?? -2) + Math.sin(a) * o.rz,
    );
    const vx = -Math.sin(a) * o.rx * dir;
    const vz = Math.cos(a) * o.rz * dir;
    g.rotation.order = "YXZ";
    g.rotation.set(Math.sin(t * 0.5 + o.phase) * 0.05, Math.atan2(-vz, vx), 0);
  });
}

function GlowSprite({ color, size, opacity }: { color: string; size: number; opacity: number }) {
  return (
    <sprite scale={[size, size, 1]}>
      <spriteMaterial
        map={getGlowTexture()}
        color={color}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        fog={false}
      />
    </sprite>
  );
}

type SchoolProps = {
  zone: number;
  count: number;
  shape: FishShape;
  scale: number;
  speed: number;
  rx: number;
  rz: number;
  cx?: number;
  cz?: number;
  spreadY: number;
  spreadA?: number; // how loosely the fish are bunched along the path
  dir?: 1 | -1;
  seed?: number;
  swim?: number;
  amp?: number;
  metalness?: number;
  roughness?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  opacity?: number;
};

/** A group of fish drawn as one instanced mesh, all circling the same path. */
export function School(p: SchoolProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const { geometry, material, fish } = useMemo(() => {
    const r = mulberry32(p.seed ?? 1);
    const geometry = makeFishGeometry(p.shape);
    const phases = new Float32Array(p.count);
    const fish = Array.from({ length: p.count }, (_, i) => {
      phases[i] = r() * Math.PI * 2;
      return {
        off: (r() - 0.5) * (p.spreadA ?? 0.5),
        dr: 0.75 + r() * 0.5,
        dy: (r() - 0.5) * 2 * p.spreadY,
        s: 0.85 + r() * 0.3,
        bob: r() * Math.PI * 2,
      };
    });
    geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));

    const material = makeAnimatedMaterial({
      vertexColors: true,
      metalness: p.metalness ?? 0.45,
      roughness: p.roughness ?? 0.4,
      emissive: p.emissive,
      emissiveIntensity: p.emissiveIntensity,
      opacity: p.opacity,
      instanced: true,
      speed: p.swim ?? 7,
      amp: p.amp ?? 0.22,
      snippet: swimSnippet(),
    });
    return { geometry, material, fish };
    // props are fixed for the lifetime of a school
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const o = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.rotation.order = "YXZ";
    return obj;
  }, []);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = timeU.value;
    const dir = p.dir ?? 1;
    const a0 = dir * t * p.speed;
    const cy = zoneY(p.zone);

    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      const a = a0 + f.off;
      const x = (p.cx ?? 0) + Math.cos(a) * p.rx * f.dr;
      const z = (p.cz ?? -2) + Math.sin(a) * p.rz * f.dr;
      const y = cy + f.dy + Math.sin(t * 0.5 + f.bob) * 0.6;
      const vx = -Math.sin(a) * p.rx * f.dr * dir;
      const vz = Math.cos(a) * p.rz * f.dr * dir;
      const s = p.scale * f.s;
      o.position.set(x, y, z);
      o.rotation.set(Math.sin(t * 0.7 + f.bob) * 0.06, Math.atan2(-vz, vx), 0);
      o.scale.setScalar(s);
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
