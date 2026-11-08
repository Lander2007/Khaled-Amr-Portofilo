"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const GLITCH_CHARS = "Ξ/#01X_";

const SLICE_BANDS = [
  "inset(10% 0 72% 0)",
  "inset(42% 0 38% 0)",
  "inset(75% 0 8% 0)",
];

export function HeroGlitchLockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slicesWrapperRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const limeGhostRef = useRef<HTMLDivElement>(null);
  const orangeGhostRef = useRef<HTMLDivElement>(null);
  const amrBadgeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [amrText, setAmrText] = useState("AMR");
  const [exploringText, setExploringText] = useState("// Exploring");
  const [eggMessageVisible, setEggMessageVisible] = useState(false);

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eggResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subtle & quick character decode
  const scrambleString = useCallback(
    (original: string, setter: React.Dispatch<React.SetStateAction<string>>, durationMs = 260) => {
      let frame = 0;
      const totalFrames = Math.max(1, Math.floor(durationMs / 40));
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const nextStr = original
          .split("")
          .map((char, idx) => {
            if (char === " " || char === "/") return char;
            if (idx / original.length <= progress) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");
        setter(nextStr);
        if (frame >= totalFrames) {
          clearInterval(interval);
          setter(original);
        }
      }, 40);
      return () => clearInterval(interval);
    },
    []
  );

  // Subtle 110ms Editorial Micro-Twitch
  const triggerGlitchBurst = useCallback((intensity = 1) => {
    if (!slicesWrapperRef.current) return;

    const prefersReducedMotion =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-reduced-motion") === "true";
    if (prefersReducedMotion) return;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline({ overwrite: true });
    tlRef.current = tl;

    tl.set(slicesWrapperRef.current, { opacity: 0.85 })
      .set([limeGhostRef.current, orangeGhostRef.current], { opacity: 0.55 });

    // Only 3 ultra-short, subtle micro-frames
    for (let step = 0; step < 3; step++) {
      tl.add(() => {
        sliceRefs.current.forEach((slice, i) => {
          if (!slice) return;
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.set(slice, {
            x: gsap.utils.random(-9, 9) * intensity * dir,
            y: 0,
            skewX: gsap.utils.random(-2.5, 2.5) * intensity,
          });
        });

        if (limeGhostRef.current) {
          gsap.set(limeGhostRef.current, {
            x: gsap.utils.random(-6, -3) * intensity,
            clipPath: `inset(${gsap.utils.random(15, 65)}% 0 ${gsap.utils.random(15, 35)}% 0)`,
          });
        }

        if (orangeGhostRef.current) {
          gsap.set(orangeGhostRef.current, {
            x: gsap.utils.random(3, 6) * intensity,
            clipPath: `inset(${gsap.utils.random(25, 60)}% 0 ${gsap.utils.random(15, 35)}% 0)`,
          });
        }

        if (amrBadgeRef.current) {
          gsap.set(amrBadgeRef.current, {
            x: gsap.utils.random(-2, 2) * intensity,
          });
        }
      }, "+=0.035");
    }

    // Cleanly reset
    tl.add(() => {
      if (slicesWrapperRef.current) gsap.set(slicesWrapperRef.current, { opacity: 0 });
      gsap.set([limeGhostRef.current, orangeGhostRef.current], { opacity: 0 });
      sliceRefs.current.forEach((slice) => {
        if (slice) gsap.set(slice, { x: 0, y: 0, skewX: 0 });
      });
      if (amrBadgeRef.current) {
        gsap.to(amrBadgeRef.current, {
          x: 0,
          rotation: -2,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    }, "+=0.035");
  }, []);

  // Calm periodic pulse every 7.5 seconds
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      triggerGlitchBurst(0.8);
    }, 1500);

    const interval = setInterval(() => {
      triggerGlitchBurst(0.75);
    }, 7500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (tlRef.current) tlRef.current.kill();
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (eggResetTimerRef.current) clearTimeout(eggResetTimerRef.current);
    };
  }, [triggerGlitchBurst]);

  const handleHoverEnter = () => {
    triggerGlitchBurst(1.0);
    scrambleString("AMR", setAmrText, 240);
    scrambleString("// Exploring", setExploringText, 300);
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickCountRef.current += 1;
    triggerGlitchBurst(1.0);
    scrambleString("AMR", setAmrText, 240);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3500);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      setEggMessageVisible(true);
      triggerGlitchBurst(1.2);

      if (eggResetTimerRef.current) clearTimeout(eggResetTimerRef.current);
      eggResetTimerRef.current = setTimeout(() => {
        setEggMessageVisible(false);
      }, 3000);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleHoverEnter}
      className="relative select-none"
    >
      {/* MAIN KHALED LOCKUP */}
      <div className="relative inline-block">
        {/* 1. Always-Solid Base Layer */}
        <h1 className="font-display text-[clamp(4.2rem,13.5vw,14rem)] font-black leading-[0.84] tracking-tighter uppercase text-[var(--ink-primary)]">
          KHALED
        </h1>

        {/* 2. Subtle Acid Chartreuse Split Ghost */}
        <div
          ref={limeGhostRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-display text-[clamp(4.2rem,13.5vw,14rem)] font-black leading-[0.84] tracking-tighter uppercase text-[#D4FF33] mix-blend-difference opacity-0 z-10"
        >
          KHALED
        </div>

        {/* 3. Subtle International Orange Split Ghost */}
        <div
          ref={orangeGhostRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-display text-[clamp(4.2rem,13.5vw,14rem)] font-black leading-[0.84] tracking-tighter uppercase text-[#FF4D1C] opacity-0 z-10"
        >
          KHALED
        </div>

        {/* 4. 3 Gentle Horizontal Micro-Slices */}
        <div
          ref={slicesWrapperRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 z-20"
        >
          {SLICE_BANDS.map((clip, idx) => (
            <div
              key={idx}
              ref={(el) => {
                sliceRefs.current[idx] = el;
              }}
              style={{ clipPath: clip }}
              className="absolute inset-0 font-display text-[clamp(4.2rem,13.5vw,14rem)] font-black leading-[0.84] tracking-tighter uppercase text-[var(--ink-primary)] bg-[var(--bg-canvas)]"
            >
              KHALED
            </div>
          ))}
        </div>
      </div>

      {/* TILTED AMR BADGE */}
      <div className="mt-2 md:mt-4 relative inline-block">
        <div
          ref={amrBadgeRef}
          onClick={handleBadgeClick}
          style={{ transform: "rotate(-2deg)" }}
          className="inline-block px-6 py-2 md:px-8 md:py-3 bg-[#381932] dark:bg-[#D4FF33] border border-[#D4FF33]/40 shadow-[4px_4px_0px_#FF4D1C] transition-colors duration-500 cursor-pointer active:scale-95"
        >
          <span className="font-display text-[clamp(2.4rem,6.5vw,6.2rem)] font-black leading-none tracking-tight uppercase text-[#D4FF33] dark:text-[#381932]">
            {amrText}
          </span>
        </div>

        {/* Secret Message Tooltip / Toast (Easter Egg 1) */}
        {eggMessageVisible && (
          <div
            role="status"
            aria-live="polite"
            className="absolute top-full left-0 mt-3 z-40 px-4 py-2 bg-[#381932] border-2 border-[#D4FF33] text-[#FFF3E6] text-xs sm:text-sm font-mono shadow-2xl flex items-center gap-2.5 whitespace-nowrap pointer-events-none animate-fadeIn"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4FF33] animate-pulse" />
            <span className="font-semibold">You found the part that wasn&apos;t supposed to be obvious.</span>
          </div>
        )}
      </div>

      {/* MONOSPACE SUB-LABEL */}
      <div className="mt-8 font-mono text-sm md:text-base tracking-widest text-[var(--ink-secondary)]">
        {exploringText}
      </div>
    </div>
  );
}

export default HeroGlitchLockup;
