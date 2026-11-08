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

  // Easter Egg 3 — Interactive Word Wall state & refs
  const [isLimeRevealed, setIsLimeRevealed] = useState(false);
  const limeRevealTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Easter Egg 3 — SHIFT Click Ripple Trigger
  const handleShiftTrigger = useCallback((targetEl: HTMLElement) => {
    setIsLimeRevealed(true);
    if (limeRevealTimerRef.current) clearTimeout(limeRevealTimerRef.current);
    limeRevealTimerRef.current = setTimeout(() => {
      setIsLimeRevealed(false);
    }, 2400);

    const prefersReducedMotion =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-reduced-motion") === "true";

    if (prefersReducedMotion) return;

    const targetRect = targetEl.getBoundingClientRect();
    const originX = targetRect.left + targetRect.width / 2;
    const originY = targetRect.top + targetRect.height / 2;

    const words = wordWallRef.current?.querySelectorAll<HTMLElement>(".interactive-word");
    if (!words || words.length === 0) return;

    words.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(centerX - originX, centerY - originY);
      const delay = Math.min(dist / 1200, 0.42);

      el.dataset.inRipple = "true";

      gsap.killTweensOf(el);
      gsap.timeline({
        onComplete: () => {
          el.dataset.inRipple = "false";
          el.style.transform = "";
          el.style.color = "";
          el.style.opacity = "";
        },
      })
      .to(el, {
        y: -14,
        scale: 1.1,
        skewX: -8,
        color: el === targetEl ? "#D4FF33" : undefined,
        opacity: 0.65,
        duration: 0.26,
        ease: "power2.out",
        delay,
      })
      .to(el, {
        y: 0,
        scale: 1,
        skewX: 0,
        color: "inherit",
        opacity: 0.08,
        duration: 0.42,
        ease: "power2.inOut",
      });
    });
  }, []);

  const handleShiftClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    handleShiftTrigger(e.currentTarget);
  }, [handleShiftTrigger]);

  const handleShiftKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleShiftTrigger(e.currentTarget);
    }
  }, [handleShiftTrigger]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (limeRevealTimerRef.current) clearTimeout(limeRevealTimerRef.current);
    };
  }, []);

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
        className="absolute inset-0 overflow-hidden pointer-events-auto select-none flex flex-col justify-around py-8 z-0"
        aria-hidden="false"
        role="region"
        aria-label="Interactive Kinetic Word Wall"
      >
        {/* Row 1: Leftward Glide */}
        <div
          ref={wordRow1Ref}
          className="hero-watermark-row font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight whitespace-nowrap will-change-transform leading-none"
        >
          {ROW1_WORDS.map((word, idx) => {
            if (word === "•") {
              return (
                <span key={idx} className="inline-block opacity-40 px-3 select-none">
                  &bull;
                </span>
              );
            }
            if (word === "SHIFT") {
              return (
                <span key={idx} className="inline-flex items-center">
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Shift — Trigger kinetic wave"
                    onClick={handleShiftClick}
                    onKeyDown={handleShiftKeyDown}
                    className="interactive-word inline-block cursor-pointer transition-colors duration-200 hover:text-[#D4FF33] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF33]"
                  >
                    SHIFT
                  </span>
                  {idx === 2 && (
                    <span
                      aria-hidden={!isLimeRevealed}
                      className={`inline-block px-3 py-1 mx-3 font-mono text-[0.34em] tracking-wider font-bold transition-all duration-300 rounded-xs select-none ${
                        isLimeRevealed
                          ? "bg-[#D4FF33] text-[#381932] opacity-100 scale-100 shadow-[0_0_18px_rgba(212,255,51,0.8)]"
                          : "opacity-0 scale-75 pointer-events-none w-0 p-0 m-0 overflow-hidden"
                      }`}
                    >
                      {"[DISCOVERED // 01]"}
                    </span>
                  )}
                </span>
              );
            }
            return (
              <span
                key={idx}
                className="interactive-word inline-block transition-transform duration-200 hover:text-[#FF4D1C]"
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Row 2: Rightward Glide */}
        <div
          ref={wordRow2Ref}
          className="hero-watermark-row font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight whitespace-nowrap will-change-transform leading-none ml-[-20%]"
        >
          {ROW2_WORDS.map((word, idx) => {
            if (word === "•") {
              return (
                <span key={idx} className="inline-block opacity-40 px-3 select-none">
                  &bull;
                </span>
              );
            }
            return (
              <span
                key={idx}
                className="interactive-word inline-block transition-transform duration-200"
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Row 3: Leftward Glide */}
        <div
          ref={wordRow3Ref}
          className="hero-watermark-row font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight whitespace-nowrap will-change-transform leading-none"
        >
          {ROW3_WORDS.map((word, idx) => {
            if (word === "•") {
              return (
                <span key={idx} className="inline-block opacity-40 px-3 select-none">
                  &bull;
                </span>
              );
            }
            return (
              <span
                key={idx}
                className="interactive-word inline-block transition-transform duration-200"
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Subtle Hairline Grid Layer for Architectural Texture */}
      <div className="absolute inset-0 pointer-events-none bg-grid-milk opacity-25 z-0" />

      {/* ============================================================== */}
      {/* 02. BASE LAYER: EDITORIAL HERO COMPOSITION WITH GLITCH ENGINE   */}
      {/* ============================================================== */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 pt-12 sm:pt-14 pb-8 z-10 pointer-events-none"
      >
        <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 pointer-events-none">
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
