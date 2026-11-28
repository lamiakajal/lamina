"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rand";
import { pointer, store } from "@/lib/store";
import { getGlowTexture, glowU, timeU } from "./fx";
import { makeFishGeometry, swimSnippet, type FishShape } from "./geometry";
import { makeAnimatedMaterial } from "./materials";

// A small pale fish that comes to see what the cursor is doing. Each one is tinted
// with its own colour, so the body is kept light and the tint does the rest.
const SHAPE: FishShape = { H: 0.2, W: 0.12, tail: 0.66, dorsal: 0.07, eye: 0.04, back: "#ffffff", belly: "#ffe7c4", fins: "#ffffff" };

// nemo orange, goldfish gold, blue tang, and friends
const PALETTE = ["#ff7a1a", "#ffb400", "#ffd93b", "#1f7bff", "#ff4a4a", "#b05cff", "#3fd37a", "#ff6fae", "#19c9d8", "#ff9a3c"];

const ACTIVE_MS = 5000; // how long they stay after the pointer stops
const MAX_PELLETS = 32;
const PELLET_LIFE = 11; // seconds
const FISH_SCALE = 0.2;
const SHALLOW = new THREE.Color("#ffffff");
const DEEP = new THREE.Color("#3c4a5e"); // the same colours, just dimmed once the light is gone

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

type Pellet = { x: number; y: number; z: number; vy: number; life: number };

/**
 * Fish that follow the cursor and chase food dropped with a click. Everything is
 * simulated in the camera's own space, so it works at every depth.
 */
export default function Followers({ low }: { low: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const points = useRef<THREE.Points>(null);
  const painted = useRef(false);
  const count = low ? 12 : 26;

  const sim = useMemo(() => {
    const r = mulberry32(77);
    const geometry = makeFishGeometry(SHAPE);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) phases[i] = r() * Math.PI * 2;
    geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));

    const material = makeAnimatedMaterial({
      vertexColors: true,
      metalness: 0.5,
      roughness: 0.35,
      emissive: "#4a6a80",
      emissiveIntensity: 0,
      instanced: true,
      speed: 11,
      amp: 0.24,
      snippet: swimSnippet(),
    });

    const fish = Array.from({ length: count }, () => ({
      alive: false,
      x: 0,
      y: 0,
      d: 9 + r() * 6, // distance in front of the camera
      vx: 0,
      vy: 0,
      yaw: 0,
      tilt: 0,
      ring: 0.5 + r() * 1.9, // how far from the cursor it likes to hover
      w: 0.5 + r() * 0.9, // how fast it circles
      ph: r() * Math.PI * 2,
      s: 0.85 + r() * 0.35,
    }));

    const pellets: Pellet[] = [];
    const pelletGeo = new THREE.BufferGeometry();
    pelletGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_PELLETS * 3), 3));
    pelletGeo.setDrawRange(0, 0);
    const pelletMat = new THREE.PointsMaterial({
      map: getGlowTexture(),
      color: "#ffd9a0",
      size: 0.6,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });

    return { geometry, material, fish, pellets, pelletGeo, pelletMat, r };
    // the crowd size is fixed for the lifetime of the scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tmp = useMemo(
    () => ({
      o: new THREE.Object3D(),
      qz: new THREE.Quaternion(),
      qy: new THREE.Quaternion(),
      zAxis: new THREE.Vector3(0, 0, 1),
      yAxis: new THREE.Vector3(0, 1, 0),
      color: new THREE.Color(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    const dt = Math.min(0.05, delta);
    const now = performance.now();
    const t = timeU.value;

    // give every fish its own colour, once
    if (!painted.current) {
      for (let i = 0; i < count; i++) m.setColorAt(i, tmp.color.set(PALETTE[i % PALETTE.length]));
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      painted.current = true;
    }

    // ride with the camera so every position below is in screen space
    g.position.copy(cam.position);
    g.quaternion.copy(cam.quaternion);

    const tanH = Math.tan((cam.fov * Math.PI) / 360);
    const aspect = state.size.width / state.size.height;
    const halfH = (d: number) => tanH * d;
    const halfW = (d: number) => tanH * d * aspect;

    const enabled = !store.reduced;
    const active = enabled && pointer.seen && now - pointer.last < ACTIVE_MS;
    const { fish, pellets, pelletGeo } = sim;

    // turn queued clicks into pellets
    while (pointer.food.length) {
      const f = pointer.food.shift()!;
      if (!enabled || pellets.length >= MAX_PELLETS) continue;
      const d = 12;
      pellets.push({
        x: f.x * halfW(d),
        y: f.y * halfH(d),
        z: -d,
        vy: -(0.5 + sim.r() * 0.5),
        life: PELLET_LIFE,
      });
    }
    for (const p of pellets) {
      p.life -= dt;
      p.y += p.vy * dt;
      p.x += Math.sin(t * 1.3 + p.y) * 0.15 * dt; // a little drift
    }

    const want = active || pellets.length > 0;
    const eaten = new Set<Pellet>();

    for (let i = 0; i < count; i++) {
      const f = fish[i];

      if (!f.alive) {
        if (!want) {
          tmp.o.scale.setScalar(0);
          tmp.o.updateMatrix();
          m.setMatrixAt(i, tmp.o.matrix);
          continue;
        }
        // stagger arrivals so they trickle in from the sides
        if (sim.r() > 0.015) {
          tmp.o.scale.setScalar(0);
          tmp.o.updateMatrix();
          m.setMatrixAt(i, tmp.o.matrix);
          continue;
        }
        const side = sim.r() < 0.5 ? -1 : 1;
        f.alive = true;
        f.x = side * (halfW(f.d) + 2.5);
        f.y = (sim.r() - 0.5) * halfH(f.d) * 1.6;
        f.vx = -side * 3;
        f.vy = 0;
        f.yaw = f.vx < 0 ? Math.PI : 0;
      }

      // pick something to swim toward
      let tx: number;
      let ty: number;
      let top = 6.5;
      let near: Pellet | null = null;
      let nd = Infinity;
      for (const p of pellets) {
        if (eaten.has(p)) continue;
        const dd = (p.x - f.x) ** 2 + (p.y - f.y) ** 2;
        if (dd < nd) {
          nd = dd;
          near = p;
        }
      }

      if (near) {
        tx = near.x;
        ty = near.y;
        top = 8.5;
        if (nd < 0.35) {
          eaten.add(near);
          pointer.fed += 1;
          pointer.lastFed = now;
        }
      } else if (active) {
        const a = t * f.w + f.ph;
        tx = pointer.x * halfW(f.d) + Math.cos(a) * f.ring;
        ty = pointer.y * halfH(f.d) + Math.sin(a) * f.ring * 0.7;
      } else {
        // nothing going on: head for the nearest edge and disappear
        const side = f.x >= 0 ? 1 : -1;
        tx = side * (halfW(f.d) + 8);
        ty = f.y;
        top = 5;
        if (Math.abs(f.x) > halfW(f.d) + 3.5) f.alive = false;
      }

      const dx = tx - f.x;
      const dy = ty - f.y;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = top * clamp(dist / 3.5, 0.08, 1);
      const k = Math.min(1, dt * 2.8);
      f.vx += ((dx / dist) * speed - f.vx) * k;
      f.vy += ((dy / dist) * speed - f.vy) * k;
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      // face where it is going, flipping over smoothly instead of snapping
      const sp = Math.hypot(f.vx, f.vy);
      if (sp > 0.25) {
        const right = f.vx >= 0;
        const tiltTarget = clamp(Math.atan2(f.vy, Math.abs(f.vx)) * (right ? 1 : -1), -0.8, 0.8);
        f.yaw += ((right ? 0 : Math.PI) - f.yaw) * Math.min(1, dt * 7);
        f.tilt += (tiltTarget - f.tilt) * Math.min(1, dt * 8);
      }

      tmp.qz.setFromAxisAngle(tmp.zAxis, f.tilt);
      tmp.qy.setFromAxisAngle(tmp.yAxis, f.yaw);
      tmp.o.quaternion.copy(tmp.qz).multiply(tmp.qy);
      tmp.o.position.set(f.x, f.y, -f.d);
      tmp.o.scale.setScalar(f.alive ? FISH_SCALE * f.s : 0);
      tmp.o.updateMatrix();
      m.setMatrixAt(i, tmp.o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

    // remove eaten and expired pellets, then upload positions
    for (let i = pellets.length - 1; i >= 0; i--) {
      if (eaten.has(pellets[i]) || pellets[i].life <= 0 || pellets[i].y < -halfH(12) - 2) pellets.splice(i, 1);
    }
    const attr = pelletGeo.attributes.position as THREE.BufferAttribute;
    pellets.forEach((p, i) => attr.setXYZ(i, p.x, p.y, p.z));
    attr.needsUpdate = true;
    pelletGeo.setDrawRange(0, pellets.length);

    // bright near the surface, dim and a touch luminous once the light is gone
    const mat = sim.material;
    mat.color.copy(tmp.color.lerpColors(SHALLOW, DEEP, clamp(store.current / 3, 0, 1)));
    mat.emissiveIntensity = glowU.value * 0.35;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[sim.geometry, sim.material, count]} frustumCulled={false} />
      <points ref={points} geometry={sim.pelletGeo} material={sim.pelletMat} frustumCulled={false} />
    </group>
  );
}
