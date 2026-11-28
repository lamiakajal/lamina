import Finale from "@/components/Finale";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Hud from "@/components/Hud";
import Intro from "@/components/Intro";
import Plate from "@/components/Plate";
import PointerLayer from "@/components/PointerLayer";
import Preloader from "@/components/Preloader";
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
      <Preloader />
      <SceneLoader />
      <ScrollDriver />
      <PointerLayer />
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
        <Plate
          src="/scenes/jellyfish.jpg"
          alt="A single jellyfish drifting in blue water with sunbeams above"
          place="Mid-water, 60 m"
          caption="The last of the sunlight, and one jellyfish in no hurry."
        />
        <Programme />
        <Finale />
        <Footer />
      </main>
    </>
  );
}
