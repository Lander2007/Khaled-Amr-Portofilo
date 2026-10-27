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

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

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
