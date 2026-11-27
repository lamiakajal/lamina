import Finale from "@/components/Finale";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Hud from "@/components/Hud";
import Intro from "@/components/Intro";
import Programme from "@/components/Programme";
import SceneLoader from "@/components/SceneLoader";
import ScrollDriver from "@/components/ScrollDriver";
import SpeciesIndex from "@/components/SpeciesIndex";
import Stats from "@/components/Stats";
import VideoLayers from "@/components/VideoLayers";
import ZoneSection from "@/components/ZoneSection";
import { ZONES } from "@/lib/zones";

export default function Home() {
  return (
    <>
      <SceneLoader />
      <ScrollDriver />
      <VideoLayers />
      <Hud />
      <main id="top" className="relative z-10">
        <Hero />
        <Intro />
        <Stats />
        <div id="zones">
          {ZONES.map((zone, i) => (
            <ZoneSection key={zone.id} zone={zone} index={i} />
          ))}
        </div>
        <SpeciesIndex />
        <Programme />
        <Finale />
        <Footer />
      </main>
    </>
  );
}
