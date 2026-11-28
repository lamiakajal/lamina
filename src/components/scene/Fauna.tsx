"use client";

import { Suspense, type ReactNode } from "react";
import { hasCreature } from "@/lib/media";
import { SPECIES } from "@/lib/species";
import { Angler, Gulper, Jellies, Manta, School } from "./creatures";
import type { FishShape } from "./geometry";
import { SpriteSchool } from "./sprites";

const SARDINE: FishShape = { H: 0.2, W: 0.12, tail: 0.62, dorsal: 0.06, eye: 0.04, back: "#2f6a85", belly: "#e1e9ec" };
const SNAPPER: FishShape = { H: 0.38, W: 0.17, tail: 0.7, dorsal: 0.14, eye: 0.05, back: "#e0a82e", belly: "#f7e7a6", fins: "#f0b93a" };
const TUNA: FishShape = { H: 0.3, W: 0.22, tail: 1.05, dorsal: 0.1, eye: 0.045, back: "#10243b", belly: "#aab8c2" };
const LANTERN: FishShape = { H: 0.24, W: 0.13, tail: 0.6, dorsal: 0.05, eye: 0.05, back: "#14283a", belly: "#5d7586" };
const SNAILFISH: FishShape = { H: 0.5, W: 0.42, tail: 0.9, dorsal: 0.25, eye: 0.05, head: 0.2, back: "#5d4f70", belly: "#85769a" };

/** Uses the photographic version of an animal when its file exists, otherwise the one drawn in code. */
function Pick({ file, photo, fallback }: { file: string; photo: ReactNode; fallback: ReactNode }) {
  return hasCreature(file) ? <Suspense fallback={null}>{photo}</Suspense> : <>{fallback}</>;
}

/** Every animal in the scene, grouped by zone. `low` halves the crowds. */
export default function Fauna({ low }: { low: boolean }) {
  const n = (full: number) => (low ? Math.ceil(full / 2) : full);

  return (
    <>
      {/* zone 1: sunlight */}
      <Pick
        file="sardine"
        photo={<SpriteSchool file="sardine" mode="alpha" zone={0} count={n(36)} length={1.3} seed={1} speed={0.22} rx={13} rz={7} cz={-3} spreadY={6} spreadA={0.6} />}
        fallback={<School zone={0} count={n(70)} seed={1} scale={0.38} speed={0.22} rx={13} rz={7} cz={-3} spreadY={6} spreadA={0.6} shape={SARDINE} metalness={0.55} roughness={0.32} swim={9} amp={0.2} />}
      />
      <Pick
        file="yellow-snapper"
        photo={<SpriteSchool file="yellow-snapper" mode="alpha" zone={0} count={n(14)} length={1.5} seed={2} speed={0.15} dir={-1} rx={11} rz={6} cz={-5} spreadY={7} />}
        fallback={<School zone={0} count={n(22)} seed={2} scale={0.55} speed={0.15} dir={-1} rx={11} rz={6} cz={-5} spreadY={7} shape={SNAPPER} swim={6} amp={0.2} />}
      />
      <Pick
        file="manta-ray"
        photo={<SpriteSchool file="manta-ray" mode="alpha" zone={0} count={2} length={5.5} seed={9} speed={0.06} rx={14} rz={8} cz={-7} spreadY={5} spreadA={3} />}
        fallback={
          <>
            <Manta zone={0} phase={0} rx={14} rz={7} cz={-6} speed={0.07} dy={4} />
            <Manta zone={0} phase={2} dir={-1} rx={16} rz={9} cz={-10} speed={0.05} dy={-6} />
          </>
        }
      />

      {/* zone 2: twilight */}
      <Pick
        file="bluefin-tuna"
        photo={<SpriteSchool file="bluefin-tuna" mode="alpha" zone={1} count={4} length={3.2} seed={3} speed={0.16} rx={14} rz={7} cz={-4} spreadY={5} spreadA={0.9} />}
        fallback={<School zone={1} count={5} seed={3} scale={2.3} speed={0.16} rx={14} rz={7} cz={-4} spreadY={5} spreadA={0.9} shape={TUNA} metalness={0.55} swim={5} amp={0.12} />}
      />
      <Pick
        file="lanternfish"
        photo={<SpriteSchool file="lanternfish" mode="alpha" zone={1} count={n(30)} length={1} seed={4} speed={0.2} dir={-1} rx={12} rz={6} cz={-5} spreadY={6} />}
        fallback={<School zone={1} count={n(60)} seed={4} scale={0.32} speed={0.2} dir={-1} rx={12} rz={6} cz={-5} spreadY={6} shape={LANTERN} emissive="#0b4a5e" emissiveIntensity={0.5} swim={9} />}
      />

      {/* zone 3: midnight */}
      <Pick
        file="pelagia-jelly"
        photo={<SpriteSchool file="pelagia-jelly" mode="alpha" zone={2} count={n(6)} height={3} seed={21} speed={0.03} rx={8} rz={4} cz={-6} spreadY={8} spreadA={5} flip={false} pulse={0.06} />}
        fallback={<Jellies zone={2} count={n(8)} seed={21} />}
      />
      {hasCreature("atolla-jelly") && (
        <Suspense fallback={null}>
          <SpriteSchool file="atolla-jelly" mode="alpha" zone={2} count={3} height={2.4} seed={22} speed={0.025} dir={-1} rx={9} rz={4} cz={-8} spreadY={8} spreadA={5} flip={false} pulse={0.05} />
        </Suspense>
      )}
      <Pick
        file="anglerfish"
        photo={<SpriteSchool file="anglerfish" mode="alpha" zone={2} count={1} length={3.6} seed={23} speed={0.1} rx={9} rz={5} cz={-4} spreadY={1} spreadA={0.1} />}
        fallback={<Angler zone={2} phase={0.5} rx={9} rz={5} cz={-4} speed={0.1} dy={-2} />}
      />

      {/* zone 4: abyss */}
      <Pick
        file="gulper-eel"
        photo={<SpriteSchool file="gulper-eel" mode="alpha" zone={3} count={2} length={4.5} seed={31} speed={0.05} rx={12} rz={6} cz={-7} spreadY={5} spreadA={3} />}
        fallback={
          <>
            <Gulper zone={3} phase={0} rx={11} rz={6} cz={-6} speed={0.06} dy={2} size={0.9} />
            <Gulper zone={3} phase={2.5} dir={-1} rx={13} rz={7} cz={-9} speed={0.045} dy={-5} size={1.1} />
          </>
        }
      />
      {hasCreature("vampire-squid") && (
        <Suspense fallback={null}>
          <SpriteSchool file="vampire-squid" mode="alpha" zone={3} count={2} length={3.6} seed={32} speed={0.03} dir={-1} rx={8} rz={4} cz={-6} spreadY={6} spreadA={4} flip={false} pulse={0.05} />
        </Suspense>
      )}
      {!hasCreature("pelagia-jelly") && <Jellies zone={3} count={3} seed={33} sizeMin={0.8} sizeMax={1.3} />}

      {/* zone 5: hadal */}
      <Pick
        file="snailfish"
        photo={<SpriteSchool file="snailfish" mode="alpha" zone={4} count={5} length={2.6} seed={5} speed={0.06} rx={9} rz={5} cz={-4} spreadY={6} spreadA={1.2} />}
        fallback={<School zone={4} count={7} seed={5} scale={0.75} speed={0.06} rx={9} rz={5} cz={-4} spreadY={6} spreadA={1.2} shape={SNAILFISH} metalness={0.05} roughness={0.5} opacity={0.8} emissive="#5a4a88" emissiveIntensity={0.35} swim={4} amp={0.2} />}
      />
      {hasCreature("amphipod") && (
        <Suspense fallback={null}>
          <SpriteSchool file="amphipod" mode="alpha" zone={4} count={n(12)} length={0.8} seed={6} speed={0.05} dir={-1} rx={10} rz={5} cz={-5} spreadY={7} spreadA={2} />
        </Suspense>
      )}

      {/* the rest of the list, shown only when their photos exist */}
      {SPECIES.filter((sp) => hasCreature(sp.file)).map((sp) => (
        <Suspense key={sp.file} fallback={null}>
          <SpriteSchool {...sp} count={sp.count > 3 ? n(sp.count) : sp.count} seed={sp.file.length * 7} />
        </Suspense>
      ))}
    </>
  );
}
