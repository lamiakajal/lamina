"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { glowU, isLowEnd, snowU } from "./fx";
import { Particles, Rays, Rig, Surface } from "./environment";
import { Angler, Gulper, Jellies, Manta, School } from "./creatures";
import type { FishShape } from "./geometry";

const SARDINE: FishShape = { H: 0.2, W: 0.12, tail: 0.62, dorsal: 0.06, eye: 0.04, back: "#2f6a85", belly: "#e1e9ec" };
const SNAPPER: FishShape = { H: 0.38, W: 0.17, tail: 0.7, dorsal: 0.14, eye: 0.05, back: "#e0a82e", belly: "#f7e7a6", fins: "#f0b93a" };
const TUNA: FishShape = { H: 0.3, W: 0.22, tail: 1.05, dorsal: 0.1, eye: 0.045, back: "#10243b", belly: "#aab8c2" };
const LANTERN: FishShape = { H: 0.24, W: 0.13, tail: 0.6, dorsal: 0.05, eye: 0.05, back: "#14283a", belly: "#5d7586" };
const SNAILFISH: FishShape = { H: 0.5, W: 0.42, tail: 0.9, dorsal: 0.25, eye: 0.05, head: 0.2, back: "#5d4f70", belly: "#85769a" };

export default function Scene() {
  const low = useMemo(() => isLowEnd(), []);
  const n = (full: number) => (low ? Math.ceil(full / 2) : full);

  return (
    <Canvas
      dpr={[1, low ? 1.25 : 1.75]}
      camera={{ fov: 55, near: 0.1, far: 140, position: [0, -1.5, 10] }}
      gl={{ antialias: !low, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#1796b3"]} />
      <fogExp2 attach="fog" args={["#1796b3", 0.018]} />

      <Rig />
      <Surface />
      <Rays />

      <Particles count={n(1500)} yMin={-340} yMax={12} size={2.2} tints={["#bcd6e6"]} alpha={snowU} twinkle={0} seed={11} />
      <Particles
        count={n(520)}
        yMin={-330}
        yMax={-110}
        size={5.5}
        tints={["#5ff0ff", "#7dffb0", "#c07bff"]}
        alpha={glowU}
        twinkle={1}
        seed={12}
      />

      {/* zone 1: sunlight */}
      <School zone={0} count={n(70)} seed={1} scale={0.38} speed={0.22} rx={13} rz={7} cz={-3} spreadY={6} spreadA={0.6} shape={SARDINE} metalness={0.55} roughness={0.32} swim={9} amp={0.2} />
      <School zone={0} count={n(22)} seed={2} scale={0.55} speed={0.15} dir={-1} rx={11} rz={6} cz={-5} spreadY={7} shape={SNAPPER} swim={6} amp={0.2} />
      <Manta zone={0} phase={0} rx={14} rz={7} cz={-6} speed={0.07} dy={4} />
      <Manta zone={0} phase={2} dir={-1} rx={16} rz={9} cz={-10} speed={0.05} dy={-6} />

      {/* zone 2: twilight */}
      <School zone={1} count={5} seed={3} scale={2.3} speed={0.16} rx={14} rz={7} cz={-4} spreadY={5} spreadA={0.9} shape={TUNA} metalness={0.55} swim={5} amp={0.12} />
      <School zone={1} count={n(60)} seed={4} scale={0.32} speed={0.2} dir={-1} rx={12} rz={6} cz={-5} spreadY={6} shape={LANTERN} emissive="#0b4a5e" emissiveIntensity={0.5} swim={9} />

      {/* zone 3: midnight */}
      <Jellies zone={2} count={n(8)} seed={21} />
      <Angler zone={2} phase={0.5} rx={9} rz={5} cz={-4} speed={0.1} dy={-2} />

      {/* zone 4: abyss */}
      <Gulper zone={3} phase={0} rx={11} rz={6} cz={-6} speed={0.06} dy={2} size={0.9} />
      <Gulper zone={3} phase={2.5} dir={-1} rx={13} rz={7} cz={-9} speed={0.045} dy={-5} size={1.1} />
      <Jellies zone={3} count={3} seed={33} sizeMin={0.8} sizeMax={1.3} />

      {/* zone 5: hadal */}
      <School zone={4} count={7} seed={5} scale={0.75} speed={0.06} rx={9} rz={5} cz={-4} spreadY={6} spreadA={1.2} shape={SNAILFISH} metalness={0.05} roughness={0.5} opacity={0.8} emissive="#5a4a88" emissiveIntensity={0.35} swim={4} amp={0.2} />
    </Canvas>
  );
}
