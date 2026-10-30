import Navbar from "@/components/layout/Navbar";
import HeroCenterRevealTransition from "@/components/motion/HeroCenterRevealTransition";
import Scene03SelectedWork from "@/components/scenes/Scene03SelectedWork";
import Scene04BehindTheInterface from "@/components/scenes/Scene04BehindTheInterface";
import Scene05Contact from "@/components/scenes/Scene05Contact";
import CinematicIntro from "@/components/motion/CinematicIntro";

export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen bg-[#FFF3E6] text-[#381932]">
      {/* Cinematic Autonomous Intro: The Digital Awakening */}
      <CinematicIntro />

      {/* Navigation */}
      <Navbar />

      {/* Scene 01 Hero & Scene 02 Transform: Cinematic Scroll-Driven Center Reveal */}
      <HeroCenterRevealTransition />

      {/* Scene 03: Selected Work (CodeSystem Flagship + Portfolio Repertoire) */}
      <Scene03SelectedWork />

      {/* Scene 04: Behind the Interface (Authentic Engineering Breakdown) */}
      <Scene04BehindTheInterface />

      {/* Scene 05: Contact & Resolution */}
      <Scene05Contact />
    </main>
  );
}
