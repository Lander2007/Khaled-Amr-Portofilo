"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useTheme } from "@/context/ThemeContext";

// 11x11 micro-grid definitions (col 0..10, row 0..10)
// Pixel width: 1.5px, height: 1.5px, step: 1.6px in a 20x20 viewBox
interface PixelCoord {
  col: number;
  row: number;
  x: number;
  y: number;
}

const STEP = 1.6;
const OFFSET = 2.0;

function createCoord(col: number, row: number): PixelCoord {
  return {
    col,
    row,
    x: OFFSET + col * STEP,
    y: OFFSET + row * STEP,
  };
}

// ==============================================================
// 1. SUN MATRIX (Light Mode): Geometric pixel sun with 4 cardinal rays
// ==============================================================
const SUN_COORDS: PixelCoord[] = [
  // Core circular disc
  createCoord(4, 3), createCoord(5, 3), createCoord(6, 3),
  createCoord(3, 4), createCoord(4, 4), createCoord(5, 4), createCoord(6, 4), createCoord(7, 4),
  createCoord(3, 5), createCoord(4, 5), createCoord(5, 5), createCoord(6, 5), createCoord(7, 5),
  createCoord(3, 6), createCoord(4, 6), createCoord(5, 6), createCoord(6, 6), createCoord(7, 6),
  createCoord(4, 7), createCoord(5, 7), createCoord(6, 7),

  // 4 Cardinal Rays
  createCoord(5, 0), createCoord(5, 1), // North
  createCoord(5, 9), createCoord(5, 10), // South
  createCoord(0, 5), createCoord(1, 5), // West
  createCoord(9, 5), createCoord(10, 5), // East

  // 4 Diagonal Corner Accents
  createCoord(2, 2), createCoord(8, 2),
  createCoord(2, 8), createCoord(8, 8),
]; // 33 pixels

// ==============================================================
// 2. CRESCENT MOON MATRIX (Dark Mode): Pixel crescent with 2 tiny stars
// ==============================================================
const MOON_COORDS: PixelCoord[] = [
  // Crescent Body
  createCoord(4, 2), createCoord(5, 2), createCoord(6, 2),
  createCoord(3, 3), createCoord(4, 3), createCoord(5, 3),
  createCoord(2, 4), createCoord(3, 4), createCoord(4, 4),
  createCoord(2, 5), createCoord(3, 5),
  createCoord(2, 6), createCoord(3, 6),
  createCoord(2, 7), createCoord(3, 7), createCoord(4, 7),
  createCoord(3, 8), createCoord(4, 8), createCoord(5, 8),
  createCoord(4, 9), createCoord(5, 9), createCoord(6, 9),

  // Star 1 (Upper Right Sky)
  createCoord(8, 2), createCoord(8, 3), createCoord(9, 2),

  // Star 2 (Lower Right Sky)
  createCoord(8, 7), createCoord(9, 7),
]; // 27 pixels

const TOTAL_PARTICLES = Math.max(SUN_COORDS.length, MOON_COORDS.length); // 33

interface PixelThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export default function PixelThemeToggle({
  className = "",
  showLabels = false,
}: PixelThemeToggleProps) {
  const { theme, isPlum, toggleTheme } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const beamPathRef = useRef<SVGRectElement>(null);
  const particleRefs = useRef<(SVGRectElement | null)[]>([]);
  const isHoveredRef = useRef(false);
  const isAnimatingRef = useRef(false);

  // Position thumb based on current theme state
  // Dark/Plum: Left (x = 0)
  // Light/Milk: Right (x = 40px)
  const syncThumbPosition = useCallback(
    (animate = true, targetIsPlum = isPlum) => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const targetX = targetIsPlum ? 0 : 40;

      if (!animate) {
        gsap.set(thumb, { x: targetX });
      } else {
        gsap.to(thumb, {
          x: targetX,
          duration: 0.65,
          ease: "elastic.out(1, 0.75)",
          overwrite: "auto",
        });
      }
    },
    [isPlum]
  );

  // Render pixels to target formation
  const renderFormation = useCallback(
    (targetIsPlum: boolean, morph = false) => {
      const targetCoords = targetIsPlum ? MOON_COORDS : SUN_COORDS;
      const targetFill = targetIsPlum ? "#FFF3E6" : "#FF4D1C";

      if (!morph) {
        // Instant alignment
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

      // Swirl & Re-assemble Click Morph Transition
      isAnimatingRef.current = true;
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      // 1. Swirl & chaotic dispersion explosion
      tl.to(particleRefs.current, {
        x: () => `+=${gsap.utils.random(-8, 8, 0.5)}`,
        y: () => `+=${gsap.utils.random(-8, 8, 0.5)}`,
        rotation: () => gsap.utils.random(-180, 180, 5),
        duration: 0.18,
        ease: "power2.in",
        stagger: {
          amount: 0.05,
          from: "center",
        },
      })
      // 2. Converge and snap into target pixel formation
      .to(
        particleRefs.current,
        {
          x: (i) => (targetCoords[i] ? targetCoords[i].x : 10),
          y: (i) => (targetCoords[i] ? targetCoords[i].y : 10),
          rotation: 0,
          scale: (i) => (targetCoords[i] ? 1 : 0),
          opacity: (i) => (targetCoords[i] ? 1 : 0),
          fill: targetFill,
          duration: 0.45,
          ease: "elastic.out(1.1, 0.8)",
          stagger: {
            amount: 0.1,
            from: "center",
          },
        },
        "-=0.04"
      );
    },
    []
  );

  // Initial mount synchronization
  useEffect(() => {
    syncThumbPosition(false, isPlum);
    renderFormation(isPlum, false);
  }, []);

  // Continuous traveling border beam animation
  useEffect(() => {
    const beam = beamPathRef.current;
    if (!beam) return;

    // Perimeter of 30.5x30.5 rounded rect with rx=4 is ~118px
    const tween = gsap.fromTo(
      beam,
      { strokeDashoffset: 0 },
      {
        strokeDashoffset: -118,
        duration: 3.2,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Hover Scatter Physics
  const handleMouseEnter = () => {
    if (isAnimatingRef.current) return;
    isHoveredRef.current = true;

    gsap.to(particleRefs.current, {
      x: (i) => {
        const base = isPlum ? MOON_COORDS[i] : SUN_COORDS[i];
        return base ? base.x + gsap.utils.random(-4.5, 4.5, 0.5) : 10;
      },
      y: (i) => {
        const base = isPlum ? MOON_COORDS[i] : SUN_COORDS[i];
        return base ? base.y + gsap.utils.random(-4.5, 4.5, 0.5) : 10;
      },
      rotation: () => gsap.utils.random(-45, 45, 1),
      duration: 0.32,
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
    if (isAnimatingRef.current) return;

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
          duration: 0.38,
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

  // Click Handler with Elastic Slide & Morph
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextIsPlum = !isPlum;
    toggleTheme();
    syncThumbPosition(true, nextIsPlum);
    renderFormation(nextIsPlum, true);
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {showLabels && (
        <span className="font-mono text-[10px] tracking-wider uppercase opacity-60 hidden sm:inline">
          {isPlum ? "PLUM [DARK]" : "MILK [LIGHT]"}
        </span>
      )}

      {/* Outer Track: Compact architectural pill/rectangle */}
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
        className="w-20 h-10 p-1 rounded-md border border-current/20 bg-current/5 relative flex items-center cursor-pointer transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-current group"
      >
        {/* Subtle Track Inner Track Marks */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-20 font-mono text-[8px] font-bold">
          <span className="ml-1 tracking-tighter">PLUM</span>
          <span className="mr-1 tracking-tighter">MILK</span>
        </div>

        {/* Sliding Thumb: A square inner block */}
        <div
          ref={thumbRef}
          className={`w-8 h-8 rounded-[4px] relative overflow-hidden flex items-center justify-center transition-colors duration-500 shadow-md ${
            isPlum
              ? "bg-[#240f20] border border-[#FFF3E6]/25"
              : "bg-[#381932] border border-[#381932]/20"
          }`}
        >
          {/* Traveling Perimeter Border Beam */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 32 32"
          >
            <defs>
              {/* Milk Mode: International Orange / Warm Amber Light Trail */}
              <linearGradient
                id="beam-orange-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FF4D1C" stopOpacity="1" />
                <stop offset="60%" stopColor="#FF8540" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF4D1C" stopOpacity="0" />
              </linearGradient>

              {/* Plum Mode: Crisp Warm Milk Light Trail */}
              <linearGradient
                id="beam-milk-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF3E6" stopOpacity="1" />
                <stop offset="70%" stopColor="#FFFDF9" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFF3E6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect
              ref={beamPathRef}
              x="0.75"
              y="0.75"
              width="30.5"
              height="30.5"
              rx="3.5"
              fill="none"
              strokeWidth="1.5"
              stroke={isPlum ? "url(#beam-milk-gradient)" : "url(#beam-orange-gradient)"}
              strokeDasharray="26 92"
              strokeLinecap="round"
              style={{
                filter: isPlum
                  ? "drop-shadow(0 0 3.5px rgba(255, 243, 230, 0.7))"
                  : "drop-shadow(0 0 4px rgba(255, 77, 28, 0.85))",
                transition: "stroke 0.4s ease, filter 0.4s ease",
              }}
            />
          </svg>

          {/* Pixel-Particle Matrix Canvas/SVG Grid (11x11 Grid of 1.5px x 1.5px Rects) */}
          <svg
            className="w-5 h-5 pointer-events-none overflow-visible"
            viewBox="0 0 20 20"
          >
            {Array.from({ length: TOTAL_PARTICLES }).map((_, idx) => (
              <rect
                key={idx}
                ref={(el) => {
                  particleRefs.current[idx] = el;
                }}
                width="1.5"
                height="1.5"
                rx="0.25"
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

