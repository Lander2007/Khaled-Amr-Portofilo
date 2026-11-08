"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const GLITCH_CHARS = "ΞØ#/_01XΔ§±¥¶";

// 5 horizontal slice bands covering 0% -> 100% height
const SLICE_BANDS = [
  "inset(0% 0 82% 0)",
  "inset(18% 0 60% 0)",
  "inset(40% 0 38% 0)",
  "inset(62% 0 18% 0)",
  "inset(82% 0 0% 0)",
];

export function HeroGlitchLockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseTextRef = useRef<HTMLHeadingElement>(null);
  const slicesWrapperRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const limeGhostRef = useRef<HTMLDivElement>(null);
  const orangeGhostRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const amrBadgeRef = useRef<HTMLButtonElement>(null);

  const [amrText, setAmrText] = useState("AMR");
  const [exploringText, setExploringText] = useState("// Exploring Creative Web Technologies");
  const [eggMessageVisible, setEggMessageVisible] = useState(false);

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eggResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Character Scramble helper
  const scrambleString = useCallback(
    (original: string, setter: React.Dispatch<React.SetStateAction<string>>, durationMs = 420) => {
      let frame = 0;
      const totalFrames = Math.max(1, Math.floor(durationMs / 35));
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const nextStr = original
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            if (idx / original.length < progress) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");
        setter(nextStr);
        if (frame >= totalFrames) {
          clearInterval(interval);
          setter(original);
        }
      }, 35);
      return () => clearInterval(interval);
    },
    []
  );

  // Heavy Mechanical Glitch Burst Timeline
  const triggerGlitchBurst = useCallback((intensity = 1) => {
    if (!slicesWrapperRef.current || !baseTextRef.current) return;

    const prefersReducedMotion =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-reduced-motion") === "true";
    if (prefersReducedMotion) return;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline({ overwrite: true });
    tlRef.current = tl;

    // Hide solid base text during the destructive slice frames so slices visibly cut the word apart
    tl.set(baseTextRef.current, { opacity: 0.15 })
      .set(slicesWrapperRef.current, { opacity: 1 })
      .set([limeGhostRef.current, orangeGhostRef.current, scanlineRef.current], { opacity: 1 });

    // 6 rapid stepped mechanical glitch frames
    for (let step = 0; step < 6; step++) {
      tl.add(() => {
        // Displace each of the 5 horizontal slices aggressively
        sliceRefs.current.forEach((slice, i) => {
          if (!slice) return;
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.set(slice, {
            x: gsap.utils.random(-38, 38) * intensity * dir,
            y: gsap.utils.random(-3, 3) * intensity,
            skewX: gsap.utils.random(-18, 18) * intensity,
            scaleX: gsap.utils.random(0.96, 1.05),
          });
        });

        // Aggressive Chromatic Split (Acid Lime & International Orange)
        if (limeGhostRef.current) {
          gsap.set(limeGhostRef.current, {
            x: gsap.utils.random(-28, -10) * intensity,
            y: gsap.utils.random(-4, 4),
            skewX: gsap.utils.random(-12, 12),
            clipPath: `inset(${gsap.utils.random(5, 65)}% 0 ${gsap.utils.random(5, 30)}% 0)`,
          });
        }

        if (orangeGhostRef.current) {
          gsap.set(orangeGhostRef.current, {
            x: gsap.utils.random(10, 28) * intensity,
            y: gsap.utils.random(-4, 4),
            skewX: gsap.utils.random(-12, 12),
            clipPath: `inset(${gsap.utils.random(10, 55)}% 0 ${gsap.utils.random(10, 40)}% 0)`,
          });
        }

        // Razor scanline jump
        if (scanlineRef.current) {
          gsap.set(scanlineRef.current, {
            top: `${gsap.utils.random(8, 92)}%`,
            scaleY: gsap.utils.random(1, 3.5),
          });
        }

        // Jolt the tilted AMR badge in sync
        if (amrBadgeRef.current) {
          gsap.set(amrBadgeRef.current, {
            x: gsap.utils.random(-10, 10) * intensity,
            y: gsap.utils.random(-4, 4) * intensity,
            rotation: gsap.utils.random(-6, 3),
          });
        }
      }, `+=${0.045}`);
    }

    // Snap everything back to razor-sharp alignment
    tl.add(() => {
      if (baseTextRef.current) gsap.set(baseTextRef.current, { opacity: 1 });
      if (slicesWrapperRef.current) gsap.set(slicesWrapperRef.current, { opacity: 0 });
      gsap.set([limeGhostRef.current, orangeGhostRef.current, scanlineRef.current], { opacity: 0 });
      sliceRefs.current.forEach((slice) => {
        if (slice) gsap.set(slice, { x: 0, y: 0, skewX: 0, scaleX: 1 });
      });
      if (amrBadgeRef.current) {
        gsap.to(amrBadgeRef.current, {
          x: 0,
          y: 0,
          rotation: -2,
          duration: 0.2,
          ease: "back.out(3)",
        });
      }
    }, "+=0.05");
  }, []);

  // Automatic periodic glitch loop every 2.4 seconds
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      triggerGlitchBurst(1.1);
      scrambleString("AMR", setAmrText, 360);
    }, 600);

    const interval = setInterval(() => {
      triggerGlitchBurst(gsap.utils.random(0.85, 1.35));
      if (Math.random() > 0.4) {
        scrambleString("AMR", setAmrText, 320);
      }
    }, 2400);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (tlRef.current) tlRef.current.kill();
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (eggResetTimerRef.current) clearTimeout(eggResetTimerRef.current);
    };
  }, [triggerGlitchBurst, scrambleString]);

  const handleHoverEnter = () => {
    triggerGlitchBurst(1.5);
    scrambleString("AMR", setAmrText, 450);
    scrambleString("// Exploring Creative Web Technologies", setExploringText, 520);
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickCountRef.current += 1;
    triggerGlitchBurst(1.8);
    scrambleString("AMR", setAmrText, 400);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3500);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      setEggMessageVisible(true);
      triggerGlitchBurst(2.5);

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
      onClick={() => triggerGlitchBurst(1.7)}
      className="relative select-none cursor-pointer group flex flex-col items-start"
    >
      {/* MAIN KHALED MULTI-SLICE STACK */}
      <div className="relative inline-block">
        {/* 1. Solid Base Layer */}
        <h1
          ref={baseTextRef}
          className="font-display text-[clamp(3.5rem,11.5vw,12.5rem)] font-black leading-[0.84] tracking-tighter uppercase text-[var(--ink-primary)]"
        >
          KHALED
        </h1>

        {/* 2. Acid Chartreuse (#D4FF33) Chromatic Split Ghost */}
        <div
          ref={limeGhostRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-display text-[clamp(3.5rem,11.5vw,12.5rem)] font-black leading-[0.84] tracking-tighter uppercase text-[#D4FF33] mix-blend-difference opacity-0 z-10"
        >
          KHALED
        </div>

        {/* 3. International Orange (#FF4D1C) Chromatic Split Ghost */}
        <div
          ref={orangeGhostRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-display text-[clamp(3.5rem,11.5vw,12.5rem)] font-black leading-[0.84] tracking-tighter uppercase text-[#FF4D1C] opacity-0 z-10"
        >
          KHALED
        </div>

        {/* 4. 5 Destructive Horizontal Razor Slices */}
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
              className="absolute inset-0 font-display text-[clamp(3.5rem,11.5vw,12.5rem)] font-black leading-[0.84] tracking-tighter uppercase text-[var(--ink-primary)]"
            >
              KHALED
            </div>
          ))}
        </div>

        {/* 5. Horizontal Acid Lime Laser Scanline Cut */}
        <div
          ref={scanlineRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-[-4%] right-[-4%] h-[3px] bg-[#D4FF33] shadow-[0_0_12px_#D4FF33] opacity-0 z-30"
        />
      </div>

      {/* TILTED AMR BADGE WITH SYNCED GLITCH & SCRAMBLE */}
      <div className="mt-2 md:mt-3 relative inline-block">
        <button
          ref={amrBadgeRef}
          type="button"
          onClick={handleBadgeClick}
          style={{ transform: "rotate(-2deg)" }}
          aria-label="Amr identity — Click repeatedly to discover secret"
          className="inline-block px-5 py-1.5 md:px-8 md:py-2.5 bg-[#381932] border-2 border-[#D4FF33] shadow-[5px_5px_0px_#FF4D1C] transition-all duration-300 cursor-pointer active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF33]"
        >
          <span className="font-display text-[clamp(1.8rem,5vw,5rem)] font-black leading-none tracking-tight uppercase text-[#D4FF33]">
            {amrText}
          </span>
        </button>

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

      {/* SCRAMBLING MONOSPACE SUB-LABEL */}
      <div className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm md:text-base tracking-widest text-[var(--ink-secondary)]">
        {exploringText}
      </div>
    </div>
  );
}

export default HeroGlitchLockup;
