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
  const apertureRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });

      // State A -> State B: Words shift into alignment
      tl.to(
        wordFormRef.current,
        {
          xPercent: 40,
          yPercent: 20,
          letterSpacing: "0.25em",
          ease: "power2.inOut",
          duration: 0.3,
        },
        0
      );

      tl.to(
        wordShiftRef.current,
        {
          xPercent: -40,
          yPercent: -20,
          scale: 1.15,
          ease: "power2.inOut",
          duration: 0.3,
        },
        0
      );

      tl.to(
        wordStructRef.current,
        {
          xPercent: 30,
          yPercent: -25,
          ease: "power2.inOut",
          duration: 0.3,
        },
        0
      );

      tl.to(
        wordRevealRef.current,
        {
          xPercent: -30,
          yPercent: 25,
          ease: "power2.inOut",
          duration: 0.3,
        },
        0
      );

      // State B -> State C: Words compress into grid lines and wireframes
      tl.to(
        [
          wordFormRef.current,
          wordShiftRef.current,
          wordStructRef.current,
          wordRevealRef.current,
        ],
        {
          opacity: 0.15,
          scale: 0.85,
          duration: 0.3,
          ease: "power2.out",
        },
        0.3
      );

      tl.fromTo(
        gridFrameRef.current,
        {
          opacity: 0,
          scale: 0.92,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        0.35
      );

      // State C -> State D: Aperture expands to reveal the upcoming project stage
      tl.fromTo(
        apertureRef.current,
        {
          scaleY: 0,
          opacity: 0,
        },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.35,
          ease: "power2.inOut",
        },
        0.65
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="transform"
      className="relative w-full h-screen bg-[#381932] text-[#FFF3E6] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Background Architectural Grid Lines in Milk */}
      <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-30 z-0" />

      {/* Top Section Tag */}
      <div className="relative z-20 pt-28 sm:pt-32 px-6 sm:px-12 md:px-16 flex items-center justify-between text-xs font-mono tracking-widest text-[#FFF3E6]/60 uppercase border-b border-[#FFF3E6]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFF3E6] inline-block" />
          <span className="font-bold text-[#FFF3E6]">02 // KINETIC METAMORPHOSIS</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[11px] text-[#FFF3E6]/50">
          <span>STATE [ A &rarr; D ]</span>
          <span>SPATIAL TYPOGRAPHY GRID</span>
        </div>
      </div>

      {/* Center Dynamic Wordstage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-12">
        {/* Floating Typography Matrix */}
        <div className="w-full max-w-5xl h-[52vh] sm:h-[58vh] relative flex flex-col justify-between">
          {/* Top Row */}
          <div className="flex justify-between items-start">
            <div
              ref={wordFormRef}
              className="font-display text-[9vw] sm:text-[7vw] md:text-[6vw] font-black uppercase tracking-tighter text-[#C6F277]"
            >
              FORM
            </div>
            <div
              ref={wordShiftRef}
              className="font-serif italic font-normal text-[10vw] sm:text-[8vw] md:text-[7vw] lowercase text-[#FFF3E6]/85"
            >
              /shift
            </div>
          </div>

          {/* Wireframe Grid Frame (State C) */}
          <div
            ref={gridFrameRef}
            className="absolute inset-4 sm:inset-8 border border-[#FFF3E6]/30 opacity-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6"
          >
            <div className="flex justify-between items-center font-mono text-[10px] text-[#FFF3E6]/60 uppercase tracking-widest">
              <span>CANVAS // 1920 &times; 1080</span>
              <span>GRID RATIO // 1.618</span>
              <span>FPS LOCKED // 60.00</span>
            </div>

            {/* Central Scroll-Fill Manifesto inside Grid */}
            <div className="max-w-2xl mx-auto text-center px-4">
              <ScrollTextFill
                text="STATIC FORM BECOMES MOVEMENT. MOVEMENT BECOMES STRUCTURE. STRUCTURE REVEALS WORK."
                className="text-base sm:text-xl md:text-2xl"
                theme="milk"
              />
            </div>

            {/* Aperture Preview Gate (State D) */}
            <div
              ref={apertureRef}
              className="w-full h-28 sm:h-36 border border-[#FFF3E6]/60 bg-[#421e3b]/85 backdrop-blur-sm p-4 sm:p-5 flex flex-col justify-between origin-bottom"
            >
              <div className="flex items-center justify-between font-mono text-xs text-[#FFF3E6]/80">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] shadow-[0_0_8px_rgba(198,242,119,0.8)] animate-ping" />
                  <span>CATALOGUE INITIALIZED</span>
                </span>
                <span>15 VERIFIED CLIENT & OPEN-SOURCE PROJECTS</span>
              </div>
              <div className="font-display text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#FFF3E6]">
                SELECTED WORK &bull; PORTFOLIO REPERTOIRE
              </div>
            </div>

            <div className="flex justify-between items-center font-mono text-[10px] text-[#FFF3E6]/40 uppercase">
              <span>SYS.COORDS: 31.2001&deg; N // 29.9187&deg; E</span>
              <span>&copy; KHALED AMR</span>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-end">
            <div
              ref={wordStructRef}
              className="font-serif italic font-normal text-[9vw] sm:text-[7vw] md:text-[6vw] lowercase text-[#FFF3E6]/70"
            >
              structure
            </div>
            <div
              ref={wordRevealRef}
              className="font-display text-[10vw] sm:text-[8vw] md:text-[7vw] font-black uppercase tracking-tighter text-[#C6F277]"
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
