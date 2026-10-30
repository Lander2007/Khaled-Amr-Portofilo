"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene01Hero, { HeroScrollElements } from "@/components/scenes/Scene01Hero";
import Scene02Transform, { TransformScrollElements } from "@/components/scenes/Scene02Transform";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCenterRevealTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const revealWrapRef = useRef<HTMLDivElement>(null);
  const apertureFrameRef = useRef<HTMLDivElement>(null);

  const heroElementsRef = useRef<HeroScrollElements | null>(null);
  const transformElementsRef = useRef<TransformScrollElements | null>(null);

  const [elementsReady, setElementsReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Registration callbacks passed to embedded child sections
  const handleRegisterHero = useCallback((elements: HeroScrollElements) => {
    heroElementsRef.current = elements;
    if (transformElementsRef.current) {
      setElementsReady(true);
    }
  }, []);

  const handleRegisterTransform = useCallback((elements: TransformScrollElements) => {
    transformElementsRef.current = elements;
    if (heroElementsRef.current) {
      setElementsReady(true);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !elementsReady || !containerRef.current || !viewportRef.current) {
      return;
    }

    const heroElements = heroElementsRef.current;
    const transformElements = transformElementsRef.current;
    const heroWrap = heroWrapRef.current;
    const revealWrap = revealWrapRef.current;
    const apertureFrame = apertureFrameRef.current;

    if (!heroWrap || !revealWrap) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 769px) and (max-width: 1023px)",
        isMobile: "(max-width: 768px)",
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions as {
          isDesktop: boolean;
          isTablet: boolean;
          isMobile: boolean;
        };

        // Scroll distances for fluid, natural pacing
        const scrollDistance = isDesktop ? "+=270%" : isMobile ? "+=200%" : "+=230%";

        // Proportional geometric apertures tailored for fluid expansion
        const initialClip = isMobile
          ? "inset(44% 28% 44% 28% round 18px)"
          : isDesktop
          ? "inset(45% 38% 45% 38% round 20px)"
          : "inset(44% 34% 44% 34% round 18px)";

        const finalClip = "inset(0% 0% 0% 0% round 0px)";

        // Initialize GPU layer baseline states
        gsap.set(heroWrap, {
          scale: 1,
          y: 0,
          opacity: 1,
          pointerEvents: "auto",
        });

        gsap.set(revealWrap, {
          clipPath: initialClip,
          scale: 0.96,
          autoAlpha: 0,
          pointerEvents: "none",
        });

        if (apertureFrame) {
          gsap.set(apertureFrame, {
            opacity: 1,
          });
        }

        // State trackers to eliminate redundant DOM mutation thrashing during scroll
        let lastPointerState: "hero" | "reveal" = "hero";

        // Single Master Synchronized Scrub Timeline with smooth inertial dampening
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: scrollDistance,
            pin: viewportRef.current,
            scrub: 0.8, // Smooth, weighted inertial damping for buttery motion
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Optimized pointer-events handoff without layout thrashing
              const shouldTargetReveal = self.progress >= 0.32;
              const nextState = shouldTargetReveal ? "reveal" : "hero";

              if (nextState !== lastPointerState) {
                lastPointerState = nextState;
                if (shouldTargetReveal) {
                  heroWrap.style.pointerEvents = "none";
                  revealWrap.style.pointerEvents = "auto";
                } else {
                  heroWrap.style.pointerEvents = "auto";
                  revealWrap.style.pointerEvents = "none";
                }
              }
            },
            onLeaveBack: () => {
              // Guaranteed instant reset when completely at scroll 0
              lastPointerState = "hero";
              heroWrap.style.opacity = "1";
              heroWrap.style.transform = "none";
              heroWrap.style.pointerEvents = "auto";

              revealWrap.style.opacity = "0";
              revealWrap.style.visibility = "hidden";
              revealWrap.style.pointerEvents = "none";
              revealWrap.style.clipPath = initialClip;

              if (heroElements?.wordRow1) heroElements.wordRow1.style.transform = "none";
              if (heroElements?.wordRow2) heroElements.wordRow2.style.transform = "none";
              if (heroElements?.wordRow3) heroElements.wordRow3.style.transform = "none";
            },
          },
        });

        // ==============================================================
        // 0. GLOBAL METAMORPHOSIS PROGRESS BAR (0.0 to 1.0)
        // ==============================================================
        if (transformElements?.progressBar) {
          masterTl.fromTo(
            transformElements.progressBar,
            { width: "0%" },
            { width: "100%", ease: "none" },
            0
          );
        }

        // ==============================================================
        // PHASE 1: BUTTERY CINEMATIC CENTER APERTURE REVEAL (0.0 to 0.34)
        // ==============================================================

        // 1. Reveal container clip-path expands gracefully with organic deceleration
        masterTl.fromTo(
          revealWrap,
          {
            clipPath: initialClip,
            scale: 0.96,
          },
          {
            clipPath: finalClip,
            scale: 1,
            duration: 0.34,
            ease: "sine.inOut",
          },
          0
        );

        // Fluid autoAlpha emergence: gentle fade-in matching the aperture expansion
        masterTl.fromTo(
          revealWrap,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.16,
            ease: "power2.out",
          },
          0
        );

        // Architectural hairline border on aperture dissolves gently as opening reaches screen edges
        if (apertureFrame) {
          masterTl.fromTo(
            apertureFrame,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.12,
              ease: "power1.out",
            },
            0.22
          );
        }

        // 2. Hero layer recedes gracefully with subtle scale and soft depth fade
        masterTl.fromTo(
          heroWrap,
          {
            scale: 1,
            y: 0,
            opacity: 1,
          },
          {
            scale: 0.94,
            y: -20,
            opacity: 0.28,
            duration: 0.34,
            ease: "sine.inOut",
          },
          0
        );

        // 3. Hero Word Wall opposing kinetic glides
        if (
          heroElements?.wordRow1 &&
          heroElements?.wordRow2 &&
          heroElements?.wordRow3
        ) {
          masterTl.fromTo(
            heroElements.wordRow1,
            { xPercent: 0 },
            {
              xPercent: isDesktop ? -15 : -22,
              ease: "none",
              duration: 0.34,
            },
            0
          );
          masterTl.fromTo(
            heroElements.wordRow2,
            { xPercent: 0 },
            {
              xPercent: isDesktop ? 15 : 22,
              ease: "none",
              duration: 0.34,
            },
            0
          );
          masterTl.fromTo(
            heroElements.wordRow3,
            { xPercent: 0 },
            {
              xPercent: isDesktop ? -11 : -16,
              ease: "none",
              duration: 0.34,
            },
            0
          );
        }

        // ==============================================================
        // PHASE 2: RESOLVED STAGE 01 (FORM) REST (0.34 to 0.40)
        // Section occupies full viewport in its pristine original layout
        // ==============================================================

        // ==============================================================
        // PHASE 3: STAGE 01 (FORM) -> STAGE 02 (SHIFT) (0.40 to 0.64)
        // ==============================================================

        // Statement 01 fades out
        if (transformElements?.stmt1) {
          masterTl.fromTo(
            transformElements.stmt1,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -20, duration: 0.10, ease: "power2.in" },
            0.40
          );
        }

        // Indicator 01 dims, Indicator 02 illuminates
        if (transformElements?.stagePill1 && transformElements?.stagePill2) {
          masterTl.fromTo(
            transformElements.stagePill1,
            { opacity: 1, color: "#C6F277" },
            { opacity: 0.35, color: "#FFF3E6", duration: 0.08 },
            0.44
          );
          masterTl.fromTo(
            transformElements.stagePill2,
            { opacity: 0.35, color: "#FFF3E6" },
            { opacity: 1, color: "#C6F277", duration: 0.08 },
            0.44
          );
        }

        // Word FORM transforms: scales, glides up-left, settles into watermark
        if (transformElements?.wordForm) {
          masterTl.fromTo(
            transformElements.wordForm,
            {
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              letterSpacing: "normal",
              opacity: 1,
            },
            {
              scale: isDesktop ? 0.65 : 0.7,
              xPercent: isDesktop ? -25 : -15,
              yPercent: isDesktop ? -20 : -15,
              letterSpacing: "0.08em",
              opacity: 0.14,
              duration: 0.18,
              ease: "power2.inOut",
            },
            0.42
          );
        }

        // Word SHIFT sweeps into center stage with kinetic power
        if (transformElements?.wordShift) {
          masterTl.fromTo(
            transformElements.wordShift,
            { opacity: 0, scale: 0.85, yPercent: 35 },
            {
              opacity: 1,
              scale: 1,
              yPercent: 0,
              duration: 0.18,
              ease: "power2.out",
            },
            0.44
          );
        }

        // Statement 02 reveals
        if (transformElements?.stmt2) {
          masterTl.fromTo(
            transformElements.stmt2,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
            0.46
          );
        }

        // ==============================================================
        // PHASE 4: STAGE 02 (SHIFT) -> STAGE 03 (WORK) (0.66 to 0.94)
        // ==============================================================

        // Statement 02 fades out
        if (transformElements?.stmt2) {
          masterTl.to(
            transformElements.stmt2,
            { opacity: 0, y: -20, duration: 0.08, ease: "power2.in" },
            0.66
          );
        }

        // Indicator 02 dims, Indicator 03 illuminates
        if (transformElements?.stagePill2 && transformElements?.stagePill3) {
          masterTl.to(
            transformElements.stagePill2,
            { opacity: 0.35, color: "#FFF3E6", duration: 0.08 },
            0.70
          );
          masterTl.fromTo(
            transformElements.stagePill3,
            { opacity: 0.35, color: "#FFF3E6" },
            { opacity: 1, color: "#C6F277", duration: 0.08 },
            0.70
          );
        }

        // Typography recedes gracefully
        if (transformElements?.wordShift) {
          masterTl.to(
            transformElements.wordShift,
            {
              opacity: 0,
              scale: 0.6,
              yPercent: -35,
              duration: 0.14,
              ease: "power2.in",
            },
            0.67
          );
        }

        if (transformElements?.wordForm) {
          masterTl.to(
            transformElements.wordForm,
            {
              opacity: 0,
              scale: 0.4,
              yPercent: -35,
              duration: 0.14,
              ease: "power2.in",
            },
            0.67
          );
        }

        // Stage 03 Compact Header Banner resolves
        if (transformElements?.stage3Header) {
          masterTl.fromTo(
            transformElements.stage3Header,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
            0.72
          );
        }

        // Statement 03 reveals
        if (transformElements?.stmt3) {
          masterTl.fromTo(
            transformElements.stmt3,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
            0.74
          );
        }

        // Genuine Project Showcase Card emerges
        if (transformElements?.projectCard) {
          masterTl.fromTo(
            transformElements.projectCard,
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
              duration: 0.20,
              ease: "power2.out",
            },
            0.74
          );
        }
      },
      containerRef
    );

    return () => {
      mm.revert();
    };
  }, [elementsReady, prefersReducedMotion]);

  // Reduced motion: Clean immediate sequential flow without pinning or clipping
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full">
        <Scene01Hero />
        <Scene02Transform />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="hero-portal-boundary"
      className="relative w-full bg-[#FFF3E6]"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={viewportRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Layer 1 (Underneath): Base Editorial Hero */}
        <div
          ref={heroWrapRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto"
          style={{
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          <Scene01Hero
            isEmbedded={true}
            onRegisterScrollElements={handleRegisterHero}
          />
        </div>

        {/* Layer 2 (On Top): Center-Origin Reveal Container */}
        <div
          ref={revealWrapRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-none opacity-0 invisible"
          style={{
            willChange: "clip-path, transform, opacity",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Architectural Hairline Inner Bezel on Expanding Aperture */}
          <div
            ref={apertureFrameRef}
            className="absolute inset-0 pointer-events-none z-30 transition-opacity"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255, 243, 230, 0.25), inset 0 0 32px rgba(0, 0, 0, 0.4)",
            }}
          />

          <Scene02Transform
            isEmbedded={true}
            onRegisterTransformElements={handleRegisterTransform}
          />
        </div>
      </div>
    </div>
  );
}
