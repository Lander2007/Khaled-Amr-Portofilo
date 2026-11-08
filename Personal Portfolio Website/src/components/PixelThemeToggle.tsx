"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// 74 exact pixel coordinates on a 15x15 grid (0..14, center = 7,7)
// Matches the dense dithered Sun & Crescent Moon from Whitespace's glass-light-toggle
const SUN_MATRIX: [number, number][] = [
  // Dense 5x5 rounded core (21 pixels)
  [6, 5], [7, 5], [8, 5],
  [5, 6], [6, 6], [7, 6], [8, 6], [9, 6],
  [5, 7], [6, 7], [7, 7], [8, 7], [9, 7],
  [5, 8], [6, 8], [7, 8], [8, 8], [9, 8],
  [6, 9], [7, 9], [8, 9],
  // Inner ring accents (8 pixels)
  [7, 4], [7, 10], [4, 7], [10, 7], [5, 5], [9, 5], [5, 9], [9, 9],
  // Top vertical ray (4 pixels)
  [7, 0], [7, 1], [7, 2], [7, 3],
  // Bottom vertical ray (4 pixels)
  [7, 11], [7, 12], [7, 13], [7, 14],
  // Left horizontal ray (4 pixels)
  [0, 7], [1, 7], [2, 7], [3, 7],
  // Right horizontal ray (4 pixels)
  [11, 7], [12, 7], [13, 7], [14, 7],
  // Top-Left diagonal ray (4 pixels)
  [2, 2], [3, 3], [4, 4], [1, 1],
  // Top-Right diagonal ray (4 pixels)
  [12, 2], [11, 3], [10, 4], [13, 1],
  // Bottom-Left diagonal ray (4 pixels)
  [2, 12], [3, 11], [4, 10], [1, 13],
  // Bottom-Right diagonal ray (4 pixels)
  [12, 12], [11, 11], [10, 10], [13, 13],
  // Extra dithered core density (13 pixels)
  [6, 6], [8, 6], [6, 8], [8, 8], [7, 7], [6, 7], [8, 7], [7, 6], [7, 8], [4, 6], [10, 6], [6, 4], [6, 10],
];

const MOON_MATRIX: [number, number][] = [
  // Dithered Crescent Moon outer & inner curve (58 pixels)
  [6, 2], [7, 2],
  [4, 3], [5, 3], [6, 3], [7, 3],
  [3, 4], [4, 4], [5, 4], [6, 4],
  [2, 5], [3, 5], [4, 5], [5, 5],
  [2, 6], [3, 6], [4, 6], [5, 6],
  [1, 7], [2, 7], [3, 7], [4, 7], [5, 7],
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [2, 9], [3, 9], [4, 9], [5, 9], [6, 9],
  [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10],
  [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11],
  [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12],
  [6, 13], [7, 13], [8, 13], [9, 13], [10, 11],
  // Top-right star & dithered sparkles (16 pixels)
  [10, 2], [9, 3], [10, 3], [11, 3], [10, 4],
  [12, 5], [13, 5], [12, 6],
  [8, 5], [8, 6], [9, 7], [11, 8], [7, 4], [6, 8], [7, 9], [8, 10],
];

const PIXEL_COUNT = 74;
const MAX_X = 42; // Track travel distance in px (92 track - 42 thumb - 8 padding)

// Precomputed random scatter offsets so hover/drag dispersion feels organic
const SCATTER_OFFSETS = Array.from({ length: PIXEL_COUNT }, (_, i) => {
  const angle = (i / PIXEL_COUNT) * Math.PI * 2 + (i % 7) * 0.45;
  const dist = 2.2 + (i % 6) * 1.85;
  return {
    dx: Math.cos(angle) * dist + (((i * 13) % 5) - 2) * 0.9,
    dy: Math.sin(angle) * dist + (((i * 17) % 5) - 2) * 0.9,
  };
});

interface PixelThemeToggleProps {
  className?: string;
}

export function PixelThemeToggle({ className = "" }: PixelThemeToggleProps) {
  // false = Sun on right (Milk / Light Mode), true = Moon on left (Plum / Dark Mode)
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rimGlowRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);

  // Animation values tracked outside React state for zero-lag 120 FPS rendering
  const animRef = useRef({
    x: MAX_X,
    progress: 1, // 0 = Moon/Dark, 1 = Sun/Light
    scatter: 0,
  });

  const dragState = useRef({
    active: false,
    startX: 0,
    startThumbX: MAX_X,
    moved: false,
  });

  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Draw 74 pixels onto 2D Canvas with zero DOM overhead
  const drawPixels = useCallback(
    (ctx: CanvasRenderingContext2D, progress: number, scatter: number) => {
      ctx.clearRect(0, 0, 42, 40);

      const cx = 21;
      const cy = 20;
      const STEP = 1.68;
      const size = 1.68;

      // Parabolic organic dispersion curve during morph
      const midScatter = Math.sin(progress * Math.PI) * 0.9;
      const totalScatter = scatter + midScatter;

      // Smooth color morph from pure white (Dark/Moon) to dark charcoal (Light/Sun)
      const r = Math.round(255 + (30 - 255) * progress);
      const g = Math.round(255 + (27 - 255) * progress);
      const b = Math.round(255 + (24 - 255) * progress);

      ctx.fillStyle = `rgb(${r},${g},${b})`;

      // Soft nocturnal starlight glow for Moon & stars in dark mode
      if (progress < 0.65) {
        const glowFactor = (1 - progress / 0.65);
        ctx.shadowBlur = glowFactor * 3;
        ctx.shadowColor = `rgba(255, 255, 255, ${glowFactor * 0.85})`;
      } else {
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < PIXEL_COUNT; i++) {
        const [mx, my] = MOON_MATRIX[i] || [7, 7];
        const [sx, sy] = SUN_MATRIX[i] || [7, 7];

        const moonX = cx + (mx - 7) * STEP;
        const moonY = cy + (my - 7) * STEP;
        const sunX = cx + (sx - 7) * STEP;
        const sunY = cy + (sy - 7) * STEP;

        let px = moonX + (sunX - moonX) * progress;
        let py = moonY + (sunY - moonY) * progress;

        if (totalScatter > 0.01) {
          const offset = SCATTER_OFFSETS[i];
          px += offset.dx * totalScatter;
          py += offset.dy * totalScatter;
        }

        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }
    },
    []
  );

  // Hardware-accelerated animation runner
  const animateTo = useCallback(
    (targetDark: boolean, targetScatter = 0) => {
      const targetX = targetDark ? 0 : MAX_X;
      const targetProgress = targetDark ? 0 : 1;

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      tweenRef.current = gsap.to(animRef.current, {
        x: targetX,
        progress: targetProgress,
        scatter: targetScatter,
        duration: 0.65,
        ease: "power3.out", // Calming, buttery-smooth deceleration
        onUpdate: () => {
          if (thumbRef.current) {
            gsap.set(thumbRef.current, { x: animRef.current.x, force3D: true });
          }
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              drawPixels(ctx, animRef.current.progress, animRef.current.scatter);
            }
          }
        },
      });
    },
    [drawPixels]
  );

  // Apply theme change to document and localStorage with View Transition support
  const applyTheme = useCallback((dark: boolean) => {
    const theme = dark ? "plum" : "milk";
    if (typeof document !== "undefined") {
      // Use View Transitions API if supported to avoid main-thread style recalculation spike
      const docWithVT = document as unknown as { startViewTransition?: (cb: () => void) => void };
      if (typeof docWithVT.startViewTransition === "function") {
        docWithVT.startViewTransition(() => {
          document.documentElement.setAttribute("data-theme", theme);
        });
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    }
    try {
      localStorage.setItem("portfolio-polarity-theme", theme);
    } catch (_) {}
  }, []);

  // Sync initial state on mount
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
      const currentAttr =
        typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : null;
      initialDark = currentAttr === "plum";
    }

    setIsDark(initialDark);
    const startX = initialDark ? 0 : MAX_X;
    const startProgress = initialDark ? 0 : 1;

    animRef.current = {
      x: startX,
      progress: startProgress,
      scatter: 0,
    };

    if (thumbRef.current) {
      gsap.set(thumbRef.current, { x: startX, force3D: true });
    }

    // Initialize Canvas with Retina devicePixelRatio
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(42 * dpr);
      canvas.height = Math.round(40 * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawPixels(ctx, startProgress, 0);
      }
    }
  }, [drawPixels]);

  // Handle window resize or monitor DPI changes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(42 * dpr);
      canvas.height = Math.round(40 * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawPixels(ctx, animRef.current.progress, animRef.current.scatter);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawPixels]);

  // Cleanup tweens on unmount
  useEffect(() => {
    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, []);

  // Hover handlers
  const handlePointerEnter = () => {
    setIsHovered(true);
    if (dragState.current.active) return;
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { scale: 1.025, duration: 0.35, ease: "power2.out" });
    }
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.to(animRef.current, {
      scatter: 0.8,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) drawPixels(ctx, animRef.current.progress, animRef.current.scatter);
        }
      },
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (dragState.current.active) return;
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { scale: 1, duration: 0.35, ease: "power2.out" });
    }
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.to(animRef.current, {
      scatter: 0,
      duration: 0.5,
      ease: "back.out(1.5)",
      onUpdate: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) drawPixels(ctx, animRef.current.progress, animRef.current.scatter);
        }
      },
    });
  };

  // Drag Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (tweenRef.current) tweenRef.current.kill();

    dragState.current = {
      active: true,
      startX: e.clientX,
      startThumbX: animRef.current.x,
      moved: false,
    };
    setIsDragging(true);

    if (thumbRef.current) {
      gsap.to(thumbRef.current, { scale: 1.04, duration: 0.2, ease: "power1.out" });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const deltaX = e.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.current.moved = true;
    }

    const clampedX = Math.max(0, Math.min(MAX_X, dragState.current.startThumbX + deltaX));
    const progress = clampedX / MAX_X;

    animRef.current.x = clampedX;
    animRef.current.progress = progress;
    animRef.current.scatter = 0.95;

    if (thumbRef.current) {
      gsap.set(thumbRef.current, { x: clampedX, force3D: true });
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) drawPixels(ctx, progress, animRef.current.scatter);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const wasClick = !dragState.current.moved;
    setIsDragging(false);

    if (thumbRef.current) {
      gsap.to(thumbRef.current, {
        scale: isHovered ? 1.025 : 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    let nextDark = isDark;
    if (wasClick) {
      nextDark = !isDark;
    } else {
      const progress = animRef.current.x / MAX_X;
      nextDark = progress < 0.5;
    }

    applyTheme(nextDark);
    setIsDark(nextDark);
    animateTo(nextDark, 0);
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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const nextDark = !isDark;
          applyTheme(nextDark);
          setIsDark(nextDark);
          animateTo(nextDark, 0);
        }
      }}
      style={{ touchAction: "none" }}
      className={`relative w-[92px] h-[48px] rounded-[16px] p-[4px] flex items-center cursor-grab active:cursor-grabbing select-none transition-colors duration-500 ${className} ${
        isDark
          ? "bg-[#151519]/90 border border-white/[0.12] shadow-[inset_0_3px_8px_rgba(0,0,0,0.85),0_2px_12px_rgba(0,0,0,0.45)]"
          : "bg-[#E4DFD9]/90 border border-black/[0.08] shadow-[inset_0_2px_6px_rgba(0,0,0,0.14),0_2px_10px_rgba(56,25,50,0.06)]"
      }`}
    >
      {/* Ambient Radial Light Spill behind the squircle thumb */}
      <div
        ref={ambientGlowRef}
        className={`pointer-events-none absolute -inset-2 rounded-[22px] transition-opacity duration-500 blur-[12px] ${
          isDark
            ? "bg-[radial-gradient(circle_at_24%_50%,rgba(140,175,255,0.42),transparent_62%)] opacity-90"
            : "bg-[radial-gradient(circle_at_76%_50%,rgba(255,155,45,0.48),transparent_62%)] opacity-90"
        }`}
      />

      {/* Sliding Squircle Glass Thumb (42x40px, rounded-[12px] — NOT circular!) */}
      <div
        ref={thumbRef}
        className={`relative z-10 w-[42px] h-[40px] rounded-[12px] flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-br from-[#3A3C46]/90 via-[#25262E]/95 to-[#181920]/95 shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.35)]"
            : "bg-gradient-to-br from-[#FFFFFF]/95 via-[#FAF5EE]/92 to-[#EFE6DA]/95 shadow-[0_6px_16px_rgba(255,140,30,0.28),inset_0_1.5px_2px_rgba(255,255,255,1)]"
        }`}
      >
        {/* Glowing Specular Rim Arc on the Squircle Edge (Whitespace accurate) */}
        <div
          ref={rimGlowRef}
          className={`pointer-events-none absolute inset-0 rounded-[12px] transition-all duration-500 ${
            isDark
              ? "border-l-[2px] border-t-[1.5px] border-b-[1.5px] border-r-0 border-[#DCE8FF] shadow-[-3px_0_12px_rgba(165,195,255,0.85),inset_2px_0_6px_rgba(210,230,255,0.55)]"
              : "border-r-[2px] border-t-[1.5px] border-b-[1.5px] border-l-0 border-[#FFA033] shadow-[4px_0_14px_rgba(255,150,35,0.9),inset_-2px_0_8px_rgba(255,165,50,0.65)]"
          }`}
        />

        {/* 120 FPS High-DPI Canvas Rendering 74 Square Pixels with Zero DOM Overhead */}
        <canvas
          ref={canvasRef}
          className="relative z-20 w-[42px] h-[40px] pointer-events-none block"
          style={{ width: 42, height: 40 }}
        />
      </div>
    </div>
  );
}

export default PixelThemeToggle;
