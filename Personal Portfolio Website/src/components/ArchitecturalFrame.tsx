"use client";

import { useEffect, useState } from "react";

export default function ArchitecturalFrame() {
  const [localTime, setLocalTime] = useState<string>("");

  // Live Alexandria, Egypt Local Time (Africa/Cairo timeZone)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch {
        setLocalTime("31.2001° N");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="architectural-frame"
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none transition-colors duration-500"
      aria-label="Architectural HUD Frame"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono tracking-wider">
        {/* Top-Left Section: Coordinates & Architectural Identifier */}
        <div className="hidden lg:flex items-center gap-2.5 opacity-60 pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] shadow-[0_0_6px_rgba(255,77,28,0.7)]" />
          <span className="font-bold">31.2001° N, 29.9187° E</span>
          <span className="opacity-40">•</span>
          <span className="tracking-widest">ARCHITECTURAL POLARITY HUD</span>
        </div>

        {/* Top-Right Section: ALEXANDRIA, EG [LOCAL TIME] */}
        <div className="ml-auto flex items-center gap-3 sm:gap-4 pointer-events-auto">
          <div
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-md border border-current/15 bg-current/5 backdrop-blur-md text-[10px] sm:text-[11px] font-mono transition-colors"
            title="Alexandria, Egypt (GMT+2 / Cairo Time)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1C] animate-pulse shadow-[0_0_6px_rgba(255,77,28,0.8)]" />
            <span className="font-semibold tracking-wider">
              ALEXANDRIA, EG
            </span>
            <span className="opacity-40 hidden xs:inline">|</span>
            <span className="font-mono text-current/80">
              [LOCAL TIME{localTime ? `: ${localTime}` : ""}]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
