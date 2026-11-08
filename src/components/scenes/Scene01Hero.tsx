"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import TypewriterHero from "@/components/motion/TypewriterHero";

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

  // Glitch Engine State & Refs
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Easter Egg 1 — Secret Identity state & refs
  const [amrText, setAmrText] = useState("AMR");
  const [isEgg1Active, setIsEgg1Active] = useState(false);
  const [egg1MessageVisible, setEgg1MessageVisible] = useState(false);
  const clickCountRef = useRef(0);
  const clickWindowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const egg1ResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const glyphCycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const khaledTitleRef = useRef<HTMLHeadingElement>(null);
  const amrBadgeRef = useRef<HTMLButtonElement>(null);

  // Easter Egg 3 — Interactive Word Wall state & refs
  const [isLimeRevealed, setIsLimeRevealed] = useState(false);
  const limeRevealTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Glitch Burst (Signal & Slice aberration)
  const triggerGlitchBurst = useCallback((durationMs = 280) => {
    const prefersReducedMotion =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-reduced-motion") === "true";
    if (prefersReducedMotion) return;

    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    setIsGlitching(true);
    glitchTimerRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, durationMs);
  }, []);

  // Ambient Architectural Glitch Pulse (occasional subtle 220ms pulse)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.45) {
        triggerGlitchBurst(220);
      }
    }, 7500);

    return () => {
      clearInterval(interval);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [triggerGlitchBurst]);

  // Easter Egg 1 Trigger Logic
  const triggerSecretIdentity = useCallback(() => {
    setIsEgg1Active(true);
    setEgg1MessageVisible(true);
    triggerGlitchBurst(550);

    const prefersReducedMotion =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-reduced-motion") === "true";

    // 1. Polished typographic transformation sequence
    const glyphs = ["// DEV", "010", "K.A.", "AMR"];
    let step = 0;
    if (glyphCycleIntervalRef.current) clearInterval(glyphCycleIntervalRef.current);
    glyphCycleIntervalRef.current = setInterval(() => {
      if (step < glyphs.length) {
        setAmrText(glyphs[step]);
        step++;
      } else {
        if (glyphCycleIntervalRef.current) clearInterval(glyphCycleIntervalRef.current);
      }
    }, 130);

    // 2. Animate subtle Electric Lime accent through Hero typography
    if (!prefersReducedMotion && khaledTitleRef.current) {
      gsap.fromTo(
        khaledTitleRef.current,
        { color: "inherit" },
        {
          color: "#D4FF33",
          textShadow: "0 0 25px rgba(212, 255, 51, 0.5)",
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          onComplete: () => {
            if (khaledTitleRef.current) {
              khaledTitleRef.current.style.color = "";
              khaledTitleRef.current.style.textShadow = "";
            }
          },
        }
      );
    }

    if (!prefersReducedMotion && amrBadgeRef.current) {
      gsap.fromTo(
        amrBadgeRef.current,
        { scale: 1, rotate: -1 },
        {
          scale: 1.08,
          rotate: 2,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
          onComplete: () => {
            if (amrBadgeRef.current) {
              amrBadgeRef.current.style.transform = "";
            }
          },
        }
      );
    }

    // 4. Return to original visual state after approximately two seconds
    if (egg1ResetTimerRef.current) clearTimeout(egg1ResetTimerRef.current);
    egg1ResetTimerRef.current = setTimeout(() => {
      if (glyphCycleIntervalRef.current) clearInterval(glyphCycleIntervalRef.current);
      setAmrText("AMR");
      setEgg1MessageVisible(false);
      setIsEgg1Active(false);
    }, 2200);
  }, [triggerGlitchBurst]);

  const handleAmrClick = useCallback(() => {
    if (isEgg1Active) return;

    clickCountRef.current += 1;
    triggerGlitchBurst(350);

    // Tactile micro-pulse on each intentional click
    if (amrBadgeRef.current) {
      gsap.fromTo(
        amrBadgeRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.12, ease: "power1.out" }
      );
    }

    // Reset counter window after 4.0s of inactivity
    if (clickWindowTimerRef.current) clearTimeout(clickWindowTimerRef.current);
    clickWindowTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 4000);

    // 5 intentional clicks trigger the secret identity
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (clickWindowTimerRef.current) clearTimeout(clickWindowTimerRef.current);
      triggerSecretIdentity();
    }
  }, [isEgg1Active, triggerSecretIdentity, triggerGlitchBurst]);

  // Easter Egg 3 — SHIFT Click Ripple Trigger
  const handleShiftTrigger = useCallback((targetEl: HTMLElement) => {
    setIsLimeRevealed(true);
    triggerGlitchBurst(300);
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
  }, [triggerGlitchBurst]);

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
      if (clickWindowTimerRef.current) clearTimeout(clickWindowTimerRef.current);
      if (egg1ResetTimerRef.current) clearTimeout(egg1ResetTimerRef.current);
      if (glyphCycleIntervalRef.current) clearInterval(glyphCycleIntervalRef.current);
      if (limeRevealTimerRef.current) clearTimeout(limeRevealTimerRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
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
        className="absolute inset-0 overflow-hidden pointer-events-auto select-none flex flex-col justify-around py-8 opacity-[0.06] sm:opacity-[0.075] z-0"
        aria-hidden="false"
        role="region"
        aria-label="Interactive Kinetic Word Wall"
      >
        {/* Row 1: Leftward Glide */}
        <div
          ref={wordRow1Ref}
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-current whitespace-nowrap will-change-transform leading-none"
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
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-current whitespace-nowrap will-change-transform leading-none ml-[-20%]"
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
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-current whitespace-nowrap will-change-transform leading-none"
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
          {/* Expressive Typographic Name Treatment with Architectural Slice & Chromatic Glitch */}
          <div className="flex items-baseline flex-wrap gap-3 sm:gap-6 pointer-events-auto">
            {/* KHALED with Architectural Slice Layers */}
            <div
              className="glitch-wrapper relative inline-block cursor-default select-none group"
              data-glitching={isGlitching ? "true" : "false"}
              onMouseEnter={() => triggerGlitchBurst(320)}
            >
              {/* Primary Base Layer */}
              <h1
                ref={khaledTitleRef}
                className="font-display text-[clamp(2.8rem,9.2vw,9.5rem)] leading-[0.86] font-extrabold tracking-tighter text-current uppercase transition-colors relative z-10"
              >
                KHALED
              </h1>

              {/* Chromatic Slice Layer 1 (Acid Chartreuse & International Orange) */}
              <span
                aria-hidden="true"
                className="glitch-slice glitch-slice-lime font-display text-[clamp(2.8rem,9.2vw,9.5rem)] leading-[0.86] font-extrabold tracking-tighter uppercase text-current z-20"
              >
                KHALED
              </span>

              {/* Chromatic Slice Layer 2 (Acid Chartreuse & Deep Plum / Milk) */}
              <span
                aria-hidden="true"
                className="glitch-slice glitch-slice-orange font-display text-[clamp(2.8rem,9.2vw,9.5rem)] leading-[0.86] font-extrabold tracking-tighter uppercase text-current z-20"
              >
                KHALED
              </span>
            </div>

            {/* AMR Tilted Badge with Chromatic Aberration Layers */}
            <div className="relative inline-flex items-center">
              <button
                ref={amrBadgeRef}
                type="button"
                onClick={handleAmrClick}
                onMouseEnter={() => triggerGlitchBurst(220)}
                aria-label="Amr identity — Click repeatedly to discover secret"
                className="relative overflow-hidden bg-[#381932] text-[#D4FF33] px-4 sm:px-7 py-1.5 sm:py-3 mb-2 inline-flex items-center justify-center transform -rotate-1 shadow-sm cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF33] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] transition-transform active:scale-95 group"
              >
                {/* Chromatic Channel B (International Orange offset) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.5rem,4.4vw,4.5rem)] leading-none font-black tracking-normal text-[#FF4D1C] opacity-0 group-hover:opacity-90 translate-x-[2px] -translate-y-[1px] transition-opacity pointer-events-none select-none z-0"
                >
                  {amrText}
                </span>

                {/* Chromatic Channel A (Acid Chartreuse offset) */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.5rem,4.4vw,4.5rem)] leading-none font-black tracking-normal text-[#D4FF33] opacity-0 group-hover:opacity-90 -translate-x-[2px] translate-y-[1px] transition-opacity pointer-events-none select-none z-0"
                >
                  {amrText}
                </span>

                {/* Primary Badge Content */}
                <span className="relative z-10 font-display text-[clamp(1.5rem,4.4vw,4.5rem)] leading-none font-black tracking-normal text-[#D4FF33]">
                  {amrText}
                </span>
              </button>

              {/* Secret Message Tooltip / Toast (Easter Egg 1 Step 3) */}
              {egg1MessageVisible && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute top-full left-0 mt-3 z-30 px-4 py-2 bg-[#381932] border-2 border-[#D4FF33] text-[#FFF3E6] text-xs sm:text-sm font-mono shadow-2xl flex items-center gap-2.5 whitespace-nowrap pointer-events-none animate-fadeIn"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D4FF33] animate-pulse" />
                  <span className="font-semibold">You found the part that wasn&apos;t supposed to be obvious.</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Infinite Looping Typewriter Phrases */}
          <div className="pt-1 pointer-events-auto">
            <TypewriterHero className="max-w-2xl" />
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
                className="px-7 py-4 bg-current text-[var(--bg-primary)] font-bold uppercase tracking-widest flex items-center gap-2.5 hover:opacity-90 transition-opacity shadow-sm cursor-pointer group"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#D4FF33] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.25} maxOffset={6}>
              <a
                href="#contact"
                className="px-7 py-4 border border-current text-current font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-current hover:text-[var(--bg-primary)] transition-colors cursor-pointer"
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
