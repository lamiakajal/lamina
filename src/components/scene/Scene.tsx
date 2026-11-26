"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { glowU, isLowEnd, snowU } from "./fx";
import { Particles, Rays, Rig, Surface } from "./environment";
import Fauna from "./Fauna";

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

      <Fauna low={low} />
    </Canvas>
  );
}
