"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// 74 exact pixel coordinates on a 15x15 grid (0..14, center = 7,7)
// Matches the dense dithered Sun & Crescent Moon from Whitespace's glass-light-toggle
const SUN_MATRIX: [number, number][] = [
  // Dense 5x5 rounded core (21 pixels)
  [6,5],[7,5],[8,5],
  [5,6],[6,6],[7,6],[8,6],[9,6],
  [5,7],[6,7],[7,7],[8,7],[9,7],
  [5,8],[6,8],[7,8],[8,8],[9,8],
  [6,9],[7,9],[8,9],
  // Inner ring accents (8 pixels)
  [7,4],[7,10],[4,7],[10,7],[5,5],[9,5],[5,9],[9,9],
  // Top vertical ray (4 pixels)
  [7,0],[7,1],[7,2],[7,3],
  // Bottom vertical ray (4 pixels)
  [7,11],[7,12],[7,13],[7,14],
  // Left horizontal ray (4 pixels)
  [0,7],[1,7],[2,7],[3,7],
  // Right horizontal ray (4 pixels)
  [11,7],[12,7],[13,7],[14,7],
  // Top-Left diagonal ray (4 pixels)
  [2,2],[3,3],[4,4],[1,1],
  // Top-Right diagonal ray (4 pixels)
  [12,2],[11,3],[10,4],[13,1],
  // Bottom-Left diagonal ray (4 pixels)
  [2,12],[3,11],[4,10],[1,13],
  // Bottom-Right diagonal ray (4 pixels)
  [12,12],[11,11],[10,10],[13,13],
  // Extra dithered core density (13 pixels)
  [6,6],[8,6],[6,8],[8,8],[7,7],[6,7],[8,7],[7,6],[7,8],[4,6],[10,6],[6,4],[6,10]
];

const MOON_MATRIX: [number, number][] = [
  // Dithered Crescent Moon outer & inner curve (58 pixels)
  [6,2],[7,2],
  [4,3],[5,3],[6,3],[7,3],
  [3,4],[4,4],[5,4],[6,4],
  [2,5],[3,5],[4,5],[5,5],
  [2,6],[3,6],[4,6],[5,6],
  [1,7],[2,7],[3,7],[4,7],[5,7],
  [1,8],[2,8],[3,8],[4,8],[5,8],
  [2,9],[3,9],[4,9],[5,9],[6,9],
  [2,10],[3,10],[4,10],[5,10],[6,10],[7,10],
  [3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],
  [4,12],[5,12],[6,12],[7,12],[8,12],[9,12],[10,12],
  [6,13],[7,13],[8,13],[9,13],[10,11],
  // Top-right star & dithered sparkles (16 pixels)
  [10,2],[9,3],[10,3],[11,3],[10,4],
  [12,5],[13,5],[12,6],
  [8,5],[8,6],[9,7],[11,8],[7,4],[6,8],[7,9],[8,10]
];

const PIXEL_COUNT = 74;
const MAX_X = 42; // Track travel distance in px

interface PixelThemeToggleProps {
  className?: string;
}

export default function PixelThemeToggle({ className = "" }: PixelThemeToggleProps = {}) {
  // Default to light mode (false = Sun on right) or sync with current document attribute
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rimGlowRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Precomputed random scatter offsets so hover/drag dispersion feels organic
  const scatterOffsets = useRef(
    Array.from({ length: PIXEL_COUNT }, (_, i) => {
      const angle = (i / PIXEL_COUNT) * Math.PI * 2 + (i % 7) * 0.45;
      const dist = 2.2 + (i % 6) * 1.85;
      return {
        dx: Math.cos(angle) * dist + ((i * 13) % 5 - 2) * 0.9,
        dy: Math.sin(angle) * dist + ((i * 17) % 5 - 2) * 0.9,
        rot: ((i * 29) % 90) - 45,
      };
    })
  );

  const dragState = useRef({
    active: false,
    startX: 0,
    startThumbX: MAX_X,
    currentX: MAX_X,
    moved: false,
  });

  // Sync initial state with DOM theme and localStorage
  useEffect(() => {
    let initialDark = false;
    try {
      const stored = localStorage.getItem("portfolio-polarity-theme");
      if (stored) {
        initialDark = stored === "plum";
      } else {
        const currentAttr = document.documentElement.getAttribute("data-theme");
        initialDark = currentAttr === "plum";
      }
    } catch {
      const currentAttr = document.documentElement.getAttribute("data-theme");
      initialDark = currentAttr === "plum";
    }

    setIsDark(initialDark);
    dragState.current.currentX = initialDark ? 0 : MAX_X;
    gsap.set(thumbRef.current, { x: initialDark ? 0 : MAX_X });
  }, []);

  // Apply theme to document and persist to localStorage
  useEffect(() => {
    const theme = isDark ? "plum" : "milk";
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("portfolio-polarity-theme", theme);
    } catch (_) {}
  }, [isDark]);

  // Animate pixels based on progress (0 = Moon/Left, 1 = Sun/Right) and scatter intensity
  const updatePixels = useCallback(
    (progress: number, scattered: boolean, immediate = false) => {
      const STEP = 1.65; // Pixel spacing inside the 42x40 squircle

      pixelsRef.current.forEach((el, i) => {
        if (!el) return;
        const [mx, my] = MOON_MATRIX[i] || [7, 7];
        const [sx, sy] = SUN_MATRIX[i] || [7, 7];

        const moonX = (mx - 7) * STEP;
        const moonY = (my - 7) * STEP;
        const sunX = (sx - 7) * STEP;
        const sunY = (sy - 7) * STEP;

        // Interpolate base position between Moon (0) and Sun (1)
        let targetX = moonX + (sunX - moonX) * progress;
        let targetY = moonY + (sunY - moonY) * progress;
        let targetRot = 0;
        let targetScale = 1;

        // Mid-drag or hover scatter swirl
        const midMorphFactor = Math.sin(progress * Math.PI); // Peaks at 0.5 during drag
        const scatterStrength = scattered ? 1 : midMorphFactor * 1.15;

        if (scatterStrength > 0.01) {
          const { dx, dy, rot } = scatterOffsets.current[i];
          targetX += dx * scatterStrength;
          targetY += dy * scatterStrength;
          targetRot = rot * scatterStrength;
          targetScale = 1 - 0.15 * scatterStrength + (i % 3) * 0.1 * scatterStrength;
        }

        gsap.to(el, {
          x: targetX,
          y: targetY,
          rotation: targetRot,
          scale: targetScale,
          duration: immediate ? 0.12 : scattered ? 0.48 : 0.68,
          delay: immediate ? 0 : (i % 10) * 0.008,
          ease: scattered ? "power3.out" : "back.out(1.55)",
          overwrite: "auto",
        });
      });
    },
    []
  );

  // Trigger smooth state animation when not actively dragging
  useEffect(() => {
    if (isDragging) return;
    const targetX = isDark ? 0 : MAX_X;
    dragState.current.currentX = targetX;

    gsap.to(thumbRef.current, {
      x: targetX,
      scale: isHovered ? 1.02 : 1,
      duration: 0.72,
      ease: "expo.out",
      overwrite: "auto",
    });

    updatePixels(isDark ? 0 : 1, isHovered, false);
  }, [isDark, isHovered, isDragging, updatePixels]);

  // Pointer Down (Start Drag or Click)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current.active = true;
    dragState.current.startX = e.clientX;
    dragState.current.startThumbX = dragState.current.currentX;
    dragState.current.moved = false;
    setIsDragging(true);
  };

  // Pointer Move (Live Drag Scrubbing)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const deltaX = e.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.current.moved = true;
    }

    const clampedX = Math.max(0, Math.min(MAX_X, dragState.current.startThumbX + deltaX));
    dragState.current.currentX = clampedX;
    const progress = clampedX / MAX_X; // 0 = Dark (Left), 1 = Light (Right)

    gsap.set(thumbRef.current, { x: clampedX });
    updatePixels(progress, true, true);

    // Live theme preview while crossing midpoint
    const shouldBeDark = progress < 0.5;
    if (shouldBeDark !== isDark) {
      setIsDark(shouldBeDark);
    }
  };

  // Pointer Up / Cancel (Snap & Assemble)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const wasClick = !dragState.current.moved;
    setIsDragging(false);

    if (wasClick) {
      // Clicking toggles polarity directly
      setIsDark((prev) => !prev);
    } else {
      // Snap to nearest side based on drag release position
      const progress = dragState.current.currentX / MAX_X;
      setIsDark(progress < 0.5);
    }
  };

  return (
    <div
      ref={trackRef}
      role="switch"
      aria-checked={!isDark}
      aria-label={`Theme Polarity Toggle (${isDark ? "Plum / Dark" : "Milk / Light"})`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsDark((p) => !p);
        }
      }}
      style={{ touchAction: "none" }}
      className={`relative w-[92px] h-[48px] rounded-[16px] p-[4px] flex items-center cursor-grab active:cursor-grabbing select-none transition-all duration-700 ${className} ${
        isDark
          ? "bg-[#151519]/90 border border-white/[0.12] shadow-[inset_0_3px_8px_rgba(0,0,0,0.85),0_2px_12px_rgba(0,0,0,0.45)]"
          : "bg-[#E4DFD9]/90 border border-black/[0.08] shadow-[inset_0_2px_6px_rgba(0,0,0,0.14),0_2px_10px_rgba(56,25,50,0.06)]"
      }`}
    >
      {/* Ambient Radial Light Spill outside/behind the squircle thumb */}
      <div
        ref={ambientGlowRef}
        className={`pointer-events-none absolute -inset-2 rounded-[22px] transition-all duration-700 blur-[12px] ${
          isDark
            ? "bg-[radial-gradient(circle_at_24%_50%,rgba(140,175,255,0.42),transparent_62%)]"
            : "bg-[radial-gradient(circle_at_76%_50%,rgba(255,155,45,0.48),transparent_62%)]"
        }`}
      />

      {/* Sliding Squircle Glass Thumb (42x40px, rounded-[12px] — NOT circular!) */}
      <div
        ref={thumbRef}
        className={`relative z-10 w-[42px] h-[40px] rounded-[12px] flex items-center justify-center backdrop-blur-md transition-colors duration-700 ${
          isDark
            ? "bg-gradient-to-br from-[#3A3C46]/90 via-[#25262E]/95 to-[#181920]/95 shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.35)]"
            : "bg-gradient-to-br from-[#FFFFFF]/95 via-[#FAF5EE]/92 to-[#EFE6DA]/95 shadow-[0_6px_16px_rgba(255,140,30,0.28),inset_0_1.5px_2px_rgba(255,255,255,1)]"
        }`}
      >
        {/* Glowing Specular Rim Arc on the Squircle Edge (Matches Video 1:1) */}
        <div
          ref={rimGlowRef}
          className={`pointer-events-none absolute inset-0 rounded-[12px] transition-all duration-700 ${
            isDark
              ? "border-l-[2px] border-t-[1.5px] border-b-[1.5px] border-r-0 border-[#DCE8FF] shadow-[-3px_0_12px_rgba(165,195,255,0.85),inset_2px_0_6px_rgba(210,230,255,0.55)]"
              : "border-r-[2px] border-t-[1.5px] border-b-[1.5px] border-l-0 border-[#FFA033] shadow-[4px_0_14px_rgba(255,150,35,0.9),inset_-2px_0_8px_rgba(255,165,50,0.65)]"
          }`}
        />

        {/* 74 Individual Morphing & Scattering Square Pixels */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {Array.from({ length: PIXEL_COUNT }).map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                pixelsRef.current[i] = el;
              }}
              className={`absolute w-[1.65px] h-[1.65px] rounded-[0.2px] transition-colors duration-500 ${
                isDark
                  ? "bg-white shadow-[0_0_2px_rgba(255,255,255,0.9)]"
                  : "bg-[#1E1916]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
