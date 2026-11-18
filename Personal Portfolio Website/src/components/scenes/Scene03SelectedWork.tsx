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
  SlidersHorizontal,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, CaseStudy } from "@/data/projectsData";
import MagneticButton from "@/components/motion/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Snappy scroll distance per project chapter (55vh of travel per slice)
const STEP_VH = 55;

export default function Scene03SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Dedicated scroll track ref for Block B
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(0);
  activeIndexRef.current = activeIndex;

  // Direct GPU DOM refs for 120fps continuous scrubbing
  const scannerLineRef = useRef<HTMLDivElement>(null);
  const scannerHeadTextRef = useRef<HTMLSpanElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const telemetryPercentRef = useRef<HTMLSpanElement>(null);

  // Specs strip refs for sequential border illumination below the viewport frame
  const spec1Ref = useRef<HTMLDivElement>(null);
  const spec2Ref = useRef<HTMLDivElement>(null);
  const spec3Ref = useRef<HTMLDivElement>(null);

  const scanTweenRef = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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

  // 3 Curated flagship highlights for Block A
  const curatedHighlights = useMemo(() => {
    return [
      PROJECTS.find((p) => p.slug === "codesystem") || PROJECTS[0],
      PROJECTS.find((p) => p.slug === "el3almia-leather") || PROJECTS[2],
      PROJECTS.find((p) => p.slug === "retone") || PROJECTS[1],
    ];
  }, []);

  // Total wrapper height: 100vh for the sticky viewport + (N - 1) * 55vh travel
  const totalHeightVh = useMemo(() => {
    return 100 + Math.max(0, filteredProjects.length - 1) * STEP_VH;
  }, [filteredProjects.length]);

  // Direct GPU DOM update helper for laser scanner and clip-path
  const updateScanDOM = useCallback((s: number) => {
    if (scannerLineRef.current) {
      scannerLineRef.current.style.left = `${(s * 100).toFixed(2)}%`;
      scannerLineRef.current.style.opacity = s < 0.98 ? "1" : "0";
    }

    if (scannerHeadTextRef.current) {
      scannerHeadTextRef.current.textContent = `▼ ${(s * 100).toFixed(0)}%`;
    }

    if (revealLayerRef.current) {
      const insetRight = ((1 - s) * 100).toFixed(2);
      revealLayerRef.current.style.clipPath = `inset(0 ${insetRight}% 0 0)`;
    }

    if (spec1Ref.current) {
      spec1Ref.current.style.borderLeftColor = s >= 0.2 ? "#D4FF33" : "transparent";
      spec1Ref.current.style.opacity = s >= 0.2 ? "1" : "0.5";
    }
    if (spec2Ref.current) {
      spec2Ref.current.style.borderLeftColor = s >= 0.5 ? "#D4FF33" : "transparent";
      spec2Ref.current.style.opacity = s >= 0.5 ? "1" : "0.5";
    }
    if (spec3Ref.current) {
      spec3Ref.current.style.borderLeftColor = s >= 0.8 ? "#D4FF33" : "transparent";
      spec3Ref.current.style.opacity = s >= 0.8 ? "1" : "0.5";
    }
  }, []);

  // Jump smoothly to a project slice synchronized with window scroll position inside scrollTrackRef
  const handleJumpToProject = useCallback(
    (targetIndex: number) => {
      const N = filteredProjects.length;
      const clampedIndex = Math.max(0, Math.min(targetIndex, N - 1));
      setActiveIndex(clampedIndex);

      if (!scrollTrackRef.current) return;

      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const trackTop = trackRect.top + window.scrollY;
      const stepPixels = (window.innerHeight * STEP_VH) / 100;

      // Exact target scroll Y for project clampedIndex
      const targetY = trackTop + clampedIndex * stepPixels;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    },
    [filteredProjects.length]
  );

  // Category switch handler: resets stage to chapter 0 and scrolls to start of scrollTrackRef
  const handleCategorySelect = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveIndex(0);

    if (scrollTrackRef.current) {
      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const trackTop = trackRect.top + window.scrollY;
      window.scrollTo({
        top: trackTop,
        behavior: "smooth",
      });
    }
  }, []);

  // Stepper handlers for quick chapter navigation
  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      handleJumpToProject(activeIndex - 1);
    } else if (scrollTrackRef.current) {
      // At chapter 0, scrolling back up smoothly navigates to Block A highlights
      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const trackTop = trackRect.top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, trackTop - window.innerHeight * 0.7),
        behavior: "smooth",
      });
    }
  }, [activeIndex, handleJumpToProject]);

  const handleNext = useCallback(() => {
    if (activeIndex < filteredProjects.length - 1) {
      handleJumpToProject(activeIndex + 1);
    } else if (scrollTrackRef.current) {
      // At final chapter (15), NEXT scrolls past the stage directly into Scene 04
      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const trackBottom = trackRect.bottom + window.scrollY;
      window.scrollTo({
        top: trackBottom + 20,
        behavior: "smooth",
      });
    }
  }, [activeIndex, filteredProjects.length, handleJumpToProject]);

  // As a project becomes active (by scroll or click), smoothly animate the laser scanner
  // from 0% to 100% over 0.7s so the full-color interface and specs are NEVER stuck at 0%
  useEffect(() => {
    if (prefersReducedMotion) {
      updateScanDOM(1);
      return;
    }

    if (scanTweenRef.current) {
      scanTweenRef.current.kill();
    }

    const obj = { s: 0 };
    updateScanDOM(0);

    scanTweenRef.current = gsap.to(obj, {
      s: 1,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        updateScanDOM(obj.s);
      },
      onComplete: () => {
        updateScanDOM(1);
      },
    });

    return () => {
      if (scanTweenRef.current) {
        scanTweenRef.current.kill();
      }
    };
  }, [activeIndex, prefersReducedMotion, updateScanDOM]);

  // Unified ScrollTrigger scrubbing tied directly to scrollTrackRef (Zero pin-spacers)
  useEffect(() => {
    if (prefersReducedMotion || !scrollTrackRef.current) return;

    const track = scrollTrackRef.current;
    const N = filteredProjects.length;
    if (N <= 1) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          const progress = self.progress; // 0.0 -> 1.0 through scrollTrackRef
          const raw = progress * (N - 1);
          const pIdx = Math.min(Math.max(0, Math.round(raw)), N - 1);

          // Update HUD Telemetry
          if (telemetryPercentRef.current) {
            telemetryPercentRef.current.textContent = `${Math.round(progress * 100)}%`;
          }

          // Cross-project index sync (Fires strictly when changing project slice)
          if (pIdx !== activeIndexRef.current) {
            activeIndexRef.current = pIdx;
            setActiveIndex(pIdx);
          }
        },
      });
    }, track);

    return () => {
      ctx.revert();
    };
  }, [filteredProjects, prefersReducedMotion]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollTrackRef.current) return;
      const rect = scrollTrackRef.current.getBoundingClientRect();
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
      {/* BLOCK A: STATIC INTRO & FLAGSHIP HIGHLIGHTS (NORMAL DOCUMENT FLOW)*/}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto pt-16 md:pt-24 px-6 md:px-16 pb-16 space-y-12">
        {/* Editorial Header & Manifesto */}
        <header className="space-y-6 md:space-y-8 border-b border-[var(--border-hairline)] pb-8 md:pb-12">
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

          {/* Editorial Subtitle & Scroll Cue */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <p className="font-serif italic text-lg sm:text-xl text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
              A scroll-driven CAD deconstruction stage designed to inspect 15 production web architectures, bilingual RTL e-commerce storefronts, 3D web experiments, and color science engines.
            </p>

            <div className="font-mono text-xs text-[var(--ink-muted)] hidden sm:flex items-center gap-2 shrink-0">
              <Compass className="w-3.5 h-3.5 text-[#D4FF33]" />
              <span>SCROLL DOWN TO ENTER PINNED STAGE</span>
            </div>
          </div>
        </header>

        {/* 3 Curated Flagship Highlights Strip */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase block">
                {"// COMPACT CURATED APERTURES"}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--ink-primary)]">
                FLAGSHIP HIGHLIGHTS
              </h3>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-[var(--ink-secondary)] max-w-md">
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
                  <div className="flex items-center justify-between font-mono text-xs text-[var(--ink-muted)] border-b border-[var(--border-hairline)] pb-3">
                    <span className="font-bold text-[var(--ink-primary)]">FLAGSHIP // 0{index + 1}</span>
                    <span className="uppercase text-[11px] font-semibold">{highlight.category}</span>
                  </div>

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

                  <div className="space-y-1.5">
                    <h4 className="font-display text-xl font-bold uppercase tracking-tight text-[var(--ink-primary)]">
                      {highlight.title}
                    </h4>
                    <p className="font-serif italic text-sm sm:text-base text-[var(--ink-secondary)] line-clamp-2">
                      {highlight.subtitle}
                    </p>
                  </div>
                </div>

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
      </div>

      {/* ============================================================== */}
      {/* BLOCK B: THE SELF-CONTAINED PINNED SCROLL STAGE                */}
      {/* ============================================================== */}
      <div
        ref={scrollTrackRef}
        className="relative w-full"
        style={{
          // Snappy total height: 100vh + (N - 1) * 55vh (zero dead scroll distance)
          height: `${totalHeightVh}vh`,
        }}
      >
        {/* Native CSS Sticky 100vh Stage Container (Top padded pt-20 to clear fixed Navbar) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-[var(--bg-canvas)] border-y border-[var(--border-hairline)] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-3 sm:pb-4 z-20">
          {/* Background Architectural Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.04]">
            <span className="font-display font-extrabold text-[clamp(6rem,18vw,22rem)] uppercase tracking-tighter whitespace-nowrap text-[var(--ink-primary)]">
              {activeProject.title}
            </span>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* 1. TOP INTEGRATED HUD BAR (Sits cleanly below fixed Navbar)  */}
          {/* ------------------------------------------------------------ */}
          <div className="relative z-30 w-full flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-2.5 shrink-0">
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
              <div className="flex items-center gap-1 text-[var(--ink-primary)] font-bold">
                <span>CHAPTER:</span>
                <span className="text-[#D4FF33]">
                  [ {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")} ]
                </span>
              </div>
              <span className="opacity-30">&bull;</span>
              <div className="hidden sm:inline uppercase text-[10px] text-[var(--ink-secondary)] font-semibold">
                {activeProject.category}
              </div>
              <span className="opacity-30 hidden sm:inline">&bull;</span>
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
          {/* 2. MIDDLE 12-COLUMN STAGE                                    */}
          {/* ------------------------------------------------------------ */}
          <div className="relative z-20 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-2 min-h-0">
            {/* ========================================================== */}
            {/* LEFT NARRATIVE COLUMN (Cols 1-5)                           */}
            {/* ========================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full max-h-[56vh] space-y-3 z-10 overflow-y-auto scrollbar-none pr-1">
              <div className="space-y-2">
                {/* Index Counter & Year */}
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-5xl sm:text-6xl font-black text-[var(--ink-primary)] tracking-tighter leading-none select-none">
                    {activeProject.num}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase tracking-widest">
                    {activeProject.year} &bull; {activeProject.category}
                  </span>
                </div>

                {/* Role Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                  <span className="truncate max-w-[280px]">ROLE: {activeProject.role}</span>
                </div>

                {/* Project Title and Subtitle */}
                <div className="space-y-0.5">
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
              <div className="space-y-2.5 pt-2.5 border-t border-[var(--border-hairline)] mt-auto">
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
                      className="group relative px-4 py-2 bg-[var(--ink-primary)] text-[var(--bg-canvas)] border border-transparent hover:bg-[#D4FF33] hover:text-[#0B0A0E] hover:border-[#D4FF33] font-bold uppercase tracking-wider flex items-center transition-all duration-200"
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
                        className="group relative px-3 py-2 border border-[var(--ink-primary)]/35 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] font-bold uppercase tracking-wider flex items-center transition-all duration-200"
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
                      className="group relative px-2.5 py-2 border border-[var(--border-hairline)] text-[var(--ink-muted)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] font-mono text-[11px] uppercase tracking-wider flex items-center transition-all duration-200"
                    >
                      <span>CODE ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* RIGHT CLEAN VIEWPORT FRAME & SPECS STRIP (Cols 6-12)       */}
            {/* ========================================================== */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* 16:10 Architectural Viewport Frame (Clean, Unobstructed Image) */}
              <div className="relative w-full aspect-[16/10] max-h-[46vh] bg-[var(--bg-surface)] border border-[var(--border-hairline)] overflow-hidden shadow-2xl">
                {/* Layer 1: Bright Architectural Cyan/Plum Blueprint Schematic */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--bg-surface)]">
                  <Image
                    src={activeProject.coverImage}
                    alt={`${activeProject.title} Blueprint`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    className="object-cover object-top filter grayscale contrast-[115%] brightness-[110%] mix-blend-luminosity"
                  />

                  {/* 24px Precision Blueprint Grid Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-25"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(212, 255, 51, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(212, 255, 51, 0.18) 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Corner CAD Brackets on Frame Perimeter */}
                  <div className="absolute top-2 left-2 z-10 font-mono text-[9px] text-[#D4FF33] tracking-widest pointer-events-none select-none flex items-center gap-1.5 bg-[var(--bg-canvas)]/85 px-2 py-0.5 border border-[#D4FF33]/30">
                    <span className="text-[#D4FF33]">┌</span> CAD_SPEC // SCHEMATIC_MODE
                  </div>

                  <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-[#D4FF33] tracking-widest pointer-events-none select-none bg-[var(--bg-canvas)]/85 px-2 py-0.5 border border-[#D4FF33]/30">
                    SCALE: 1:1 ┐
                  </div>

                  <div className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-[#D4FF33] tracking-widest pointer-events-none select-none bg-[var(--bg-canvas)]/85 px-2 py-0.5 border border-[#D4FF33]/30">
                    └ 31.2001° N // 29.9187° E
                  </div>

                  <div className="absolute bottom-2 right-2 z-10 font-mono text-[9px] text-[#D4FF33] tracking-widest pointer-events-none select-none bg-[var(--bg-canvas)]/85 px-2 py-0.5 border border-[#D4FF33]/30">
                    AUDIT: VERIFIED ┘
                  </div>
                </div>

                {/* Layer 2: Full-Color Production UI (Revealed via Horizontal Clip-Path) */}
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
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    className="object-cover object-top"
                  />
                </div>

                {/* Laser X-Ray Scanner Bar (#D4FF33) */}
                <div
                  ref={scannerLineRef}
                  className="absolute top-0 bottom-0 z-30 pointer-events-none will-change-[left] -translate-x-1/2 opacity-0 transition-opacity duration-150"
                  style={{ left: "0%" }}
                >
                  {/* Glowing Laser Vertical Bar */}
                  <div className="w-[2px] h-full bg-[#D4FF33] shadow-[0_0_12px_#D4FF33,0_0_24px_rgba(212,255,51,0.6)]" />

                  {/* Trailing Laser Glow Effect */}
                  <div className="absolute top-0 right-[2px] bottom-0 w-10 bg-gradient-to-r from-transparent to-[#D4FF33]/15 pointer-events-none" />

                  {/* Top Scanhead Chip */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#D4FF33] text-[#0B0A0E] font-mono text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md flex items-center gap-1">
                    <span ref={scannerHeadTextRef}>▼ 0%</span>
                  </div>

                  {/* Bottom Scanfoot Chip */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#D4FF33] text-[#0B0A0E] font-mono text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-md">
                    <span>▲ X-RAY</span>
                  </div>
                </div>
              </div>

              {/* 3-Column Architectural Specs Strip (Cleanly Below the Frame) */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2.5 sm:mt-3">
                {activeProject.verifiableMetrics.map((metric, idx) => {
                  const refMap = [spec1Ref, spec2Ref, spec3Ref];
                  return (
                    <div
                      key={idx}
                      ref={refMap[idx]}
                      className="p-2 sm:p-2.5 border border-[var(--border-hairline)] border-l-2 border-l-transparent bg-[var(--bg-surface)] transition-all duration-200"
                      style={{ opacity: 0.5 }}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#D4FF33] font-bold uppercase tracking-wider mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                        <span>SPEC // 0{idx + 1}</span>
                      </div>
                      <p className="font-mono text-[10.5px] sm:text-[11px] text-[var(--ink-primary)] font-medium leading-tight line-clamp-2">
                        {metric}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* 3. BOTTOM VERNIER SCRUBBER DOCK                              */}
          {/* ------------------------------------------------------------ */}
          <div className="relative z-30 w-full border-t border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
            {/* Step Previous Button */}
            <button
              onClick={handlePrev}
              aria-label={activeIndex === 0 ? "Scroll to top of observatory" : "Previous project chapter"}
              className="p-1.5 sm:p-2 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0 font-mono text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-bold">PREV</span>
            </button>

            {/* Center Vernier Ruler with Millimeter-Style Calibration */}
            <div className="flex-1 relative flex items-center justify-between px-2 sm:px-4 overflow-x-auto scrollbar-none py-0.5">
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

            {/* Step Next / Next Section Button */}
            <button
              onClick={handleNext}
              aria-label={
                activeIndex === filteredProjects.length - 1
                  ? "Scroll to next section"
                  : "Next project chapter"
              }
              className="p-1.5 sm:p-2 border border-[var(--border-hairline)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-[var(--ink-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0 font-mono text-xs flex items-center gap-1.5"
            >
              <span className="text-[10px] font-bold">
                {activeIndex === filteredProjects.length - 1 ? "NEXT SECTION" : "NEXT"}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeIndex === filteredProjects.length - 1 ? "rotate-90 text-[#D4FF33]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Named alias export for seamless component import compatibility
export { Scene03SelectedWork as ProjectObservatory };
