import { useRef, useEffect, useState, memo } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
} from "framer-motion"

function BackgroundKComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  // Track scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animations for cursor-based parallax
  const springConfig = { stiffness: 150, damping: 40, mass: 0.3 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Mouse movement handler with cursor spotlight tracking
  useEffect(() => {
    if (shouldReduceMotion) return

    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!containerRef.current) return
          const rect = containerRef.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          // Update cursor position for spotlight
          setCursorPos({ x, y })

          // Normalize to -1 to 1 for tilt
          const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2
          const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2

          mouseX.set(normalizedX * 40)
          mouseY.set(normalizedY * 40)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY, shouldReduceMotion])

  // Transform scroll progress into animation values
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.9, 0.5, 0])

  // 3D tilt based on mouse position
  const rotateX = shouldReduceMotion
    ? 0
    : useTransform(smoothMouseY, [-40, 40], [8, -8])
  const rotateY = shouldReduceMotion
    ? 0
    : useTransform(smoothMouseX, [-40, 40], [-8, 8])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          scale,
          opacity,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1400,
          willChange: "transform, opacity",
        }}
      >
        {/* Cyber Orbital HUD Ring 1 - Outer Ring */}
        <motion.svg
          className="absolute"
          style={{
            width: "clamp(500px, 55vw, 850px)",
            height: "clamp(500px, 55vw, 850px)",
            willChange: "transform",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: [0, 360],
                }
          }
          transition={{
            rotate: {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="47%"
            fill="none"
            stroke="url(#hudGradient1)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            opacity="0.4"
          />
          {/* Coordinate ticks */}
          {[0, 90, 180, 270].map((angle) => (
            <line
              key={angle}
              x1="50%"
              y1="3%"
              x2="50%"
              y2="8%"
              stroke="rgba(6, 182, 212, 0.6)"
              strokeWidth="2"
              style={{ transformOrigin: "center", transform: `rotate(${angle}deg)` }}
            />
          ))}
          <defs>
            <linearGradient
              id="hudGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.7)" />
              <stop offset="50%" stopColor="rgba(217, 70, 239, 0.6)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.7)" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Cyber Orbital HUD Ring 2 - Inner Ring */}
        <motion.svg
          className="absolute"
          style={{
            width: "clamp(400px, 45vw, 700px)",
            height: "clamp(400px, 45vw, 700px)",
            willChange: "transform",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: [0, -360],
                }
          }
          transition={{
            rotate: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="47%"
            fill="none"
            stroke="url(#hudGradient2)"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.3"
          />
          {/* Corner markers */}
          {[45, 135, 225, 315].map((angle) => (
            <circle
              key={angle}
              cx="50%"
              cy="5%"
              r="2"
              fill="rgba(217, 70, 239, 0.8)"
              style={{ transformOrigin: "center", transform: `rotate(${angle}deg)` }}
            />
          ))}
          <defs>
            <linearGradient id="hudGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(217, 70, 239, 0.6)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
              <stop offset="100%" stopColor="rgba(217, 70, 239, 0.6)" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* HUD Coordinate Labels */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 text-cyan-400 text-[10px] font-mono tracking-wider opacity-50">
          K-01 // FRONTEND PROTOCOL
        </div>
        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-fuchsia-400 text-[10px] font-mono tracking-wider opacity-50">
          HOLOGRAPHIC INTERFACE
        </div>

        {/* Main "K" SVG with Animated Stroke */}
        <svg
          className="absolute"
          style={{
            width: "clamp(350px, 40vw, 600px)",
            height: "clamp(350px, 40vw, 600px)",
          }}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Grid Texture */}
          <defs>
            <pattern
              id="cyberGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(139, 92, 246, 0.15)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="kGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="40%" stopColor="#6c2bd9" />
              <stop offset="70%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Radial spotlight mask */}
            <radialGradient id="spotlight">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="50%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Holographic "K" Letter Path */}
          <motion.path
            d="M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160"
            stroke="url(#kGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2, ease: "easeInOut" },
              opacity: { duration: 0.5 },
            }}
          />

          {/* Grid texture fill inside K */}
          <path
            d="M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160"
            stroke="url(#cyberGrid)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />

          {/* Glitch / Chromatic Aberration Layers */}
          <motion.path
            d="M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              transform: "translate(-2px, -2px)",
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: [0.4, 0.6, 0.4],
                  }
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M 60 40 L 60 160 M 60 100 L 140 40 M 60 100 L 140 160"
            stroke="rgba(217, 70, 239, 0.4)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              transform: "translate(2px, 2px)",
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: [0.4, 0.6, 0.4],
                  }
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          {/* Interactive Spotlight Reveal Overlay */}
          <motion.circle
            cx={cursorPos.x || 100}
            cy={cursorPos.y || 100}
            r="120"
            fill="url(#spotlight)"
            opacity="0"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: [0, 0.15, 0],
                  }
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              mixBlendMode: "screen",
            }}
          />
        </svg>

        {/* Ambient Holographic Glow - Deep Purple Base */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "clamp(400px, 50vw, 750px)",
            height: "clamp(400px, 50vw, 750px)",
            background:
              "radial-gradient(circle, rgba(108, 43, 217, 0.3) 0%, rgba(139, 79, 232, 0.15) 30%, transparent 70%)",
            filter: "blur(70px)",
            willChange: "transform, opacity",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary Cyan/Fuchsia Highlight Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "clamp(300px, 40vw, 600px)",
            height: "clamp(300px, 40vw, 600px)",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(217, 70, 239, 0.2) 40%, transparent 70%)",
            filter: "blur(60px)",
            willChange: "transform, opacity",
            mixBlendMode: "screen",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1.1, 1.35, 1.1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </motion.div>
    </div>
  )
}

export default memo(BackgroundKComponent)
