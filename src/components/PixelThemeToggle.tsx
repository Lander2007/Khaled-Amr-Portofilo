"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useTheme } from "@/context/ThemeContext";

interface PixelCoord {
  col: number;
  row: number;
  x: number;
  y: number;
}

// 11x11 micro-grid geometry in a 22x22 SVG viewBox
// Step: 1.7px, Offset: 2.5px
const STEP = 1.7;
const OFFSET = 2.5;

function createCoord(col: number, row: number): PixelCoord {
  return {
    col,
    row,
    x: Number((OFFSET + col * STEP).toFixed(2)),
    y: Number((OFFSET + row * STEP).toFixed(2)),
  };
}

// ==============================================================
// 1. SUN MATRIX (Light Mode): Geometric pixel sun with 4 cardinal rays
// ==============================================================
const SUN_COORDS: PixelCoord[] = [
  // 3x3 Center Core
  createCoord(4, 4), createCoord(5, 4), createCoord(6, 4),
  createCoord(4, 5), createCoord(5, 5), createCoord(6, 5),
  createCoord(4, 6), createCoord(5, 6), createCoord(6, 6),

  // Ring Accents
  createCoord(5, 3), createCoord(3, 5), createCoord(7, 5), createCoord(5, 7),

  // 4 Cardinal Rays
  createCoord(5, 0), createCoord(5, 1), // North
  createCoord(5, 9), createCoord(5, 10), // South
  createCoord(0, 5), createCoord(1, 5), // West
  createCoord(9, 5), createCoord(10, 5), // East

  // 4 Diagonal Corner Beams
  createCoord(2, 2), createCoord(8, 2),
  createCoord(2, 8), createCoord(8, 8),
]; // 25 particles

// ==============================================================
// 2. CRESCENT MOON MATRIX (Dark Mode): Pixel crescent with 2 tiny stars
// ==============================================================
const MOON_COORDS: PixelCoord[] = [
  // Crescent Body
  createCoord(4, 2), createCoord(5, 2), createCoord(6, 2),
  createCoord(3, 3), createCoord(4, 3),
  createCoord(2, 4), createCoord(3, 4),
  createCoord(2, 5), createCoord(3, 5),
  createCoord(2, 6), createCoord(3, 6),
  createCoord(2, 7), createCoord(3, 7),
  createCoord(3, 8), createCoord(4, 8),
  createCoord(4, 9), createCoord(5, 9), createCoord(6, 9),

  // Star 1 (Upper Right Sky)
  createCoord(8, 2), createCoord(9, 2), createCoord(8, 3),

  // Star 2 (Lower Right Sky)
  createCoord(8, 7), createCoord(9, 7),
]; // 23 particles

const TOTAL_PARTICLES = Math.max(SUN_COORDS.length, MOON_COORDS.length);

interface PixelThemeToggleProps {
  className?: string;
}

export default function PixelThemeToggle({
  className = "",
}: PixelThemeToggleProps) {
  const { isPlum, toggleTheme } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const beamPathRef = useRef<SVGRectElement>(null);
  const particleRefs = useRef<(SVGRectElement | null)[]>([]);
  const isHoveredRef = useRef(false);
  const isMorphingRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Position thumb based on current theme state:
  // Dark/Plum: Left (x = 0)
  // Light/Milk: Right (x = 36px)
  const syncThumbPosition = useCallback(
    (animate = true, targetIsPlum = isPlum) => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const targetX = targetIsPlum ? 0 : 36;

      if (!animate) {
        gsap.set(thumb, { x: targetX });
      } else {
        gsap.to(thumb, {
          x: targetX,
          duration: 0.55,
          ease: "back.out(1.2)",
          overwrite: "auto",
        });
      }
    },
    [isPlum]
  );

  // Render particles to target formation
  const renderFormation = useCallback(
    (targetIsPlum: boolean, morph = false) => {
      const targetCoords = targetIsPlum ? MOON_COORDS : SUN_COORDS;
      const targetFill = targetIsPlum ? "#FFF3E6" : "#FF4D1C";
      // Direction of motion: right-to-left (-1) when switching to Plum; left-to-right (+1) when switching to Milk
      const dir = targetIsPlum ? -1 : 1;

      if (!morph) {
        // Instant alignment on mount
        particleRefs.current.forEach((el, i) => {
          if (!el) return;
          const coord = targetCoords[i];
          if (coord) {
            gsap.set(el, {
              x: coord.x,
              y: coord.y,
              rotation: 0,
              scale: 1,
              opacity: 1,
              fill: targetFill,
            });
          } else {
            gsap.set(el, {
              scale: 0,
              opacity: 0,
            });
          }
        });
        return;
      }

      // Fluid Directional Inertia & Morphing Physics
      isMorphingRef.current = true;
      const tl = gsap.timeline({
        onComplete: () => {
          isMorphingRef.current = false;
        },
      });

      // 1. Dispersion & Fluid Swirl in direction of inertia
      tl.to(particleRefs.current, {
        x: () => `+=${dir * gsap.utils.random(-3.5, 3.5, 0.2)}`,
        y: () => gsap.utils.random(-3.5, 3.5, 0.2),
        rotation: () => dir * gsap.utils.random(-90, 90, 5),
        duration: 0.16,
        ease: "power2.in",
        stagger: {
          amount: 0.05,
          from: targetIsPlum ? "end" : "start",
        },
      })
      // 2. Converge magnetically and snap into target pixel matrix
      .to(
        particleRefs.current,
        {
          x: (i) => (targetCoords[i] ? targetCoords[i].x : 11),
          y: (i) => (targetCoords[i] ? targetCoords[i].y : 11),
          rotation: 0,
          scale: (i) => (targetCoords[i] ? 1 : 0),
          opacity: (i) => (targetCoords[i] ? 1 : 0),
          fill: targetFill,
          duration: 0.42,
          ease: "back.out(1.5)",
          stagger: {
            amount: 0.09,
            from: "center",
          },
        },
        "-=0.03"
      );
    },
    []
  );

  useEffect(() => {
    setMounted(true);
    syncThumbPosition(false, isPlum);
    renderFormation(isPlum, false);
  }, []);

  // Continuous traveling border beam around the thumb
  useEffect(() => {
    const beam = beamPathRef.current;
    if (!beam) return;

    // Perimeter of 28.5x28.5 rounded rect is ~110px
    const tween = gsap.fromTo(
      beam,
      { strokeDashoffset: 0 },
      {
        strokeDashoffset: -110,
        duration: 3.2,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Fluid Hover Micro-Physics
  const handleMouseEnter = () => {
    if (isMorphingRef.current) return;
    isHoveredRef.current = true;

    const coords = isPlum ? MOON_COORDS : SUN_COORDS;
    gsap.to(particleRefs.current, {
      x: (i) => {
        const base = coords[i];
        return base ? base.x + gsap.utils.random(-2.2, 2.2, 0.3) : 11;
      },
      y: (i) => {
        const base = coords[i];
        return base ? base.y + gsap.utils.random(-2.2, 2.2, 0.3) : 11;
      },
      rotation: () => gsap.utils.random(-25, 25, 1),
      duration: 0.28,
      ease: "power2.out",
      stagger: {
        amount: 0.06,
        from: "center",
      },
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (isMorphingRef.current) return;

    const coords = isPlum ? MOON_COORDS : SUN_COORDS;
    particleRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = coords[i];
      if (target) {
        gsap.to(el, {
          x: target.x,
          y: target.y,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.34,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(el, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextIsPlum = !isPlum;
    toggleTheme();
    syncThumbPosition(true, nextIsPlum);
    renderFormation(nextIsPlum, true);
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Outer Track: Architectural Pill with Tactile Depth */}
      <div
        ref={trackRef}
        role="switch"
        aria-checked={isPlum}
        aria-label={`Current polarity: ${isPlum ? "Plum (Dark)" : "Milk (Light)"}. Click to invert.`}
        title={`Switch to ${isPlum ? "Milk (Light)" : "Plum (Dark)"} Polarity`}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-[72px] h-[34px] p-[2px] rounded-full relative flex items-center cursor-pointer transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-current group ${
          isPlum
            ? "bg-[#160715] border border-[#FFF3E6]/15 shadow-[inset_0_2px_5px_rgba(0,0,0,0.65),inset_0_0_1px_rgba(255,243,230,0.08)]"
            : "bg-[#EFE3D5] border border-[#381932]/18 shadow-[inset_0_2px_4px_rgba(56,25,50,0.12),inset_0_0_1px_rgba(56,25,50,0.15)]"
        }`}
      >
        {/* Architectural Groove Rail (Precision Mechanical Detail) */}
        <div
          className={`absolute inset-x-3.5 top-1/2 -translate-y-1/2 h-[1px] pointer-events-none transition-colors duration-500 ${
            isPlum ? "bg-[#FFF3E6]/10" : "bg-[#381932]/10"
          }`}
          aria-hidden="true"
        />

        {/* Sliding Thumb: Physical Floating Block with Perimeter Beam */}
        <div
          ref={thumbRef}
          className={`w-[28px] h-[28px] rounded-full relative flex items-center justify-center transition-colors duration-500 z-10 ${
            isPlum
              ? "bg-[#2D1328] border border-[#FFF3E6]/25 shadow-[0_2px_8px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,243,230,0.2)]"
              : "bg-[#FFFDF9] border border-[#381932]/12 shadow-[0_2px_6px_rgba(56,25,50,0.14),0_1px_2px_rgba(56,25,50,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]"
          }`}
        >
          {/* Traveling Perimeter Border Beam */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 28 28"
          >
            <defs>
              {/* Milk Mode: International Orange / Warm Amber */}
              <linearGradient
                id="beam-orange-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF4D1C" stopOpacity="1" />
                <stop offset="65%" stopColor="#FF8540" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF4D1C" stopOpacity="0" />
              </linearGradient>

              {/* Plum Mode: Crisp Warm Milk */}
              <linearGradient
                id="beam-milk-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF3E6" stopOpacity="1" />
                <stop offset="65%" stopColor="#FFFDF9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFF3E6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect
              ref={beamPathRef}
              x="0.75"
              y="0.75"
              width="26.5"
              height="26.5"
              rx="13.25"
              fill="none"
              strokeWidth="1.5"
              stroke={isPlum ? "url(#beam-milk-gradient)" : "url(#beam-orange-gradient)"}
              strokeDasharray="24 80"
              strokeLinecap="round"
              style={{
                filter: isPlum
                  ? "drop-shadow(0 0 3px rgba(255, 243, 230, 0.7))"
                  : "drop-shadow(0 0 3.5px rgba(255, 77, 28, 0.8))",
                transition: "stroke 0.4s ease, filter 0.4s ease",
              }}
            />
          </svg>

          {/* Pixel-Particle Matrix (11x11 Grid of 1.6px x 1.6px Rects) */}
          <svg
            className="w-[18px] h-[18px] pointer-events-none overflow-visible"
            viewBox="0 0 22 22"
          >
            {Array.from({ length: TOTAL_PARTICLES }).map((_, idx) => (
              <rect
                key={idx}
                ref={(el) => {
                  particleRefs.current[idx] = el;
                }}
                width="1.6"
                height="1.6"
                rx="0.3"
                x="0"
                y="0"
                fill={isPlum ? "#FFF3E6" : "#FF4D1C"}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center center",
                }}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
