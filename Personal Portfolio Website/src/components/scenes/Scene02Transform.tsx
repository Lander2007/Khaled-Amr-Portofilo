"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollTextFill from "@/components/motion/ScrollTextFill";
import LiquidDivider from "@/components/motion/LiquidDivider";

gsap.registerPlugin(ScrollTrigger);

export default function Scene02Transform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordFormRef = useRef<HTMLDivElement>(null);
  const wordShiftRef = useRef<HTMLDivElement>(null);
  const wordStructRef = useRef<HTMLDivElement>(null);
  const wordRevealRef = useRef<HTMLDivElement>(null);
  const gridFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Fluid unpinned scroll transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      // Spatial typography gently shifts into harmony
      if (wordFormRef.current) {
        tl.fromTo(
          wordFormRef.current,
          { x: -30, opacity: 0.7 },
          { x: 0, opacity: 1, ease: "power2.out" },
          0
        );
      }

      if (wordShiftRef.current) {
        tl.fromTo(
          wordShiftRef.current,
          { x: 30, opacity: 0.7 },
          { x: 0, opacity: 1, ease: "power2.out" },
          0
        );
      }

      if (wordStructRef.current) {
        tl.fromTo(
          wordStructRef.current,
          { x: -20, opacity: 0.6 },
          { x: 0, opacity: 0.85, ease: "power2.out" },
          0.1
        );
      }

      if (wordRevealRef.current) {
        tl.fromTo(
          wordRevealRef.current,
          { x: 20, opacity: 0.7 },
          { x: 0, opacity: 1, ease: "power2.out" },
          0.1
        );
      }

      // Wireframe manifesto frame softly reveals
      if (gridFrameRef.current) {
        tl.fromTo(
          gridFrameRef.current,
          { opacity: 0.4, scale: 0.97 },
          { opacity: 1, scale: 1, ease: "power2.out" },
          0.15
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="transform"
      className="relative w-full min-h-[90vh] sm:min-h-screen bg-[#381932] text-[#FFF3E6] overflow-hidden select-none flex flex-col justify-between pt-24 sm:pt-28"
    >
      {/* Background Architectural Grid Lines in Milk */}
      <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-30 z-0" />

      {/* Top Section Tag */}
      <div className="relative z-20 px-6 sm:px-12 md:px-16 flex items-center justify-between text-xs font-mono tracking-widest text-[#FFF3E6]/60 uppercase border-b border-[#FFF3E6]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFF3E6] inline-block" />
          <span className="font-bold text-[#FFF3E6]">02 // KINETIC METAMORPHOSIS</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[11px] text-[#FFF3E6]/50">
          <span>STATE [ A &rarr; D ]</span>
          <span>SPATIAL TYPOGRAPHY MATRIX</span>
        </div>
      </div>

      {/* Center Dynamic Wordstage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 sm:py-16">
        <div className="w-full max-w-5xl relative flex flex-col justify-between gap-8 sm:gap-12">
          {/* Top Row */}
          <div className="flex justify-between items-start">
            <div
              ref={wordFormRef}
              className="font-display text-[9vw] sm:text-[7vw] md:text-[6vw] font-black uppercase tracking-tighter text-[#C6F277] will-change-transform"
            >
              FORM
            </div>
            <div
              ref={wordShiftRef}
              className="font-serif italic font-normal text-[10vw] sm:text-[8vw] md:text-[7vw] lowercase text-[#FFF3E6]/85 will-change-transform"
            >
              /shift
            </div>
          </div>

          {/* Central Architectural Wireframe Box */}
          <div
            ref={gridFrameRef}
            className="border border-[#FFF3E6]/30 bg-[#421e3b]/40 backdrop-blur-xs flex flex-col justify-between p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <div className="flex justify-between items-center font-mono text-[10px] text-[#FFF3E6]/60 uppercase tracking-widest">
              <span>CANVAS // 1920 &times; 1080</span>
              <span>GRID RATIO // 1.618</span>
              <span>ENGINE // GSAP 3 + TURBOPACK</span>
            </div>

            {/* Central Scroll-Fill Manifesto inside Grid */}
            <div className="max-w-2xl mx-auto text-center px-2 py-4">
              <ScrollTextFill
                text="STATIC FORM BECOMES MOVEMENT. MOVEMENT BECOMES STRUCTURE. STRUCTURE REVEALS WORK."
                className="text-lg sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#FFF3E6] leading-snug"
                theme="milk"
              />
            </div>

            {/* Aperture Preview Gate */}
            <div className="w-full border border-[#FFF3E6]/30 bg-[#381932]/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs text-[#FFF3E6]/80">
                <span className="w-2 h-2 rounded-full bg-[#C6F277] shadow-[0_0_8px_rgba(198,242,119,0.8)] animate-pulse" />
                <span className="font-bold text-[#C6F277]">CATALOGUE INITIALIZED</span>
                <span className="text-[#FFF3E6]/40 hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline">15 VERIFIED PRODUCTION PLATFORMS</span>
              </div>
              <div className="font-mono text-xs text-[#FFF3E6]/70 uppercase tracking-wider">
                SELECTED WORK OBSERVATORY &darr;
              </div>
            </div>

            <div className="flex justify-between items-center font-mono text-[10px] text-[#FFF3E6]/40 uppercase">
              <span>COORDS: 31.2001&deg; N // 29.9187&deg; E</span>
              <span>&copy; KHALED AMR</span>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-end">
            <div
              ref={wordStructRef}
              className="font-serif italic font-normal text-[9vw] sm:text-[7vw] md:text-[6vw] lowercase text-[#FFF3E6]/70 will-change-transform"
            >
              structure
            </div>
            <div
              ref={wordRevealRef}
              className="font-display text-[10vw] sm:text-[8vw] md:text-[7vw] font-black uppercase tracking-tighter text-[#C6F277] will-change-transform"
            >
              REVEAL
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Architectural Legend */}
      <div className="relative z-20 pb-4 px-6 sm:px-12 md:px-16 flex items-center justify-between font-mono text-xs text-[#FFF3E6]/50 tracking-widest uppercase border-t border-[#FFF3E6]/15 pt-3">
        <div>TYPOGRAPHIC TRANSFORMATION SEQUENCE</div>
        <div>CONTINUE SCROLLING TO DISCOVER WORK &darr;</div>
      </div>

      {/* Organic Liquid Divider Boundary */}
      <LiquidDivider fillColor="#FFF3E6" direction="bottom" />
    </section>
  );
}
