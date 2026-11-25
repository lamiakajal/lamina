"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rand";
import { store } from "@/lib/store";
import { ZONE_H } from "./config";
import { glowU, snowU, sstep, sunU, timeU } from "./fx";

/** Rippling water surface, seen from below. */
export function Surface() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: timeU, uSun: sunU },
        vertexShader: /* glsl */ `
          varying vec3 vW;
          void main() {
            vec4 w = modelMatrix * vec4(position, 1.0);
            vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uSun;
          varying vec3 vW;

          float ripple(vec2 p) {
            float t = uTime * 0.35;
            float v = 0.0;
            vec2 q = p * 0.25;
            for (int i = 0; i < 4; i++) {
              q += vec2(sin(q.y * 1.7 + t * 1.3), cos(q.x * 1.5 - t)) * 0.45;
              v += abs(sin(q.x * 3.1 + t) * sin(q.y * 2.7 - t * 0.8));
            }
            return v * 0.25;
          }

          void main() {
            float b = pow(ripple(vW.xz), 2.2);
            vec3 c = mix(vec3(0.04, 0.42, 0.55), vec3(0.75, 0.97, 1.0), b * 1.6);
            float dist = length(vW.xz - cameraPosition.xz);
            float alpha = (0.55 + 0.45 * b) * uSun * smoothstep(120.0, 20.0, dist);
            gl_FragColor = vec4(c, alpha);
          }
        `,
      }),
    [],
  );

  return (
    <mesh position={[0, 9, -20]} rotation={[Math.PI / 2, 0, 0]} material={material}>
      <planeGeometry args={[260, 200]} />
    </mesh>
  );
}

/** Slanted shafts of light that fade out with depth. */
export function Rays() {
  const rays = useMemo(() => {
    const r = mulberry32(7);
    return Array.from({ length: 10 }, () => {
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: timeU, uSun: sunU, uSeed: { value: r() * 10 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uSun;
          uniform float uSeed;
          varying vec2 vUv;
          void main() {
            float edge = pow(max(1.0 - abs(vUv.x - 0.5) * 2.0, 0.0), 1.8);
            float len = pow(vUv.y, 1.3);
            float flick = 0.65 + 0.35 * sin(uTime * 0.5 + uSeed * 6.0 + vUv.y * 3.0);
            gl_FragColor = vec4(0.75, 0.95, 1.0, edge * len * flick * uSun * 0.22);
          }
        `,
      });
      return {
        material,
        x: (r() - 0.5) * 40,
        z: -8 - r() * 22,
        w: 1.6 + r() * 3,
        tilt: 0.18 + r() * 0.12,
        yaw: (r() - 0.5) * 0.5,
      };
    });
  }, []);

  return (
    <>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          material={ray.material}
          position={[ray.x, -26, ray.z]}
          rotation={[0, ray.yaw, ray.tilt]}
          scale={[ray.w, 80, 1]}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </>
  );
}

type ParticleProps = {
  count: number;
  yMin: number;
  yMax: number;
  size: number;
  tints: string[];
  alpha: { value: number };
  twinkle: number; // 0 steady, 1 fully twinkling
  seed: number;
};

/** Drifting points: marine snow near the top, glowing specks in the deep. */
export function Particles({ count, yMin, yMax, size, tints, alpha, twinkle, seed }: ParticleProps) {
  const dpr = useThree((s) => s.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const r = mulberry32(seed);
    const colors = tints.map((c) => new THREE.Color(c));
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const tint = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos.set([(r() - 0.5) * 44, yMin + r() * (yMax - yMin), -30 + r() * 44], i * 3);
      seeds[i] = r();
      const c = colors[Math.floor(r() * colors.length)];
      tint.set([c.r, c.g, c.b], i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aTint", new THREE.BufferAttribute(tint, 3));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: timeU,
        uSize: { value: size },
        uPixel: { value: 1 },
        uAlpha: alpha,
        uTwinkle: { value: twinkle },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uSize;
        uniform float uPixel;
        attribute float aSeed;
        attribute vec3 aTint;
        varying float vSeed;
        varying vec3 vTint;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.13 + aSeed * 40.0) * 0.9;
          p.y += sin(uTime * 0.21 + aSeed * 25.0) * 0.7;
          p.z += cos(uTime * 0.11 + aSeed * 33.0) * 0.9;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float s = uSize * (0.6 + aSeed) * uPixel * 28.0 / max(1.0, -mv.z);
          gl_PointSize = clamp(s, 1.0, 48.0 * uPixel);
          vSeed = aSeed;
          vTint = aTint;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uAlpha;
        uniform float uTime;
        uniform float uTwinkle;
        varying float vSeed;
        varying vec3 vTint;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.05, d);
          float flicker = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.8 + vSeed * 1.7) + vSeed * 60.0));
          float tw = mix(1.0, flicker, uTwinkle);
          gl_FragColor = vec4(vTint, a * uAlpha * tw);
        }
      `,
    });

    return { geometry, material };
    // the inputs are constants for the lifetime of the scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    material.uniforms.uPixel.value = dpr;
  }, [dpr, material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
