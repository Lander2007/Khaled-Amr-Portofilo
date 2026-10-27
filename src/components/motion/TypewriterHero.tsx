"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterHeroProps {
  phrases?: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  pauseBeforeNext?: number;
}

const DEFAULT_PHRASES = [
  "Creative Frontend Developer",
  "Building Interactive Experiences",
  "Crafting Motion-Driven Websites",
  "Turning Ideas Into Interfaces",
  "Exploring Creative Web Technologies",
];

export default function TypewriterHero({
  phrases = DEFAULT_PHRASES,
  className = "",
  typeSpeed = 50,
  deleteSpeed = 26,
  pauseDuration = 1800,
  pauseBeforeNext = 350,
}: TypewriterHeroProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isTabVisible = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Monitor prefers-reduced-motion and tab visibility
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", onMotionChange);

    const handleVisibilityChange = () => {
      isTabVisible.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Continuous, infinitely looping typewriter state machine
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(phrases[0] || "");
      return;
    }

    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex % phrases.length];

    const tick = () => {
      // If tab is inactive, defer the next tick to prevent timer buildup
      if (!isTabVisible.current) {
        timerRef.current = setTimeout(tick, 150);
        return;
      }

      if (!isDeleting) {
        // Typing characters forward
        if (displayText.length < currentPhrase.length) {
          const nextLength = displayText.length + 1;
          setDisplayText(currentPhrase.slice(0, nextLength));

          // Natural human typing rhythm variation
          const jitter = Math.random() * 20 - 10;
          const delay = Math.max(25, typeSpeed + jitter);
          timerRef.current = setTimeout(tick, delay);
        } else {
          // Completed typing full phrase: pause for 1.5 - 2s before backspacing
          timerRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else {
        // Deleting characters backward
        if (displayText.length > 0) {
          const nextLength = displayText.length - 1;
          setDisplayText(currentPhrase.slice(0, nextLength));

          // Brisk backspace speed
          const jitter = Math.random() * 10 - 5;
          const delay = Math.max(18, deleteSpeed + jitter);
          timerRef.current = setTimeout(tick, delay);
        } else {
          // Fully deleted phrase: brief pause, then advance to next phrase
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          timerRef.current = setTimeout(tick, pauseBeforeNext);
        }
      }
    };

    // Trigger initial tick
    timerRef.current = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    displayText,
    isDeleting,
    phraseIndex,
    phrases,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
    pauseBeforeNext,
    prefersReducedMotion,
  ]);

  // Reduced motion accessible fallback: Static, stable phrase with zero layout shift
  if (prefersReducedMotion) {
    return (
      <div
        className={`font-mono text-xs sm:text-sm text-[#381932] tracking-wide flex items-center min-h-[1.75rem] sm:min-h-[2rem] select-none ${className}`}
        aria-label={phrases[0]}
      >
        <span className="text-[#381932]/60 mr-2 shrink-0 select-none">//</span>
        <span className="font-semibold text-[#381932] truncate">{phrases[0]}</span>
      </div>
    );
  }

  return (
    <div
      className={`font-mono text-xs sm:text-sm text-[#381932] tracking-wide flex items-center min-h-[1.75rem] sm:min-h-[2rem] select-none overflow-hidden max-w-full ${className}`}
      aria-live="polite"
      aria-label={displayText || phrases[phraseIndex % phrases.length]}
    >
      <span className="text-[#381932]/60 mr-2 shrink-0 select-none">//</span>
      <span className="font-semibold text-[#381932] whitespace-nowrap overflow-hidden text-ellipsis">
        {displayText}
      </span>
      {/* Blinking Caret in Electric Lime */}
      <span
        className="inline-block w-2 h-3.5 sm:h-4 bg-[#C6F277] ml-1.5 shrink-0 animate-caret shadow-[0_0_8px_rgba(198,242,119,0.7)]"
        aria-hidden="true"
      />
    </div>
  );
}
