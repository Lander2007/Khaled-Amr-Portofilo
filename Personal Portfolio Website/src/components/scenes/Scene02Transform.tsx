"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/data/projectsData";
import MagneticButton from "@/components/motion/MagneticButton";
import LiquidDivider from "@/components/motion/LiquidDivider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Scene02Transform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Stage Indicator Refs
  const stagePill1Ref = useRef<HTMLDivElement>(null);
  const stagePill2Ref = useRef<HTMLDivElement>(null);
  const stagePill3Ref = useRef<HTMLDivElement>(null);

  // Kinetic Typography Refs
  const wordFormRef = useRef<HTMLDivElement>(null);
  const wordShiftRef = useRef<HTMLDivElement>(null);

  // Supporting Statements Refs
  const stmt1Ref = useRef<HTMLDivElement>(null);
  const stmt2Ref = useRef<HTMLDivElement>(null);
  const stmt3Ref = useRef<HTMLDivElement>(null);

  // Stage 03 Work Elements
  const stage3HeaderRef = useRef<HTMLDivElement>(null);
  const projectCardRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  // First verified genuine project from data
  const featuredProject = PROJECTS[0]; // Code Systems SW

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };
        const scrollDistance = isDesktop ? "+=180%" : "+=130%";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: scrollDistance,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 0. Live Timeline Progress Bar
        if (progressBarRef.current) {
          tl.to(progressBarRef.current, { width: "100%", ease: "none" }, 0);
        }

        // ==============================================================
        // TRANSITION: STAGE 01 (FORM) -> STAGE 02 (SHIFT) [0.20 to 0.45]
        // ==============================================================

        // Statement 01 fades out
        if (stmt1Ref.current) {
          tl.to(
            stmt1Ref.current,
            { opacity: 0, y: -20, duration: 0.14, ease: "power2.in" },
            0.18
          );
        }

        // Indicator 01 dims, Indicator 02 illuminates
        if (stagePill1Ref.current && stagePill2Ref.current) {
          tl.to(
            stagePill1Ref.current,
            { opacity: 0.35, color: "#FFF3E6", duration: 0.1 },
            0.24
          );
          tl.to(
            stagePill2Ref.current,
            { opacity: 1, color: "#C6F277", duration: 0.1 },
            0.24
          );
        }

        // Word FORM transforms: scales, glides up-left, letter spacing breathes, settles into watermark
        if (wordFormRef.current) {
          tl.to(
            wordFormRef.current,
            {
              scale: isDesktop ? 0.65 : 0.7,
              xPercent: isDesktop ? -25 : -15,
              yPercent: isDesktop ? -20 : -15,
              letterSpacing: "0.08em",
              opacity: 0.14,
              duration: 0.26,
              ease: "power2.inOut",
            },
            0.18
          );
        }

        // Word SHIFT sweeps into center stage with kinetic power
        if (wordShiftRef.current) {
          tl.fromTo(
            wordShiftRef.current,
            { opacity: 0, scale: 0.85, yPercent: 35 },
            {
              opacity: 1,
              scale: 1,
              yPercent: 0,
              duration: 0.25,
              ease: "power2.out",
            },
            0.22
          );
        }

        // Statement 02 reveals
        if (stmt2Ref.current) {
          tl.fromTo(
            stmt2Ref.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
            0.26
          );
        }

        // ==============================================================
        // TRANSITION: STAGE 02 (SHIFT) -> STAGE 03 (WORK) [0.55 to 0.85]
        // ==============================================================

        // Statement 02 fades out
        if (stmt2Ref.current) {
          tl.to(
            stmt2Ref.current,
            { opacity: 0, y: -20, duration: 0.12, ease: "power2.in" },
            0.56
          );
        }

        // Indicator 02 dims, Indicator 03 illuminates
        if (stagePill2Ref.current && stagePill3Ref.current) {
          tl.to(
            stagePill2Ref.current,
            { opacity: 0.35, color: "#FFF3E6", duration: 0.1 },
            0.62
          );
          tl.to(
            stagePill3Ref.current,
            { opacity: 1, color: "#C6F277", duration: 0.1 },
            0.62
          );
        }

        // Typography recedes gracefully to make room for project showcase
        if (wordShiftRef.current) {
          tl.to(
            wordShiftRef.current,
            {
              opacity: 0,
              scale: 0.6,
              yPercent: -35,
              duration: 0.2,
              ease: "power2.in",
            },
            0.56
          );
        }

        if (wordFormRef.current) {
          tl.to(
            wordFormRef.current,
            {
              opacity: 0,
              scale: 0.4,
              yPercent: -35,
              duration: 0.2,
              ease: "power2.in",
            },
            0.56
          );
        }

        // Stage 03 Compact Header Banner resolves
        if (stage3HeaderRef.current) {
          tl.fromTo(
            stage3HeaderRef.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
            0.62
          );
        }

        // Statement 03 reveals
        if (stmt3Ref.current) {
          tl.fromTo(
            stmt3Ref.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
            0.64
          );
        }

        // Genuine Project Showcase Card emerges
        if (projectCardRef.current) {
          tl.fromTo(
            projectCardRef.current,
            {
              opacity: 0,
              yPercent: 18,
              scale: 0.94,
              pointerEvents: "none",
            },
            {
              opacity: 1,
              yPercent: 0,
              scale: 1,
              pointerEvents: "auto",
              duration: 0.26,
              ease: "power2.out",
            },
            0.64
          );
        }
      }
    );

    return () => mm.revert();
  }, [prefersReducedMotion]);

  // Render static accessible layout for reduced motion
  if (prefersReducedMotion) {
    return (
      <section
        id="transform"
        className="relative w-full bg-[#381932] text-[#FFF3E6] py-24 px-6 sm:px-12 md:px-16 space-y-16"
        aria-label="The Kinetic Sequence: Form, Shift, Work"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#FFF3E6]/20 pb-4 font-mono text-xs uppercase tracking-widest text-[#FFF3E6]/70">
            <span>02 // THE KINETIC SEQUENCE</span>
            <span>FORM &rarr; SHIFT &rarr; WORK</span>
          </div>

          {/* Static Stage 1 */}
          <div className="border border-[#FFF3E6]/20 p-8 space-y-4 bg-[#240f20]/60">
            <span className="font-mono text-xs text-[#C6F277] uppercase tracking-wider block">
              [ 01 // STAGE: FORM ]
            </span>
            <h3 className="font-display text-5xl sm:text-7xl font-black uppercase text-[#FFF3E6]">
              FORM
            </h3>
            <p className="font-serif italic text-2xl text-[#FFF3E6]/85">
              &ldquo;Every experience begins with an idea.&rdquo;
            </p>
          </div>

          {/* Static Stage 2 */}
          <div className="border border-[#FFF3E6]/20 p-8 space-y-4 bg-[#240f20]/60">
            <span className="font-mono text-xs text-[#C6F277] uppercase tracking-wider block">
              [ 02 // STAGE: SHIFT ]
            </span>
            <h3 className="font-serif italic text-5xl sm:text-7xl text-[#C6F277] lowercase">
              /shift
            </h3>
            <p className="font-serif italic text-2xl text-[#FFF3E6]/85">
              &ldquo;Interaction gives it movement.&rdquo;
            </p>
          </div>

          {/* Static Stage 3 */}
          <div className="border border-[#FFF3E6]/30 p-8 space-y-6 bg-[#240f20]">
            <span className="font-mono text-xs text-[#C6F277] uppercase tracking-wider block">
              [ 03 // STAGE: WORK ]
            </span>
            <h3 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FFF3E6]">
              WORK
            </h3>
            <p className="font-serif italic text-2xl text-[#FFF3E6]/90">
              &ldquo;The result is something you can explore.&rdquo;
            </p>

            {/* Featured Project Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-4 border-t border-[#FFF3E6]/15">
              <div className="md:col-span-5 relative aspect-[16/10] overflow-hidden border border-[#FFF3E6]/20">
                <Image
                  src={featuredProject.coverImage}
                  alt={featuredProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-7 space-y-4">
                <div className="font-mono text-xs text-[#C6F277] uppercase tracking-wider">
                  FEATURED CLIENT ARCHITECTURE
                </div>
                <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#FFF3E6]">
                  {featuredProject.title}
                </h4>
                <p className="text-sm text-[#FFF3E6]/75">
                  {featuredProject.subtitle}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {featuredProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 font-mono text-[11px] border border-[#FFF3E6]/20 bg-[#1b0a18] text-[#FFF3E6]/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href={`/work/${featuredProject.slug}`}
                    className="px-5 py-2.5 bg-[#C6F277] text-[#381932] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#d4f796] transition-colors"
                  >
                    <span>VIEW CASE STUDY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  {featuredProject.liveUrl && (
                    <a
                      href={featuredProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 border border-[#FFF3E6]/40 text-[#FFF3E6] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:border-[#FFF3E6] transition-colors"
                    >
                      <span>LIVE PLATFORM</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FFF3E6]/15 flex justify-end">
              <a
                href="#work"
                className="font-mono text-xs text-[#C6F277] hover:underline uppercase tracking-wider flex items-center gap-2"
              >
                <span>EXPLORE ALL 15 EXHIBITS IN OBSERVATORY</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="transform"
      className="relative w-full h-screen bg-[#381932] text-[#FFF3E6] overflow-hidden select-none flex flex-col justify-between"
      aria-label="The Kinetic Sequence: Form, Shift, Work"
    >
      {/* Background Architectural Grid Lines in Plum */}
      <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-20 z-0" />

      {/* ============================================================== */}
      {/* TOP STRIP: SECTION MARKER & PROGRESSIVE STAGE INDICATOR         */}
      {/* ============================================================== */}
      <div className="relative z-20 pt-24 sm:pt-28 md:pt-32 px-6 sm:px-12 md:px-16 flex items-center justify-between text-xs font-mono tracking-widest uppercase border-b border-[#FFF3E6]/15 pb-4">
        {/* Section Identifier */}
        <div className="flex items-center gap-3 text-[#FFF3E6]/70">
          <span className="w-2 h-2 bg-[#C6F277] inline-block shadow-[0_0_8px_rgba(198,242,119,0.6)]" />
          <span className="font-bold text-[#FFF3E6]">02 // THE KINETIC SEQUENCE</span>
        </div>

        {/* 3-Stage Narrative Tracker */}
        <div className="flex items-center gap-3 sm:gap-6 font-mono text-[11px] sm:text-xs">
          <div
            ref={stagePill1Ref}
            className="flex items-center gap-1.5 font-bold text-[#C6F277] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277]" />
            <span>01. FORM</span>
          </div>
          <span className="text-[#FFF3E6]/25">&rarr;</span>
          <div
            ref={stagePill2Ref}
            className="flex items-center gap-1.5 text-[#FFF3E6]/35 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>02. SHIFT</span>
          </div>
          <span className="text-[#FFF3E6]/25">&rarr;</span>
          <div
            ref={stagePill3Ref}
            className="flex items-center gap-1.5 text-[#FFF3E6]/35 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>03. WORK</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CENTRAL STAGE: THREE-STAGE PROGRESSIVE NARRATIVE                */}
      {/* ============================================================== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-10 md:px-16 max-w-7xl mx-auto w-full">
        {/* Stage 01 & Stage 02 Kinetic Typographic Canvas */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[46vh] sm:min-h-[52vh]">
          {/* Word 01: FORM — Monolithic Architectural Block */}
          <div
            ref={wordFormRef}
            className="font-display font-black text-[clamp(4.2rem,14vw,11.5rem)] uppercase leading-none tracking-tight text-[#FFF3E6] text-center will-change-transform select-none"
          >
            FORM
          </div>

          {/* Word 02: SHIFT — Kinetic Expressive Serif Italic */}
          <div
            ref={wordShiftRef}
            className="absolute font-serif italic font-normal text-[clamp(4.5rem,15vw,12.5rem)] lowercase leading-none tracking-tighter text-[#C6F277] text-center will-change-transform opacity-0 pointer-events-none select-none drop-shadow-[0_4px_24px_rgba(198,242,119,0.2)]"
          >
            /shift
          </div>

          {/* Supporting Statement 01: FORM */}
          <div
            ref={stmt1Ref}
            className="mt-6 sm:mt-8 text-center max-w-xl px-4 will-change-transform"
          >
            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#FFF3E6]/85 leading-snug">
              &ldquo;Every experience begins with an idea.&rdquo;
            </p>
            <span className="font-mono text-[11px] text-[#FFF3E6]/40 uppercase tracking-[0.2em] mt-2 block">
              STAGE 01 &bull; ARCHITECTURAL INTENT
            </span>
          </div>

          {/* Supporting Statement 02: SHIFT */}
          <div
            ref={stmt2Ref}
            className="absolute bottom-4 sm:bottom-8 text-center max-w-xl px-4 will-change-transform opacity-0 pointer-events-none"
          >
            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#C6F277] leading-snug">
              &ldquo;Interaction gives it movement.&rdquo;
            </p>
            <span className="font-mono text-[11px] text-[#C6F277]/60 uppercase tracking-[0.2em] mt-2 block">
              STAGE 02 &bull; KINETIC METAMORPHOSIS
            </span>
          </div>

          {/* ============================================================== */}
          {/* STAGE 03: WORK RESOLUTION & GENUINE PROJECT PREVIEW CARD       */}
          {/* ============================================================== */}

          {/* Stage 03 Compact Header Banner */}
          <div
            ref={stage3HeaderRef}
            className="absolute top-0 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#FFF3E6]/20 pb-3 opacity-0 pointer-events-none will-change-transform"
          >
            <div className="space-y-0.5">
              <span className="font-mono text-[11px] text-[#C6F277] uppercase tracking-widest block">
                [ STAGE 03 // RESOLUTION ]
              </span>
              <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#FFF3E6] tracking-tight">
                WORK
              </div>
            </div>

            {/* Supporting Statement 03 */}
            <div ref={stmt3Ref} className="opacity-0 will-change-transform">
              <p className="font-serif italic text-base sm:text-lg text-[#FFF3E6]/85 max-w-md">
                &ldquo;The result is something you can explore.&rdquo;
              </p>
            </div>
          </div>

          {/* Stage 03 Project Showcase Card (Code Systems SW) */}
          <div
            ref={projectCardRef}
            className="absolute w-full max-w-4xl border border-[#FFF3E6]/25 bg-[#250f22]/95 backdrop-blur-md p-4 sm:p-6 md:p-7 space-y-5 opacity-0 pointer-events-none will-change-transform shadow-2xl mt-12 sm:mt-10"
          >
            {/* Card Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFF3E6]/15 pb-3 font-mono text-[11px] text-[#FFF3E6]/70 uppercase">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] shadow-[0_0_6px_rgba(198,242,119,0.8)]" />
                <span className="text-[#C6F277] font-bold">
                  EXHIBIT 01 / 15 &bull; {featuredProject.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#FFF3E6]/50">
                <span>YEAR: {featuredProject.year}</span>
                <span>&bull;</span>
                <span className="text-[#FFF3E6]/90 font-medium">{featuredProject.status}</span>
              </div>
            </div>

            {/* Card Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Left Column: Real Project Screenshot */}
              <div className="md:col-span-5 relative aspect-[16/10] overflow-hidden border border-[#FFF3E6]/20 bg-[#180a16] group">
                <Image
                  src={featuredProject.coverImage}
                  alt={featuredProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-[#381932]/15 pointer-events-none" />
              </div>

              {/* Right Column: Architectural Details & Verified Stack */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="space-y-1">
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#FFF3E6]">
                    {featuredProject.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#FFF3E6]/80 leading-relaxed line-clamp-2">
                    {featuredProject.subtitle}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuredProject.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 font-mono text-[10px] sm:text-[11px] border border-[#FFF3E6]/15 bg-[#1a0a18] text-[#FFF3E6]/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action CTA Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <MagneticButton strength={0.18} maxOffset={4}>
                    <Link
                      href={`/work/${featuredProject.slug}`}
                      className="px-5 py-2.5 bg-[#C6F277] text-[#381932] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#d4f796] transition-colors shadow-sm"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </MagneticButton>

                  {featuredProject.liveUrl && (
                    <MagneticButton strength={0.12} maxOffset={3}>
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 border border-[#FFF3E6]/35 text-[#FFF3E6] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:border-[#FFF3E6] hover:bg-[#FFF3E6]/10 transition-colors"
                      >
                        <span>LIVE PLATFORM</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </MagneticButton>
                  )}
                </div>
              </div>
            </div>

            {/* Seamless Transition Handoff into Observatory */}
            <div className="pt-3 border-t border-[#FFF3E6]/15 flex items-center justify-between font-mono text-xs">
              <span className="text-[#FFF3E6]/50 hidden sm:inline">
                SCROLL CONTINUES DIRECTLY INTO OBSERVATORY
              </span>
              <a
                href="#work"
                className="ml-auto font-mono text-xs text-[#C6F277] hover:text-[#d4f796] font-bold uppercase tracking-wider flex items-center gap-1.5 group transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#C6F277]" />
                <span className="underline decoration-1 underline-offset-4">
                  EXPLORE THE PROJECT OBSERVATORY (15 EXHIBITS)
                </span>
                <span className="group-hover:translate-y-0.5 transition-transform">&darr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM STRIP: KINETIC STATUS & LIVE SCROLL PROGRESS TRACK       */}
      {/* ============================================================== */}
      <div className="relative z-20 pb-4 px-6 sm:px-12 md:px-16 flex items-center justify-between font-mono text-xs text-[#FFF3E6]/50 tracking-widest uppercase border-t border-[#FFF3E6]/15 pt-3">
        <div className="flex items-center gap-2">
          <span>SEQUENCE: FORM [01] &rarr; SHIFT [02] &rarr; WORK [03]</span>
        </div>

        {/* Live Scroll Scrub Progress Track */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] hidden sm:inline text-[#FFF3E6]/40">
            METAMORPHOSIS PROGRESS
          </span>
          <div className="w-24 sm:w-36 h-1 bg-[#FFF3E6]/15 overflow-hidden">
            <div ref={progressBarRef} className="h-full bg-[#C6F277] w-0 transition-none" />
          </div>
        </div>
      </div>

      {/* Organic Liquid Divider Boundary Transitioning to Scene 03 (#FFF3E6) */}
      <LiquidDivider fillColor="#FFF3E6" direction="bottom" />
    </section>
  );
}
