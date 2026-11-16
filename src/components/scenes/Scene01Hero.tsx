"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import HeroGlitchLockup from "@/components/motion/HeroGlitchLockup";

gsap.registerPlugin(ScrollTrigger);

const ROW1_WORDS = [
  "FORM", "•", "SHIFT", "•", "KINETIC", "•", "ARCHITECTURE", "•", "FORM", "•", "SHIFT", "•", "KINETIC", "•", "ARCHITECTURE"
];
const ROW2_WORDS = [
  "DREAM", "•", "PASSION", "•", "EMOTION", "•", "DREAM", "•", "PASSION", "•", "EMOTION", "•", "DREAM", "•", "PASSION"
];
const ROW3_WORDS = [
  "EMOTION", "•", "DREAM", "•", "PASSION", "•", "EMOTION", "•", "DREAM", "•", "PASSION", "•", "EMOTION"
];

export interface HeroScrollElements {
  wordRow1: HTMLDivElement | null;
  wordRow2: HTMLDivElement | null;
  wordRow3: HTMLDivElement | null;
  heroContent: HTMLDivElement | null;
}

interface Scene01HeroProps {
  isEmbedded?: boolean;
  onRegisterScrollElements?: (elements: HeroScrollElements) => void;
}

export default function Scene01Hero({
  isEmbedded = false,
  onRegisterScrollElements,
}: Scene01HeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const wordWallRef = useRef<HTMLDivElement>(null);
  const wordRow1Ref = useRef<HTMLDivElement>(null);
  const wordRow2Ref = useRef<HTMLDivElement>(null);
  const wordRow3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onRegisterScrollElements) {
      onRegisterScrollElements({
        wordRow1: wordRow1Ref.current,
        wordRow2: wordRow2Ref.current,
        wordRow3: wordRow3Ref.current,
        heroContent: heroContentRef.current,
      });
    }
  }, [onRegisterScrollElements]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const mm = gsap.matchMedia();

    // Responsive ScrollTrigger orchestration
    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

        // 1. Initial Page Load Staggered Entrance
        gsap.from(heroContentRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });

        // When embedded inside the Center Reveal transition, the parent orchestrator handles the scroll scrub
        if (isEmbedded) {
          return;
        }

        // 2. Unpinned Smooth Scroll Scrub on Word Wall and Hero Elements
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        // Animated Word Wall Opposing Glides
        if (wordRow1Ref.current && wordRow2Ref.current && wordRow3Ref.current) {
          tl.to(
            wordRow1Ref.current,
            {
              xPercent: isDesktop ? -15 : -24,
              ease: "none",
            },
            0
          );

          tl.to(
            wordRow2Ref.current,
            {
              xPercent: isDesktop ? 15 : 24,
              ease: "none",
            },
            0
          );

          tl.to(
            wordRow3Ref.current,
            {
              xPercent: isDesktop ? -12 : -18,
              ease: "none",
            },
            0
          );
        }

        // Hero Content gentle upward translation and soft fade on scroll
        if (heroContentRef.current) {
          tl.to(
            heroContentRef.current,
            {
              y: -40,
              opacity: 0.25,
              ease: "none",
            },
            0
          );
        }
      },
      containerRef
    );

    return () => {
      mm.revert();
    };
  }, [isEmbedded]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-[var(--bg-primary)] select-none"
    >
      {/* ============================================================== */}
      {/* 01. ANIMATED WORD WALL (BACKGROUND LAYER, Z-0)                 */}
      {/* ============================================================== */}
      <div
        ref={wordWallRef}
        className="absolute inset-0 overflow-hidden pointer-events-none select-none flex flex-col justify-around py-8 z-0"
        aria-hidden="true"
      >
        {/* Row 1: Leftward Glide */}
        <div
          ref={wordRow1Ref}
          className="hero-watermark-row font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight whitespace-nowrap will-change-transform leading-none pointer-events-none"
        >
          {ROW1_WORDS.map((word, idx) => (
            <span key={idx} className="inline-block px-2">
              {word}
            </span>
          ))}
        </div>

        {/* Row 2: Rightward Glide */}
        <div
          ref={wordRow2Ref}
          className="hero-watermark-row font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight whitespace-nowrap will-change-transform leading-none ml-[-20%] pointer-events-none"
        >
          {ROW2_WORDS.map((word, idx) => (
            <span key={idx} className="inline-block px-2">
              {word}
            </span>
          ))}
        </div>

        {/* Row 3: Leftward Glide */}
        <div
          ref={wordRow3Ref}
          className="hero-watermark-row font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight whitespace-nowrap will-change-transform leading-none pointer-events-none"
        >
          {ROW3_WORDS.map((word, idx) => (
            <span key={idx} className="inline-block px-2">
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle Hairline Grid Layer for Architectural Texture */}
      <div className="absolute inset-0 pointer-events-none bg-grid-milk z-0" />

      {/* ============================================================== */}
      {/* 02. BASE LAYER: EDITORIAL HERO COMPOSITION WITH GLITCH ENGINE   */}
      {/* ============================================================== */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 w-full h-full flex flex-col justify-center pt-20 sm:pt-24 pb-12 z-10 pointer-events-none"
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 space-y-6 sm:space-y-8 pointer-events-none">
          {/* High-Impact 5-Slice Destructive Glitch & Character Scramble Engine */}
          <div className="pointer-events-auto">
            <HeroGlitchLockup />
          </div>

          {/* 4. Concise Professional Supporting Statement */}
          <p className="font-serif italic text-[clamp(1.25rem,2.4vw,2.1rem)] text-current leading-snug max-w-3xl text-balance pointer-events-auto">
            I build interactive digital experiences through code, design, and motion.
          </p>

          {/* 5. Clear, Focused Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-3 font-mono text-xs pointer-events-auto">
            <MagneticButton strength={0.3} maxOffset={8}>
              <a
                href="#work"
                className="px-7 py-4 bg-[var(--ink-primary)] text-[var(--bg-canvas)] font-bold uppercase tracking-widest flex items-center gap-2.5 hover:bg-[#D4FF33] hover:text-[#2B1126] transition-colors shadow-sm cursor-pointer group"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#FF4D1C] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.25} maxOffset={6}>
              <a
                href="#contact"
                className="px-7 py-4 border border-[var(--border-hairline)] text-[var(--ink-primary)] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              >
                <span>CONTACT ME</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
