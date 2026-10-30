"use client";

import React, { useRef, useEffect } from "react";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  strength?: number; // Distance multiplier (default: 0.25)
  maxOffset?: number; // Max distance in px (default: 10)
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.25,
  maxOffset = 10,
  className = "",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (typeof document !== "undefined" && document.documentElement.getAttribute("data-reduced-motion") === "true") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    let rect = rectRef.current;
    if (!rect) {
      const r = el.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      rectRef.current = rect;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${boundedX.toFixed(1)}px, ${boundedY.toFixed(1)}px, 0)`;
      el.style.transition = "transform 0.1s linear";
    });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (!ref.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = "translate3d(0px, 0px, 0)";
        ref.current.style.transition = "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)";
      }
    });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
      }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
