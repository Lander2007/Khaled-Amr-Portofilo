"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type C = [number, number, number];
type Cell = { x: number; y: number; a: number; c: C; s: number; d: number };

// Brand Palette (Plum & Milk & Electric Lime)
const BRAND_WARM_HI: C = [255, 243, 230]; // #FFF3E6 Warm Milk
const BRAND_LIME_DITHER: C = [195, 240, 85]; // Soft Electric Lime dither on Moon
const BRAND_LIME_STAR: C = [212, 255, 51]; // #D4FF33 Electric Lime Stars
const BRAND_PLUM_DARK: C = [56, 25, 50]; // #381932 Deep Plum Sun Core
const BRAND_PLUM_MID: C = [122, 48, 108]; // Velvet Plum Sun Rays

// Classic Palette (Original Whitespace Yellow & Blue)
const CLASSIC_WARM_HI: C = [255, 250, 238];
const CLASSIC_COOL_DITHER: C = [188, 194, 226];
const CLASSIC_STAR_ICE: C = [240, 244, 255];
const CLASSIC_INK_DARK: C = [52, 44, 38];
const CLASSIC_INK_WARM: C = [118, 102, 88];

const MOON_GRID = [
  ".................",
  ".............s...",
  "............sSs..",
  ".....WWd.....s...",
  "...WWWWd.d.......",
  "..WWWW.d.d.d.....",
  ".WWWWd.d.d.d...s.",
  ".WWWW.d.d.d.d....",
  ".WWWWd.d.d.d.....",
  ".WWWWW.d.d.d.....",
  ".WWWWWW.d.d.d....",
  "..WWWWWWW.d..d...",
  "..WWWWWWWWWWW....",
  "...WWWWWWWWWWW...",
  "....WWWWWWWWW....",
  "......WWWWW......",
  ".................",
];

const SUN_GRID = [
  "........t........",
  "........m........",
  "........r........",
  "...t.........t...",
  "....r.......r....",
  "......c#c#c......",
  ".....#c#d#c#.....",
  ".....c#d#d#c.....",
  "tmr..#d#c#d#..rmt",
  ".....c#d#d#c.....",
  ".....#c#d#c#.....",
  "......c#c#c......",
  "....r.......r....",
  "...t.........t...",
  "........r........",
  "........m........",
  "........t........",
];

function clampNorm(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const buildParticles = (isBrand: boolean) => {
  const WARM_HI = isBrand ? BRAND_WARM_HI : CLASSIC_WARM_HI;
  const COOL_DITHER = isBrand ? BRAND_LIME_DITHER : CLASSIC_COOL_DITHER;
  const STAR_ICE = isBrand ? BRAND_LIME_STAR : CLASSIC_STAR_ICE;
  const INK_DARK = isBrand ? BRAND_PLUM_DARK : CLASSIC_INK_DARK;
  const INK_WARM = isBrand ? BRAND_PLUM_MID : CLASSIC_INK_WARM;

  const parseGrid = (
    rows: string[],
    mapper: (ch: string, x: number, y: number, dist: number) => [number, C, number] | null
  ): Cell[] => {
    const out: Cell[] = [];
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const dist = Math.hypot(x - 8, y - 8);
        const res = mapper(ch, x, y, dist);
        if (res) out.push({ x, y, a: res[0], c: res[1], s: res[2], d: dist });
      });
    });
    return out;
  };

  const M_CELLS = parseGrid(MOON_GRID, (ch) => {
    if (ch === "W") return [1, WARM_HI, 0.88];
    if (ch === "d") return [0.38, COOL_DITHER, 0.76];
    if (ch === "S") return [1, STAR_ICE, 0.92];
    if (ch === "s") return [0.6, STAR_ICE, 0.74];
    return null;
  });

  const S_CELLS = parseGrid(SUN_GRID, (ch) => {
    if (ch === "#") return [1, INK_DARK, 0.88];
    if (ch === "d") return [0.72, INK_WARM, 0.84];
    if (ch === "c") return [0.88, INK_DARK, 0.82];
    if (ch === "r") return [0.94, INK_DARK, 0.84];
    if (ch === "m") return [0.76, INK_WARM, 0.76];
    if (ch === "t") return [0.54, INK_WARM, 0.66];
    return null;
  });

  let seed = 13;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const M_SORTED = [...M_CELLS].sort((a, b) => a.d - b.d);
  const S_SORTED = [...S_CELLS].sort((a, b) => a.d - b.d);
  const TOTAL_PT = Math.max(M_SORTED.length, S_SORTED.length);

  return Array.from({ length: TOTAL_PT }, (_, i) => {
    const A = M_SORTED[i % M_SORTED.length];
    const B = S_SORTED[i % S_SORTED.length];
    const angle = rand() * Math.PI * 2;
    const radius = (0.35 + Math.sqrt(rand()) * 0.65) * 6.4;
    const radialNormB = clampNorm(B.d / 8.5);
    const radialNormA = clampNorm(A.d / 8.5);
    return {
      A,
      B,
      aA: i < M_SORTED.length ? A.a : 0,
      aB: i < S_SORTED.length ? B.a : 0,
      delayToSun: radialNormB * 0.26 + rand() * 0.05,
      delayToMoon: radialNormA * 0.22 + rand() * 0.05,
      sx: Math.cos(angle) * radius,
      sy: Math.sin(angle) * radius,
      phase: rand() * Math.PI * 2,
      speed: (0.8 + rand() * 1.4) * (i % 2 === 0 ? 1 : -1),
    };
  });
};

const BRAND_PARTICLES = buildParticles(true);
const CLASSIC_PARTICLES = buildParticles(false);

const mem = { p: NaN, mp: NaN, a: NaN };

export default function ThemeToggle({
  isDark,
  onToggle,
  size = 44,
  variant = "brand", // Change to "classic" anytime to revert to original yellow/blue!
  respectReducedMotion = false,
}: {
  isDark: boolean;
  onToggle: (nextIsDark: boolean, coords?: { x: number; y: number }) => void;
  size?: number;
  variant?: "brand" | "classic";
  respectReducedMotion?: boolean;
}) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const cur = useRef(isDark ? 0 : 1);
  const cb = useRef(onToggle);
  cb.current = onToggle;

  const api = useRef<{ go: (t: number) => void }>({ go: () => {} });
  const DARK_ANGLE = 192;
  const LIGHT_ANGLE = 42;
  const A0 = Number.isNaN(mem.a) ? (isDark ? DARK_ANGLE : LIGHT_ANGLE) : mem.a;
  const P0 = Number.isNaN(mem.p) ? cur.current : mem.p;

  const st = useRef({
    p: P0,
    v: 0,
    mp: Number.isNaN(mem.mp) ? P0 : mem.mp,
    mv: 0,
    t: cur.current,
    a: A0,
    av: 0,
    at: A0,
    raf: 0,
    last: 0,
    clock: 0,
    down: false,
    drag: false,
    x0: 0,
    p0: 0,
    lx: 0,
    lt: 0,
    vel: 0,
  });

  useEffect(() => {
    const r = rootRef.current!;
    const cv = cvRef.current!;
    const ctx = cv.getContext("2d")!;
    const S = st.current;
    const PTS = variant === "brand" ? BRAND_PARTICLES : CLASSIC_PARTICLES;
    const reduce =
      respectReducedMotion && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const travel = size * 0.83;

    const draw = (timeSec: number) => {
      const d = window.devicePixelRatio || 1;
      const w = size * 0.9;
      const h = size * 0.86;
      const pc = (w * 0.56) / 17;
      const ox = (w - 17 * pc) / 2;
      const oy = (h - 17 * pc) / 2;
      const q = clampNorm(S.mp);
      const goingToSun = S.t === 1 || S.vel > 0;

      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const k of PTS) {
        const dl = goingToSun ? k.delayToSun : k.delayToMoon;
        const u = goingToSun
          ? clampNorm((q - dl) / (1 - dl))
          : 1 - clampNorm((1 - q - dl) / (1 - dl));

        const E = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const midFlight = Math.sin(Math.PI * E);

        const al = lerp(k.aA, k.aB, E) * (1 - 0.32 * midFlight);
        if (al < 0.02) continue;

        const swirlAngle = timeSec * k.speed * 2.2 + k.phase;
        const driftX = Math.cos(swirlAngle) * 1.35 * midFlight;
        const driftY = Math.sin(swirlAngle) * 1.35 * midFlight;

        const x = lerp(k.A.x, k.B.x, E) + k.sx * midFlight + driftX;
        const y = lerp(k.A.y, k.B.y, E) + k.sy * midFlight + driftY;
        const baseScale = lerp(k.A.s, k.B.s, E);
        const z = pc * baseScale * (1 - 0.38 * midFlight);

        const c0 = Math.round(lerp(k.A.c[0], k.B.c[0], E));
        const c1 = Math.round(lerp(k.A.c[1], k.B.c[1], E));
        const c2 = Math.round(lerp(k.A.c[2], k.B.c[2], E));

        if (E < 0.55 && k.aA > 0.7) {
          ctx.shadowColor =
            variant === "brand" ? "rgba(212, 255, 51, 0.75)" : "rgba(255, 242, 215, 0.9)";
          ctx.shadowBlur = pc * d * 2.2 * (1 - E * 1.8);
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(${c0},${c1},${c2},${al.toFixed(3)})`;
        ctx.fillRect(ox + (x + 0.5) * pc - z / 2, oy + (y + 0.5) * pc - z / 2, z, z);
      }
    };

    const fit = () => {
      const d = window.devicePixelRatio || 1;
      cv.width = Math.round(size * 0.9 * d);
      cv.height = Math.round(size * 0.86 * d);
      draw(S.clock);
    };

    const apply = () => {
      mem.p = S.p;
      mem.mp = S.mp;
      mem.a = S.a;
      const q = clampNorm(S.p);
      const rad = (S.a * Math.PI) / 180;
      const set = (k: string, v: string) => r.style.setProperty(k, v);

      set("--p", q.toFixed(4));
      set("--o", clampNorm(S.p, -0.045, 1.045).toFixed(4));
      set("--f", Math.pow(4 * q * (1 - q), 0.85).toFixed(4));
      set("--a", S.a.toFixed(2));
      set("--hx", (Math.sin(rad) * size * 0.25).toFixed(2) + "px");
      set("--hy", (-Math.cos(rad) * size * 0.22).toFixed(2) + "px");
      draw(S.clock);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - S.last) / 1000 || 0.016);
      S.last = now;
      S.clock += dt;

      if (!S.drag) {
        const kP = 185, cP = 2 * Math.sqrt(kP) * 0.82;
        S.v += (-kP * (S.p - S.t) - cP * S.v) * dt;
        S.p += S.v * dt;

        const kM = 115, cM = 2 * Math.sqrt(kM) * 0.88;
        S.mv += (-kM * (S.mp - S.t) - cM * S.mv) * dt;
        S.mp += S.mv * dt;

        const kA = 120, cA = 2 * Math.sqrt(kA) * 0.88;
        S.av += (-kA * (S.a - S.at) - cA * S.av) * dt;
        S.a += S.av * dt;
      } else {
        S.mp += (clampNorm(S.p) - S.mp) * Math.min(1, dt * 14);
        S.a = DARK_ANGLE - (DARK_ANGLE - LIGHT_ANGLE) * clampNorm(S.p);
        S.av = 0;
      }

      apply();

      const rest =
        !S.drag &&
        Math.abs(S.p - S.t) < 0.0006 &&
        Math.abs(S.v) < 0.003 &&
        Math.abs(S.mp - S.t) < 0.0008 &&
        Math.abs(S.mv) < 0.003 &&
        Math.abs(S.a - S.at) < 0.08 &&
        Math.abs(S.av) < 0.15;

      if (rest) {
        S.p = S.t; S.v = 0; S.mp = S.t; S.mv = 0; S.a = S.at; S.av = 0;
        apply();
        S.raf = 0;
      } else {
        S.raf = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (!S.raf) {
        S.last = performance.now();
        S.raf = requestAnimationFrame(tick);
      }
    };

    const go = (t: number) => {
      S.t = t;
      const rest = t ? LIGHT_ANGLE : DARK_ANGLE;
      let dl = (((S.a - rest) % 360) + 360) % 360;
      if (dl > 250) dl -= 360;
      S.at = S.a - dl;
      if (reduce) {
        S.p = t; S.mp = t; S.v = 0; S.mv = 0; S.a = S.at;
        apply();
      } else {
        start();
      }
    };
    api.current.go = go;

    const commit = (t: number) => {
      go(t);
      if (t !== cur.current) {
        cur.current = t;
        let coords: { x: number; y: number } | undefined;
        try {
          const thumbEl = (r.querySelector(".th") as HTMLElement) || r;
          const rect = thumbEl.getBoundingClientRect();
          coords = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        } catch (_) {}
        cb.current(t === 0, coords);
      }
    };

    const dn = (e: PointerEvent) => {
      if (e.button) return;
      S.down = true; S.drag = false;
      S.x0 = S.lx = e.clientX; S.lt = e.timeStamp; S.p0 = S.p; S.vel = 0;
      r.setPointerCapture(e.pointerId);
    };

    const mv = (e: PointerEvent) => {
      if (!S.down) return;
      const dx = e.clientX - S.x0;
      if (!S.drag) {
        if (Math.abs(dx) < 3.5) return;
        S.drag = true; S.v = 0; r.dataset.drag = "1";
        start();
      }
      S.p = clampNorm(S.p0 + dx / travel, -0.045, 1.045);
      const dt = Math.max(1, e.timeStamp - S.lt);
      S.vel = 0.65 * S.vel + 0.35 * ((e.clientX - S.lx) / travel / dt);
      S.lx = e.clientX; S.lt = e.timeStamp;
    };

    const up = (e: PointerEvent) => {
      if (!S.down) return;
      S.down = false;
      try { r.releasePointerCapture(e.pointerId); } catch {}
      const was = S.drag;
      S.drag = false;
      delete r.dataset.drag;
      commit(was ? (clampNorm(S.p) + S.vel * 145 > 0.5 ? 1 : 0) : S.t ? 0 : 1);
    };

    const ck = (e: MouseEvent) => {
      if (e.detail === 0) commit(S.t ? 0 : 1);
    };

    r.addEventListener("pointerdown", dn);
    r.addEventListener("pointermove", mv);
    r.addEventListener("pointerup", up);
    r.addEventListener("pointercancel", up);
    r.addEventListener("click", ck);
    window.addEventListener("resize", fit);

    fit();
    apply();
    if (Math.abs(S.p - cur.current) > 0.001) go(cur.current);

    return () => {
      cancelAnimationFrame(S.raf);
      S.raf = 0;
      r.removeEventListener("pointerdown", dn);
      r.removeEventListener("pointermove", mv);
      r.removeEventListener("pointerup", up);
      r.removeEventListener("pointercancel", up);
      r.removeEventListener("click", ck);
      window.removeEventListener("resize", fit);
    };
  }, [size, variant, respectReducedMotion]);

  useEffect(() => {
    const t = isDark ? 0 : 1;
    cur.current = t;
    if (!st.current.drag && st.current.t !== t) api.current.go(t);
  }, [isDark]);

  const [init0] = useState(() => ({
    "--p": clampNorm(st.current.p),
    "--o": clampNorm(st.current.p, -0.045, 1.045),
    "--f": 0,
    "--a": st.current.a,
    "--hx": "0px",
    "--hy": "0px",
  }));
  const init = { ...init0, "--h": size + "px" } as CSSProperties;

  return (
    <>
      <style>{CSS}</style>
      <button
        ref={rootRef}
        type="button"
        data-variant={variant}
        className="tt"
        role="switch"
        aria-checked={!isDark}
        aria-label="Toggle theme"
        style={init}
      >
        <i className="td" />
        <i className="tl" />
        <span className="th">
          <i className="ha hd" />
          <i className="ha hl" />
          <i className="ha hf" />
          <i className="gd" />
          <i className="gl" />
          <canvas ref={cvRef} className="cv" />
          <span className="aw awd"><i className="arc ad" /></span>
          <span className="aw awl"><i className="arc al" /></span>
          <span className="aw awf"><i className="arc af" /></span>
        </span>
      </button>
    </>
  );
}

const CSS = `
@property --d{syntax:"<angle>";inherits:true;initial-value:0deg}
@keyframes tt-d{from{--d:-14deg}to{--d:14deg}}
.tt{
  --r-track: 6px; /* Sharp architectural track corners (set to 0px for 90° brutalist corners) */
  --r-thumb: 4px; /* Sharp inner thumb & rim light corners (set to 0px for 90° brutalist corners) */
  appearance:none;border:0;padding:0;margin:0;background:none;position:relative;display:block;flex:none;width:calc(var(--h)*1.91);height:var(--h);cursor:grab;touch-action:pan-y;user-select:none;-webkit-tap-highlight-color:transparent;overflow:visible;isolation:isolate;
  view-transition-name:theme-toggle-pill;
}
.tt[data-drag]{cursor:grabbing}
.tt:focus-visible{outline:2px solid #D4FF33;outline-offset:5px;border-radius:var(--r-track)}
.tt i,.tt span{display:block;transition:none!important}
.td,.tl,.gd,.gl{position:absolute;inset:0}
.td,.tl{border-radius:var(--r-track)}
.gd,.gl{border-radius:inherit}

/* ================= BRAND VARIANT (PLUM LIGHT + ELECTRIC LIME DARK) ================= */
.tt[data-variant="brand"] .td{background:linear-gradient(180deg,#08080b,#121116);box-shadow:inset 0 3px 8px rgba(0,0,0,.95),inset 0 0 0 1px rgba(255,243,230,.07),0 1px 0 rgba(255,243,230,.06),0 0 24px rgba(212,255,51,.14);opacity:calc(1 - var(--p))}
.tt[data-variant="brand"] .tl{background:linear-gradient(180deg,#e5dacd,#f2e7da);box-shadow:inset 0 2px 5px rgba(56,25,50,.14),inset 0 -1px 0 rgba(255,255,255,.85),0 1px 2px rgba(255,255,255,.8),0 8px 20px rgba(56,25,50,.1);opacity:var(--p)}

/* Dark Thumb: Obsidian Glass with Electric Lime (#D4FF33) Refraction */
.tt[data-variant="brand"] .gd{background:radial-gradient(115% 95% at 22% 96%,rgba(212,255,51,.55),rgba(155,205,25,.22) 44%,transparent 72%),linear-gradient(180deg,rgba(62,60,68,.62),rgba(26,24,32,.78) 58%,rgba(72,88,24,.58));border:1px solid rgba(255,243,230,.2);box-shadow:inset 0 1px 0 rgba(255,243,230,.35),inset 0 -8px 14px -4px rgba(212,255,51,.65),0 8px 16px rgba(0,0,0,.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:calc(1 - var(--p))}

/* Light Thumb: Warm Milk Glass with Velvet Plum (#381932 -> #9E3589) Refraction */
.tt[data-variant="brand"] .gl{background:radial-gradient(125% 100% at 88% 10%,rgba(148,45,128,.62),rgba(56,25,50,.32) 38%,transparent 72%),linear-gradient(195deg,#fffcf8 0%,#f7ede1 58%,#eadbc9 100%);border:1px solid rgba(255,255,255,.88);box-shadow:inset 1.5px -1.5px 2px #fff,inset -1px 1px 3px rgba(120,38,105,.38),-6px 7px 14px rgba(56,25,50,.16),0 2px 5px rgba(56,25,50,.08);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:var(--p)}

/* Brand Halos */
.tt[data-variant="brand"] .hd{background:radial-gradient(closest-side,rgba(212,255,51,.58),rgba(175,225,30,.2) 55%,transparent);opacity:calc(1 - var(--p))}
.tt[data-variant="brand"] .hl{background:radial-gradient(closest-side,rgba(135,40,118,.62),rgba(56,25,50,.24) 55%,transparent);opacity:var(--p)}
.tt[data-variant="brand"] .hf{background:radial-gradient(closest-side,rgba(255,140,95,.75),rgba(212,255,51,.3) 58%,transparent);opacity:var(--f)}

/* Brand Rim Glow Filters */
.tt[data-variant="brand"] .awd{filter:drop-shadow(0 0 3px rgba(240,255,170,.95)) drop-shadow(0 0 9px rgba(212,255,51,.92)) drop-shadow(0 0 16px rgba(175,230,20,.62));opacity:calc(1 - var(--p))}
.tt[data-variant="brand"] .awl{filter:drop-shadow(0 0 3px rgba(215,110,195,.95)) drop-shadow(0 0 9px rgba(128,38,112,.92)) drop-shadow(0 0 18px rgba(56,25,50,.7));opacity:var(--p)}
.tt[data-variant="brand"] .awf{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 11px rgba(212,255,51,.9)) drop-shadow(0 0 20px rgba(148,45,128,.75));opacity:var(--f)}

/* Brand Rim Conic Colors */
.tt[data-variant="brand"] .ad{--c1:rgba(212,255,51,.92);--c2:#f7ffdb}
.tt[data-variant="brand"] .al{--c1:rgba(138,42,120,.95);--c2:#381932}
.tt[data-variant="brand"] .af{--c1:rgba(212,255,51,.95);--c2:#FFF3E6}

/* ================= CLASSIC VARIANT (ORIGINAL YELLOW + BLUE) ================= */
.tt[data-variant="classic"] .td{background:linear-gradient(180deg,#09090c,#121318);box-shadow:inset 0 3px 8px rgba(0,0,0,.95),inset 0 0 0 1px rgba(255,255,255,.05),0 1px 0 rgba(255,255,255,.07),0 0 26px rgba(95,115,255,.16);opacity:calc(1 - var(--p))}
.tt[data-variant="classic"] .tl{background:linear-gradient(180deg,#e3e1dc,#eceae6);box-shadow:inset 0 2px 5px rgba(0,0,0,.1),inset 0 -1px 0 rgba(255,255,255,.9),0 1px 2px rgba(255,255,255,.8),0 8px 20px rgba(0,0,0,.09);opacity:var(--p)}
.tt[data-variant="classic"] .gd{background:radial-gradient(115% 95% at 22% 96%,rgba(135,155,255,.68),rgba(95,110,235,.28) 42%,transparent 72%),linear-gradient(180deg,rgba(78,82,100,.62),rgba(42,44,58,.72) 58%,rgba(68,78,155,.65));border:1px solid rgba(255,255,255,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.38),inset 0 -8px 14px -4px rgba(145,165,255,.75),0 8px 16px rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:calc(1 - var(--p))}
.tt[data-variant="classic"] .gl{background:radial-gradient(125% 100% at 88% 10%,#ffbe55,rgba(255,192,95,.58) 36%,transparent 72%),linear-gradient(195deg,#ffffff 0%,#f7f5f0 58%,#eae7e1 100%);border:1px solid rgba(255,255,255,.88);box-shadow:inset 1.5px -1.5px 2px #fff,inset -1px 1px 3px rgba(255,180,60,.45),-6px 7px 14px rgba(0,0,0,.14),0 2px 5px rgba(0,0,0,.08);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:var(--p)}
.tt[data-variant="classic"] .hd{background:radial-gradient(closest-side,rgba(115,135,255,.65),rgba(90,110,255,.22) 55%,transparent);opacity:calc(1 - var(--p))}
.tt[data-variant="classic"] .hl{background:radial-gradient(closest-side,rgba(255,168,38,.72),rgba(255,150,20,.25) 55%,transparent);opacity:var(--p)}
.tt[data-variant="classic"] .hf{background:radial-gradient(closest-side,rgba(255,215,195,.82),rgba(255,180,155,.3) 58%,transparent);opacity:var(--f)}
.tt[data-variant="classic"] .awd{filter:drop-shadow(0 0 3px rgba(200,215,255,.95)) drop-shadow(0 0 9px rgba(110,130,255,.95)) drop-shadow(0 0 16px rgba(95,115,255,.65));opacity:calc(1 - var(--p))}
.tt[data-variant="classic"] .awl{filter:drop-shadow(0 0 3px rgba(255,230,130,.95)) drop-shadow(0 0 9px rgba(255,160,30,.92)) drop-shadow(0 0 18px rgba(255,140,15,.6));opacity:var(--p)}
.tt[data-variant="classic"] .awf{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 11px rgba(255,205,185,.95)) drop-shadow(0 0 20px rgba(255,175,145,.75));opacity:var(--f)}
.tt[data-variant="classic"] .ad{--c1:rgba(165,185,255,.85);--c2:#ffffff}
.tt[data-variant="classic"] .al{--c1:rgba(255,185,55,.9);--c2:#fff7d6}
.tt[data-variant="classic"] .af{--c1:rgba(255,205,185,.95);--c2:#ffffff}

/* ================= SHARED GEOMETRY ================= */
.th{position:absolute;left:calc(var(--h)*.07);top:calc(var(--h)*.07);width:calc(var(--h)*.9);height:calc(var(--h)*.86);border-radius:var(--r-thumb);transform:translate3d(calc(var(--o)*var(--h)*.83),0,0);will-change:transform}
.cv{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2}
.ha{position:absolute;z-index:-1;left:50%;top:50%;width:175%;height:175%;border-radius:50%;pointer-events:none;filter:blur(12px);transform:translate3d(calc(-50% + var(--hx)),calc(-50% + var(--hy)),0)}
.aw{position:absolute;inset:-2px;pointer-events:none;z-index:3}
.arc{position:absolute;inset:0;border-radius:calc(var(--r-thumb) + 2px);padding:1.75px;background:conic-gradient(from calc(var(--a)*1deg + var(--d) - 62deg),transparent 0deg,var(--c1) 28deg,var(--c2) 62deg,var(--c1) 96deg,transparent 124deg,transparent 360deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;animation:tt-d 3.2s ease-in-out infinite alternate}
`;