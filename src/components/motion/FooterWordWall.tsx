"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function FooterWordWall() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerBackgroundRef = useRef<HTMLDivElement>(null);
  const layerMidgroundRef = useRef<HTMLDivElement>(null);
  const layerForegroundRef = useRef<HTMLDivElement>(null);

  // Easter Egg State (Controlled, lightweight discovery on 'EXPERIMENT')
  const [eggActive, setEggActive] = useState(false);
  const [eggText, setEggText] = useState("EXPERIMENT");
  const eggTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Parallax pointer tracking (Scoped exclusively to container, zero continuous rAF)
  const pointerRafRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Subtle Easter Egg craft reveal on EXPERIMENT click
  const handleEggClick = useCallback(() => {
    if (eggActive) return;
    setEggActive(true);
    setEggText("UNSEEN CRAFT // 31.2° N");

    if (eggTimerRef.current) clearTimeout(eggTimerRef.current);
    eggTimerRef.current = setTimeout(() => {
      setEggText("EXPERIMENT");
      setEggActive(false);
    }, 2800);
  }, [eggActive]);

  // Clean cleanup on unmount
  useEffect(() => {
    return () => {
      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
      if (eggTimerRef.current) clearTimeout(eggTimerRef.current);
    };
  }, []);

  // Lightweight, hardware-accelerated Scroll-Driven Scrub
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Background monumental word layer: subtle opposing horizontal glide
      if (layerBackgroundRef.current) {
        gsap.fromTo(
          layerBackgroundRef.current,
          { xPercent: 2 },
          {
            xPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }

      // Midground editorial layer: subtle counter-glide
      if (layerMidgroundRef.current) {
        gsap.fromTo(
          layerMidgroundRef.current,
          { xPercent: -2 },
          {
            xPercent: 2,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Scoped, restrained cursor parallax (Active ONLY while mouse is inside container)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
      pointerRafRef.current = requestAnimationFrame(() => {
        if (layerBackgroundRef.current) {
          layerBackgroundRef.current.style.transform = `translate3d(${(normX * 12).toFixed(1)}px, ${(normY * 8).toFixed(1)}px, 0)`;
        }
        if (layerMidgroundRef.current) {
          layerMidgroundRef.current.style.transform = `translate3d(${(normX * -18).toFixed(1)}px, ${(normY * -10).toFixed(1)}px, 0)`;
        }
        if (layerForegroundRef.current) {
          layerForegroundRef.current.style.transform = `translate3d(${(normX * 8).toFixed(1)}px, ${(normY * 6).toFixed(1)}px, 0)`;
        }
      });
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
    if (layerBackgroundRef.current) {
      layerBackgroundRef.current.style.transform = "translate3d(0, 0, 0)";
      layerBackgroundRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    if (layerMidgroundRef.current) {
      layerMidgroundRef.current.style.transform = "translate3d(0, 0, 0)";
      layerMidgroundRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    if (layerForegroundRef.current) {
      layerForegroundRef.current.style.transform = "translate3d(0, 0, 0)";
      layerForegroundRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full overflow-hidden select-none py-12 sm:py-20 my-10 border-y border-[#FFF3E6]/15"
      role="region"
      aria-label="Editorial Typographic Playground"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-10" />

      {/* ============================================================== */}
      {/* ROW 1: MONUMENTAL OVERSIZED ANCHOR & CONTRASTING ITALIC SERIF   */}
      {/* ============================================================== */}
      <div
        ref={layerBackgroundRef}
        className="relative w-full will-change-transform"
      >
        <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4 overflow-visible">
          {/* Dominant Oversized Word: SHIFT (Deliberately cropped on right) */}
          <div className="group cursor-default">
            <span className="font-display font-black text-[clamp(5.5rem,19vw,15.5rem)] uppercase leading-[0.82] tracking-tighter text-[#FFF3E6] group-hover:text-[#C6F277] transition-colors duration-300 inline-block -ml-2 sm:-ml-4">
              SHIFT
            </span>
          </div>

          {/* Secondary Counterweight: /interactive. (Instrument Serif Italic in Electric Lime) */}
          <div className="group cursor-default lg:-mt-10 lg:mr-2 self-start lg:self-end">
            <span className="font-serif italic font-normal text-[clamp(3rem,8.5vw,7.8rem)] lowercase leading-none tracking-tight text-[#C6F277] group-hover:scale-[1.03] transition-transform duration-300 inline-block drop-shadow-[0_0_25px_rgba(198,242,119,0.3)]">
              /interactive.
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 2: ASYMMETRICAL EDITORIAL MIDGROUND                         */}
      {/* ============================================================== */}
      <div
        ref={layerMidgroundRef}
        className="relative z-10 w-full pt-8 sm:pt-12 will-change-transform"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Anchor: FORM & BUILD */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-baseline gap-4 sm:gap-6 flex-wrap">
              <span className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#FFF3E6]/90 hover:text-[#C6F277] hover:scale-[1.03] transition-all duration-300 cursor-default inline-block">
                FORM
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#FFF3E6]/45 hover:text-[#C6F277] transition-colors duration-200 cursor-default">
                [ BUILD ]
              </span>
            </div>
            <div className="font-mono text-[10px] tracking-widest text-[#FFF3E6]/35 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277]" />
              <span>SYNTAX // MOTION DYNAMICS</span>
            </div>
          </div>

          {/* Center Expressive Flourish: create */}
          <div className="md:col-span-3 flex justify-start md:justify-center">
            <span className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#FFF3E6]/75 hover:text-[#C6F277] hover:scale-[1.04] transition-all duration-300 cursor-default inline-block">
              create
            </span>
          </div>

          {/* Right Editorial Cluster: DIGITAL & EXPLORE */}
          <div className="md:col-span-4 flex flex-col md:items-end space-y-2">
            <span className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-widest text-[#FFF3E6]/40 hover:text-[#FFF3E6] transition-colors duration-300 cursor-default">
              DIGITAL
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-[#C6F277]/80 hover:text-[#C6F277] transition-colors duration-200 cursor-default">
              &rarr; EXPLORE
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ROW 3: KINETIC RESOLUTION (EXPERIMENT PROBE, MOTION, IDEAS)     */}
      {/* ============================================================== */}
      <div
        ref={layerForegroundRef}
        className="relative z-20 w-full pt-10 sm:pt-14 mt-8 border-t border-[#FFF3E6]/10 will-change-transform"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Interactive Easter Egg Trigger: EXPERIMENT */}
          <button
            type="button"
            onClick={handleEggClick}
            className="group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6F277] py-1 transition-all"
            aria-label="Interactive Typographic Experiment"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(198,242,119,0.8)]" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#C6F277] uppercase">
                {eggActive ? "[ CRAFT // DISCOVERED ]" : "[ CLICK TO PROBE ]"}
              </span>
            </div>
            <div className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#FFF3E6] group-hover:text-[#C6F277] transition-colors duration-200">
              {eggText}
            </div>
          </button>

          {/* Accompanying Editorial Pair: MOTION & IDEAS */}
          <div className="flex items-center gap-8 sm:gap-12 font-mono">
            <div className="group cursor-default flex items-center gap-2 text-[#FFF3E6]/80 hover:text-[#C6F277] transition-colors duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] animate-pulse" />
              <span className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider">
                MOTION
              </span>
            </div>

            <div className="group cursor-default">
              <span className="font-serif italic text-2xl sm:text-3xl text-[#FFF3E6]/70 group-hover:text-[#FFF3E6] transition-colors duration-200 lowercase">
                ideas.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
