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
  "PRECISION", "•", "STRUCTURE", "•", "SPACE", "•", "CRAFT", "•", "PRECISION", "•", "STRUCTURE", "•", "SPACE", "•", "CRAFT"
];
const ROW3_WORDS = [
  "TACTILE", "•", "MOTION", "•", "ENGINEERING", "•", "INTERACTION", "•", "TACTILE", "•", "MOTION", "•", "ENGINEERING"
];

export default function Scene01Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const curtainOverlayRef = useRef<HTMLDivElement>(null);
  const wordWallRef = useRef<HTMLDivElement>(null);
  const wordRow1Ref = useRef<HTMLDivElement>(null);
  const wordRow2Ref = useRef<HTMLDivElement>(null);
  const wordRow3Ref = useRef<HTMLDivElement>(null);

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

  // Easter Egg 1 Trigger Logic
  const triggerSecretIdentity = useCallback(() => {
    setIsEgg1Active(true);
    setEgg1MessageVisible(true);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        { color: "#381932" },
        {
          color: "#C6F277",
          textShadow: "0 0 25px rgba(198, 242, 119, 0.45)",
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
  }, []);

  const handleAmrClick = useCallback(() => {
    if (isEgg1Active) return;

    clickCountRef.current += 1;

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
  }, [isEgg1Active, triggerSecretIdentity]);

  // Easter Egg 3 — SHIFT Click Ripple Trigger
  const handleShiftTrigger = useCallback((targetEl: HTMLElement) => {
    setIsLimeRevealed(true);
    if (limeRevealTimerRef.current) clearTimeout(limeRevealTimerRef.current);
    limeRevealTimerRef.current = setTimeout(() => {
      setIsLimeRevealed(false);
    }, 2400);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        color: el === targetEl ? "#C6F277" : undefined,
        opacity: 0.65,
        duration: 0.26,
        ease: "power2.out",
        delay,
      })
      .to(el, {
        y: 0,
        scale: 1,
        skewX: 0,
        color: "#381932",
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

  // Easter Egg 3 — Pointer proximity distortion for fine pointers (Mouse)
  const handleWordWallPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const words = wordWallRef.current?.querySelectorAll<HTMLElement>(".interactive-word");
    if (!words) return;

    words.forEach((el) => {
      if (el.dataset.inRipple === "true") return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      const dist = Math.hypot(distX, distY);

      if (dist < 170) {
        const factor = 1 - dist / 170;
        const offsetX = -(distX / dist) * factor * 7;
        const offsetY = -(distY / dist) * factor * 5;
        const skew = -(distX / dist) * factor * 6;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) skewX(${skew}deg) scale(${1 + factor * 0.03})`;
        el.style.opacity = `${0.07 + factor * 0.16}`;
      } else {
        el.style.transform = "";
        el.style.opacity = "";
      }
    });
  }, []);

  const handleWordWallPointerLeave = useCallback(() => {
    const words = wordWallRef.current?.querySelectorAll<HTMLElement>(".interactive-word");
    if (!words) return;
    words.forEach((el) => {
      if (el.dataset.inRipple !== "true") {
        el.style.transform = "";
        el.style.opacity = "";
      }
    });
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (clickWindowTimerRef.current) clearTimeout(clickWindowTimerRef.current);
      if (egg1ResetTimerRef.current) clearTimeout(egg1ResetTimerRef.current);
      if (glyphCycleIntervalRef.current) clearInterval(glyphCycleIntervalRef.current);
      if (limeRevealTimerRef.current) clearTimeout(limeRevealTimerRef.current);
    };
  }, []);

  useEffect(() => {
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
        onPointerMove={handleWordWallPointerMove}
        onPointerLeave={handleWordWallPointerLeave}
        className="absolute inset-0 overflow-hidden pointer-events-auto select-none flex flex-col justify-around py-8 opacity-[0.06] sm:opacity-[0.075] z-0"
        aria-hidden="false"
        role="region"
        aria-label="Interactive Kinetic Word Wall"
      >
        {/* Row 1: Leftward Glide */}
        <div
          ref={wordRow1Ref}
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-[#381932] whitespace-nowrap will-change-transform leading-none"
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
                    className="interactive-word inline-block cursor-pointer transition-colors duration-200 hover:text-[#381932] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F277]"
                  >
                    SHIFT
                  </span>
                  {idx === 2 && (
                    <span
                      aria-hidden={!isLimeRevealed}
                      className={`inline-block px-3 py-1 mx-3 font-mono text-[0.34em] tracking-wider font-bold transition-all duration-300 rounded-xs select-none ${
                        isLimeRevealed
                          ? "bg-[#C6F277] text-[#381932] opacity-100 scale-100 shadow-[0_0_18px_rgba(198,242,119,0.8)]"
                          : "opacity-0 scale-75 pointer-events-none w-0 p-0 m-0 overflow-hidden"
                      }`}
                    >
                      [DISCOVERED // 01]
                    </span>
                  )}
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

        {/* Row 2: Rightward Glide */}
        <div
          ref={wordRow2Ref}
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-[#381932] whitespace-nowrap will-change-transform leading-none ml-[-20%]"
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
          className="font-display text-[clamp(4.5rem,10.5vw,11.5rem)] font-black uppercase tracking-tight text-[#381932] whitespace-nowrap will-change-transform leading-none"
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
      {/* 02. BASE LAYER: REFINED EDITORIAL HERO COMPOSITION (Z-10)       */}
      {/* ============================================================== */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 pt-20 pb-16 z-10 pointer-events-none"
      >
        <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 pointer-events-none">
          {/* Expressive Typographic Name Treatment */}
          <div className="flex items-baseline flex-wrap gap-3 sm:gap-6 pointer-events-auto">
            <h1
              ref={khaledTitleRef}
              className="font-display text-[clamp(2.8rem,9.2vw,9.5rem)] leading-[0.86] font-extrabold tracking-tighter text-[#381932] uppercase transition-colors"
            >
              KHALED
            </h1>
            <div className="relative inline-flex items-center">
              <button
                ref={amrBadgeRef}
                type="button"
                onClick={handleAmrClick}
                aria-label="Amr identity — Click repeatedly to discover secret"
                className="bg-[#381932] text-[#C6F277] px-4 sm:px-7 py-1.5 sm:py-3 mb-2 inline-flex items-center justify-center transform -rotate-1 shadow-sm cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#C6F277] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF3E6] transition-transform active:scale-95 group"
              >
                <span className="font-display text-[clamp(1.5rem,4.4vw,4.5rem)] leading-none font-black tracking-normal text-[#C6F277]">
                  {amrText}
                </span>
              </button>

              {/* Secret Message Tooltip / Toast (Easter Egg 1 Step 3) */}
              {egg1MessageVisible && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute top-full left-0 mt-3 z-30 px-4 py-2 bg-[#381932] border-2 border-[#C6F277] text-[#FFF3E6] text-xs sm:text-sm font-mono shadow-2xl flex items-center gap-2.5 whitespace-nowrap pointer-events-none animate-fadeIn"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C6F277] animate-pulse" />
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
          <p className="font-serif italic text-[clamp(1.25rem,2.4vw,2.1rem)] text-[#381932] leading-snug max-w-3xl text-balance pointer-events-auto">
            I build interactive digital experiences through code, design, and motion.
          </p>

          {/* 5. Clear, Focused Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-3 font-mono text-xs pointer-events-auto">
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
