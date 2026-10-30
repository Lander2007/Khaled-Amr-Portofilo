"use client";

import { useSyncExternalStore } from "react";

export type MotionPreference = "full" | "reduced" | "system";

const STORAGE_KEY = "portfolio-motion-mode";

/**
 * Returns the current motion preference.
 * Defaults to "full" so Windows users with OS "MinAnimate: 0" (Visual Effects disabled)
 * do not have the portfolio's core creative motion features disabled by default.
 */
export function getMotionPreference(): MotionPreference {
  if (typeof window === "undefined") return "full";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as MotionPreference | null;
    if (stored === "full" || stored === "reduced" || stored === "system") {
      return stored;
    }
  } catch {
    // LocalStorage unavailable
  }
  return "full";
}

/**
 * Updates the user's motion preference and synchronizes DOM & listeners.
 */
export function setMotionPreference(pref: MotionPreference): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // LocalStorage unavailable
  }

  const isReduced =
    pref === "reduced" ||
    (pref === "system" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  document.documentElement.setAttribute(
    "data-reduced-motion",
    isReduced ? "true" : "false"
  );

  window.dispatchEvent(
    new CustomEvent("portfolio-motion-changed", {
      detail: { preference: pref, isReduced },
    })
  );

  // Recalculate ScrollTrigger if available
  try {
    const gsapAny = (window as unknown as { gsap?: { ScrollTrigger?: { refresh: () => void } } }).gsap;
    gsapAny?.ScrollTrigger?.refresh();
  } catch {
    // Safely ignore if not loaded
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  window.addEventListener("portfolio-motion-changed", callback);
  window.addEventListener("storage", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
    window.removeEventListener("portfolio-motion-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const pref = getMotionPreference();
  if (pref === "full") return false;
  if (pref === "reduced") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Hook that returns whether reduced motion is active.
 * Defaults to false (full motion enabled) for optimal creative showcase.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
