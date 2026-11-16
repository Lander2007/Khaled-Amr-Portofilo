"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// =========================================================================
// 1. EXACT BITMAP SPECIFICATIONS FROM WHITESPACE EXPERIMENT
// =========================================================================
// Moon: 15x15 bitmap placed at grid offset (1, 1) on a 17x17 grid
// W = bright #fff4e0 with warm glow
// d = dim dither cell #c9cbe8 at alpha 0.30
// S = sparkle bright #e8ebff alpha 0.90
// x = sparkle dim alpha 0.45
const MOON_MAP = [
  ".........d...x.",
  "............xSx",
  "....WWd.d....x.",
  "..WWWd.d.d.....",
  ".WWWW.d.d.d....",
  ".WWW.d.d.d.d..S",
  "WWWWd.d.d.d.d..",
  "WWWWWd.d.d.d...",
  "WWWWW.d.d.d.d..",
  "WWWWWW.d.d.d...",
  "WWWWWWW.d...d..",
  ".WWWWWWWWWWW...",
  ".WWWWWWWWWWW...",
  "..WWWWWWWWW....",
  "....WWWWW......",
];

// Sun: 17x17 bitmap placed at grid offset (0, 0)
// '#' = pixel, color #4a4038 (rays ~80% alpha)
const SUN_MAP = [
  "........#........",
  "........#........",
  "........#........",
  "...#.........#...",
  "....#.......#....",
  "......#####......",
  ".....#######.....",
  ".....#######.....",
  "###..#######..###",
  ".....#######.....",
  ".....#######.....",
  "......#####......",
  "....#.......#....",
  "...#.........#...",
  "........#........",
  "........#........",
  "........#........",
];

interface PixelDef {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  glow?: boolean;
  isRay?: boolean;
}

interface LiveParticle {
  curX: number;
  curY: number;
  curScale: number;
  curR: number;
  curG: number;
  curB: number;
  curA: number;
  glow?: boolean;

  startX: number;
  startY: number;
  startR: number;
  startG: number;
  startB: number;
  startA: number;

  scatterX: number;
  scatterY: number;

  targetX: number;
  targetY: number;
  targetR: number;
  targetG: number;
  targetB: number;
  targetA: number;
  isRay?: boolean;
  hasTarget: boolean;
}

function getMoonPixels(iconW: number, cx: number, cy: number): PixelDef[] {
  const pitch = iconW / 17;
  const startX = cx - (17 * pitch) / 2;
  const startY = cy - (17 * pitch) / 2;
  const pixels: PixelDef[] = [];

  for (let r = 0; r < MOON_MAP.length; r++) {
    const rowStr = MOON_MAP[r];
    for (let c = 0; c < rowStr.length; c++) {
      const ch = rowStr[c];
      if (ch === ".") continue;
      const gx = c + 1;
      const gy = r + 1;
      const px = startX + gx * pitch;
      const py = startY + gy * pitch;

      if (ch === "W") {
        pixels.push({ x: px, y: py, r: 255, g: 244, b: 224, a: 1.0, glow: true });
      } else if (ch === "d") {
        pixels.push({ x: px, y: py, r: 201, g: 203, b: 232, a: 0.3 });
      } else if (ch === "S") {
        pixels.push({ x: px, y: py, r: 232, g: 235, b: 255, a: 0.9, glow: true });
      } else if (ch === "x") {
        pixels.push({ x: px, y: py, r: 232, g: 235, b: 255, a: 0.45 });
      }
    }
  }
  return pixels;
}

function getSunPixels(iconW: number, cx: number, cy: number): PixelDef[] {
  const pitch = iconW / 17;
  const startX = cx - (17 * pitch) / 2;
  const startY = cy - (17 * pitch) / 2;
  const pixels: PixelDef[] = [];

  for (let r = 0; r < SUN_MAP.length; r++) {
    const rowStr = SUN_MAP[r];
    for (let c = 0; c < rowStr.length; c++) {
      const ch = rowStr[c];
      if (ch !== "#") continue;
      const px = startX + c * pitch;
      const py = startY + r * pitch;
      const isCore = r >= 5 && r <= 11 && c >= 5 && c <= 11;

      if (isCore) {
        pixels.push({ x: px, y: py, r: 74, g: 64, b: 56, a: 1.0, isRay: false });
      } else {
        pixels.push({ x: px, y: py, r: 74, g: 64, b: 56, a: 0.8, isRay: true });
      }
    }
  }
  return pixels;
}

interface PixelThemeToggleProps {
  className?: string;
}

export function PixelThemeToggle({ className = "" }: PixelThemeToggleProps) {
  // false = Light / Milk (Sun on right), true = Dark / Plum (Moon on left)
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  const animStateRef = useRef<{
    startTime: number;
    particles: LiveParticle[];
    fromDark: boolean;
    toDark: boolean;
    startAngle: number;
    targetAngle: number;
  } | null>(null);

  const rafRef = useRef<number | null>(null);

  // Apply theme to document with buttery-smooth DOM CSS transition
  const applyTheme = useCallback((dark: boolean) => {
    const theme = dark ? "plum" : "milk";
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    try {
      localStorage.setItem("portfolio-polarity-theme", theme);
    } catch (_) {}
  }, []);

  // Draw static icon when resting
  const drawRestingIcon = useCallback((dark: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const w = canvas.clientWidth || 41;
    const h = canvas.clientHeight || 39;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const iconW = w * 0.52;
    const cellPitch = iconW / 17;
    const cellSize = cellPitch * 0.85;
    const cx = w / 2;
    const cy = h / 2;

    const pixels = dark ? getMoonPixels(iconW, cx, cy) : getSunPixels(iconW, cx, cy);

    for (const p of pixels) {
      if (p.glow) {
        ctx.save();
        ctx.shadowColor = "rgba(255, 236, 200, 0.7)";
        ctx.shadowBlur = 4;
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a})`;
        ctx.fillRect(p.x, p.y, cellSize, cellSize);
        ctx.restore();
      }
      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a})`;
      ctx.fillRect(p.x, p.y, cellSize, cellSize);
    }

    ctx.restore();
  }, []);

  // Initialize theme from storage or document
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
    requestAnimationFrame(() => {
      drawRestingIcon(initialDark);
    });
  }, [drawRestingIcon]);

  // Window resize handler to maintain sharp DPR on canvas
  useEffect(() => {
    const handleResize = () => {
      if (!animStateRef.current) {
        drawRestingIcon(isDark);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDark, drawRestingIcon]);

  // Tab visibility: pause RAF if tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Start 600ms particle & arc transition
  const startTransition = useCallback(
    (toDark: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const w = canvas.clientWidth || 41;
      const h = canvas.clientHeight || 39;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const iconW = w * 0.52;
      const cellPitch = iconW / 17;
      const cellSize = cellPitch * 0.85;
      const cx = w / 2;
      const cy = h / 2;

      const fromDark = !toDark;
      const sourcePixels = fromDark ? getMoonPixels(iconW, cx, cy) : getSunPixels(iconW, cx, cy);
      const targetPixels = toDark ? getMoonPixels(iconW, cx, cy) : getSunPixels(iconW, cx, cy);

      // Check if rapid click happened while mid-animation: reuse current particle positions
      const existingParticles = animStateRef.current?.particles;
      const maxLen = Math.max(sourcePixels.length, targetPixels.length);
      const particles: LiveParticle[] = [];

      for (let i = 0; i < maxLen; i++) {
        const src = sourcePixels[i];
        const dst = targetPixels[i];
        const existing = existingParticles?.[i];

        const angle = Math.random() * Math.PI * 2;
        const dist = (0.2 + Math.random() * 0.45) * iconW;
        const scatX = cx + Math.cos(angle) * dist;
        const scatY = cy + Math.sin(angle) * dist;

        const startX = existing ? existing.curX : src ? src.x : scatX;
        const startY = existing ? existing.curY : src ? src.y : scatY;
        const startR = existing ? existing.curR : src ? src.r : dst ? dst.r : 255;
        const startG = existing ? existing.curG : src ? src.g : dst ? dst.g : 255;
        const startB = existing ? existing.curB : src ? src.b : dst ? dst.b : 255;
        const startA = existing ? existing.curA : src ? src.a : 0;

        const targetX = dst ? dst.x : scatX;
        const targetY = dst ? dst.y : scatY;
        const targetR = dst ? dst.r : startR;
        const targetG = dst ? dst.g : startG;
        const targetB = dst ? dst.b : startB;
        const targetA = dst ? dst.a : 0;

        particles.push({
          curX: startX,
          curY: startY,
          curScale: existing ? existing.curScale : 1.0,
          curR: startR,
          curG: startG,
          curB: startB,
          curA: startA,
          glow: src ? src.glow : dst?.glow,

          startX,
          startY,
          startR,
          startG,
          startB,
          startA,

          scatterX: scatX,
          scatterY: scatY,

          targetX,
          targetY,
          targetR,
          targetG,
          targetB,
          targetA,
          isRay: dst?.isRay || false,
          hasTarget: !!dst,
        });
      }

      // Resting angles:
      // Dark Mode (bottom-centered): 180° - 60° = 120°
      // Light Mode (top/top-right): 45° - 60° = -15° = 345°
      const startAngle = toDark ? 345 : 120;
      const targetAngle = toDark ? 120 : -15;

      animStateRef.current = {
        startTime: performance.now(),
        particles,
        fromDark,
        toDark,
        startAngle,
        targetAngle,
      };

      setIsAnimating(true);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const DURATION = 600;

      const frame = (now: number) => {
        if (!animStateRef.current) return;
        const elapsed = now - animStateRef.current.startTime;
        const t = Math.min(DURATION, elapsed);
        const p = t / DURATION;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, w, h);

          // Update & draw particles
          for (const pt of animStateRef.current.particles) {
            if (t <= 150) {
              // 0-150ms: Scatter into cloud
              const u = t / 150;
              const easeOut = 1 - Math.pow(1 - u, 3);
              pt.curX = pt.startX + (pt.scatterX - pt.startX) * easeOut;
              pt.curY = pt.startY + (pt.scatterY - pt.startY) * easeOut;
              pt.curScale = 1.0 - 0.4 * easeOut;
              pt.curA = pt.startA * (1.0 - 0.35 * easeOut);
              pt.curR = pt.startR;
              pt.curG = pt.startG;
              pt.curB = pt.startB;
            } else {
              // 150-600ms: Converge into new icon positions
              if (!pt.hasTarget) {
                const fadeProgress = Math.min(1, (t - 150) / 180);
                pt.curA = pt.startA * 0.65 * (1 - fadeProgress);
                pt.curScale = 0.6;
              } else {
                // Sun rays arrive last (delayed start)
                const convStart = pt.isRay ? 270 : 150;
                const convEnd = pt.isRay ? 600 : 540;

                if (t < convStart) {
                  pt.curScale = 0.6;
                  pt.curA = pt.startA * 0.65;
                } else {
                  const u = Math.min(1, (t - convStart) / (convEnd - convStart));
                  const easeInOut = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
                  pt.curX = pt.scatterX + (pt.targetX - pt.scatterX) * easeInOut;
                  pt.curY = pt.scatterY + (pt.targetY - pt.scatterY) * easeInOut;
                  pt.curScale = 0.6 + 0.4 * easeInOut;
                  pt.curA = pt.startA * 0.65 + (pt.targetA - pt.startA * 0.65) * easeInOut;
                  pt.curR = pt.startR + (pt.targetR - pt.startR) * easeInOut;
                  pt.curG = pt.startG + (pt.targetG - pt.startG) * easeInOut;
                  pt.curB = pt.startB + (pt.targetB - pt.startB) * easeInOut;
                }
              }
            }

            if (pt.curA > 0.01) {
              const sz = cellSize * pt.curScale;
              const off = (cellSize - sz) / 2;

              if (pt.glow && pt.curA > 0.3) {
                ctx.save();
                ctx.shadowColor = "rgba(255, 236, 200, 0.7)";
                ctx.shadowBlur = 4 * pt.curScale;
                ctx.fillStyle = `rgba(${Math.round(pt.curR)}, ${Math.round(pt.curG)}, ${Math.round(pt.curB)}, ${(pt.curA * 0.8).toFixed(3)})`;
                ctx.fillRect(pt.curX + off, pt.curY + off, sz, sz);
                ctx.restore();
              }

              ctx.fillStyle = `rgba(${Math.round(pt.curR)}, ${Math.round(pt.curG)}, ${Math.round(pt.curB)}, ${pt.curA.toFixed(3)})`;
              ctx.fillRect(pt.curX + off, pt.curY + off, sz, sz);
            }
          }

          ctx.restore();
        }

        // Update Arc Angle & Color
        const arcEl = arcRef.current;
        const bloomEl = bloomRef.current;
        if (arcEl && bloomEl) {
          const easeInOut = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const curAngle =
            animStateRef.current.startAngle +
            (animStateRef.current.targetAngle - animStateRef.current.startAngle) * easeInOut;

          // Arc Color transition: flash white-pink (#ffe6f2) mid-flight, settle into target
          let coreColor = "#ffe6f2";
          let bloomColor = "rgba(255, 230, 242, 0.85)";
          let tailColor = "rgba(255, 215, 235, 0.4)";

          if (p < 0.25) {
            coreColor = toDark ? "#ffd34a" : "#d7dcff";
            bloomColor = toDark ? "rgba(255, 165, 30, 0.5)" : "rgba(111, 124, 255, 0.6)";
            tailColor = toDark ? "rgba(248, 180, 72, 0.4)" : "rgba(111, 124, 255, 0.35)";
          } else if (p > 0.7) {
            coreColor = toDark ? "#d7dcff" : "#ffd34a";
            bloomColor = toDark ? "rgba(111, 124, 255, 0.6)" : "rgba(255, 165, 30, 0.5)";
            tailColor = toDark ? "rgba(111, 124, 255, 0.4)" : "rgba(248, 180, 72, 0.45)";
          }

          arcEl.style.setProperty("--arc-angle", `${curAngle.toFixed(1)}deg`);
          arcEl.style.setProperty("--arc-core", coreColor);
          arcEl.style.setProperty("--arc-tail", tailColor);

          bloomEl.style.setProperty("--arc-angle", `${curAngle.toFixed(1)}deg`);
          bloomEl.style.setProperty("--arc-bloom", bloomColor);
          bloomEl.style.setProperty("--arc-tail", tailColor);
        }

        if (t < DURATION) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          animStateRef.current = null;
          setIsAnimating(false);
          drawRestingIcon(toDark);
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    },
    [drawRestingIcon]
  );

  // Toggle Action
  const togglePolarity = useCallback(
    (forcedDark?: boolean) => {
      const nextDark = typeof forcedDark === "boolean" ? forcedDark : !isDark;
      setIsDark(nextDark);
      applyTheme(nextDark);

      const prefersReduced =
        typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-reduced-motion") === "true";

      if (prefersReduced) {
        drawRestingIcon(nextDark);
      } else {
        startTransition(nextDark);
      }
    },
    [isDark, applyTheme, drawRestingIcon, startTransition]
  );

  // Keyboard accessibility (Space / Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePolarity();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={`Theme Polarity Toggle (${isDark ? "Plum / Dark Mode" : "Milk / Light Mode"})`}
      tabIndex={0}
      onClick={() => togglePolarity()}
      onKeyDown={handleKeyDown}
      className={`relative select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF33] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
      style={{
        width: "var(--track-w)",
        height: "var(--track-h)",
      }}
    >
      {/* ============================================================== */}
      {/* 0. CSS VARIABLES & KEYFRAME STYLES                              */}
      {/* ============================================================== */}
      <style>{`
        :root, [role="switch"] {
          --h: 46px;
          --track-w: calc(1.91 * var(--h));
          --track-h: var(--h);
          --track-r: calc(0.38 * var(--h));
          --thumb-w: calc(0.90 * var(--h));
          --thumb-h: calc(0.86 * var(--h));
          --thumb-r: calc(0.27 * var(--h));
          --thumb-inset-left: calc(0.07 * var(--h));
          --thumb-inset-top: calc(0.07 * var(--h));
          --thumb-travel: calc(0.83 * var(--h));
        }

        @keyframes arc-idle-drift {
          0%, 100% {
            transform: rotate(-18deg);
          }
          50% {
            transform: rotate(18deg);
          }
        }

        .neon-arc-drift-active {
          animation: arc-idle-drift 3s ease-in-out infinite;
        }

        .neon-arc-ring {
          position: absolute;
          inset: -1.5px;
          border-radius: calc(var(--thumb-r) + 1.5px);
          padding: 1.5px;
          box-sizing: border-box;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      {/* ============================================================== */}
      {/* 1. AMBIENT HALO & BLOOM LAYERS (NON-INTERACTIVE, OUTSIDE TRACK) */}
      {/* ============================================================== */}
      {/* Light Mode: Soft Amber Halo above the thumb bleeding onto page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3.5 right-0 w-[64px] h-[64px] rounded-full blur-[12px] transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 175, 45, 0.45) 0%, rgba(255, 160, 30, 0.16) 45%, transparent 70%)",
          opacity: isDark ? 0 : 1,
        }}
      />

      {/* Dark Mode: Faint Lavender Bloom around the track */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--track-r)] blur-[14px] transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 25% 60%, rgba(111, 124, 255, 0.32) 0%, rgba(111, 124, 255, 0.08) 50%, transparent 75%)",
          opacity: isDark ? 1 : 0,
        }}
      />

      {/* ============================================================== */}
      {/* 2. OUTER TRACK (SURFACE & INSET SHADOWS)                       */}
      {/* ============================================================== */}
      <div
        className="relative w-full h-full rounded-[var(--track-r)] overflow-hidden transition-all duration-500"
        style={{
          borderRadius: "var(--track-r)",
        }}
      >
        {/* Dark Track Surface: Near-black #0a090c, 1px border rgba(255,255,255,.06), deep inset */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundColor: "#0a090c",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "var(--track-r)",
            boxShadow:
              "inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 16px rgba(111, 124, 255, 0.12)",
            opacity: isDark ? 1 : 0,
          }}
        />

        {/* Light Track Surface: Soft off-white raised surface, #ebe9e5 -> #e2e0dc */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "linear-gradient(to bottom, #ebe9e5, #e2e0dc)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
            borderRadius: "var(--track-r)",
            boxShadow:
              "inset 0 1px 0 #ffffff, inset 0 -2px 6px rgba(0, 0, 0, 0.08), 0 8px 18px rgba(0, 0, 0, 0.12)",
            opacity: isDark ? 0 : 1,
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* 3. SLIDING THUMB (FROSTED GLASS SQUIRCLE)                      */}
      {/* ============================================================== */}
      <div
        className="absolute transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          top: "var(--thumb-inset-top)",
          left: "var(--thumb-inset-left)",
          width: "var(--thumb-w)",
          height: "var(--thumb-h)",
          borderRadius: "var(--thumb-r)",
          transform: `translateX(${isDark ? "0px" : "var(--thumb-travel)"})`,
        }}
      >
        {/* Dark Mode Thumb: Frosted glass blur(6px), grayish #4a4c58 at 45% -> lavender #6f7cff, inner glow */}
        <div
          className="absolute inset-0 rounded-[var(--thumb-r)] transition-opacity duration-500 backdrop-blur-[6px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(74, 76, 88, 0.45), rgba(111, 124, 255, 0.55))",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -10px 14px -6px rgba(130, 140, 255, 0.7), 0 4px 12px rgba(0, 0, 0, 0.5)",
            opacity: isDark ? 1 : 0,
          }}
        />

        {/* Light Mode Thumb: Gradient #ffffff -> #efede9 -> #ebebe6, amber radial glow top-right, soft gray shadow */}
        <div
          className="absolute inset-0 rounded-[var(--thumb-r)] transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, #f9c666 0%, #f9d9ab 35%, transparent 70%), linear-gradient(to bottom, #ffffff, #efede9, #ebebe6)",
            boxShadow:
              "calc(0.04 * var(--h)) calc(0.04 * var(--h)) calc(0.05 * var(--h)) rgba(0, 0, 0, 0.2), inset 0 1px 1px #ffffff",
            opacity: isDark ? 0 : 1,
          }}
        />

        {/* ============================================================ */}
        {/* 4. NEON ARC (GLOWING THIN RING & BLOOM AROUND THUMB OUTLINE) */}
        {/* ============================================================ */}
        <div
          className={`pointer-events-none absolute inset-0 ${
            isAnimating ? "" : "neon-arc-drift-active"
          }`}
          style={{ transformOrigin: "center" }}
        >
          {/* Bloom Layer */}
          <div
            ref={bloomRef}
            className="neon-arc-ring"
            style={
              {
                filter: "blur(8px)",
                background: `conic-gradient(from var(--arc-angle, ${
                  isDark ? "120deg" : "345deg"
                }), transparent 0deg, var(--arc-tail, ${
                  isDark ? "rgba(111,124,255,0.4)" : "rgba(248,180,72,0.45)"
                }) 25deg, var(--arc-bloom, ${
                  isDark ? "rgba(111,124,255,0.6)" : "rgba(255,165,30,0.5)"
                }) 60deg, var(--arc-tail, ${
                  isDark ? "rgba(111,124,255,0.4)" : "rgba(248,180,72,0.45)"
                }) 95deg, transparent 120deg, transparent 360deg)`,
                opacity: 0.85,
              } as React.CSSProperties
            }
          />

          {/* Razor-sharp 1.5px Core Ring */}
          <div
            ref={arcRef}
            className="neon-arc-ring"
            style={
              {
                background: `conic-gradient(from var(--arc-angle, ${
                  isDark ? "120deg" : "345deg"
                }), transparent 0deg, var(--arc-tail, ${
                  isDark ? "rgba(111,124,255,0.4)" : "rgba(248,180,72,0.45)"
                }) 25deg, var(--arc-core, ${
                  isDark ? "#d7dcff" : "#ffd34a"
                }) 60deg, var(--arc-tail, ${
                  isDark ? "rgba(111,124,255,0.4)" : "rgba(248,180,72,0.45)"
                }) 95deg, transparent 120deg, transparent 360deg)`,
              } as React.CSSProperties
            }
          />
        </div>

        {/* ============================================================ */}
        {/* 5. CANVAS PIXEL ICONS (CRISP 17x17 SQUARES + SCATTER ENGINE) */}
        {/* ============================================================ */}
        <canvas
          ref={canvasRef}
          className="relative z-10 w-full h-full pointer-events-none"
        />
      </div>
    </button>
  );
}

export default PixelThemeToggle;
