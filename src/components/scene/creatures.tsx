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

type MantaProps = OrbitOpts;

export function Manta(p: MantaProps) {
  const ref = useRef<THREE.Group>(null);

  const { geometry, material } = useMemo(
    () => ({
      geometry: makeMantaGeometry(),
      material: makeAnimatedMaterial({
        vertexColors: true,
        metalness: 0.15,
        roughness: 0.55,
        phase: p.phase,
        speed: 1.4,
        amp: 0.38,
        snippet: MANTA_SNIPPET,
      }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useOrbit(ref, p);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return (
    <group ref={ref} scale={1.5}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}

type JellyProps = {
  zone: number;
  x: number;
  z: number;
  dy: number;
  size: number;
  phase: number;
};

const TENTACLES = 10;
const TENTACLE_POINTS = 14;

export function Jelly({ zone, x, z, dy, size, phase }: JellyProps) {
  const ref = useRef<THREE.Group>(null);

  const built = useMemo(() => {
    const bellGeometry = new THREE.SphereGeometry(1, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const bellMaterial = makeAnimatedMaterial({
      color: "#7fb4e0",
      emissive: "#2f8cff",
      emissiveIntensity: 0.5,
      opacity: 0.36,
      roughness: 0.25,
      metalness: 0,
      physical: true,
      phase,
      speed: 1.6,
      snippet: JELLY_SNIPPET,
    });

    // tentacles are thin additive lines whose points are moved every frame
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#8fd0ff",
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const group = new THREE.Group();
    const lines: { attr: THREE.BufferAttribute; angle: number }[] = [];
    for (let k = 0; k < TENTACLES; k++) {
      const g = new THREE.BufferGeometry();
      const attr = new THREE.BufferAttribute(new Float32Array(TENTACLE_POINTS * 3), 3);
      g.setAttribute("position", attr);
      const line = new THREE.Line(g, lineMaterial);
      line.frustumCulled = false;
      group.add(line);
      lines.push({ attr, angle: (k / TENTACLES) * Math.PI * 2 });
    }
    return { bellGeometry, bellMaterial, lineMaterial, group, lines };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const t = timeU.value;
    const pulse = Math.sin(t * 1.6 + phase);

    g.position.set(
      x + Math.sin(t * 0.12 + phase) * 2.5,
      zoneY(zone) + dy + Math.sin(t * 0.3 + phase * 2) * 0.9,
      z + Math.cos(t * 0.1 + phase) * 2,
    );
    g.rotation.z = Math.sin(t * 0.2 + phase) * 0.12;

    for (const { attr, angle } of built.lines) {
      for (let j = 0; j < TENTACLE_POINTS; j++) {
        const f = j / (TENTACLE_POINTS - 1);
        const sway = Math.sin(t * 1.1 - j * 0.5 + angle * 2 + phase) * 0.06 * (0.4 + j * 0.35);
        const r = 0.6 * (1 - f * 0.35) * (1 + 0.1 * pulse * (1 - f));
        const drop = 0.15 + f * 2.3 * (1 + 0.06 * Math.sin(t * 1.6 + phase + 1));
        attr.setXYZ(j, Math.cos(angle) * r + sway, -drop, Math.sin(angle) * r + sway * 0.7);
      }
      attr.needsUpdate = true;
    }
  });

  useEffect(
    () => () => {
      built.bellGeometry.dispose();
      built.bellMaterial.dispose();
      built.lineMaterial.dispose();
    },
    [built],
  );

  return (
    <group ref={ref} scale={size}>
      <mesh geometry={built.bellGeometry} material={built.bellMaterial} />
      <primitive object={built.group} />
      <GlowSprite color="#3d9bff" size={3.2} opacity={0.35} />
    </group>
  );
}

type JelliesProps = { zone: number; count: number; seed: number; sizeMin?: number; sizeMax?: number };

/** A loose cloud of jellyfish scattered through one zone. */
export function Jellies({ zone, count, seed, sizeMin = 0.9, sizeMax = 1.7 }: JelliesProps) {
  const items = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 18,
      dy: (r() - 0.5) * 16,
      z: -14 + r() * 14,
      size: sizeMin + r() * (sizeMax - sizeMin),
      phase: r() * Math.PI * 2,
    }));
  }, [count, seed, sizeMin, sizeMax]);

  return (
    <>
      {items.map((j, i) => (
        <Jelly key={i} zone={zone} {...j} />
      ))}
    </>
  );
}
