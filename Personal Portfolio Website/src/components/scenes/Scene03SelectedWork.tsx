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
} from "lucide-react";
import { PROJECTS } from "@/data/projectsData";
import MagneticButton from "@/components/motion/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function Scene03SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSlug, setActiveSlug] = useState<string>(PROJECTS[0].slug);
  const sectionRef = useRef<HTMLDivElement>(null);
  const previewStageRef = useRef<HTMLDivElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  // Subtle interactive perspective tilt (Gentle GPU DOM transforms, zero layout shifts)
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const tiltRafRef = useRef<number | null>(null);

  const handleImagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      if (prefersReducedMotion) return;
      if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;

      // Restrained micro-angles (max ±1.8deg)
      const rotX = (0.5 - normY) * 1.8;
      const rotY = (normX - 0.5) * 1.8;

      if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
      tiltRafRef.current = requestAnimationFrame(() => {
        if (cardInnerRef.current) {
          cardInnerRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
          cardInnerRef.current.style.transition = "transform 0.12s ease-out";
        }
      });
    },
    [prefersReducedMotion]
  );

  const handleImagePointerLeave = useCallback(() => {
    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      cardInnerRef.current.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  }, []);

  useEffect(() => {
    return () => {
      if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    };
  }, []);

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

  // Handle category change and keep active project aligned
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      const nextFiltered =
        categoryId === "all"
          ? PROJECTS
          : PROJECTS.filter((proj) => proj.category === categoryId);
      if (!nextFiltered.some((p) => p.slug === activeSlug) && nextFiltered.length > 0) {
        setActiveSlug(nextFiltered[0].slug);
      }
    },
    [activeSlug]
  );

  // Currently selected active project
  const activeProject = useMemo(() => {
    return (
      filteredProjects.find((p) => p.slug === activeSlug) ||
      filteredProjects[0] ||
      PROJECTS[0]
    );
  }, [filteredProjects, activeSlug]);

  const activeIndex = useMemo(() => {
    return filteredProjects.findIndex((p) => p.slug === activeProject.slug);
  }, [filteredProjects, activeProject]);

  // Stepper navigation handlers
  const handleNextProject = useCallback(() => {
    const nextIdx = (activeIndex + 1) % filteredProjects.length;
    setActiveSlug(filteredProjects[nextIdx].slug);
  }, [activeIndex, filteredProjects]);

  const handlePrevProject = useCallback(() => {
    const prevIdx = (activeIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setActiveSlug(filteredProjects[prevIdx].slug);
  }, [activeIndex, filteredProjects]);

  // Keyboard navigation within the index
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNextProject();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevProject();
      }
    },
    [handleNextProject, handlePrevProject]
  );

  // Smooth scroll preview stage into view on mobile tap
  const handleProjectSelect = (slug: string) => {
    setActiveSlug(slug);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      previewStageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // 3 Curated Flagship Projects for the compact editorial strip below the Observatory
  const curatedHighlights = useMemo(() => {
    return [
      PROJECTS.find((p) => p.slug === "codesystem") || PROJECTS[0],
      PROJECTS.find((p) => p.slug === "el3almia-leather") || PROJECTS[2],
      PROJECTS.find((p) => p.slug === "retone") || PROJECTS[1],
    ];
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-[var(--bg-canvas)] text-[var(--ink-primary)] overflow-hidden select-none border-t border-[var(--border-hairline)]"
    >
      {/* Subtle Hairline Grid Texture */}
      <div className="absolute inset-0 pointer-events-none bg-grid-milk opacity-20 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-16 space-y-16 md:space-y-24">
        
        {/* ============================================================== */}
        {/* 01. EDITORIAL HEADER & OBSERVATORY MANIFESTO                    */}
        {/* ============================================================== */}
        <header className="border-b border-[var(--border-hairline)] pb-8 md:pb-12 space-y-6 md:space-y-8">
          {/* Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest text-[var(--ink-muted)] uppercase border-b border-[var(--border-hairline)] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[var(--ink-primary)] inline-block" />
              <span className="font-bold text-[var(--ink-primary)]">THE PROJECT OBSERVATORY</span>
              <span className="opacity-30">&bull;</span>
              <span>15 AUDITED CODEBASES</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] text-[var(--ink-muted)]">
              <span>ALEXANDRIA, EG (31.2001° N)</span>
              <span>&bull;</span>
              <span>TWO-COLUMN INTERACTIVE APERTURE</span>
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

          {/* Editorial Description & Category Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <p className="font-serif italic text-lg sm:text-xl text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
              A minimalist editorial instrument designed to inspect 15 production web architectures, bilingual RTL e-commerce storefronts, 3D web experiments, and color science engines.
            </p>

            <div className="font-mono text-xs text-[var(--ink-muted)] hidden sm:flex items-center gap-2 shrink-0">
              <Compass className="w-3.5 h-3.5 text-[var(--ink-primary)]" />
              <span>CLICK TO SELECT • EXPLORE CASE STUDY</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2" role="tablist">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--ink-muted)] mr-1 shrink-0 hidden sm:inline" />
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 font-mono text-xs whitespace-nowrap uppercase tracking-wider transition-all duration-200 cursor-pointer border flex items-center gap-2 ${
                    isActive
                      ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)] border-[var(--ink-primary)] font-bold"
                      : "bg-[var(--bg-surface)] text-[var(--ink-secondary)] border-[var(--border-hairline)] hover:border-[var(--ink-primary)] hover:text-[var(--ink-primary)]"
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* ============================================================== */}
        {/* 02. THE CORE TWO-COLUMN PROJECT OBSERVATORY                     */}
        {/* ============================================================== */}
        <div
          ref={previewStageRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start"
          onKeyDown={handleKeyDown}
        >
          {/* ============================================================ */}
          {/* OBSERVATORY PREVIEW STAGE (7/12)                             */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24 space-y-6 z-10">
            <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 md:p-8 space-y-6 transition-colors duration-350 ease-out">
              
              {/* Telemetry Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-[var(--border-hairline)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF33]" />
                  <span className="font-bold text-[var(--ink-primary)]">
                    VIEWPORT // [ {activeProject.num} / {PROJECTS.length} ]
                  </span>
                  <span className="text-[var(--ink-muted)] opacity-40">&bull;</span>
                  <span className="text-[var(--ink-secondary)] uppercase font-semibold">
                    {activeProject.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--ink-muted)]">
                  <span>{activeProject.year}</span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[var(--ink-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                    {activeProject.status}
                  </span>
                </div>
              </div>

              {/* Pristine Image Viewport (Zero clashing badges or distracting glows) */}
              <Link
                href={`/work/${activeProject.slug}`}
                onPointerMove={handleImagePointerMove}
                onPointerLeave={handleImagePointerLeave}
                className="group relative block w-full aspect-[16/10] overflow-hidden bg-[var(--bg-canvas)] border border-[var(--border-hairline)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--ink-primary)]"
                style={{
                  perspective: "1000px",
                }}
                aria-label={`Open case study for ${activeProject.title}`}
              >
                <div
                  key={activeProject.slug}
                  ref={cardInnerRef}
                  className="relative w-full h-full animate-observatory-reveal will-change-transform"
                >
                  <Image
                    src={activeProject.coverImage}
                    alt={activeProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    className="object-cover object-top transition-opacity duration-350 ease-out group-hover:opacity-95"
                  />
                </div>
              </Link>

              {/* Project Headline and Core Editorial Metadata */}
              <div key={`meta-${activeProject.slug}`} className="space-y-4 animate-observatory-reveal">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[var(--ink-primary)]">
                      {activeProject.title}
                    </h3>
                    <span className="font-mono text-xs text-[var(--ink-muted)] uppercase">
                      ROLE: {activeProject.role}
                    </span>
                  </div>

                  <p className="font-serif italic text-lg sm:text-xl text-[var(--ink-secondary)] leading-snug">
                    {activeProject.subtitle}
                  </p>
                </div>

                <p className="font-sans text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed max-w-3xl">
                  {activeProject.overview}
                </p>

                {/* Verifiable Architecture Metrics */}
                {activeProject.verifiableMetrics && activeProject.verifiableMetrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {activeProject.verifiableMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] flex items-start gap-2 text-xs font-mono text-[var(--ink-primary)]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4FF33] shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="font-mono text-[11px] text-[var(--ink-muted)] mr-1 uppercase">
                    ENGINEERING STACK:
                  </span>
                  {activeProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] font-mono text-[11px] text-[var(--ink-secondary)] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links & Stepper Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-hairline)]">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <MagneticButton strength={0.2} maxOffset={5}>
                      <Link
                        href={`/work/${activeProject.slug}`}
                        className="group relative px-6 py-3.5 bg-[var(--ink-primary)] text-[var(--bg-canvas)] border border-transparent hover:bg-[#D4FF33] hover:text-[#0B0A0E] hover:border-[#D4FF33] font-bold uppercase tracking-wider flex items-center transition-all duration-200"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>VIEW CASE STUDY</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#FF4D1C] group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    </MagneticButton>

                    {activeProject.liveUrl && (
                      <MagneticButton strength={0.15} maxOffset={4}>
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative px-5 py-3.5 border border-[var(--ink-primary)]/35 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] font-bold uppercase tracking-wider flex items-center transition-all duration-200"
                        >
                          <span className="relative z-10 flex items-center gap-2">
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
                        className="group relative px-3.5 py-3.5 border border-[var(--ink-primary)]/20 text-[var(--ink-secondary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] font-mono text-xs font-semibold uppercase tracking-wider flex items-center transition-all duration-200"
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          <span>SOURCE CODE</span>
                          <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-1 font-mono text-xs ml-auto">
                    <button
                      onClick={handlePrevProject}
                      aria-label="Previous project exhibit"
                      className="p-2.5 border border-[var(--ink-primary)]/35 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] transition-all duration-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-2 text-[var(--ink-primary)] font-bold select-none">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                    </span>
                    <button
                      onClick={handleNextProject}
                      aria-label="Next project exhibit"
                      className="p-2.5 border border-[var(--ink-primary)]/35 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] transition-all duration-200 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* COMPACT VERTICALLY ORGANIZED INDEX (5/12)                     */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            {/* Index Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3 font-mono text-xs uppercase tracking-widest text-[var(--ink-primary)]">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[var(--ink-primary)]" />
                <span className="font-bold">SYSTEM INDEX // {filteredProjects.length} ENTRIES</span>
              </div>
              <span className="text-[11px] text-[var(--ink-muted)] hidden sm:inline">
                NAV: &uarr; &darr;
              </span>
            </div>

            {/* Vertically Organized Compact Index List */}
            <div
              ref={indexContainerRef}
              className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] divide-y divide-[var(--border-hairline)] max-h-[640px] overflow-y-auto"
              role="tablist"
              aria-label="Project Observatory Directory"
            >
              {filteredProjects.map((project) => {
                const isSelected = activeProject.slug === project.slug;

                return (
                  <button
                    key={project.slug}
                    onClick={() => handleProjectSelect(project.slug)}
                    role="tab"
                    aria-selected={isSelected}
                    tabIndex={0}
                    className={`w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors duration-200 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--ink-primary)] ${
                      isSelected
                        ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)] border-l-4 border-l-[#D4FF33]"
                        : "border-l-4 border-l-transparent bg-transparent text-[var(--ink-primary)] hover:bg-[var(--bg-elevated)] hover:border-l-[var(--ink-primary)]/40"
                    }`}
                  >
                    {/* Index Number & Title */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className={`font-mono text-xs shrink-0 font-bold transition-colors duration-200 ${
                          isSelected ? "text-[#D4FF33]" : "text-[var(--ink-muted)] group-hover:text-[var(--ink-primary)]"
                        }`}
                      >
                        {project.num}
                      </span>

                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm sm:text-base uppercase tracking-tight truncate leading-tight">
                          {project.title}
                        </div>
                        <div
                          className={`font-mono text-[11px] uppercase tracking-wider truncate mt-0.5 transition-colors duration-200 ${
                            isSelected ? "text-[var(--bg-canvas)]/70" : "text-[var(--ink-muted)]"
                          }`}
                        >
                          {project.category}
                        </div>
                      </div>
                    </div>

                    {/* Right Year & Selection Indicator */}
                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <span
                        className={`hidden sm:inline text-[11px] transition-colors duration-200 ${
                          isSelected ? "text-[var(--bg-canvas)]/60" : "text-[var(--ink-muted)]"
                        }`}
                      >
                        {project.year}
                      </span>
                      <div
                        className={`w-7 h-7 flex items-center justify-center border transition-all duration-200 ${
                          isSelected
                            ? "bg-[#D4FF33] text-[#0B0A0E] border-[#D4FF33] font-bold"
                            : "border-[var(--border-hairline)] text-[var(--ink-muted)] group-hover:border-[var(--ink-primary)] group-hover:text-[var(--ink-primary)] group-hover:bg-[var(--ink-primary)]/10"
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-surface)] font-mono text-[11px] text-[var(--ink-muted)] flex items-center justify-between">
              <span>ACTIVE APERTURE: {activeProject.num} OF {PROJECTS.length}</span>
              <Link
                href={`/work/${activeProject.slug}`}
                className="font-bold underline text-[var(--ink-primary)] hover:text-[#D4FF33] transition-colors duration-350 ease-out"
              >
                OPEN CASE STUDY &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 03. COMPACT EDITORIAL STRIP: 3 CURATED FLAGSHIPS BELOW STAGE    */}
        {/* ============================================================== */}
        <div className="pt-12 sm:pt-16 border-t border-[var(--border-hairline)] space-y-8">
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
                  <span className="text-[var(--ink-muted)] text-[11px]">{highlight.year} • {highlight.status}</span>
                  <Link
                    href={`/work/${highlight.slug}`}
                    className="group/link relative px-3 py-1.5 border border-[var(--ink-primary)]/30 text-[var(--ink-primary)] bg-transparent hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] hover:border-[var(--ink-primary)] font-bold text-xs uppercase tracking-wider flex items-center transition-all duration-200 rounded-xs"
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
    </section>
  );
}
