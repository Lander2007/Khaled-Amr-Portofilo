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
  ExternalLink,
  Layers,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, CaseStudy } from "@/data/projectsData";
import MagneticButton from "@/components/motion/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function Scene03SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSlug, setActiveSlug] = useState<string>(PROJECTS[0].slug);
  const sectionRef = useRef<HTMLDivElement>(null);
  const previewStageRef = useRef<HTMLDivElement>(null);
  const indexContainerRef = useRef<HTMLDivElement>(null);

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

  // Synchronize active project when category changes
  useEffect(() => {
    if (filteredProjects.length > 0) {
      const exists = filteredProjects.some((p) => p.slug === activeSlug);
      if (!exists) {
        setActiveSlug(filteredProjects[0].slug);
      }
    }
  }, [filteredProjects, activeSlug]);

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

  // GSAP subtle parallax on the curated strip below the main explorer
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".curated-card-inner");
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-[#FFF3E6] text-[#381932] overflow-hidden select-none border-t border-[#381932]/10"
    >
      {/* Subtle Hairline Grid Texture */}
      <div className="absolute inset-0 pointer-events-none bg-grid-milk opacity-25 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto pt-24 sm:pt-32 pb-24 px-5 sm:px-8 md:px-12 space-y-16 sm:space-y-20">
        
        {/* ============================================================== */}
        {/* 01. EDITORIAL HEADER & OBSERVATORY MANIFESTO                    */}
        {/* ============================================================== */}
        <header className="border-b border-[#381932]/15 pb-10 sm:pb-12 space-y-8">
          {/* Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest text-[#381932]/70 uppercase border-b border-[#381932]/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#381932] inline-block" />
              <span className="font-bold text-[#381932]">THE PROJECT OBSERVATORY</span>
              <span className="text-[#381932]/30">&bull;</span>
              <span>15 AUDITED CODEBASES</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] text-[#381932]/60">
              <span>ALEXANDRIA, EG (31.2001° N)</span>
              <span>&bull;</span>
              <span>TWO-COLUMN INTERACTIVE APERTURE</span>
            </div>
          </div>

          {/* Monumental Headline */}
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-[0.25em] text-[#381932]/60 uppercase block">
              // ARCHITECTURAL EXPLORATION CONSOLE
            </span>
            <h2 className="font-display text-[clamp(2.4rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-tighter text-[#381932]">
              THE PROJECT
              <span className="font-serif italic font-normal lowercase block text-[clamp(2.1rem,6.2vw,6rem)] text-[#381932]/90 ml-1 sm:ml-2">
                Observatory.
              </span>
            </h2>
          </div>

          {/* Editorial Description & Category Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <p className="font-serif italic text-lg sm:text-xl text-[#381932]/85 max-w-2xl leading-snug">
              A minimalist editorial instrument designed to inspect 15 production web architectures, bilingual RTL e-commerce storefronts, 3D web experiments, and color science engines.
            </p>

            <div className="font-mono text-xs text-[#381932]/60 hidden sm:flex items-center gap-2 shrink-0">
              <Compass className="w-3.5 h-3.5 text-[#381932]" />
              <span>CLICK TO SELECT • EXPLORE CASE STUDY</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2" role="tablist">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#381932]/50 mr-1 shrink-0 hidden sm:inline" />
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 font-mono text-xs whitespace-nowrap uppercase tracking-wider transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#381932] text-[#FFF3E6] border-[#381932] font-bold shadow-sm"
                      : "bg-[#FFFDF9]/60 text-[#381932]/75 border-[#381932]/15 hover:border-[#381932]/40 hover:text-[#381932]"
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] shadow-[0_0_6px_rgba(198,242,119,0.8)]" />
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
          {/* LARGER COLUMN: SUBSTANTIAL OBSERVATORY PREVIEW STAGE (7/12)   */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24 space-y-6">
            <div className="border border-[#381932]/20 bg-[#FFFDF9] shadow-sm p-5 sm:p-7 md:p-8 space-y-6">
              
              {/* Telemetry Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-[#381932]/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C6F277] shadow-[0_0_8px_rgba(198,242,119,0.8)] animate-pulse" />
                  <span className="font-bold text-[#381932]">
                    VIEWPORT // [ {activeProject.num} / 15 ]
                  </span>
                  <span className="text-[#381932]/30">&bull;</span>
                  <span className="text-[#381932]/80 uppercase font-semibold">
                    {activeProject.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-[#381932]/65">
                  <span>{activeProject.year}</span>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[#381932]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277]" />
                    {activeProject.status}
                  </span>
                </div>
              </div>

              {/* Main Substantial Image Viewport with Smooth Image Reveal */}
              <Link
                href={`/work/${activeProject.slug}`}
                className="group relative block w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#240f20] border border-[#381932]/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#381932]"
                aria-label={`Open case study for ${activeProject.title}`}
              >
                {/* Keyed container for instant smooth reveal animation */}
                <div
                  key={activeProject.slug}
                  className="relative w-full h-full animate-observatory-reveal"
                >
                  <Image
                    src={activeProject.coverImage}
                    alt={activeProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  {/* Minimal Architectural Frame Corner Accents */}
                  <div className="absolute top-3 left-3 font-mono text-[10px] tracking-widest text-[#FFF3E6] bg-[#381932]/85 px-2.5 py-1 uppercase backdrop-blur-xs select-none">
                    EXHIBIT_{activeProject.num}
                  </div>

                  <div className="absolute bottom-3 right-3 font-mono text-[11px] tracking-wider text-[#FFF3E6] bg-[#381932] px-3 py-1.5 uppercase flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shadow-md">
                    <span>EXPLORE ARCHITECTURE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Project Headline and Core Editorial Metadata */}
              <div key={`meta-${activeProject.slug}`} className="space-y-4 animate-observatory-reveal">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#381932]">
                      {activeProject.title}
                    </h3>
                    <span className="font-mono text-xs text-[#381932]/60 uppercase">
                      ROLE: {activeProject.role}
                    </span>
                  </div>

                  <p className="font-serif italic text-lg sm:text-xl text-[#381932]/85 leading-snug">
                    {activeProject.subtitle}
                  </p>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#381932]/80 leading-relaxed max-w-3xl">
                  {activeProject.overview}
                </p>

                {/* Verifiable Architecture Metrics */}
                {activeProject.verifiableMetrics && activeProject.verifiableMetrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {activeProject.verifiableMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 border border-[#381932]/10 bg-[#FFF3E6]/60 flex items-start gap-2 text-xs font-mono text-[#381932]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#381932] shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="font-mono text-[11px] text-[#381932]/50 mr-1 uppercase">
                    ENGINEERING STACK:
                  </span>
                  {activeProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 border border-[#381932]/15 bg-[#FFFDF9] font-mono text-[11px] text-[#381932]/85"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links & Stepper Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#381932]/10">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <MagneticButton strength={0.2} maxOffset={5}>
                      <Link
                        href={`/work/${activeProject.slug}`}
                        className="px-6 py-3.5 bg-[#381932] text-[#FFF3E6] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#250d21] transition-colors shadow-sm"
                      >
                        <span>VIEW CASE STUDY</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C6F277]" />
                      </Link>
                    </MagneticButton>

                    {activeProject.liveUrl && (
                      <MagneticButton strength={0.15} maxOffset={4}>
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3.5 border border-[#381932] text-[#381932] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#381932] hover:text-[#FFF3E6] transition-colors"
                        >
                          <span>LIVE PLATFORM</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </MagneticButton>
                    )}

                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-3.5 text-[#381932]/70 hover:text-[#381932] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <span>SOURCE CODE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-1 font-mono text-xs ml-auto">
                    <button
                      onClick={handlePrevProject}
                      aria-label="Previous project exhibit"
                      className="p-2.5 border border-[#381932]/20 hover:border-[#381932] hover:bg-[#381932] hover:text-[#FFF3E6] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-2 text-[#381932]/70 font-bold select-none">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                    </span>
                    <button
                      onClick={handleNextProject}
                      aria-label="Next project exhibit"
                      className="p-2.5 border border-[#381932]/20 hover:border-[#381932] hover:bg-[#381932] hover:text-[#FFF3E6] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SMALLER COLUMN: COMPACT VERTICALLY ORGANIZED INDEX (5/12)     */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* Index Header */}
            <div className="flex items-center justify-between border-b border-[#381932]/15 pb-3 font-mono text-xs uppercase tracking-widest text-[#381932]">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#381932]" />
                <span className="font-bold">SYSTEM INDEX // {filteredProjects.length} ENTRIES</span>
              </div>
              <span className="text-[11px] text-[#381932]/50 hidden sm:inline">
                NAV: &uarr; &darr;
              </span>
            </div>

            {/* Vertically Organized Compact Index List */}
            <div
              ref={indexContainerRef}
              className="border border-[#381932]/20 bg-[#FFFDF9] divide-y divide-[#381932]/10 shadow-sm overflow-hidden"
              role="tablist"
              aria-label="Project Observatory Directory"
            >
              {filteredProjects.map((project, idx) => {
                const isSelected = activeProject.slug === project.slug;

                return (
                  <button
                    key={project.slug}
                    onClick={() => handleProjectSelect(project.slug)}
                    role="tab"
                    aria-selected={isSelected}
                    tabIndex={0}
                    className={`w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors duration-150 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[#381932] ${
                      isSelected
                        ? "bg-[#381932] text-[#FFF3E6] border-l-4 border-l-[#C6F277]"
                        : "border-l-4 border-l-transparent bg-transparent text-[#381932] hover:bg-[#381932]/5"
                    }`}
                  >
                    {/* Index Number & Title */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span
                        className={`font-mono text-xs shrink-0 font-bold ${
                          isSelected ? "text-[#C6F277]" : "text-[#381932]/45 group-hover:text-[#381932]"
                        }`}
                      >
                        {project.num}
                      </span>

                      <div className="min-w-0">
                        <div className="font-display font-bold text-sm sm:text-base uppercase tracking-tight truncate leading-tight">
                          {project.title}
                        </div>
                        <div
                          className={`font-mono text-[11px] uppercase tracking-wider truncate mt-0.5 ${
                            isSelected ? "text-[#FFF3E6]/70" : "text-[#381932]/60"
                          }`}
                        >
                          {project.category}
                        </div>
                      </div>
                    </div>

                    {/* Right Year & Selection Indicator */}
                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <span
                        className={`hidden sm:inline text-[11px] ${
                          isSelected ? "text-[#FFF3E6]/60" : "text-[#381932]/40"
                        }`}
                      >
                        {project.year}
                      </span>
                      <div
                        className={`w-7 h-7 flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#C6F277] text-[#381932] border-[#C6F277] font-bold shadow-[0_0_8px_rgba(198,242,119,0.35)]"
                            : "border-[#381932]/20 text-[#381932]/60 group-hover:border-[#381932] group-hover:text-[#381932]"
                        }`}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 border border-[#381932]/10 bg-[#FFFDF9]/60 font-mono text-[11px] text-[#381932]/70 flex items-center justify-between">
              <span>ACTIVE APERTURE: {activeProject.num} OF 15</span>
              <Link
                href={`/work/${activeProject.slug}`}
                className="font-bold underline text-[#381932] hover:opacity-80"
              >
                OPEN CASE STUDY &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 03. COMPACT EDITORIAL STRIP: 3 CURATED FLAGSHIPS BELOW STAGE    */}
        {/* ============================================================== */}
        <div className="pt-12 sm:pt-16 border-t border-[#381932]/15 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="font-mono text-xs tracking-widest text-[#381932]/60 uppercase block">
                // COMPACT CURATED APERTURES
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#381932]">
                FLAGSHIP HIGHLIGHTS
              </h3>
            </div>
            <p className="font-serif italic text-base sm:text-lg text-[#381932]/80 max-w-md">
              Three benchmark production systems engineered for extreme performance, bilingual layout rigor, and procedural color science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {curatedHighlights.map((highlight, index) => (
              <article
                key={highlight.slug}
                className="group border border-[#381932]/20 bg-[#FFFDF9] shadow-sm flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Category & Number Header */}
                  <div className="flex items-center justify-between font-mono text-xs text-[#381932]/70 border-b border-[#381932]/10 pb-3">
                    <span className="font-bold text-[#381932]">FLAGSHIP // 0{index + 1}</span>
                    <span className="uppercase text-[11px]">{highlight.category}</span>
                  </div>

                  {/* Thumbnail Image Viewport */}
                  <Link
                    href={`/work/${highlight.slug}`}
                    className="relative block w-full aspect-[16/10] overflow-hidden bg-[#240f20] border border-[#381932]/15"
                  >
                    <div className="curated-card-inner relative w-full h-[108%] -top-[4%]">
                      <Image
                        src={highlight.coverImage}
                        alt={highlight.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Title and Short Overview */}
                  <div className="space-y-1.5">
                    <h4 className="font-display text-xl font-bold uppercase tracking-tight text-[#381932]">
                      {highlight.title}
                    </h4>
                    <p className="font-serif italic text-sm sm:text-base text-[#381932]/80 line-clamp-2">
                      {highlight.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 sm:p-6 pt-0 border-t border-[#381932]/10 mt-auto flex items-center justify-between font-mono text-xs">
                  <span className="text-[#381932]/60 text-[11px]">{highlight.year} • {highlight.status}</span>
                  <Link
                    href={`/work/${highlight.slug}`}
                    className="font-bold text-[#381932] flex items-center gap-1.5 hover:translate-x-1 transition-transform"
                  >
                    <span>READ CASE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
