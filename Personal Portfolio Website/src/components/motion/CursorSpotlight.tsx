"use client";

import React, { useRef, useEffect } from "react";

interface CursorSpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number; // Radius in px (default: 340)
}

export default function CursorSpotlight({
  children,
  className = "",
  size = 340,
}: CursorSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !spotlightRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = "1";
        spotlightRef.current.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, rgba(255, 243, 230, 0.08) 0%, transparent 80%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (!spotlightRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = "0";
      }
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Radial luminescent spotlight updated directly on DOM with zero re-renders */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300"
      />

      {children}
    </div>
  );
}
