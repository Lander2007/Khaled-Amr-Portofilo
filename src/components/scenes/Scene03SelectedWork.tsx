"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Crosshair,
  Scan,
  Maximize2,
  Activity,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, CaseStudy } from "@/data/projectsData";
import MagneticButton from "@/components/motion/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Scene03SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Dynamic RAF-driven DOM refs for 120fps continuous scrubbing (Zero React render thrashing)
  const scannerLineRef = useRef<HTMLDivElement>(null);
  const scannerHeadTextRef = useRef<HTMLSpanElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const blueprintLayerRef = useRef<HTMLDivElement>(null);
  const cardFrameRef = useRef<HTMLDivElement>(null);

  const telemetryActRef = useRef<HTMLSpanElement>(null);
  const telemetryPercentRef = useRef<HTMLSpanElement>(null);

  // CAD Callout Cards and Leader Line refs
  const callout1Ref = useRef<HTMLDivElement>(null);
  const callout2Ref = useRef<HTMLDivElement>(null);
  const callout3Ref = useRef<HTMLDivElement>(null);
  const leader1Ref = useRef<SVGGElement>(null);
  const leader2Ref = useRef<SVGGElement>(null);
  const leader3Ref = useRef<SVGGElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const activeIndexRef = useRef<number>(0);
  activeIndexRef.current = activeIndex;

  // Category definitions with live counts
  const categories = useMemo(
    () => [
      { id: "all", label: `ALL ARCHITECTURES (${PROJECTS.length})` },
      {
        id: "Web Platforms",
        label: `WEB PLATFORMS (${PROJECTS.filter((p) => p.category === "Web Platforms").length})`,
      },
      {
        id: "E-Commerce & RTL",
        label: `E-COMMERCE & RTL (${PROJECTS.filter((p) => p.category === "E-Commerce & RTL").length})`,
      },
      {
        id: "3D & Interactive",
        label: `3D & INTERACTIVE (${PROJECTS.filter((p) => p.category === "3D & Interactive").length})`,
      },
      {
        id: "Creative Tech & Tools",
        label: `CREATIVE TECH (${PROJECTS.filter((p) => p.category === "Creative Tech & Tools").length})`,
      },
    ],
    []
  );

  // Filtered project list
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return PROJECTS;
    return PROJECTS.filter((proj) => proj.category === activeCategory);
  }, [activeCategory]);

  const activeProject: CaseStudy = useMemo(() => {
    return filteredProjects[activeIndex] || filteredProjects[0] || PROJECTS[0];
  }, [filteredProjects, activeIndex]);

  // Curated flagship highlights for the bottom strip
  const curatedHighlights = useMemo(() => {
    return [
      PROJECTS.find((p) => p.slug === "codesystem") || PROJECTS[0],
      PROJECTS.find((p) => p.slug === "el3almia-leather") || PROJECTS[2],
      PROJECTS.find((p) => p.slug === "retone") || PROJECTS[1],
    ];
  }, []);

  // Jump smoothly to a project slice via the Chronos Vernier Caliper Scrubber
  const handleJumpToProject = useCallback(
    (targetIdx: number) => {
      const clampedIdx = Math.max(0, Math.min(targetIdx, filteredProjects.length - 1));
      setActiveIndex(clampedIdx);

      if (!scrollTriggerRef.current) return;
      const st = scrollTriggerRef.current;
      const N = filteredProjects.length;

      // Position user at 45% of the project slice (Act II with laser scan active and CAD callouts exploded)
      const targetProgress = (clampedIdx + 0.45) / N;
      const targetY = st.start + targetProgress * (st.end - st.start);

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    },
    [filteredProjects.length]
  );

  // Category switch handler: resets stage to chapter 0 and scrolls to start
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      setActiveIndex(0);

      if (scrollTriggerRef.current) {
        window.scrollTo({
          top: scrollTriggerRef.current.start,
          behavior: "smooth",
        });
      }
    },
    []
  );

  // Stepper handlers for quick chapter navigation
  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + filteredProjects.length) % filteredProjects.length;
    handleJumpToProject(prevIdx);
  }, [activeIndex, filteredProjects.length, handleJumpToProject]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % filteredProjects.length;
    handleJumpToProject(nextIdx);
  }, [activeIndex, filteredProjects.length, handleJumpToProject]);

  // Master GSAP ScrollTrigger Pinned Storytelling Orchestration
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !stageRef.current) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    const N = filteredProjects.length;

    // Allocate 115vh scroll distance per project for fluid cinematic pacing
    const totalScrollDist = `+=${N * 115}%`;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: totalScrollDist,
        pin: stage,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const rawIndex = progress * N;
          const pIdx = Math.min(Math.floor(rawIndex), N - 1);
          const localP = rawIndex - pIdx; // Normalized progress [0, 1] within current project slice

          // -------------------------------------------------------------
          // 3-ACT SCROLL MECHANIC LOGIC
          // Act I  (0.00 -> 0.30): Blueprint / Wireframe X-Ray Mode
          // Act II (0.30 -> 0.75): Laser X-Ray Scan & Exploded CAD Callouts
          // Act III(0.75 -> 1.00): Engineering Stack Lock & Mechanical Shutter
          // -------------------------------------------------------------
          let scanProgress = 0;
          let currentAct = "ACT I // BLUEPRINT";

          if (localP < 0.3) {
            scanProgress = 0;
            currentAct = "ACT I // BLUEPRINT";
          } else if (localP < 0.75) {
            scanProgress = (localP - 0.3) / 0.45;
            currentAct = "ACT II // LASER X-RAY";
          } else {
            scanProgress = 1;
            currentAct = "ACT III // PRODUCTION LOCK";
          }

          // 1. Direct GPU update for the Laser X-Ray Scanner Bar
          if (scannerLineRef.current) {
            scannerLineRef.current.style.left = `${(scanProgress * 100).toFixed(2)}%`;
            // Keep laser line visible during active sweep (fades smoothly at edges)
            const isScanning = localP >= 0.28 && localP <= 0.85;
            scannerLineRef.current.style.opacity = isScanning ? "1" : "0";
          }

          if (scannerHeadTextRef.current) {
            scannerHeadTextRef.current.textContent = `▼ ${(scanProgress * 100).toFixed(0)}%`;
          }

          // 2. Direct GPU clip-path reveal for the Full-Color Production UI
          if (revealLayerRef.current) {
            const insetRight = ((1 - scanProgress) * 100).toFixed(2);
            revealLayerRef.current.style.clipPath = `inset(0 ${insetRight}% 0 0)`;
          }

          // 3. Act III Mechanical Aperture Shutter / Split (0.90 -> 1.00)
          if (cardFrameRef.current) {
            if (localP > 0.9) {
              const exitProgress = (localP - 0.9) / 0.1;
              const offsetY = exitProgress * -35;
              const scale = 1 - exitProgress * 0.05;
              const opacity = 1 - exitProgress * 0.7;
              cardFrameRef.current.style.transform = `translate3d(0, ${offsetY}px, 0) scale(${scale.toFixed(3)})`;
              cardFrameRef.current.style.opacity = opacity.toFixed(2);
            } else {
              cardFrameRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
              cardFrameRef.current.style.opacity = "1";
            }
          }

          // 4. Synchronized Exploded CAD Callouts & Technical SVG Leader Lines
          const c1Active = scanProgress >= 0.18;
          const c2Active = scanProgress >= 0.48;
          const c3Active = scanProgress >= 0.76;

          if (callout1Ref.current) {
            callout1Ref.current.style.opacity = c1Active ? "1" : "0";
            callout1Ref.current.style.transform = c1Active
              ? "translate3d(0, 0, 0)"
              : "translate3d(14px, 0, 0)";
          }
          if (leader1Ref.current) {
            leader1Ref.current.style.opacity = c1Active ? "0.9" : "0";
          }

          if (callout2Ref.current) {
            callout2Ref.current.style.opacity = c2Active ? "1" : "0";
            callout2Ref.current.style.transform = c2Active
              ? "translate3d(0, 0, 0)"
              : "translate3d(14px, 0, 0)";
          }
          if (leader2Ref.current) {
            leader2Ref.current.style.opacity = c2Active ? "0.9" : "0";
          }

          if (callout3Ref.current) {
            callout3Ref.current.style.opacity = c3Active ? "1" : "0";
            callout3Ref.current.style.transform = c3Active
              ? "translate3d(0, 0, 0)"
              : "translate3d(-14px, 0, 0)";
          }
          if (leader3Ref.current) {
            leader3Ref.current.style.opacity = c3Active ? "0.9" : "0";
          }

          // 5. Update Telemetry HUD
          if (telemetryActRef.current) {
            telemetryActRef.current.textContent = currentAct;
          }
          if (telemetryPercentRef.current) {
            telemetryPercentRef.current.textContent = `${Math.round(progress * 100)}%`;
          }

          // 6. Cross-project index sync (Fires strictly when changing project slice, zero render thrashing)
          if (pIdx !== activeIndexRef.current) {
            activeIndexRef.current = pIdx;
            setActiveIndex(pIdx);
          }
        },
      });

      scrollTriggerRef.current = st;
    }, container);

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [filteredProjects, prefersReducedMotion]);

  // Keyboard navigation support (Arrow keys step chapters)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
      if (!inView) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section
      id="work"
      className="relative w-full bg-[var(--bg-canvas)] text-[var(--ink-primary)] select-none border-t border-[var(--border-hairline)]"
    >
      {/* Subtle Hairline Grid Texture */}
      <div className="absolute inset-0 pointer-events-none bg-grid-milk opacity-20 z-0" />

      {/* ============================================================== */}
      {/* 01. EDITORIAL HEADER & OBSERVATORY MANIFESTO                    */}
      {/* ============================================================== */}
      <header className="relative z-10 max-w-7xl mx-auto pt-16 md:pt-24 px-6 md:px-16 pb-8 md:pb-12 space-y-6 md:space-y-8">
        {/* Top Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase border-b border-[var(--border-hairline)] pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#D4FF33] inline-block shadow-[0_0_8px_#D4FF33]" />
            <span className="font-bold text-[var(--ink-primary)]">THE PROJECT OBSERVATORY</span>
            <span className="opacity-30">&bull;</span>
            <span>15 AUDITED CODEBASES</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[var(--ink-muted)]">
            <span>ALEXANDRIA, EG (31.2001° N)</span>
            <span>&bull;</span>
            <span>SCROLL-DRIVEN CAD DECONSTRUCTION ENGINE</span>
          </div>
        </div>

        {/* Monumental Headline */}
        <div className="space-y-2 md:space-y-3">
          <span className="font-mono text-xs tracking-[0.25em] text-[var(--ink-muted)] uppercase block">
            {"// ARCHITECTURAL EXPLORATION CONSOLE"}
          </span>
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,5rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-[var(--ink-primary)]">
            THE PROJECT{" "}
            <span className="font-serif italic font-normal lowercase inline-block text-[clamp(2.2rem,5vw,4.5rem)] text-[var(--ink-secondary)] ml-1 sm:ml-2">
              Observatory.
            </span>
          </h2>
        </div>

        {/* Editorial Subtitle & Interaction Cue */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
          <p className="font-serif italic text-lg sm:text-xl text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
            A scroll-driven CAD deconstruction stage designed to inspect 15 production web architectures, bilingual RTL e-commerce storefronts, 3D web experiments, and color science engines.
          </p>

          <div className="font-mono text-xs text-[var(--ink-muted)] hidden sm:flex items-center gap-2 shrink-0">
            <Compass className="w-3.5 h-3.5 text-[#D4FF33]" />
            <span>SCROLL TO DISSECT • CLICK VERNIER TICKS TO WARP</span>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 02. GSAP SCROLL-DRIVEN PINNED STORYTELLING & X-RAY CAD STAGE   */}
      {/* ============================================================== */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{
          // Container height: N * 115vh provides natural, fluid scroll pacing
          height: `${Math.max(1, filteredProjects.length) * 115}vh`,
        }}
      >
        {/* Pinned 100vh Viewport Stage */}
        <div
          ref={stageRef}
          className="relative w-full h-screen max-h-screen overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-[var(--bg-canvas)] border-y border-[var(--border-hairline)]"
        >
          {/* Background Architectural Watermark (Giant Title & Index) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.04] sm:opacity-[0.05]">
            <span className="font-display font-extrabold text-[clamp(6rem,18vw,22rem)] uppercase tracking-tighter whitespace-nowrap text-[var(--ink-primary)]">
              {activeProject.title}
            </span>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* TOP HUD BAR (Inside Pinned Stage)                            */}
          {/* ------------------------------------------------------------ */}
          <div className="relative z-30 w-full flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-3 shrink-0">
            {/* Left: Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none" role="tablist">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--ink-muted)] mr-1 shrink-0 hidden sm:inline" />
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-2.5 sm:px-3 py-1 font-mono text-[11px] whitespace-nowrap uppercase tracking-wider transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)] border-[var(--ink-primary)] font-bold shadow-sm"
                        : "bg-[var(--bg-surface)] text-[var(--ink-secondary)] border-[var(--border-hairline)] hover:border-[var(--ink-primary)] hover:text-[var(--ink-primary)]"
                    }`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Live Telemetry */}
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] text-[var(--ink-muted)] shrink-0 ml-auto">
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] animate-pulse" />
                <span ref={telemetryActRef} className="text-[var(--ink-primary)] font-bold">
                  ACT I // BLUEPRINT
                </span>
              </div>
              <span className="opacity-30">&bull;</span>
              <div className="flex items-center gap-1 text-[var(--ink-primary)] font-bold">
                <span>CHAPTER:</span>
                <span className="text-[#D4FF33]">
                  [ {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")} ]
                </span>
              </div>
              <span className="opacity-30">&bull;</span>
              <div className="hidden md:flex items-center gap-1 text-[var(--ink-muted)]">
                <span>SCROLL:</span>
                <span ref={telemetryPercentRef} className="text-[var(--ink-primary)] font-bold">
                  0%
                </span>
                <span>↓</span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* MAIN STAGE CONTENT (12-Column Swiss Grid)                    */}
          {/* ------------------------------------------------------------ */}
          <div className="relative z-20 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-2 sm:py-4 min-h-0">
            {/* ========================================================== */}
            {/* LEFT NARRATIVE COLUMN (Cols 1-4)                           */}
            {/* ========================================================== */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full max-h-[58vh] space-y-4 lg:space-y-6 z-10 overflow-y-auto scrollbar-none pr-1">
              <div className="space-y-3 sm:space-y-4">
                {/* Index Counter & Metadata */}
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-black text-[var(--ink-primary)] tracking-tighter leading-none select-none">
                    {activeProject.num}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-widest">
                    {activeProject.year} &bull; {activeProject.category}
                  </span>
                </div>

                {/* Role Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                  <span className="truncate max-w-[260px]">ROLE: {activeProject.role}</span>
                </div>

                {/* Project Title and Subtitle */}
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--ink-primary)] leading-tight">
                    {activeProject.title}
                  </h3>
                  <p className="font-serif italic text-base sm:text-lg text-[var(--ink-secondary)] leading-snug">
                    {activeProject.subtitle}
                  </p>
                </div>

                {/* Overview Paragraph */}
                <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed line-clamp-3">
                  {activeProject.overview}
                </p>
              </div>

              {/* Bottom Anchored: Engineering Stack & CTAs */}
              <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)] mt-auto">
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase mr-1 self-center">
                    STACK:
                  </span>
                  {activeProject.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 border border-[var(--border-hairline)] bg-[var(--bg-surface)] font-mono text-[10px] text-[var(--ink-secondary)] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                  <MagneticButton strength={0.2} maxOffset={4}>
                    <Link
                      href={`/work/${activeProject.slug}`}
                      className="group relative px-4 py-2.5 bg-[var(--ink-primary)] text-[var(--bg-canvas)] border border-transparent hover:bg-[#D4FF33] hover:text-[#0B0A0E] hover:border-[#D4FF33] font-bold uppercase tracking-wider flex items-center transition-all duration-200"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span>VIEW CASE STUDY</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FF4D1C] group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  </MagneticButton>

                  {activeProject.liveUrl && (
                    <MagneticButton strength={0.15} maxOffset={3}>
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-3.5 py-2.5 border border-[var(--ink-primary)]/35 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] font-bold uppercase tracking-wider flex items-center transition-all duration-200"
                      >
                        <span className="relative z-10 flex items-center gap-1.5">
                          <span>LIVE PLATFORM</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    </MagneticButton>
                  )}

                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-2.5 py-2.5 border border-[var(--border-hairline)] text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] font-mono text-[11px] uppercase tracking-wider flex items-center transition-all duration-200"
                    >
                      <span>CODE ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* CENTER / RIGHT DISSECTION APERTURE (Cols 5-12)             */}
            {/* ========================================================== */}
            <div className="lg:col-span-8 relative w-full h-full flex flex-col justify-center items-center">
              {/* Architectural Frame Container */}
              <div
                ref={cardFrameRef}
                className="relative w-full aspect-[16/10] max-h-[58vh] bg-[var(--bg-surface)] border border-[var(--border-hairline)] overflow-hidden shadow-2xl transition-transform duration-150 ease-out will-change-transform"
              >
                {/* ------------------------------------------------------ */}
                {/* LAYER 1: BLUEPRINT / SCHEMATIC WIREFRAME (ACT I)       */}
                {/* ------------------------------------------------------ */}
                <div
                  ref={blueprintLayerRef}
                  className="absolute inset-0 z-0 overflow-hidden bg-[#0A070C]"
                >
                  <Image
                    src={activeProject.coverImage}
                    alt={`${activeProject.title} Blueprint`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover object-top filter grayscale contrast-150 brightness-[0.55] invert-[0.05]"
                  />

                  {/* CAD Precision Blueprint Grid Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(212, 255, 51, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(212, 255, 51, 0.15) 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Corner CAD Brackets & Telemetry Notations */}
                  <div className="absolute top-2 left-2 z-10 font-mono text-[9px] text-[#D4FF33]/80 tracking-widest pointer-events-none select-none flex items-center gap-1.5 bg-[var(--bg-canvas)]/80 px-1.5 py-0.5 border border-[#D4FF33]/30">
                    <span className="text-[#D4FF33]">┌</span> CAD_SPEC // SCHEMATIC_MODE
                  </div>

                  <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-[#D4FF33]/80 tracking-widest pointer-events-none select-none bg-[var(--bg-canvas)]/80 px-1.5 py-0.5 border border-[#D4FF33]/30">
                    SCALE: 1:1 ┐
                  </div>

                  <div className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-[#D4FF33]/80 tracking-widest pointer-events-none select-none bg-[var(--bg-canvas)]/80 px-1.5 py-0.5 border border-[#D4FF33]/30">
                    └ 31.2001° N // 29.9187° E
                  </div>

                  <div className="absolute bottom-2 right-2 z-10 font-mono text-[9px] text-[#D4FF33]/80 tracking-widest pointer-events-none select-none bg-[var(--bg-canvas)]/80 px-1.5 py-0.5 border border-[#D4FF33]/30">
                    AUDIT: VERIFIED ┘
                  </div>

                  {/* Center Crosshair Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="opacity-35">
                      <path d="M22 0V44M0 22H44" stroke="#D4FF33" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="22" cy="22" r="10" stroke="#D4FF33" strokeWidth="1" />
                      <circle cx="22" cy="22" r="2" fill="#D4FF33" />
                    </svg>
                  </div>
                </div>

                {/* ------------------------------------------------------ */}
                {/* LAYER 2: FULL-COLOR PRODUCTION UI (REVEALED BY X-RAY)   */}
                {/* ------------------------------------------------------ */}
                <div
                  ref={revealLayerRef}
                  className="absolute inset-0 z-10 overflow-hidden will-change-[clip-path]"
                  style={{
                    clipPath: "inset(0 100% 0 0)",
                  }}
                >
                  <Image
                    src={activeProject.coverImage}
                    alt={`${activeProject.title} Full Production UI`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover object-top"
                  />
                </div>

                {/* ------------------------------------------------------ */}
                {/* LASER X-RAY SCANNER BAR (ELECTRIC LIME #D4FF33)        */}
                {/* ------------------------------------------------------ */}
                <div
                  ref={scannerLineRef}
                  className="absolute top-0 bottom-0 z-30 pointer-events-none will-change-[left] -translate-x-1/2 opacity-0 transition-opacity duration-200"
                  style={{ left: "0%" }}
                >
                  {/* Glowing Laser Vertical Bar */}
                  <div className="w-[2px] h-full bg-[#D4FF33] shadow-[0_0_12px_#D4FF33,0_0_24px_rgba(212,255,51,0.6)]" />

                  {/* Trailing Laser Glow Effect */}
                  <div className="absolute top-0 right-[2px] bottom-0 w-12 bg-gradient-to-r from-transparent to-[#D4FF33]/15 pointer-events-none" />

                  {/* Top Scanhead Chip */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#D4FF33] text-[#0B0A0E] font-mono text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md flex items-center gap-1">
                    <span ref={scannerHeadTextRef}>▼ 0%</span>
                  </div>

                  {/* Bottom Scanfoot Chip */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#D4FF33] text-[#0B0A0E] font-mono text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md">
                    <span>▲ X-RAY</span>
                  </div>
                </div>

                {/* ------------------------------------------------------ */}
                {/* SVG TECHNICAL LEADER LINES                             */}
                {/* ------------------------------------------------------ */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Leader 1 to Top-Right Callout */}
                  <g ref={leader1Ref} className="opacity-0 transition-opacity duration-250">
                    <circle cx="34" cy="24" r="3" fill="none" stroke="#D4FF33" strokeWidth="0.8" />
                    <circle cx="34" cy="24" r="1" fill="#D4FF33" />
                    <line x1="34" y1="24" x2="74" y2="15" stroke="#D4FF33" strokeWidth="0.8" strokeDasharray="2 1.5" />
                  </g>

                  {/* Leader 2 to Mid-Right Callout */}
                  <g ref={leader2Ref} className="opacity-0 transition-opacity duration-250">
                    <circle cx="66" cy="54" r="3" fill="none" stroke="#D4FF33" strokeWidth="0.8" />
                    <circle cx="66" cy="54" r="1" fill="#D4FF33" />
                    <line x1="66" y1="54" x2="76" y2="52" stroke="#D4FF33" strokeWidth="0.8" strokeDasharray="2 1.5" />
                  </g>

                  {/* Leader 3 to Bottom-Left Callout */}
                  <g ref={leader3Ref} className="opacity-0 transition-opacity duration-250">
                    <circle cx="42" cy="76" r="3" fill="none" stroke="#D4FF33" strokeWidth="0.8" />
                    <circle cx="42" cy="76" r="1" fill="#D4FF33" />
                    <line x1="42" y1="76" x2="26" y2="82" stroke="#D4FF33" strokeWidth="0.8" strokeDasharray="2 1.5" />
                  </g>
                </svg>

                {/* ------------------------------------------------------ */}
                {/* 3 EXPLODED CAD ENGINEERING CALLOUT CARDS (DESKTOP)     */}
                {/* ------------------------------------------------------ */}
                {/* Callout 1 (Top-Right) */}
                {activeProject.verifiableMetrics[0] && (
                  <div
                    ref={callout1Ref}
                    className="hidden lg:block absolute top-[6%] right-[4%] z-25 max-w-[240px] border border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-md p-2.5 shadow-xl opacity-0 translate-x-3 transition-all duration-300 pointer-events-auto"
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#D4FF33] font-bold uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] animate-pulse" />
                      <span>CAD_SPEC // 01</span>
                    </div>
                    <p className="font-mono text-[11px] text-[var(--ink-primary)] font-medium leading-tight">
                      {activeProject.verifiableMetrics[0]}
                    </p>
                  </div>
                )}

                {/* Callout 2 (Center-Right) */}
                {activeProject.verifiableMetrics[1] && (
                  <div
                    ref={callout2Ref}
                    className="hidden lg:block absolute top-[46%] right-[4%] z-25 max-w-[240px] border border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-md p-2.5 shadow-xl opacity-0 translate-x-3 transition-all duration-300 pointer-events-auto"
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#D4FF33] font-bold uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] animate-pulse" />
                      <span>CAD_SPEC // 02</span>
                    </div>
                    <p className="font-mono text-[11px] text-[var(--ink-primary)] font-medium leading-tight">
                      {activeProject.verifiableMetrics[1]}
                    </p>
                  </div>
                )}

                {/* Callout 3 (Bottom-Left) */}
                {activeProject.verifiableMetrics[2] && (
                  <div
                    ref={callout3Ref}
                    className="hidden lg:block absolute bottom-[8%] left-[4%] z-25 max-w-[240px] border border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-md p-2.5 shadow-xl opacity-0 -translate-x-3 transition-all duration-300 pointer-events-auto"
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#D4FF33] font-bold uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] animate-pulse" />
                      <span>CAD_SPEC // 03</span>
                    </div>
                    <p className="font-mono text-[11px] text-[var(--ink-primary)] font-medium leading-tight">
                      {activeProject.verifiableMetrics[2]}
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile CAD Metrics Strip (Below Aperture on mobile screens) */}
              <div className="lg:hidden w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {activeProject.verifiableMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-2 border border-[var(--border-hairline)] bg-[var(--bg-surface)] flex items-start gap-2 font-mono text-[10px] text-[var(--ink-primary)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33] shrink-0 mt-1" />
                    <span className="leading-tight font-medium">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* BOTTOM DOCK: CHRONOS VERNIER CALIPER TIMELINE SCRUBBER       */}
          {/* ------------------------------------------------------------ */}
          <div className="relative z-30 w-full border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
            {/* Step Previous Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous project chapter"
              className="p-1.5 sm:p-2 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0 font-mono text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-bold">PREV</span>
            </button>

            {/* Center Vernier Ruler with Millimeter-Style Calibration */}
            <div className="flex-1 relative flex items-center justify-between px-2 sm:px-4 overflow-x-auto scrollbar-none py-1">
              {filteredProjects.map((proj, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <div key={proj.slug} className="flex items-center shrink-0">
                    <button
                      onClick={() => handleJumpToProject(idx)}
                      className={`group relative flex flex-col items-center px-1.5 sm:px-2 py-0.5 transition-all duration-200 cursor-pointer ${
                        isCurrent ? "scale-110" : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Jump to ${proj.title}`}
                    >
                      {/* Caliper Tick Notch */}
                      <div
                        className={`w-[1.5px] transition-all duration-200 ${
                          isCurrent
                            ? "h-4 bg-[#D4FF33] shadow-[0_0_8px_#D4FF33]"
                            : "h-2.5 bg-[var(--border-hairline)] group-hover:h-3 group-hover:bg-[var(--ink-primary)]"
                        }`}
                      />
                      {/* Tick Number */}
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] mt-0.5 tracking-tighter ${
                          isCurrent
                            ? "text-[#D4FF33] font-black"
                            : "text-[var(--ink-muted)] group-hover:text-[var(--ink-primary)]"
                        }`}
                      >
                        {proj.num}
                      </span>
                    </button>

                    {/* Sub-Millimeter Vernier Notches between chapters */}
                    {idx < filteredProjects.length - 1 && (
                      <div className="hidden md:flex items-center gap-1 px-1 opacity-30 pointer-events-none">
                        <span className="w-[1px] h-1.5 bg-[var(--border-hairline)]" />
                        <span className="w-[1px] h-1 bg-[var(--border-hairline)]" />
                        <span className="w-[1px] h-1.5 bg-[var(--border-hairline)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next project chapter"
              className="p-1.5 sm:p-2 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0 font-mono text-xs flex items-center gap-1"
            >
              <span className="hidden sm:inline text-[10px] font-bold">NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 03. COMPACT EDITORIAL STRIP: 3 CURATED FLAGSHIPS BELOW STAGE    */}
      {/* ============================================================== */}
      <div className="relative z-10 pt-16 md:pt-20 border-t border-[var(--border-hairline)] space-y-8 max-w-7xl mx-auto px-6 md:px-16 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase block">
              {"// COMPACT CURATED APERTURES"}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--ink-primary)]">
              FLAGSHIP HIGHLIGHTS
            </h3>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-[var(--ink-secondary)] max-w-md">
            Three benchmark production systems engineered for extreme performance, bilingual layout rigor, and procedural color science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {curatedHighlights.map((highlight, index) => (
            <article
              key={highlight.slug}
              className="group border border-[var(--border-hairline)] bg-[var(--bg-surface)] flex flex-col justify-between overflow-hidden hover:border-[var(--ink-primary)]/50 transition-colors duration-200"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Category & Number Header */}
                <div className="flex items-center justify-between font-mono text-xs text-[var(--ink-muted)] border-b border-[var(--border-hairline)] pb-3">
                  <span className="font-bold text-[var(--ink-primary)]">FLAGSHIP // 0{index + 1}</span>
                  <span className="uppercase text-[11px] font-semibold">{highlight.category}</span>
                </div>

                {/* Thumbnail Image Viewport */}
                <Link
                  href={`/work/${highlight.slug}`}
                  className="relative block w-full aspect-[16/10] overflow-hidden bg-[var(--bg-canvas)] border border-[var(--border-hairline)]"
                >
                  <Image
                    src={highlight.coverImage}
                    alt={highlight.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top transition-opacity duration-350 ease-out group-hover:opacity-90"
                  />
                </Link>

                {/* Title and Short Overview */}
                <div className="space-y-1.5">
                  <h4 className="font-display text-xl font-bold uppercase tracking-tight text-[var(--ink-primary)]">
                    {highlight.title}
                  </h4>
                  <p className="font-serif italic text-sm sm:text-base text-[var(--ink-secondary)] line-clamp-2">
                    {highlight.subtitle}
                  </p>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-5 sm:p-6 pt-0 border-t border-[var(--border-hairline)] mt-auto flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--ink-muted)] text-[11px]">
                  {highlight.year} • {highlight.status}
                </span>
                <Link
                  href={`/work/${highlight.slug}`}
                  className="group/link relative px-3 py-1.5 border border-[var(--ink-primary)]/30 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] font-bold text-xs uppercase tracking-wider flex items-center transition-all duration-200"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>READ CASE</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Named alias export for seamless component import compatibility
export { Scene03SelectedWork as ProjectObservatory };
