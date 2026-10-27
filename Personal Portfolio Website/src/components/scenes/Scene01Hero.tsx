"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import TypewriterHero from "@/components/motion/TypewriterHero";

gsap.registerPlugin(ScrollTrigger);

export default function Scene01Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const curtainOverlayRef = useRef<HTMLDivElement>(null);
  const wordWallRef = useRef<HTMLDivElement>(null);
  const wordRow1Ref = useRef<HTMLDivElement>(null);
  const wordRow2Ref = useRef<HTMLDivElement>(null);
  const wordRow3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!containerRef.current || !curtainOverlayRef.current) {
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
        const splitStop = isDesktop ? "36%" : "0%";

        // 1. Initial Page Load Staggered Entrance (clears props so no inline styles conflict)
        gsap.from(heroContentRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });

        // 2. Scroll-Driven Master Timeline with explicit fromTo and failsafe resets
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: isDesktop ? "+=200%" : "+=140%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeaveBack: () => {
              // Guaranteed restoration when scrolling back to the very top
              if (heroContentRef.current) {
                gsap.set(heroContentRef.current, {
                  opacity: 1,
                  scale: 1,
                  xPercent: 0,
                  clearProps: "transform",
                });
              }
              if (curtainOverlayRef.current) {
                gsap.set(curtainOverlayRef.current, {
                  clipPath: "inset(0% 0% 0% 100%)",
                });
              }
            },
            onUpdate: (self) => {
              // Safety guard: if near top, ensure hero text is fully visible
              if (self.progress <= 0.02 && heroContentRef.current) {
                heroContentRef.current.style.opacity = "1";
              }
            },
          },
        });

        // Animated Word Wall Opposing Glides
        if (wordRow1Ref.current && wordRow2Ref.current && wordRow3Ref.current) {
          tl.fromTo(
            wordRow1Ref.current,
            { xPercent: 0 },
            {
              xPercent: isDesktop ? -16 : -25,
              ease: "none",
              duration: 1,
            },
            0
          );

          tl.fromTo(
            wordRow2Ref.current,
            { xPercent: 0 },
            {
              xPercent: isDesktop ? 16 : 25,
              ease: "none",
              duration: 1,
            },
            0
          );

          tl.fromTo(
            wordRow3Ref.current,
            { xPercent: 0 },
            {
              xPercent: isDesktop ? -12 : -20,
              ease: "none",
              duration: 1,
            },
            0
          );
        }

        if (wordWallRef.current) {
          tl.fromTo(
            wordWallRef.current,
            { yPercent: 0, opacity: 0.07 },
            {
              yPercent: -10,
              opacity: 0.03,
              ease: "none",
              duration: 1,
            },
            0
          );
        }

        // Camera-shutter curtain wipe transition
        tl.fromTo(
          curtainOverlayRef.current,
          {
            clipPath: "inset(0% 0% 0% 100%)",
          },
          {
            clipPath: `inset(0% 0% 0% ${splitStop})`,
            ease: "none",
            duration: 0.45,
          },
          0
        );

        // Explicit fromTo so returning to progress 0 always restores opacity: 1
        tl.fromTo(
          heroContentRef.current,
          {
            opacity: 1,
            scale: 1,
            xPercent: 0,
          },
          {
            xPercent: isDesktop ? -4 : 0,
            scale: 0.96,
            opacity: isDesktop ? 0.75 : 0.4,
            ease: "none",
            duration: 0.45,
          },
          0
        );

        // Phase 2: Hold briefly to inspect transition title
        tl.to({}, { duration: 0.15 });

        // Phase 3: Shutter wipes completely across into Scene 02 / Work
        tl.to(
          curtainOverlayRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            duration: 0.4,
          },
          0.6
        );

        tl.to(
          heroContentRef.current,
          {
            opacity: 0,
            scale: 0.92,
            ease: "power1.in",
            duration: 0.3,
          },
          0.65
        );
      },
      containerRef
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-[#FFF3E6] select-none"
    >
      {/* ============================================================== */}
      {/* 01. RESTORED ANIMATED WORD WALL (BACKGROUND LAYER, Z-0)         */}
      {/* ============================================================== */}
      <div
        ref={wordWallRef}
        className="absolute inset-0 overflow-hidden pointer-events-none select-none flex flex-col justify-around py-8 opacity-[0.06] sm:opacity-[0.075] z-0"
        aria-hidden="true"
      >
        {/* Row 1: Leftward Glide */}
        <div
          ref={wordRow1Ref}
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-[#381932] whitespace-nowrap will-change-transform leading-none"
        >
          FORM &bull; SHIFT &bull; KINETIC &bull; ARCHITECTURE &bull; FORM &bull; SHIFT &bull; KINETIC &bull; ARCHITECTURE
        </div>

        {/* Row 2: Rightward Glide */}
        <div
          ref={wordRow2Ref}
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-[#381932] whitespace-nowrap will-change-transform leading-none ml-[-20%]"
        >
          PRECISION &bull; STRUCTURE &bull; SPACE &bull; CRAFT &bull; PRECISION &bull; STRUCTURE &bull; SPACE &bull; CRAFT
        </div>

        {/* Row 3: Leftward Glide */}
        <div
          ref={wordRow3Ref}
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-[#381932] whitespace-nowrap will-change-transform leading-none"
        >
          TACTILE &bull; MOTION &bull; ENGINEERING &bull; INTERACTION &bull; TACTILE &bull; MOTION &bull; ENGINEERING
        </div>
      </div>

      {/* Subtle Hairline Grid Layer for Architectural Texture */}
      <div className="absolute inset-0 pointer-events-none bg-grid-milk opacity-25 z-0" />

      {/* ============================================================== */}
      {/* 02. BASE LAYER: REFINED EDITORIAL HERO COMPOSITION (Z-10)       */}
      {/* ============================================================== */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 pt-20 pb-16 z-10"
      >
        <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Expressive Typographic Name Treatment */}
          <div className="flex items-baseline flex-wrap gap-3 sm:gap-6">
            <h1 className="font-display text-[clamp(2.8rem,9.2vw,9.5rem)] leading-[0.86] font-extrabold tracking-tighter text-[#381932] uppercase">
              KHALED
            </h1>
            <div className="bg-[#381932] text-[#C6F277] px-4 sm:px-7 py-1.5 sm:py-3 mb-2 inline-flex items-center justify-center transform -rotate-1 shadow-sm">
              <span className="font-display text-[clamp(1.5rem,4.4vw,4.5rem)] leading-none font-black tracking-normal text-[#C6F277]">
                AMR
              </span>
            </div>
          </div>

          {/* 3. Infinite Looping Typewriter Phrases */}
          <div className="pt-1">
            <TypewriterHero className="max-w-2xl" />
          </div>

          {/* 4. Concise Professional Supporting Statement */}
          <p className="font-serif italic text-[clamp(1.25rem,2.4vw,2.1rem)] text-[#381932] leading-snug max-w-3xl text-balance">
            I build interactive digital experiences through code, design, and motion.
          </p>

          {/* 5. Clear, Focused Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-3 font-mono text-xs">
            <MagneticButton strength={0.3} maxOffset={8}>
              <a
                href="#work"
                className="px-7 py-4 bg-[#381932] text-[#FFF3E6] font-bold uppercase tracking-widest flex items-center gap-2.5 hover:bg-[#250d21] transition-colors shadow-sm cursor-pointer group"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#C6F277] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.25} maxOffset={6}>
              <a
                href="#contact"
                className="px-7 py-4 border border-[#381932] text-[#381932] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#381932] hover:text-[#FFF3E6] transition-colors cursor-pointer"
              >
                <span>CONTACT ME</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 03. SIGNATURE DEEP PLUM CURTAIN OVERLAY: SHUTTER WIPE (Z-20)    */}
      {/* ============================================================== */}
      <div
        ref={curtainOverlayRef}
        className="absolute inset-0 w-screen h-screen bg-[#381932] text-[#FFF3E6] z-20 overflow-hidden shadow-2xl flex items-center justify-end"
        style={{ clipPath: "inset(0% 0% 0% 100%)" }}
      >
        {/* Fixed-Position Inner Showcase Container: Locked to right 58vw */}
        <div className="w-full lg:w-[58vw] h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 pt-20 pb-20 space-y-6">
          {/* Header Tag */}
          <div className="flex items-center gap-3 border-b border-[#FFF3E6]/20 pb-3">
            <span className="w-2 h-2 bg-[#FFF3E6] inline-block" />
            <span className="font-serif italic text-2xl text-[#FFF3E6]">
              Selected Works
            </span>
            <span className="ml-auto font-mono text-xs tracking-widest text-[#FFF3E6]/70">
              CATALOGUE ENTRANCE // 2026
            </span>
          </div>

          <div className="space-y-6 max-w-xl">
            <div className="font-mono text-xs tracking-widest text-[#FFF3E6]/70 uppercase">
              // PRODUCTION ARCHITECTURES
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.88] tracking-tighter text-[#FFF3E6] uppercase">
              FORM
              <br />
              / SHIFT
              <br />
              <span className="text-[#FFF3E6]/60 font-mono text-2xl sm:text-3xl font-light">
                [ 15 PROJECTS ]
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#FFF3E6]/80 leading-relaxed">
              An audited repertoire of client production platforms, Arabic/English bilingual e-commerce storefronts, and interactive audio/visual prototypes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs">
              <a
                href="#work"
                className="px-6 py-3.5 bg-[#FFF3E6] text-[#381932] font-bold uppercase tracking-wider hover:bg-[#F5E6D6] transition-colors shadow-md flex items-center gap-2"
              >
                <span>VIEW FULL CATALOGUE</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>

              <span className="text-xs text-[#FFF3E6]/70 px-4 py-3 border border-[#FFF3E6]/25">
                SCROLL TO PROCEED &darr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
