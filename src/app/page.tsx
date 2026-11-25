import Hero from "@/components/Hero";
import SceneLoader from "@/components/SceneLoader";
import ScrollDriver from "@/components/ScrollDriver";
import ZoneSection from "@/components/ZoneSection";
import { ZONES } from "@/lib/zones";

export default function Home() {
  return (
    <>
      <SceneLoader />
      <ScrollDriver />
      <main className="relative z-10">
        <Hero />
        <div id="zones">
          {ZONES.map((zone, i) => (
            <ZoneSection key={zone.id} zone={zone} index={i} />
          ))}
        </div>
      </main>
    </>
  );
}
