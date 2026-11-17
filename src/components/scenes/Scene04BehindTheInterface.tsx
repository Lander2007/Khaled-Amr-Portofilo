"use client";

import { Gauge } from "lucide-react";
import CursorSpotlight from "@/components/motion/CursorSpotlight";

export default function Scene04BehindTheInterface() {
  const skillGroups = [
    {
      num: "01",
      title: "Frontend Architecture",
      subtitle: "Component systems & type contracts",
      skills: [
        { name: "Next.js (App Router)", detail: "Server components, streaming SSR, parallel routes" },
        { name: "React 19 & TypeScript", detail: "Strict generics, custom hooks, predictable state" },
        { name: "Vanilla CSS & Tailwind", detail: "Fluid clamp tokens, CSS variables, subgrid layouts" },
        { name: "Semantic HTML5 & ARIA", detail: "Screen reader tree, tab traps, accessible landmarks" },
      ],
    },
    {
      num: "02",
      title: "Interaction & Motion",
      subtitle: "Hardware-accelerated kinetics",
      skills: [
        { name: "GSAP & ScrollTrigger", detail: "gsap.context() lifecycle, scrub pinning, multi-timelines" },
        { name: "Three.js & WebGL", detail: "Custom GLSL vertex/fragment shaders, scene optimization" },
        { name: "Web Audio API", detail: "Real-time frequency analysers, generative audio kinetics" },
        { name: "SVG Path Morphing", detail: "Fluid contour geometry, responsive mathematical viewBoxes" },
      ],
    },
    {
      num: "03",
      title: "Spatial & Bilingual Systems",
      subtitle: "Bi-directional RTL/LTR layouts",
      skills: [
        { name: "Native Arabic RTL Engine", detail: "Logical CSS properties (inline-start, inline-end)" },
        { name: "Optical Typography", detail: "Dynamic Arabic leading adjustment, curated font pairings" },
        { name: "Fluid Mathematical Scaling", detail: "Viewport clamp() algorithms, responsive typography matrices" },
        { name: "Internationalization (i18n)", detail: "Locale-aware route segment resolution & currency formatters" },
      ],
    },
    {
      num: "04",
      title: "Engineering Discipline",
      subtitle: "Performance & runtime standards",
      skills: [
        { name: "Zero CLS Layout Stability", detail: "Fixed aspect containers, priority asset preloading" },
        { name: "GPU Layer Compositing", detail: "Strict transform/opacity exclusivity, will-change discipline" },
        { name: "Accessibility Standards", detail: "prefers-reduced-motion, keyboard navigation, high contrast" },
        { name: "Testing & Profiling", detail: "Vitest, Chrome DevTools Performance audits, FPS stability" },
      ],
    },
  ];

  return (
    <>
      {/* ============================================================== */}
      {/* 01. ABOUT KHALED AMR — THE HUMAN IDENTITY & EDITORIAL INTRO   */}
      {/* ============================================================== */}
      <section
        id="about"
        className="relative w-full bg-[var(--bg-canvas)] text-[var(--ink-primary)] border-b border-[var(--border-hairline)] overflow-hidden"
      >
        {/* Background Architectural Grid Lines */}
        <div className="absolute inset-0 pointer-events-none bg-grid-milk opacity-20 z-0" />

        <CursorSpotlight className="relative z-10 py-20 sm:py-28 px-6 sm:px-12 md:px-16">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase">
              <span className="w-2.5 h-2.5 bg-[#D4FF33] inline-block shadow-[0_0_8px_rgba(212,255,51,0.5)]" />
              <span className="text-[var(--ink-primary)] font-bold">ABOUT ME</span>
              <span className="opacity-40">&bull; KHALED AMR</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6 space-y-4">
                <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-[var(--ink-primary)]">
                  THE PERSON.
                  <br />
                  <span className="font-serif italic font-normal lowercase tracking-normal text-[#D4FF33]">
                    the engineering
                  </span>{" "}
                  ETHOS.
                </h2>
                <p className="font-serif italic text-2xl sm:text-3xl text-[var(--ink-secondary)] pt-2 leading-relaxed">
                  &ldquo;Software should feel alive. I engineer digital interfaces where structural rigor and kinetic motion operate as one seamless medium.&rdquo;
                </p>
              </div>

              <div className="lg:col-span-6 space-y-6 font-sans text-base text-[var(--ink-secondary)] leading-relaxed pt-2">
                <p>
                  I am <strong className="text-[var(--ink-primary)] font-semibold">Khaled Amr</strong>, a frontend architect and creative developer based in <span className="underline decoration-1 underline-offset-4 decoration-[#D4FF33]">Alexandria, Egypt</span>. My work focuses on building robust systems, interactive web applications, and thoughtful motion design.
                </p>
                <p>
                  Rather than assembling standard templates or relying on superficial decoration, I treat every interface as an architectural problem. I construct bespoke design systems, write type-safe Next.js App Router code, engineer bi-directional Arabic (RTL) & English (LTR) layouts, and choreograph performant transitions that respect browser performance and user preferences.
                </p>

                {/* 3 Core Philosophical Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs">
                  <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 space-y-1.5 hover:border-[#D4FF33]/50 transition-colors">
                    <span className="text-[#D4FF33] font-bold block flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] shadow-[0_0_6px_rgba(212,255,51,0.8)]" />
                      RIGOR
                    </span>
                    <span className="text-[var(--ink-primary)] font-bold block">Type Safety & A11y</span>
                    <p className="text-[11px] text-[var(--ink-muted)] leading-normal">
                      Semantic HTML, accessible focus states, and responsive precision.
                    </p>
                  </div>
                  <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 space-y-1.5 hover:border-[#D4FF33]/50 transition-colors">
                    <span className="text-[#D4FF33] font-bold block flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] shadow-[0_0_6px_rgba(212,255,51,0.8)]" />
                      KINETICS
                    </span>
                    <span className="text-[var(--ink-primary)] font-bold block">Motion Discipline</span>
                    <p className="text-[11px] text-[var(--ink-muted)] leading-normal">
                      Transform and opacity animations that avoid unnecessary layout recalculation.
                    </p>
                  </div>
                  <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 space-y-1.5 hover:border-[#D4FF33]/50 transition-colors">
                    <span className="text-[#D4FF33] font-bold block flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] shadow-[0_0_6px_rgba(212,255,51,0.8)]" />
                      SPATIAL
                    </span>
                    <span className="text-[var(--ink-primary)] font-bold block">Bilingual Engines</span>
                    <p className="text-[11px] text-[var(--ink-muted)] leading-normal">
                      Native Arabic RTL & English LTR logical layout systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CursorSpotlight>
      </section>

      {/* ============================================================== */}
      {/* 02. TECHNICAL SKILLS & CAPABILITIES MATRIX                     */}
      {/* ============================================================== */}
      <section
        id="skills"
        className="relative w-full bg-[var(--bg-canvas)] text-[var(--ink-primary)] border-b border-[var(--border-hairline)] overflow-hidden"
      >
        {/* Background Architectural Grid Lines */}
        <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-15 z-0" />

        <CursorSpotlight className="relative z-10 py-20 sm:py-28 px-6 sm:px-12 md:px-16">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-hairline)] pb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase">
                  <span className="w-2.5 h-2.5 bg-[#D4FF33] inline-block shadow-[0_0_8px_rgba(212,255,51,0.5)]" />
                  <span className="text-[var(--ink-primary)] font-bold">TECHNICAL CAPABILITIES</span>
                  <span className="opacity-40">&bull; SYSTEM REPERTOIRE</span>
                </div>
                <h3 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--ink-primary)]">
                  HOW I THINK. HOW I BUILD.
                </h3>
              </div>
              <p className="max-w-md font-mono text-xs text-[var(--ink-muted)] leading-relaxed">
                Technical competencies and engineering practices applied across real client platforms, bilingual e-commerce systems, and open-source applications.
              </p>
            </div>

            {/* 4 Editorial Typographic Columns with Strict 1px Swiss Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {skillGroups.map((group) => (
                <div
                  key={group.num}
                  className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between space-y-6 hover:border-[var(--ink-primary)]/40 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Header Strip */}
                    <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3 font-mono text-xs">
                      <span className="text-[#D4FF33] font-bold">[{group.num}]</span>
                      <span className="text-[var(--ink-muted)] text-[10px] uppercase tracking-wider">
                        VERIFIED STACK
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--ink-primary)]">
                        {group.title}
                      </h4>
                      <p className="font-mono text-xs text-[var(--ink-muted)]">
                        {group.subtitle}
                      </p>
                    </div>

                    {/* Skill Rows */}
                    <div className="space-y-3 pt-2">
                      {group.skills.map((skill) => (
                        <div key={skill.name} className="space-y-0.5 border-t border-[var(--border-hairline)] pt-2.5 first:border-t-0 first:pt-0">
                          <div className="font-mono text-xs font-bold text-[var(--ink-primary)] flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#D4FF33]" />
                            <span>{skill.name}</span>
                          </div>
                          <p className="font-sans text-[11px] text-[var(--ink-secondary)] leading-normal pl-2.5">
                            {skill.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-hairline)] font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-widest flex items-center justify-between">
                    <span>ARCHITECTURAL STANDARD</span>
                    <span className="text-[#D4FF33]">&bull; READY</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hardware-Accelerated Kinetic Engineering Manifesto & Blueprint */}
            <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#D4FF33]" />
                  <span className="font-bold text-[var(--ink-primary)] uppercase">
                    ENGINEERING BLUEPRINT // GPU COMPOSITOR ALLOCATION
                  </span>
                </div>
                <div className="text-[#D4FF33] font-bold text-[11px] tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] animate-pulse" />
                  <span>ZERO-CLS &bull; 60 FPS MOTION LIFECYCLE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-3 text-sm text-[var(--ink-secondary)] leading-relaxed font-sans">
                  <p>
                    Motion must never compromise rendering fluidity. Scroll-driven animations are strictly scoped to GPU composite properties (<code className="font-mono text-xs text-[#D4FF33]">transform</code> and <code className="font-mono text-xs text-[#D4FF33]">opacity</code>) to avoid recalculating layout geometry or triggering paint cycles on the main thread.
                  </p>
                  <p className="font-mono text-xs text-[var(--ink-muted)]">
                    ScrollTrigger instances are wrapped in <code className="text-[var(--ink-primary)]">gsap.context()</code> and systematically reverted upon unmount to eliminate memory leaks across route transitions.
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <pre className="p-4 sm:p-5 bg-[var(--bg-canvas)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--ink-primary)] overflow-x-auto leading-relaxed">
                    <code>{`// Khaled Amr — Kinetic Rendering Architecture
const ctx = gsap.context(() => {
  gsap.to(targetRef.current, {
    xPercent: -20,
    force3D: true, // Promotes element to dedicated GPU compositor layer
    ease: "none",
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
    },
  });
}, containerRef);

return () => ctx.revert(); // Zero dangling listeners or memory leaks`}</code>
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </CursorSpotlight>
      </section>
    </>
  );
}
