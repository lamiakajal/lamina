"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// three.js needs the browser, so the scene is never rendered on the server
const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function SceneLoader() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(hasWebGL());
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 bg-[#0b6f8a]">
      {ok && <Scene />}
    </div>
  );
}
