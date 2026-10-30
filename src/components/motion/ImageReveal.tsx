"use client";

import React, { useRef, useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  direction?: "bottom" | "left" | "right";
}

export default function ImageReveal({
  containerClassName = "",
  imageClassName = "",
  direction = "bottom",
  alt,
  priority = false,
  ...imageProps
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const isReduced =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-reduced-motion") === "true";

    if (isReduced || !containerRef.current || !curtainRef.current) {
      return;
    }

    setMotionAllowed(true);

    const ctx = gsap.context(() => {
      const initialClip = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
      let targetClip = "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)";

      if (direction === "left") {
        targetClip = "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)";
      } else if (direction === "right") {
        targetClip = "polygon(0 0, 0 0, 0 100%, 0 100%)";
      }

      gsap.fromTo(
        curtainRef.current,
        {
          clipPath: initialClip,
          opacity: 1,
        },
        {
          clipPath: targetClip,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#240f20] ${containerClassName}`}
    >
      <Image
        alt={alt}
        className={`w-full h-full object-cover ${imageClassName}`}
        loading={priority ? undefined : "lazy"}
        priority={priority}
        {...imageProps}
      />

      {/* Wipe Curtain Overlay: only active when motion is supported, never hides image permanently */}
      {motionAllowed && (
        <div
          ref={curtainRef}
          aria-hidden="true"
          className="absolute inset-0 bg-[#381932] z-20 pointer-events-none opacity-0"
        />
      )}
    </div>
  );
}
