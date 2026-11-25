import * as THREE from "three";
import { timeU } from "./fx";

type AnimatedOptions = {
  color?: THREE.ColorRepresentation;
  vertexColors?: boolean;
  metalness?: number;
  roughness?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  opacity?: number;
  physical?: boolean;
  instanced?: boolean; // phase comes from an instanced attribute instead of a uniform
  phase?: number;
  speed?: number;
  amp?: number;
  snippet: string; // GLSL that edits `transformed`
};

/**
 * A standard lit material whose vertices are moved in the vertex shader.
 * The snippet can use uTime, uSpeed, uAmp and aPhase.
 */
export function makeAnimatedMaterial(o: AnimatedOptions): THREE.MeshStandardMaterial {
  const opacity = o.opacity ?? 1;
  const params = {
    color: o.color ?? 0xffffff,
    vertexColors: o.vertexColors ?? false,
    metalness: o.metalness ?? 0.3,
    roughness: o.roughness ?? 0.5,
    emissive: o.emissive ?? 0x000000,
    emissiveIntensity: o.emissiveIntensity ?? 1,
    transparent: opacity < 1,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: opacity >= 1,
  };
  const material = o.physical ? new THREE.MeshPhysicalMaterial(params) : new THREE.MeshStandardMaterial(params);

  const speed = o.speed ?? 3;
  const amp = o.amp ?? 0.2;
  const phase = o.phase ?? 0;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = timeU;
    shader.uniforms.uSpeed = { value: speed };
    shader.uniforms.uAmp = { value: amp };
    if (!o.instanced) shader.uniforms.aPhase = { value: phase };

    const header = `#include <common>
uniform float uTime;
uniform float uSpeed;
uniform float uAmp;
${o.instanced ? "attribute float aPhase;" : "uniform float aPhase;"}`;

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", header)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${o.snippet}`);
  };
  // materials that share a snippet can share one compiled program
  material.customProgramCacheKey = () => (o.instanced ? "i" : "u") + o.snippet;

  return material;
}
