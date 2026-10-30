"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface LiquidDividerProps {
  fillColor?: string; // e.g. "#381932" or "#FFF3E6"
  direction?: "top" | "bottom";
  className?: string;
}

export default function LiquidDivider({
  fillColor = "#381932",
  direction = "bottom",
  className = "",
}: LiquidDividerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const isFlipped = direction === "top";

  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none select-none ${
        isFlipped ? "rotate-180" : ""
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 md:h-16 block"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C240,65 480,84 720,55 C960,26 1200,68 1440,20 L1440,84 L0,84 Z"
          fill={fillColor}
        />
        {!prefersReducedMotion && (
          <path
            d="M0,25 C300,75 580,30 900,65 C1180,95 1340,35 1440,45 L1440,84 L0,84 Z"
            fill={fillColor}
            opacity="0.35"
          />
        )}
      </svg>
    </div>
  );
}
