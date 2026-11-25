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
