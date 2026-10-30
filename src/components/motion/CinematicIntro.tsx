"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export default function CinematicIntro({
  onComplete,
  forcePlay = false,
}: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Scene references
  const voidGridRef = useRef<HTMLDivElement>(null);
  const wordFormRef = useRef<HTMLDivElement>(null);
  const wordShiftRef = useRef<HTMLDivElement>(null);
  const plumSceneRef = useRef<HTMLDivElement>(null);
  const identityNameRef = useRef<HTMLDivElement>(null);
  const identityBadgeRef = useRef<HTMLDivElement>(null);
  const identitySubtitleRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const [isFinished, setIsFinished] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);

  // Clean, idempotent dismissal and cleanup
  const handleFinish = useCallback(() => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
      masterTimelineRef.current = null;
    }

    const finalize = () => {
      setIsFinished(true);
      document.body.style.overflow = "";
      if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
      if (onComplete) onComplete();
    };

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: finalize,
      });
    } else {
      finalize();
    }
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (isBypassing || isFinished) return;
    setIsBypassing(true);
    handleFinish();
  }, [isBypassing, isFinished, handleFinish]);

  // Keyboard, wheel, and touch bypass listeners
  useEffect(() => {
    if (isFinished) return;

    // Lock body scroll strictly during active intro playback
    document.body.style.overflow = "hidden";

    const startTime = Date.now();
    let accumulatedWheel = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        e.key === " " ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        handleSkip();
      }
    };

    let startTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Ignore initial touch momentum during first 600ms
      if (Date.now() - startTime < 600) return;
      const deltaY = Math.abs(e.touches[0].clientY - startTouchY);
      if (deltaY > 80) {
        handleSkip();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Ignore wheel events during initial 600ms to prevent accidental dismissals on page reload
      if (Date.now() - startTime < 600) return;
      accumulatedWheel += Math.abs(e.deltaY);
      // Require deliberate cumulative scroll (> 180) rather than a single accidental 20px notch
      if (accumulatedWheel > 180) {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = "";
      if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    };
  }, [isFinished, handleSkip]);

  // Master Cinematic Timeline Choreography
  useEffect(() => {
    if (isFinished || !containerRef.current) return;

    // Reduced motion check safely executed on client
    try {
      const mode = localStorage.getItem("portfolio-motion-mode");
      if (mode === "reduced" && !forcePlay) {
        queueMicrotask(() => {
          handleFinish();
        });
        return;
      }
    } catch {
      // media query unavailable
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          handleFinish();
        },
      });

      masterTimelineRef.current = tl;

      // Initial visual states: Scene 1 must feel intentionally empty
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(".grid-line-h", { scaleX: 0, transformOrigin: "center center" });
      gsap.set(".grid-line-v", { scaleY: 0, transformOrigin: "center center" });
      gsap.set(".grid-cross", { opacity: 0, scale: 0.4 });
      gsap.set(".grid-coord", { opacity: 0, y: 6 });

      // Words initial states: completely hidden so Scene 1 is pure Void
      gsap.set(wordFormRef.current, { autoAlpha: 0 });
      gsap.set(".letter-form", { opacity: 0, y: 40, scale: 0.94 });
      gsap.set(wordShiftRef.current, { autoAlpha: 0 });
      gsap.set(".letter-shift", { opacity: 0, y: 40, scale: 0.94 });

      // Plum scene initial state: architectural horizontal slit shutter along central axis
      gsap.set(plumSceneRef.current, {
        clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
      });
      gsap.set(".grid-bracket", { opacity: 0, scale: 0.8 });
      gsap.set(identityNameRef.current, { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(identityBadgeRef.current, { opacity: 0, scale: 0.75, rotate: -4 });
      gsap.set(identitySubtitleRef.current, { opacity: 0, y: 16 });
      gsap.set(skipButtonRef.current, { opacity: 0, y: -10 });

      // Fade in the subtle Skip button immediately
      tl.to(
        skipButtonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.1
      );

      // ==============================================================
      // SCENE 1: THE VOID (0.0s – 1.0s)
      // Architectural hairline grid draws outward from central origin
      // ==============================================================
      tl.to(
        ".grid-primary-h",
        {
          scaleX: 1,
          duration: 0.75,
          ease: "power3.inOut",
        },
        0.1
      );

      tl.to(
        ".grid-primary-v",
        {
          scaleY: 1,
          duration: 0.75,
          ease: "power3.inOut",
        },
        0.18
      );

      tl.to(
        ".grid-secondary-h",
        {
          scaleX: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0.3
      );

      tl.to(
        ".grid-secondary-v",
        {
          scaleY: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0.35
      );

      tl.to(
        ".grid-cross",
        {
          opacity: 0.7,
          scale: 1,
          duration: 0.45,
          stagger: 0.04,
          ease: "back.out(2)",
        },
        0.45
      );

      tl.to(
        ".grid-coord",
        {
          opacity: 0.55,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.55
      );

      // Camera dolly forward through grid
      tl.to(
        voidGridRef.current,
        {
          scale: 1.03,
          duration: 2.5,
          ease: "sine.inOut",
        },
        0.2
      );

      // ==============================================================
      // SCENE 2: THE AWAKENING (1.0s – 2.8s)
      // Grid organizes into "FORM", holds, then recomposes into "SHIFT"
      // ==============================================================
      tl.set(wordFormRef.current, { autoAlpha: 1 }, 1.0);

      tl.to(
        ".letter-form",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
        },
        1.0
      );

      // Pulse accent horizontal hairline under FORM
      tl.to(
        ".accent-pulse-line",
        {
          opacity: 0.8,
          scaleX: 1.15,
          duration: 0.35,
          ease: "power2.out",
        },
        1.15
      );

      // Clamp architectural framing brackets around FORM
      tl.to(
        ".grid-bracket",
        {
          opacity: 0.7,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        1.1
      );

      // Hold FORM clearly readable (~0.45s)
      tl.to({}, { duration: 0.45 }, 1.55);

      // Architectural transformation: FORM letters disassemble
      tl.to(
        ".letter-form",
        {
          y: -44,
          opacity: 0,
          duration: 0.32,
          stagger: 0.03,
          ease: "power2.in",
        },
        2.0
      );

      tl.set(wordFormRef.current, { autoAlpha: 0 }, 2.3);

      // Grid tracks shift horizontally and vertically
      tl.to(
        ".grid-shift-track",
        {
          x: 28,
          duration: 0.45,
          ease: "power3.inOut",
        },
        2.05
      );

      tl.to(
        ".grid-bracket-r",
        {
          x: 24,
          duration: 0.45,
          ease: "power3.inOut",
        },
        2.05
      );

      // SHIFT resolves into view along geometric tracks
      tl.set(wordShiftRef.current, { autoAlpha: 1 }, 2.05);

      tl.to(
        ".letter-shift",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
        },
        2.15
      );

      // Electric Lime flash on coordinate stamps during SHIFT resolution
      tl.to(
        ".lime-accent-mark",
        {
          color: "#C6F277",
          opacity: 1,
          scale: 1.15,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        2.25
      );

      // Hold SHIFT briefly to communicate transformation
      tl.to({}, { duration: 0.4 }, 2.65);

      // ==============================================================
      // SCENE 3: THE RECONSTRUCTION (2.8s – 4.5s)
      // Canvas transitions from Milk to deep Plum; identity reveal KHALED AMR
      // ==============================================================
      tl.to(
        plumSceneRef.current,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.75,
          ease: "power3.inOut",
        },
        2.85
      );

      // Reveal KHALED in Milk
      tl.to(
        identityNameRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
        },
        3.25
      );

      // Reveal AMR in Electric Lime with crisp tactile rotation
      tl.to(
        identityBadgeRef.current,
        {
          opacity: 1,
          scale: 1,
          rotate: -1,
          duration: 0.45,
          ease: "back.out(2)",
        },
        3.4
      );

      // Reveal Subtitle editorial line
      tl.to(
        identitySubtitleRef.current,
        {
          opacity: 0.85,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        3.6
      );

      // Confident hold on KHALED AMR reveal
      tl.to({}, { duration: 0.75 }, 3.8);

      // ==============================================================
      // SCENE 4: THE REVEAL INTO EXISTING HERO (4.5s – 5.2s)
      // Smoothly dissolve intro overlay to unveil the active hero
      // ==============================================================
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          scale: 1.025,
          duration: 0.65,
          ease: "power2.inOut",
        },
        4.55
      );
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [isFinished, handleFinish, forcePlay]);

  if (isFinished) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      id="cinematic-intro"
      aria-label="Cinematic Portfolio Intro — The Digital Awakening"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-[#FFF3E6] text-[#381932] select-none pointer-events-auto"
    >
      {/* ------------------------------------------------------------- */}
      {/* 00. DISCREET SKIP INTRO CONTROL (TOP-RIGHT)                   */}
      {/* ------------------------------------------------------------- */}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={handleSkip}
        aria-label="Skip introductory cinematic sequence"
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-[10000] group flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 border border-[#381932]/30 hover:border-[#381932] bg-[#FFF3E6]/95 backdrop-blur-xs font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#381932] transition-all duration-200 cursor-pointer shadow-sm hover:bg-[#381932] hover:text-[#C6F277] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#381932]"
      >
        <span className="font-semibold">SKIP INTRO</span>
        <span className="text-[9px] px-1.5 py-0.5 bg-[#381932]/10 group-hover:bg-[#C6F277]/20 group-hover:text-[#C6F277] font-bold rounded-xs tracking-normal">
          ESC
        </span>
      </button>

      {/* ------------------------------------------------------------- */}
      {/* 01 & 02. SCENE 1 & 2 CANVAS: MILK BASE + GRID + FORM/SHIFT    */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={voidGridRef}
        className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 will-change-transform bg-[#FFF3E6]"
      >
        {/* Architectural Hairline Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Primary Central Cross-Axes */}
          <div className="grid-line-h grid-primary-h absolute top-1/2 left-0 w-full h-[1.5px] bg-[#381932]/35 -translate-y-1/2" />
          <div className="grid-line-v grid-primary-v absolute left-1/2 top-0 h-full w-[1.5px] bg-[#381932]/35 -translate-x-1/2" />

          {/* Secondary Structural Horizontal Divisions */}
          <div className="grid-line-h grid-secondary-h absolute top-[25%] left-0 w-full h-[1px] bg-[#381932]/12" />
          <div className="grid-line-h grid-secondary-h absolute top-[75%] left-0 w-full h-[1px] bg-[#381932]/12" />
          <div className="grid-line-h grid-secondary-h grid-shift-track absolute top-[38%] left-0 w-full h-[1px] bg-[#381932]/15" />
          <div className="grid-line-h grid-secondary-h grid-shift-track absolute top-[62%] left-0 w-full h-[1px] bg-[#381932]/15" />

          {/* Secondary Structural Vertical Divisions */}
          <div className="grid-line-v grid-secondary-v absolute left-[20%] top-0 h-full w-[1px] bg-[#381932]/12" />
          <div className="grid-line-v grid-secondary-v absolute left-[80%] top-0 h-full w-[1px] bg-[#381932]/12" />
          <div className="grid-line-v grid-secondary-v grid-shift-track absolute left-[35%] top-0 h-full w-[1px] bg-[#381932]/15" />
          <div className="grid-line-v grid-secondary-v grid-shift-track absolute left-[65%] top-0 h-full w-[1px] bg-[#381932]/15" />

          {/* Precision Intersection Crosshairs (+) */}
          <div className="grid-cross absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-sm text-[#381932] select-none">
            +
          </div>
          <div className="grid-cross absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-[#381932] select-none">
            +
          </div>
          <div className="grid-cross absolute top-[25%] left-[80%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-[#381932] select-none">
            +
          </div>
          <div className="grid-cross absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-[#381932] select-none">
            +
          </div>
          <div className="grid-cross absolute top-[75%] left-[80%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-[#381932] select-none">
            +
          </div>

          {/* Editorial Architectural Metadata & Coordinates */}
          <div className="grid-coord lime-accent-mark absolute top-6 left-6 sm:top-8 sm:left-8 font-mono text-[10px] sm:text-[11px] tracking-widest text-[#381932]/50 uppercase">
            {"// ORIGIN: 31.2001° N · 29.9187° E"}
          </div>
          <div className="grid-coord absolute bottom-6 left-6 sm:bottom-8 sm:left-8 font-mono text-[10px] sm:text-[11px] tracking-widest text-[#381932]/50 uppercase">
            {"SYS: KINETIC ARCHITECTURE // 2026"}
          </div>
          <div className="grid-coord lime-accent-mark absolute bottom-6 right-6 sm:bottom-8 sm:right-8 font-mono text-[10px] sm:text-[11px] tracking-widest text-[#381932]/50 uppercase text-right">
            {"CANVAS: MILK // #FFF3E6"}
          </div>
        </div>

        {/* Dynamic Center Typography: FORM transforming into SHIFT */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Accent Pulse Hairline */}
          <div className="accent-pulse-line w-24 sm:w-40 h-[2px] bg-[#381932] mb-4 opacity-0 origin-center" />

          {/* Precision Architectural Guide Brackets */}
          <div className="grid-bracket grid-bracket-l absolute -left-3 sm:-left-8 top-1/2 -translate-y-1/2 w-2 h-10 sm:h-16 border-l-2 border-t-2 border-b-2 border-[#381932]/40 opacity-0 pointer-events-none" />
          <div className="grid-bracket grid-bracket-r absolute -right-3 sm:-right-8 top-1/2 -translate-y-1/2 w-2 h-10 sm:h-16 border-r-2 border-t-2 border-b-2 border-[#381932]/40 opacity-0 pointer-events-none" />

          {/* Word 01: FORM */}
          <div
            ref={wordFormRef}
            aria-label="FORM"
            className="flex items-center justify-center font-display text-[clamp(4.5rem,14.5vw,12rem)] font-extrabold uppercase tracking-tighter text-[#381932] leading-none"
          >
            <span className="letter-form inline-block px-1 sm:px-2">F</span>
            <span className="letter-form inline-block px-1 sm:px-2">O</span>
            <span className="letter-form inline-block px-1 sm:px-2">R</span>
            <span className="letter-form inline-block px-1 sm:px-2">M</span>
          </div>

          {/* Word 02: SHIFT (Positioned in exact visual center) */}
          <div
            ref={wordShiftRef}
            aria-label="SHIFT"
            className="absolute inset-0 flex items-center justify-center font-display text-[clamp(4.5rem,14.5vw,12rem)] font-extrabold uppercase tracking-tighter text-[#381932] leading-none pointer-events-none"
          >
            <span className="letter-shift inline-block px-1 sm:px-2">S</span>
            <span className="letter-shift inline-block px-1 sm:px-2">H</span>
            <span className="letter-shift inline-block px-1 sm:px-2">I</span>
            <span className="letter-shift inline-block px-1 sm:px-2">F</span>
            <span className="letter-shift inline-block px-1 sm:px-2">T</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 03. SCENE 3 CANVAS: RECONSTRUCTION & PLUM IDENTITY REVEAL     */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={plumSceneRef}
        className="absolute inset-0 w-full h-full bg-[#381932] text-[#FFF3E6] flex flex-col items-center justify-center p-6 z-20 overflow-hidden will-change-transform shadow-2xl"
      >
        {/* Fine Milk Architectural Grid on Plum Canvas */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-grid-plum" />

        {/* Central Identity Group */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Framed Identity: KHALED in Milk + AMR in Electric Lime */}
          <div className="flex items-baseline flex-wrap justify-center gap-3 sm:gap-6">
            <h1
              ref={identityNameRef}
              className="font-display text-[clamp(3.2rem,11.5vw,10.5rem)] font-extrabold leading-[0.88] tracking-tighter text-[#FFF3E6] uppercase"
            >
              KHALED
            </h1>

            <div
              ref={identityBadgeRef}
              className="bg-[#240f20] border-2 border-[#C6F277] text-[#C6F277] px-4 sm:px-8 py-2 sm:py-3.5 mb-1 sm:mb-2 inline-flex items-center justify-center shadow-[0_0_35px_rgba(198,242,119,0.35)]"
            >
              <span className="font-display text-[clamp(1.8rem,5.5vw,5.5rem)] font-black tracking-normal leading-none text-[#C6F277]">
                AMR
              </span>
            </div>
          </div>

          {/* Refined Editorial Subtitle */}
          <div
            ref={identitySubtitleRef}
            className="flex items-center gap-3 font-mono text-xs sm:text-sm tracking-[0.25em] text-[#FFF3E6]/80 uppercase"
          >
            <span className="w-2 h-2 bg-[#C6F277] inline-block shrink-0" />
            <span>{"FRONTEND ARCHITECTURE // CREATIVE MOTION"}</span>
          </div>
        </div>

        {/* Architectural Framing Brackets */}
        <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-[#FFF3E6]/30 pointer-events-none hidden sm:block" />
        <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-[#FFF3E6]/30 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-[#FFF3E6]/30 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-[#FFF3E6]/30 pointer-events-none hidden sm:block" />
      </div>
    </div>
  );
}
