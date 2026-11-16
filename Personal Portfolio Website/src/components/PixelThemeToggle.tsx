"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const MAX_X = 42; // Track travel distance: 90px track - 40px thumb - (2 * 4px padding) = 42px

interface PixelThemeToggleProps {
  className?: string;
}

export function PixelThemeToggle({ className = "" }: PixelThemeToggleProps) {
  // false = Light / Milk (Sun on right, x = 42px), true = Dark / Plum (Moon on left, x = 0px)
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const currentXRef = useRef(MAX_X);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const dragState = useRef({
    active: false,
    startX: 0,
    startThumbX: MAX_X,
    moved: false,
  });

  // Apply theme to document with View Transitions API support
  const applyTheme = useCallback((dark: boolean) => {
    const theme = dark ? "plum" : "milk";
    if (typeof document !== "undefined") {
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

  // Smooth spring sliding physics (Whitespace glass-light-toggle accurate)
  const animateThumb = useCallback((targetX: number, onComplete?: () => void) => {
    if (tweenRef.current) tweenRef.current.kill();

    currentXRef.current = targetX;
    tweenRef.current = gsap.to(thumbRef.current, {
      x: targetX,
      duration: 0.45,
      ease: "back.out(1.4)", // Tactile, satisfying cushion spring
      force3D: true,
      onComplete,
    });
  }, []);

  // Initialize theme from localStorage or document attribute
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
    currentXRef.current = startX;
    if (thumbRef.current) {
      gsap.set(thumbRef.current, { x: startX, force3D: true });
    }
  }, []);

  // Toggle theme action
  const togglePolarity = useCallback(
    (nextDark?: boolean) => {
      const resolvedDark = typeof nextDark === "boolean" ? nextDark : !isDark;
      setIsDark(resolvedDark);
      applyTheme(resolvedDark);
      animateThumb(resolvedDark ? 0 : MAX_X);
    },
    [isDark, applyTheme, animateThumb]
  );

  // Drag Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (tweenRef.current) tweenRef.current.kill();

    dragState.current = {
      active: true,
      startX: e.clientX,
      startThumbX: currentXRef.current,
      moved: false,
    };

    if (thumbRef.current) {
      gsap.to(thumbRef.current, { scale: 1.04, duration: 0.18, ease: "power1.out" });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const deltaX = e.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.current.moved = true;
    }

    const clampedX = Math.max(0, Math.min(MAX_X, dragState.current.startThumbX + deltaX));
    currentXRef.current = clampedX;

    if (thumbRef.current) {
      gsap.set(thumbRef.current, { x: clampedX, force3D: true });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const wasClick = !dragState.current.moved;

    if (thumbRef.current) {
      gsap.to(thumbRef.current, {
        scale: isHovered ? 1.025 : 1,
        duration: 0.22,
        ease: "power2.out",
      });
    }

    if (wasClick) {
      togglePolarity();
    } else {
      const targetDark = currentXRef.current < MAX_X / 2;
      setIsDark(targetDark);
      applyTheme(targetDark);
      animateThumb(targetDark ? 0 : MAX_X);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePolarity();
    }
  };

  return (
    <div
      ref={trackRef}
      role="switch"
      aria-checked={!isDark}
      aria-label={`Theme Polarity Toggle (${isDark ? "Plum / Dark Mode" : "Milk / Light Mode"})`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      style={{ touchAction: "none" }}
      className={`relative w-[90px] h-[46px] rounded-[16px] p-[4px] flex items-center select-none cursor-grab active:cursor-grabbing transition-colors duration-500 overflow-hidden ${className} ${
        isDark
          ? "bg-[#240C20]/95 border border-[rgba(255,243,230,0.15)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7),0_1px_3px_rgba(43,17,38,0.5)]"
          : "bg-[#E6DFD5]/80 border border-black/[0.08] shadow-[inset_0_2px_5px_rgba(56,25,50,0.12),0_1px_2px_rgba(56,25,50,0.04)]"
      }`}
    >
      {/* Ambient Radial Light Spill outside/behind the squircle thumb */}
      <div
        className={`pointer-events-none absolute -inset-2 rounded-[22px] transition-opacity duration-500 blur-[10px] ${
          isDark
            ? "bg-[radial-gradient(circle_at_25%_50%,rgba(140,180,255,0.35),transparent_65%)] opacity-95"
            : "bg-[radial-gradient(circle_at_75%_50%,rgba(255,160,50,0.45),transparent_65%)] opacity-95"
        }`}
      />

      {/* Inner Sliding Squircle Glass Thumb (40px x 38px, rounded-[11px] — Whitespace accurate) */}
      <div
        ref={thumbRef}
        className={`relative z-10 w-[40px] h-[38px] rounded-[11px] flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-b from-[#4A1E43]/90 via-[#381932]/95 to-[#2B1126]/95 shadow-[0_4px_14px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,243,230,0.22)]"
            : "bg-gradient-to-b from-white/95 via-[#FAF6F0]/92 to-[#EBE2D5]/92 shadow-[0_4px_12px_rgba(255,150,40,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,1)]"
        }`}
      >
        {/* Specular Rim Highlight Edge Arc (Warm Amber on Light, Cool Ice-Blue on Dark) */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[11px] transition-all duration-500 ${
            isDark
              ? "border-l-[2px] border-t-[1.5px] border-b-[1.5px] border-r-0 border-[#DCE8FF] shadow-[-3px_0_10px_rgba(165,195,255,0.8),inset_2px_0_6px_rgba(210,230,255,0.5)]"
              : "border-r-[2px] border-t-[1.5px] border-b-[1.5px] border-l-0 border-[#FFA033] shadow-[3px_0_10px_rgba(255,160,50,0.85),inset_-2px_0_6px_rgba(255,170,60,0.6)]"
          }`}
        />

        {/* Micro-Icons Container (Clean SVG Micro-Icons with Smooth Rotation & Fade) */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
          {/* Sun Micro-Icon with 8 Rays (Light Mode) */}
          <div
            style={{
              opacity: isDark ? 0 : 1,
              transform: isDark ? "rotate(-90deg) scale(0.35)" : "rotate(0deg) scale(1)",
              transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="absolute text-[#381932]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" className="stroke-current">
              <circle cx="12" cy="12" r="4.2" fill="#381932" stroke="none" />
              <path
                d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.28 5.28l1.56 1.56M17.16 17.16l1.56 1.56M5.28 18.72l1.56-1.56M17.16 6.84l1.56-1.56"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Crescent Moon & Tiny 4-Point Star Micro-Icon (Dark Mode) */}
          <div
            style={{
              opacity: isDark ? 1 : 0,
              transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.35)",
              transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="absolute text-[#FFF3E6] drop-shadow-[0_0_4px_rgba(220,232,255,0.85)]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M13.2 3.5a8.5 8.5 0 1 0 7.3 7.3 6.8 6.8 0 0 1-7.3-7.3z"
                fill="#FFF3E6"
              />
              {/* 4-point twinkling micro-star */}
              <path
                d="M17.5 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z"
                fill="#DCE8FF"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PixelThemeToggle;
