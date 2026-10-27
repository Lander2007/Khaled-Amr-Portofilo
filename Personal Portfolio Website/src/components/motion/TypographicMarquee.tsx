"use client";

import { useEffect, useState } from "react";

interface MarqueeProps {
  items: string[];
  speed?: number; // Speed in seconds per full cycle
  theme?: "plum" | "milk";
  className?: string;
}

export default function TypographicMarquee({
  items,
  speed = 28,
  theme = "plum",
  className = "",
}: MarqueeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const onMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotion);
    return () => motionQuery.removeEventListener("change", onMotion);
  }, []);

  const isPlum = theme === "plum";
  const bgClass = isPlum ? "bg-[#381932] text-[#FFF3E6]" : "bg-[#FFF3E6] text-[#381932]";
  const borderClass = isPlum ? "border-[#FFF3E6]/20" : "border-[#381932]/20";

  if (prefersReducedMotion) {
    return (
      <div
        className={`w-full py-3 px-6 border-y ${borderClass} ${bgClass} overflow-hidden font-mono text-xs tracking-widest uppercase flex flex-wrap gap-6 justify-center ${className}`}
      >
        {items.map((item, idx) => (
          <span key={idx} className="flex items-center gap-3">
            <span>{item}</span>
            <span className="opacity-40">&bull;</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`w-full py-3.5 border-y ${borderClass} ${bgClass} overflow-hidden select-none group ${className}`}
      role="region"
      aria-label="Technology and engineering capabilities marquee"
    >
      <div
        className="flex whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: `marqueeScroll ${speed}s linear infinite`,
        }}
      >
        {/* First track */}
        <div className="flex items-center shrink-0 font-mono text-xs tracking-widest uppercase">
          {items.map((item, idx) => (
            <span key={idx} className="flex items-center">
              <span className="mx-6 font-bold">{item}</span>
              <span className="opacity-40 select-none">&bull;</span>
            </span>
          ))}
        </div>

        {/* Duplicate track for seamless infinite loop */}
        <div
          className="flex items-center shrink-0 font-mono text-xs tracking-widest uppercase"
          aria-hidden="true"
        >
          {items.map((item, idx) => (
            <span key={`dup-${idx}`} className="flex items-center">
              <span className="mx-6 font-bold">{item}</span>
              <span className="opacity-40 select-none">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
