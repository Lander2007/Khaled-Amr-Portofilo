"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollTextFillProps {
  text: string;
  className?: string;
  theme?: "plum" | "milk"; // "plum" means text fills with Plum on Milk; "milk" fills with Milk on Plum
}

export default function ScrollTextFill({
  text,
  className = "",
  theme = "milk",
}: ScrollTextFillProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current || !textRef.current) return;

    const words = textRef.current.querySelectorAll(".fill-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: 0.18,
          y: 4,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power1.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.75,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const words = text.split(" ");
  const baseColor = theme === "milk" ? "text-[#FFF3E6]" : "text-[#381932]";

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      <p
        ref={textRef}
        className={`font-display font-extrabold tracking-tight uppercase leading-[1.08] ${baseColor}`}
      >
        {words.map((word, idx) => (
          <span
            key={idx}
            className="fill-word inline-block mr-[0.28em] transition-transform"
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
