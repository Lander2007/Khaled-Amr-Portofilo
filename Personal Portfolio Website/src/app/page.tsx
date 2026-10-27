import Navbar from "@/components/layout/Navbar";
import Scene01Hero from "@/components/scenes/Scene01Hero";
import Scene02Transform from "@/components/scenes/Scene02Transform";
import Scene03SelectedWork from "@/components/scenes/Scene03SelectedWork";
import Scene04BehindTheInterface from "@/components/scenes/Scene04BehindTheInterface";
import Scene05Contact from "@/components/scenes/Scene05Contact";

export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen bg-[#FFF3E6] text-[#381932]">
      {/* Navigation */}
      <Navbar />

      {/* Scene 01: The Introduction */}
      <Scene01Hero />

      {/* Scene 02: The Transformation (FORM / SHIFT Sequence) */}
      <Scene02Transform />

      {/* Scene 03: Selected Work (CodeSystem Flagship + Portfolio Repertoire) */}
      <Scene03SelectedWork />

      {/* Scene 04: Behind the Interface (Authentic Engineering Breakdown) */}
      <Scene04BehindTheInterface />

      {/* Scene 05: Contact & Resolution */}
      <Scene05Contact />
    </main>
  );
}
