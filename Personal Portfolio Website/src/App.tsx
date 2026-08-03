import { useState, useRef, useEffect, ReactNode, CSSProperties, memo, useCallback } from "react"
import { motion } from "framer-motion"
import ContactSection from "./components/ContactSection"
import TopNav from "./components/TopNav"
import LogoIcon from "./components/LogoIcon"
import BackgroundK from "./components/BackgroundK"
import Certificates from "./components/Certificates"

// â”€â”€â”€ Project Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  tools: string[]
  metrics: string
  year: string
  image: string
  githubUrl?: string
  liveUrl?: string
}

const PROJECTS: Project[] = [
  {
    id: "el3almialeather",
    title: "El Almia Leather (العالمية)",
    subtitle: "Production E-Commerce Platform",
    description:
      "A production genuine leather e-commerce platform featuring Arabic bilingual support, dynamic product filtering, and real-time inventory management.",
    longDescription:
      "A production genuine leather e-commerce platform featuring Arabic bilingual support, dynamic product filtering, real-time inventory management, and a high-converting mobile checkout flow. Built with modern web technologies to deliver a seamless shopping experience.",
    tools: ["React", "Next.js", "Tailwind CSS", "REST API"],
    metrics: "Live Production Platform",
    year: "2026",
    image: "/projects/el3almialeather.png",
    githubUrl: "#",
    liveUrl: "https://el3almialeather.com/ar",
  },
  {
    id: "spaceedu",
    title: "SpaceEdu",
    subtitle: "3D Web & EduTech Experience",
    description:
      "An interactive 3D space education web platform featuring real-time orbital visualizations and astronomical data modules.",
    longDescription:
      "An interactive 3D space education web platform featuring real-time orbital visualizations and astronomical data modules built with a futuristic glassmorphic aesthetic. Transforms astrophysics and planetary models into interactive 3D experiences with high-performance graphics and fluid user controls.",
    tools: ["React", "Three.js", "Tailwind CSS", "Vite"],
    metrics: "Interactive 3D Experience",
    year: "2026",
    image: "/projects/spaceedu.png",
    githubUrl: "https://github.com/Lander2007/SpaceEdu",
    liveUrl: "https://space-edu-drab.vercel.app/",
  },
  {
    id: "aura",
    title: "AURA SaaS Platform",
    subtitle: "AI & Web App UI",
    description:
      "A sleek, high-performance AI SaaS interface complete with real-time analytics dashboards and dark-mode visualizers.",
    longDescription:
      "A sleek, high-performance AI SaaS interface complete with real-time analytics dashboards, dark-mode visualizers, and responsive component architecture. Engineered for optimal user experience with modern design patterns and seamless data visualization.",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Lucide Icons"],
    metrics: "Real-Time Analytics Dashboard",
    year: "2026",
    image: "/projects/aura.png",
    githubUrl: "https://github.com/Lander2007/AURA",
    liveUrl: "https://aura-brown-mu.vercel.app/",
  },
  {
    id: "el-king1",
    title: "King Store",
    subtitle: "E-Commerce & Accessories",
    description:
      "A modern mobile accessories store interface featuring dynamic search indexing, category filters, and custom promotional banner layouts.",
    longDescription:
      "A modern mobile accessories store interface featuring dynamic search indexing, category filters, and custom promotional banner layouts. High-fidelity dark-mode design with glassmorphic UI components, bilingual search interface, responsive product filters, and intuitive control panels.",
    tools: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    metrics: "Dynamic Search & Filtering",
    year: "2026",
    image: "/projects/el-king1.png",
    githubUrl: "https://github.com/Lander2007/el-king1",
    liveUrl: "https://el-king1.vercel.app/",
  },
  {
    id: "maison",
    title: "Maison Design Showcase",
    subtitle: "Luxury Interior & UI",
    description:
      "An elegant home decor showcase highlighting editorial layouts, smooth scroll reveals, and high-end aesthetic typography.",
    longDescription:
      "An elegant home decor showcase highlighting editorial layouts, smooth scroll reveals, and high-end aesthetic typography for modern interiors. Features sophisticated animations, immersive visual storytelling, and a refined user experience tailored for luxury brands.",
    tools: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
    metrics: "Editorial Layout Experience",
    year: "2026",
    image: "/projects/maison.png",
    githubUrl: "https://github.com/Lander2007/Maison",
    liveUrl: "https://maison-nine-wheat.vercel.app/",
  },
  {
    id: "pharoh-view",
    title: "Pharaoh View",
    subtitle: "Cultural Tourism Web",
    description:
      "An interactive web experience exploring ancient Egyptian landmarks and historical monuments through rich media galleries.",
    longDescription:
      "An interactive web experience exploring ancient Egyptian landmarks and historical monuments through rich media galleries and immersive visual storytelling. Combines cultural heritage with modern web design to create an engaging educational journey through ancient Egypt.",
    tools: ["React", "Tailwind CSS", "JavaScript", "Vite"],
    metrics: "Interactive Cultural Experience",
    year: "2025",
    image: "/projects/pharoh-view.png",
    githubUrl: "https://github.com/Lander2007/Pharoh-view",
    liveUrl: "https://pharoh-view.vercel.app/",
  },
  {
    id: "02health",
    title: "O2 Health",
    subtitle: "HealthTech Platform",
    description:
      "A digital healthcare portal facilitating patient appointment booking, doctor directory searches, and wellness tracking tools.",
    longDescription:
      "A digital healthcare portal facilitating patient appointment booking, doctor directory searches, and wellness tracking tools. Built with a focus on accessibility, patient privacy, and seamless integration with healthcare workflows to improve patient-provider communication.",
    tools: ["React", "Tailwind CSS", "TypeScript", "Chart.js"],
    metrics: "Healthcare Portal System",
    year: "2025",
    image: "/projects/02health.png",
    githubUrl: "https://github.com/Lander2007/02Health",
    liveUrl: "https://02-health.vercel.app/",
  },
  {
    id: "savior",
    title: "Savior Emergency App",
    subtitle: "Healthcare & Aid",
    description:
      "A fast-response emergency support web application engineered with accessible, high-contrast UI for rapid navigation.",
    longDescription:
      "A fast-response emergency support web application engineered with accessible, high-contrast UI for rapid navigation during urgent situations. Prioritizes speed, clarity, and ease of use to deliver critical assistance when every second counts.",
    tools: ["React", "Tailwind CSS", "JavaScript", "REST API"],
    metrics: "Emergency Response System",
    year: "2026",
    image: "/projects/savior.png",
    githubUrl: "https://github.com/Lander2007/Savior",
    liveUrl: "https://savior-rosy.vercel.app/",
  },
  {
    id: "furni",
    title: "Furni Living Store",
    subtitle: "Interior E-Commerce",
    description:
      "A lightweight, responsive furniture catalog featuring interactive cart states, user ratings, and effortless grid filtering.",
    longDescription:
      "A lightweight, responsive furniture catalog featuring interactive cart states, user ratings, and effortless grid filtering across all viewport sizes. Delivers a smooth shopping experience with optimized performance and intuitive product discovery features.",
    tools: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    metrics: "Responsive Catalog System",
    year: "2026",
    image: "/projects/furni.png",
    githubUrl: "https://github.com/Lander2007/Furni",
    liveUrl: "https://lander2007.github.io/Furni/",
  },
  {
    id: "appexy",
    title: "Appexy Landing Page",
    subtitle: "SaaS Product Showcase",
    description:
      "A conversion-focused landing page designed for SaaS products with feature comparison matrices and interactive pricing sliders.",
    longDescription:
      "A conversion-focused landing page designed for SaaS products with feature comparison matrices, interactive pricing sliders, and user review carousels. Optimized for maximum conversion rates with strategic CTAs, social proof elements, and responsive design.",
    tools: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
    metrics: "Conversion-Optimized Landing",
    year: "2023",
    image: "/projects/appexy.png",
    githubUrl: "https://github.com/Lander2007/Appexy",
    liveUrl: "https://lander2007.github.io/Appexy/",
  },
]

const SKILLS = [
  "React 19",
  "Next.js",
  "Vite",
  "TypeScript",
  "JavaScript",
  "HTML5 & CSS3",
  "Tailwind CSS v4",
  "UI/UX & Figma",
  "Three.js & 3D Web",
  "Glassmorphic UI",
  "Custom Dark Modes",
  "Responsive Layouts",
  "Electron UI",
  "Git & GitHub",
]

const PROCESS = [
  {
    step: "01",
    title: "Discover & Align",
    desc: "Deep-diving into your vision, audience, and market through structured interview probes and architectural mapping.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Design & Prototype",
    desc: "Crafting fluid design systems, interactive prototypes, and spatial motion dynamics that make products feel inevitable.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Build & Polish",
    desc: "Translating designs into clean, resilient, production-ready code with weighted physics and frame-perfect micro-interactions.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Launch & Orbit",
    desc: "Deploying with precision monitoring, optimizing real-world telemetry, and scaling your brand into higher orbits.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
]

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  credentialId: string
  skills: string[]
  badgeColor: string
  icon: ReactNode
}

const CERTIFICATES: Certificate[] = [
  {
    id: "aws-architect",
    title: "AWS Certified Solutions Architect – Professional",
    issuer: "Amazon Web Services",
    date: "Issued Dec 2025 · Exp Dec 2028",
    credentialId: "AWS-PSA-892401",
    skills: [
      "Cloud Architecture",
      "Serverless",
      "Security",
      "Distributed Systems",
    ],
    badgeColor: "#ff9900",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "meta-frontend",
    title: "Meta Senior Front-End Developer Specialization",
    issuer: "Meta Staff Engineering",
    date: "Issued Nov 2025 · Lifetime Verification",
    credentialId: "META-FE-994102",
    skills: [
      "React 19 Architecture",
      "WebGL Shaders",
      "Web Vitals Optimization",
    ],
    badgeColor: "#0081fb",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
  },
  {
    id: "google-ux",
    title: "Google Advanced Interaction & UX Systems",
    issuer: "Google Design Systems",
    date: "Issued Aug 2025 · Lifetime Verification",
    credentialId: "GOOG-UX-401289",
    skills: ["Design Systems", "Micro-Interactions", "Accessibility Standard"],
    badgeColor: "#ea4335",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "webgl-shader",
    title: "WebGL & GLSL Real-Time Graphics Mastery",
    issuer: "Graphics & Shader Academy",
    date: "Issued May 2025 · Lifetime Verification",
    credentialId: "GLSL-MAST-10928",
    skills: [
      "Fragment Shaders",
      "Three.js Pipeline",
      "GPU Hardware Acceleration",
    ],
    badgeColor: "#8b4fe8",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
]

// ─── Framer Motion Animation Variants ─────────────────────────────────────────

const fadeInUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 48,
    filter: "blur(6px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const staggerItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    filter: "blur(4px)"
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// ─── Custom Hooks ─────────────────────────────────────────────────────────────

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight
          const currentProgress =
            totalHeight > 0
              ? Math.min(1, Math.max(0, window.scrollY / totalHeight))
              : 0
          setScrollProgress(currentProgress)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return scrollProgress
}

const SECTIONS = [
  { id: "hero", label: "Hero", num: "01" },
  { id: "about", label: "About", num: "02" },
  { id: "projects", label: "Projects", num: "03" },
  { id: "certificates", label: "Certificates", num: "04" },
  { id: "process", label: "Process", num: "05" },
  { id: "contact", label: "Contact", num: "06" },
]

function ScrollProgressIndicator() {
  const progress = useScrollProgress()
  const [activeSection, setActiveSection] = useState("hero")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id)
        if (sec) {
          const top = sec.offsetTop
          if (scrollPos >= top) {
            setActiveSection(SECTIONS[i].id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        right: "28px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.25rem",
      }}
      className="hidden sm:flex"
    >
      <div
        style={{
          fontFamily: "Syne",
          fontSize: "0.68rem",
          fontWeight: 600,
          color: "#c9a7ff",
          letterSpacing: "0.05em",
          textShadow: "0 0 10px rgba(108,43,217,0.8)",
          marginBottom: "0.25rem",
        }}
      >
        {Math.round(progress * 100)}%
      </div>

      <div
        style={{
          position: "relative",
          width: "2px",
          height: "180px",
          background: "rgba(108, 43, 217, 0.22)",
          borderRadius: "9999px",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${progress * 100}%`,
            background: "linear-gradient(to bottom, #6c2bd9, #c9a7ff, #ffffff)",
            boxShadow: "0 0 12px #c9a7ff, 0 0 24px rgba(108, 43, 217, 0.9)",
            borderRadius: "9999px",
            transition: "height 0.1s linear",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "0.25rem",
          position: "relative",
        }}
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id
          const isHovered = hoveredSection === sec.id
          return (
            <div
              key={sec.id}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <button
                onClick={() => scrollTo(sec.id)}
                aria-label={`Scroll to ${sec.label}`}
                style={{
                  width: isActive ? "12px" : "8px",
                  height: isActive ? "12px" : "8px",
                  borderRadius: "50%",
                  border: isActive
                    ? "2px solid #ffffff"
                    : "1px solid rgba(201,167,255,0.4)",
                  background: isActive ? "#6c2bd9" : "rgba(13,2,33,0.8)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  boxShadow: isActive
                    ? "0 0 14px #c9a7ff, 0 0 28px rgba(108,43,217,0.9)"
                    : "none",
                  outline: "none",
                  padding: 0,
                }}
              />

              {(isHovered || isActive) && (
                <div
                  style={{
                    position: "absolute",
                    right: "24px",
                    whiteSpace: "nowrap",
                    fontFamily: "Syne",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: isActive ? "#f0e8ff" : "#c9a7ff",
                    padding: "0.3rem 0.75rem",
                    borderRadius: "8px",
                    background: "rgba(13, 2, 33, 0.9)",
                    border: "1px solid rgba(108, 43, 217, 0.45)",
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(108,43,217,0.3)",
                    pointerEvents: "none",
                    animation: "hero-in 0.25s ease-out forwards",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span style={{ color: "#6c2bd9", fontSize: "0.65rem" }}>
                    {sec.num}
                  </span>
                  <span>{sec.label}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Dynamic Canvas Nebula Background ─────────────────────────────────────────

function DynamicNebulaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Generate 240 stars across 3 layers
    const numStars = 240
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.4 + 0.1,
      layer: Math.floor(Math.random() * 3) + 1, // 1: far, 2: mid, 3: near
      color:
        Math.random() > 0.85
          ? "#c9a7ff"
          : Math.random() > 0.7
            ? "#a78bfa"
            : "#ffffff",
      twinkleSpeed: Math.random() * 0.03 + 0.01,
    }))

    // Mouse tracking for subtle dynamic tilt
    let mouseX = width / 2
    let mouseY = height / 2
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    let animationFrameId: number
    let time = 0

    // ── Shooting stars ──────────────────────────────────────────────────────
    type ShootingStar = { x: number; y: number; vx: number; vy: number; len: number; life: number; maxLife: number; color: string }
    const ssPool: ShootingStar[] = []
    let ssTick = 0

    const spawnShootingStar = () => {
      const speed = 4.5 + Math.random() * 3
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 8) // shallow downward-right
      ssPool.push({
        x: Math.random() * width * 0.75,
        y: Math.random() * height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 90 + Math.random() * 110,
        life: 0,
        maxLife: 38 + Math.random() * 22,
        color: Math.random() > 0.5 ? "#c9a7ff" : "#ffffff",
      })
    }

    const render = () => {
      time += 0.01
      const scrollY = window.scrollY
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll))

      // Clear with progressive space depth color shift
      ctx.clearRect(0, 0, width, height)

      // Dynamic space gradient backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
      const topHue = 260 + progress * 20 // 260 -> 280 (violet to deep royal purple)
      const botHue = 270 + progress * 35 // 270 -> 305 (magenta/purple deep space)
      bgGrad.addColorStop(0, `hsl(${topHue}, 80%, ${5 + progress * 4}%)`)
      bgGrad.addColorStop(1, `hsl(${botHue}, 85%, ${3 + progress * 3}%)`)
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Render ambient dynamic cosmic nebula clouds
      const nebulaCount = 3
      for (let i = 0; i < nebulaCount; i++) {
        const offsetAngle = time * 0.15 + (i * Math.PI * 2) / nebulaCount
        const cx =
          width * (0.3 + 0.4 * Math.sin(offsetAngle + progress * Math.PI)) +
          (mouseX - width / 2) * 0.05
        const cy =
          height *
            (0.3 +
              0.4 * Math.cos(offsetAngle * 0.8 + progress * Math.PI * 1.5)) +
          (mouseY - height / 2) * 0.05
        const radius =
          Math.min(width, height) *
          (0.4 + 0.25 * Math.sin(time * 0.2 + i)) *
          (1 + progress * 0.5)

        const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        const intensity = 0.12 + progress * 0.14
        if (i === 0) {
          cloudGrad.addColorStop(0, `rgba(108, 43, 217, ${intensity})`)
          cloudGrad.addColorStop(0.5, `rgba(139, 79, 232, ${intensity * 0.4})`)
          cloudGrad.addColorStop(1, "transparent")
        } else if (i === 1) {
          cloudGrad.addColorStop(0, `rgba(139, 79, 232, ${intensity * 0.85})`)
          cloudGrad.addColorStop(
            0.6,
            `rgba(201, 167, 255, ${intensity * 0.25})`,
          )
          cloudGrad.addColorStop(1, "transparent")
        } else {
          cloudGrad.addColorStop(0, `rgba(76, 29, 149, ${intensity * 1.1})`)
          cloudGrad.addColorStop(0.5, `rgba(108, 43, 217, ${intensity * 0.3})`)
          cloudGrad.addColorStop(1, "transparent")
        }

        ctx.fillStyle = cloudGrad
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Render stars with scroll parallax speed boost
      const scrollSpeedBoost = 1 + progress * 2.2

      stars.forEach((star) => {
        // Twinkle update
        star.alpha =
          star.baseAlpha + Math.sin(time * 10 * star.twinkleSpeed) * 0.25
        star.alpha = Math.max(0.1, Math.min(1, star.alpha + progress * 0.2))

        // Parallax y calculation based on scroll and layer
        const parallaxOffsetY =
          (scrollY * star.layer * 0.12 * scrollSpeedBoost) % height
        let renderY = (star.y - parallaxOffsetY + height) % height

        // Mouse displacement
        const dx = (mouseX - width / 2) * 0.01 * star.layer
        const dy = (mouseY - height / 2) * 0.01 * star.layer
        const renderX = (star.x + dx + width) % width

        ctx.fillStyle = star.color
        ctx.globalAlpha = star.alpha
        ctx.beginPath()
        ctx.arc(
          renderX,
          renderY + dy,
          star.size * (1 + progress * 0.3),
          0,
          Math.PI * 2,
        )
        ctx.fill()

        // Subtle star glow for near layer
        if (star.layer === 3 && star.size > 1.4) {
          ctx.shadowBlur = 8 + progress * 10
          ctx.shadowColor = star.color
        } else {
          ctx.shadowBlur = 0
        }
      })
      ctx.shadowBlur = 0

      // ── Shooting stars ────────────────────────────────────────────────────
      ssTick++
      if (ssTick > 200 + Math.random() * 160) {
        ssTick = 0
        spawnShootingStar()
      }

      for (let si = ssPool.length - 1; si >= 0; si--) {
        const ss = ssPool[si]
        const t = ss.life / ss.maxLife
        const alpha = Math.sin(t * Math.PI) * 0.85
        const mag = Math.hypot(ss.vx, ss.vy)
        const tailX = ss.x - (ss.vx / mag) * ss.len
        const tailY = ss.y - (ss.vy / mag) * ss.len

        const ssGrad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY)
        ssGrad.addColorStop(0, ss.color)
        ssGrad.addColorStop(0.6, ss.color === "#c9a7ff" ? "rgba(201,167,255,0.3)" : "rgba(255,255,255,0.25)")
        ssGrad.addColorStop(1, "transparent")

        ctx.globalAlpha = alpha
        ctx.strokeStyle = ssGrad
        ctx.lineWidth = 1.5
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        // Tiny glow head
        ctx.globalAlpha = alpha * 0.6
        ctx.fillStyle = ss.color
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2)
        ctx.fill()

        ss.x += ss.vx
        ss.y += ss.vy
        ss.life++
        if (ss.life >= ss.maxLife) ssPool.splice(si, 1)
      }

      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  )
}


// â”€â”€â”€ Custom Cursor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])

  const mouse = useRef({ x: -200, y: -200 })
  const ringPos = useRef({ x: -200, y: -200 })
  const trail = useRef([
    { x: -200, y: -200 },
    { x: -200, y: -200 },
    { x: -200, y: -200 },
    { x: -200, y: -200 },
  ])
  const onLink = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onOver = (e: MouseEvent) => {
      onLink.current = !!(
        e.target instanceof Element &&
        e.target.closest('a, button, [role="button"]')
      )
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseover", onOver)

    let raf: number
    const loop = () => {
      const { x, y } = mouse.current
      const linked = onLink.current

      if (dotRef.current) {
        const sc = linked ? 1.6 : 1
        dotRef.current.style.transform = `translate(${x - 6}px, ${y - 6}px) scale(${sc})`
        dotRef.current.style.boxShadow = linked
          ? "0 0 16px rgba(201,167,255,1), 0 0 32px rgba(108,43,217,0.9)"
          : "0 0 10px rgba(201,167,255,0.85), 0 0 20px rgba(108,43,217,0.7)"
      }

      ringPos.current.x += (x - ringPos.current.x) * 0.12
      ringPos.current.y += (y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        const rs = linked ? 1.75 : 1
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${rs})`
        ringRef.current.style.opacity = linked ? "0.55" : "0.32"
        ringRef.current.style.borderColor = linked
          ? "rgba(201,167,255,0.75)"
          : "rgba(108,43,217,0.65)"
      }

      const lerps = [0.28, 0.21, 0.16, 0.12]
      trail.current.forEach((pos, i) => {
        const src = i === 0 ? mouse.current : trail.current[i - 1]
        pos.x += (src.x - pos.x) * lerps[i]
        pos.y += (src.y - pos.y) * lerps[i]
        const el = trailRefs.current[i]
        if (el) {
          const sz = 3.2 - i * 0.5
          el.style.transform = `translate(${pos.x - sz / 2}px, ${pos.y - sz / 2}px)`
          el.style.opacity = linked ? "0" : `${0.4 - i * 0.08}`
        }
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  const fixed: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    willChange: "transform",
  }

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          ...fixed,
          zIndex: 10001,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "rgba(201,167,255,0.95)",
          transition: "box-shadow 0.15s, transform 0.1s",
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          ...fixed,
          zIndex: 10000,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(108,43,217,0.65)",
          transition: "opacity 0.2s, border-color 0.2s, transform 0.05s linear",
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className="custom-cursor"
          style={{
            ...fixed,
            zIndex: 9999,
            width: `${3.2 - i * 0.5}px`,
            height: `${3.2 - i * 0.5}px`,
            borderRadius: "50%",
            background: `rgba(108,43,217,${0.72 - i * 0.12})`,
            boxShadow: `0 0 ${5 - i}px rgba(108,43,217,${0.48 - i * 0.09})`,
            transition: "opacity 0.15s",
          }}
        />
      ))}
    </>
  )
}

// â”€â”€â”€ Scroll Reveal Wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "scale"
  blur?: boolean
  style?: CSSProperties
  className?: string
}

function Reveal({
  children,
  delay = 0,
  direction = "up",
  blur = true,
  style,
  className,
}: RevealProps) {
  // Define initial transform based on direction
  let initialY = 0
  let initialX = 0
  let initialScale = 1

  switch (direction) {
    case "up":
      initialY = 48
      initialScale = 0.96
      break
    case "down":
      initialY = -48
      initialScale = 0.96
      break
    case "left":
      initialX = -48
      initialScale = 0.96
      break
    case "right":
      initialX = 48
      initialScale = 0.96
      break
    case "scale":
      initialScale = 0.86
      break
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: initialY,
        x: initialX,
        scale: initialScale,
        filter: blur ? "blur(6px)" : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ 
        once: true, 
        amount: 0.2,
        margin: "0px 0px -100px 0px"
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        willChange: "opacity, transform, filter",
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

const MemoizedReveal = memo(Reveal)

// â”€â”€â”€ Magnetic Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MagneticBtn({
  href,
  children,
  variant = "primary",
}: {
  href: string
  children: ReactNode
  variant?: "primary" | "secondary"
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * 0.28,
      y: (e.clientY - (rect.top + rect.height / 2)) * 0.28,
    })
  }, [])

  const handleMouseEnter = useCallback(() => setHovered(true), [])
  
  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setOffset({ x: 0, y: 0 })
  }, [])

  const transitionStr = hovered
    ? "transform 0.12s ease, box-shadow 0.25s, background 0.25s, border-color 0.25s"
    : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, background 0.3s, border-color 0.3s"

  const shared: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontFamily: "Syne",
    fontWeight: 600,
    fontSize: "0.9375rem",
    letterSpacing: "0.01em",
    padding: "0.875rem 2.625rem",
    borderRadius: "9999px",
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: transitionStr,
    cursor: "pointer",
    willChange: "transform",
  }

  return variant === "primary" ? (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...shared,
        color: "#f0e8ff",
        background:
          "linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #6c2bd9 100%)",
        boxShadow: hovered
          ? "0 0 50px rgba(108,43,217,0.85), 0 0 100px rgba(108,43,217,0.45)"
          : "0 0 32px rgba(108,43,217,0.55), 0 0 64px rgba(108,43,217,0.2)",
      }}
    >
      {children}
    </a>
  ) : (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...shared,
        color: "#c9a7ff",
        border: `1px solid ${
          hovered ? "rgba(201,167,255,0.55)" : "rgba(201,167,255,0.28)"
        }`,
        background: hovered
          ? "rgba(201,167,255,0.12)"
          : "rgba(201,167,255,0.05)",
      }}
    >
      {children}
    </a>
  )
}

const MemoizedMagneticBtn = memo(MagneticBtn)

// â”€â”€â”€ Section Header Label Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: "Syne",
        fontSize: "0.72rem",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "#8b4fe8",
        marginBottom: "1rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "28px",
          height: "1px",
          background: "#6c2bd9",
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  )
}

// â”€â”€â”€ Typewriter Text Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TypewriterText({
  phrases,
  onFirstTypeComplete,
}: {
  phrases: string[]
  onFirstTypeComplete?: () => void
}) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx]
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting && displayText === currentPhrase) {
      if (!completedRef.current) {
        completedRef.current = true
        onFirstTypeComplete?.()
      }
      timer = setTimeout(() => setIsDeleting(true), 2400)
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false)
      setPhraseIdx((prev) => (prev + 1) % phrases.length)
    } else {
      const speed = isDeleting ? 38 : 75
      timer = setTimeout(() => {
        const nextChar = isDeleting
          ? currentPhrase.substring(0, displayText.length - 1)
          : currentPhrase.substring(0, displayText.length + 1)
        setDisplayText(nextChar)
      }, speed)
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, phraseIdx, phrases, onFirstTypeComplete])

  return (
    <span
      style={{
        fontFamily: "'Syne', 'Plus Jakarta Sans', monospace",
        fontWeight: 600,
        color: "#f0e8ff",
        textShadow:
          "0 0 20px rgba(201, 167, 255, 0.9), 0 0 40px rgba(108, 43, 217, 0.8)",
        letterSpacing: "-0.015em",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {displayText}
      <span
        style={{
          display: "inline-block",
          width: "3px",
          height: "0.85em",
          backgroundColor: "#c9a7ff",
          marginLeft: "6px",
          borderRadius: "2px",
          boxShadow: "0 0 10px #c9a7ff, 0 0 20px rgba(108,43,217,0.9)",
          animation: "cursor-pulse 1.3s ease-in-out infinite",
        }}
      />
    </span>
  )
}

// â”€â”€â”€ Hero Section with Sticky Pinning & Typewriter Entrance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pinState, setPinState] = useState({
    opacity: 1,
    scale: 1,
    translateY: 0,
  })
  const [heroReady, setHeroReady] = useState(false)

  // Safety fallback: if typewriter takes >2s, fade in content automatically
  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!containerRef.current) return
          const rect = containerRef.current.getBoundingClientRect()
          const totalHeight =
            containerRef.current.clientHeight - window.innerHeight
          if (totalHeight > 0) {
            const p = Math.min(1, Math.max(0, -rect.top / totalHeight))
            const opacity = p > 0.45 ? 1 - (p - 0.45) / 0.55 : 1
            const scale = 1 - p * 0.08
            const translateY = -p * 60
            setPinState({ opacity: Math.max(0, opacity), scale, translateY })
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const phrases = [
    "Frontend Web Developer",
    "UI/UX Designer",
    "Web Developer @ WaveDev",
  ]

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        height: "180vh",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Interactive Cosmic "K" Background */}
      <BackgroundK />

      {/* Floating ambient orbs — depth layers behind hero content */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
        <div style={{
          position: "absolute", top: "12%", left: "6%",
          width: "340px", height: "340px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,43,217,0.25) 0%, transparent 70%)",
          filter: "blur(55px)",
          animation: "float-orb-a 13s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "38%", right: "4%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)",
          filter: "blur(48px)",
          animation: "float-orb-b 16s ease-in-out infinite 2.5s",
        }} />
        <div style={{
          position: "absolute", bottom: "18%", left: "22%",
          width: "220px", height: "220px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,70,239,0.14) 0%, transparent 70%)",
          filter: "blur(38px)",
          animation: "float-orb-c 11s ease-in-out infinite 1.2s",
        }} />
      </div>

      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: "clamp(5rem, 12vh, 8rem)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            padding: "1rem 2rem",
            maxWidth: "880px",
            opacity: pinState.opacity,
            transform: `translateY(${pinState.translateY}px) scale(${pinState.scale})`,
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            willChange: "transform, opacity",
          }}
        >
          {/* Logo Emblem */}
          <div
            style={{
              marginBottom: "1rem",
              display: "inline-block",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "scale(1)" : "scale(0.8)",
              transition:
                "opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <LogoIcon size={72} />
          </div>

          {/* Status badge - fades in smoothly after typewriter starts */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "Syne",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(201,167,255,0.85)",
              marginBottom: "1.5rem",
              border: "1px solid rgba(108,43,217,0.42)",
              padding: "0.45rem 1.25rem 0.45rem 0.95rem",
              borderRadius: "9999px",
              background: "rgba(108,43,217,0.12)",
              backdropFilter: "blur(12px)",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 1.1s 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#8b4fe8",
                display: "inline-block",
                animation: "glow-pulse-dot 2.2s ease-in-out infinite",
              }}
            />
            Web Developer @ WaveDev · Available for Custom Frontend Projects
          </div>

          {/* Main Title */}
          <h1
            className="text-glow-bright"
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
              color: "#f0e8ff",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              marginBottom: "1rem",
            }}
          >
            Khaled Amr
          </h1>

          {/* Typewriter Rotating Subtitle Line */}
          <div
            style={{
              fontSize: "clamp(1.25rem, 3.2vw, 2.15rem)",
              marginBottom: "1.75rem",
              minHeight: "3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TypewriterText
              phrases={phrases}
              onFirstTypeComplete={() => setHeroReady(true)}
            />
          </div>

          {/* Tagline Paragraph - Fades in smoothly after typewriter reveals first phrase */}
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: "clamp(1.0625rem, 2.2vw, 1.25rem)",
              color: "rgba(201,167,255,0.78)",
              lineHeight: 1.65,
              maxWidth: "640px",
              margin: "0 auto 2.5rem",
              fontWeight: 300,
              letterSpacing: "0.005em",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(24px)",
              transition:
                "opacity 1.1s 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            I build high-performance, interactive web interfaces, custom 3D web
            experiences, and pixel-perfect dark mode applications.
          </p>

          {/* Magnetic CTA Buttons - Fades in smoothly */}
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              justifyContent: "center",
              flexWrap: "wrap",
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(28px)",
              transition:
                "opacity 1.1s 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <MemoizedMagneticBtn href="#projects" variant="primary">
              Explore Featured Work
            </MemoizedMagneticBtn>
            <MemoizedMagneticBtn href="#contact" variant="secondary">
              Get In Touch
            </MemoizedMagneticBtn>
          </div>

        </div>

        {/* Scroll-down indicator */}
        <div
          className="hero-scroll-indicator"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: pinState.opacity * 0.7,
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          <span style={{
            fontFamily: "Syne",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(201,167,255,0.45)",
          }}>
            Scroll
          </span>
          <div style={{
            width: "1px",
            height: "36px",
            background: "linear-gradient(to bottom, rgba(139,79,232,0.8), transparent)",
          }} />
        </div>

      </div>
    </section>
  )
}

// â”€â”€â”€ Skill Chip Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// ─── Animated Stat Counter ────────────────────────────────────────────────────

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [inView, setInView] = useState(false)

  // Parse numeric part and suffix ("5+" → 5, "+")
  const match = value.match(/^(\d+)(.*)$/)
  const num    = match ? parseInt(match[1]) : 0
  const suffix = match ? match[2] : value

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || num === 0) return
    const duration = 1100
    const start = Date.now()
    const timer = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * num))
      if (p >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, num])

  return (
    <div ref={ref}>
      <div
        className="stat-number-in"
        style={{
          fontFamily: "Syne",
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1,
          letterSpacing: "-0.03em",
          marginBottom: "0.375rem",
          background: "linear-gradient(135deg, #f0e8ff 0%, #c9a7ff 60%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 16px rgba(201,167,255,0.45))",
        }}
      >
        {inView ? count : 0}{suffix}
      </div>
      <div style={{
        fontFamily: "Plus Jakarta Sans",
        fontSize: "0.825rem",
        color: "rgba(201,167,255,0.52)",
        letterSpacing: "0.02em",
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────

function SkillChip({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "Syne",
        fontWeight: 500,
        fontSize: "0.8rem",
        color: hovered ? "#f0e8ff" : "#c9a7ff",
        padding: "0.5rem 1.15rem",
        borderRadius: "9999px",
        border: `1px solid ${
          hovered ? "rgba(139,79,232,0.85)" : "rgba(108,43,217,0.32)"
        }`,
        background: hovered ? "rgba(108,43,217,0.25)" : "rgba(108,43,217,0.08)",
        boxShadow: hovered
          ? "0 0 20px rgba(108,43,217,0.6), 0 0 40px rgba(108,43,217,0.2)"
          : "none",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
        display: "inline-block",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </span>
  )
}

const MemoizedSkillChip = memo(SkillChip)

// â”€â”€â”€ About Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function About() {
  return (
    <section
      id="about"
      className="section-transition-bleed"
      style={{
        padding: "11rem 2rem 9rem",
        maxWidth: "1240px",
        margin: "0 auto",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="grid-about">
        <Reveal direction="left">
          <SectionLabel>02 / Philosophy &amp; Background</SectionLabel>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 4.2vw, 3.5rem)",
              color: "#f0e8ff",
              lineHeight: 1.06,
              letterSpacing: "-0.028em",
              marginBottom: "2.25rem",
            }}
          >
            Frontend Craft meets High-Performance UI/UX.
          </h2>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: "1.08rem",
              lineHeight: 1.82,
              color: "rgba(201,167,255,0.75)",
              marginBottom: "1.625rem",
              fontWeight: 300,
            }}
          >
            I&apos;m Khaled Amr, a Frontend Developer and UI/UX Designer at
            WaveDev. I build high-performance, interactive web interfaces,
            custom 3D web experiences, and pixel-perfect dark mode applications.
          </p>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: "1.08rem",
              lineHeight: 1.82,
              color: "rgba(201,167,255,0.75)",
              marginBottom: "3rem",
              fontWeight: 300,
            }}
          >
            Dedicated to modern CSS architectures, glassmorphic UI design,
            responsive layouts, and seamless client-side performance.
          </p>

          <div style={{ display: "flex", gap: "3.5rem", flexWrap: "wrap" }}>
            {[
              ["5+", "Years experience"],
              ["30+", "Projects shipped"],
              ["100%", "Custom delivery"],
            ].map(([num, label], idx) => (
              <Reveal key={label} delay={idx * 0.12} direction="up">
                <AnimatedStat value={num} label={label} />
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <div
            id="tech-stack"
            style={{
              padding: "2.5rem",
              borderRadius: "24px",
              border: "1px solid rgba(108,43,217,0.28)",
              background: "rgba(13,2,33,0.75)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,167,255,0.08)",
            }}
          >
            <SectionLabel>Core Capabilities</SectionLabel>
            <h3
              style={{
                fontFamily: "Syne",
                fontSize: "1.35rem",
                fontWeight: 600,
                color: "#f0e8ff",
                marginBottom: "1.5rem",
              }}
            >
              Toolkit &amp; Architecture
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              {SKILLS.map((s) => (
                <MemoizedSkillChip key={s} label={s} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// â”€â”€â”€ Orbital Projects Explorer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const activeProject = PROJECTS[activeIndex]

  const goTo = (index: number) => {
    setActiveIndex((index + PROJECTS.length) % PROJECTS.length)
  }

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goTo(activeIndex + 1)
    }
    if (isRightSwipe) {
      goTo(activeIndex - 1)
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const section = document.getElementById("projects")
      if (!section) return
      const rect = section.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
      if (!inView) return

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % PROJECTS.length)
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length)
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <section
      id="projects"
      className="section-transition-bleed overflow-hidden"
      style={{ padding: "6rem 1rem md:9rem 2rem", position: "relative", zIndex: 2 }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section Header */}
        <Reveal style={{ marginBottom: "3rem" }}>
          <div className="text-center md:text-left">
            <SectionLabel>03 / Featured Work</SectionLabel>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold"
              style={{
                fontFamily: "Syne",
                color: "#f0e8ff",
                letterSpacing: "-0.028em",
              }}
            >
              Featured Projects
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            {/* Mobile: Swipeable Card */}
            <div className="block lg:hidden md:hidden">
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative"
              >
                {/* Project Card */}
                <div 
                  key={activeProject.id}
                  className="bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-cyan-950/30 
                             rounded-3xl border border-purple-500/20 overflow-hidden
                             shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0221] via-[#0d0221]/40 to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#0d0221]/90 backdrop-blur-sm border border-purple-500/30">
                      <span className="text-xs font-mono text-purple-300">{activeProject.year}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs font-mono text-purple-400 mb-2 uppercase tracking-wider">
                      {activeProject.subtitle}
                    </p>
                    
                    <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Syne" }}>
                      {activeProject.title}
                    </h3>

                    <p className="text-sm text-purple-200/80 leading-relaxed mb-4">
                      {activeProject.description}
                    </p>

                    {/* Tools */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {activeProject.tools.slice(0, 4).map((tool) => (
                        <span 
                          key={tool}
                          className="text-xs px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/20 text-purple-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {activeProject.liveUrl && activeProject.liveUrl !== "#" && (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-gradient-to-r from-purple-600 to-violet-600 
                                   text-white font-semibold text-sm px-5 py-3 rounded-full
                                   shadow-[0_0_30px_rgba(108,43,217,0.4)]
                                   active:scale-95 transition-transform"
                        >
                          Visit Site →
                        </a>
                      )}
                      {activeProject.githubUrl && activeProject.githubUrl !== "#" && (
                        <a
                          href={activeProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-full border border-purple-500/30 
                                   text-purple-300 text-sm font-semibold
                                   active:scale-95 transition-transform"
                        >
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow Navigation */}
                <div className="flex justify-center gap-8 mt-6">
                  <button
                    onClick={() => goTo(activeIndex - 1)}
                    className="w-14 h-14 rounded-full bg-purple-900/30 border border-purple-500/30
                             text-purple-300 flex items-center justify-center text-2xl
                             active:scale-95 transition-transform"
                    aria-label="Previous project"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => goTo(activeIndex + 1)}
                    className="w-14 h-14 rounded-full bg-purple-900/30 border border-purple-500/30
                             text-purple-300 flex items-center justify-center text-2xl
                             active:scale-95 transition-transform"
                    aria-label="Next project"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop: Original Orbit Layout */}
            <div className="hidden md:block projects-orbit">
              {/* Constellation navigation rail */}
              <nav
                className="projects-orbit-nav"
                aria-label="Project orbit navigation"
              >
                <div className="projects-orbit-beam" aria-hidden="true" />
                {PROJECTS.map((project, i) => {
                  const isActive = i === activeIndex
                  return (
                    <button
                      key={project.id}
                      type="button"
                      className={`projects-orbit-node${
                        isActive ? " projects-orbit-node--active" : ""
                      }`}
                      onClick={() => setActiveIndex(i)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className="projects-orbit-node-orbit"
                        aria-hidden="true"
                      >
                        <span className="projects-orbit-node-core" />
                      </span>
                      <span className="projects-orbit-node-text">
                        <span className="projects-orbit-node-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="projects-orbit-node-title">
                          {project.title}
                        </span>
                        <span className="projects-orbit-node-year">
                          {project.year}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </nav>

              {/* Cinematic preview stage */}
              <div className="projects-orbit-stage">
                <div className="projects-orbit-preview-wrap">
                  <div
                    className="projects-orbit-ring projects-orbit-ring--outer"
                    aria-hidden="true"
                  />
                  <div
                    className="projects-orbit-ring projects-orbit-ring--inner"
                    aria-hidden="true"
                  />

                  <div key={activeProject.id} className="projects-orbit-preview">
                    {activeProject.liveUrl && activeProject.liveUrl !== "#" ? (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: "relative",
                          display: "block",
                          width: "100%",
                          height: "100%",
                          textDecoration: "none",
                        }}
                      >
                        <img
                          src={activeProject.image}
                          alt={activeProject.title}
                          className="projects-orbit-preview-img"
                          loading="lazy"
                          decoding="async"
                          width="1920"
                          height="1080"
                        />
                        {/* Hover overlay */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(108, 43, 217, 0.95) 0%, rgba(108, 43, 217, 0.75) 50%, rgba(108, 43, 217, 0.85) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                          className="projects-orbit-preview-overlay"
                        >
                          <div
                            style={{
                              fontFamily: "Syne",
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color: "#ffffff",
                              textAlign: "center",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              padding: "1rem 2rem",
                              borderRadius: "9999px",
                              background: "rgba(255, 255, 255, 0.15)",
                              backdropFilter: "blur(8px)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            Visit Website
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "1.1rem",
                              }}
                            >
                              ↗
                            </span>
                          </div>
                        </div>
                        <div className="projects-orbit-preview-shade" />
                        <span
                          className="projects-orbit-preview-ghost"
                          aria-hidden="true"
                        >
                          {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="projects-orbit-preview-metric">
                          {activeProject.metrics}
                        </span>
                      </a>
                    ) : (
                      <>
                        <img
                          src={activeProject.image}
                          alt={activeProject.title}
                          className="projects-orbit-preview-img"
                          loading="lazy"
                          decoding="async"
                          width="1920"
                          height="1080"
                        />
                        <div className="projects-orbit-preview-shade" />
                        <span
                          className="projects-orbit-preview-ghost"
                          aria-hidden="true"
                        >
                          {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="projects-orbit-preview-metric">
                          {activeProject.metrics}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div
                  key={`details-${activeProject.id}`}
                  className="projects-orbit-details"
                >
                  <p className="projects-orbit-details-meta">
                    {activeProject.year} · {activeProject.subtitle}
                  </p>
                  {activeProject.liveUrl && activeProject.liveUrl !== "#" ? (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#c9a7ff"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#f0e8ff"
                      }}
                    >
                      <h3 className="projects-orbit-details-title">
                        {activeProject.title}
                      </h3>
                    </a>
                  ) : (
                    <h3 className="projects-orbit-details-title">
                      {activeProject.title}
                    </h3>
                  )}
                  <p className="projects-orbit-details-desc">
                    {activeProject.longDescription}
                  </p>

                  <div className="projects-orbit-tools">
                    {activeProject.tools.map((tool) => (
                      <span key={tool} className="projects-orbit-tool">
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="projects-orbit-actions">
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {activeProject.liveUrl && activeProject.liveUrl !== "#" && (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="projects-orbit-cta"
                        >
                          Visit Website →
                        </a>
                      )}
                    </div>
                    <div className="projects-orbit-arrows">
                      <button
                        type="button"
                        className="projects-orbit-arrow-btn"
                        onClick={() => goTo(activeIndex - 1)}
                        aria-label="Previous project"
                      >
                        {"\u2190"}
                      </button>
                      <button
                        type="button"
                        className="projects-orbit-arrow-btn"
                        onClick={() => goTo(activeIndex + 1)}
                        aria-label="Next project"
                      >
                        {"\u2192"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// â”€â”€â”€ Certificate Card Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CertificateCard({
  title,
  issuer,
  date,
  credentialId,
  skills,
  badgeColor,
  icon,
}: Certificate) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "2.25rem",
        borderRadius: "24px",
        border: `1px solid ${
          hovered ? "rgba(139,79,232,0.65)" : "rgba(108,43,217,0.22)"
        }`,
        background: "rgba(13,2,33,0.85)",
        backdropFilter: "blur(20px)",
        boxShadow: hovered
          ? "0 0 60px rgba(108,43,217,0.35), 0 20px 50px rgba(0,0,0,0.6)"
          : "0 10px 30px rgba(0,0,0,0.4)",
        transition: "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(108,43,217,0.18)",
              border: "1px solid rgba(108,43,217,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: badgeColor,
              boxShadow: `0 0 20px ${badgeColor}33`,
            }}
          >
            {icon}
          </div>

          <span
            style={{
              fontFamily: "Syne",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#8b4fe8",
              padding: "0.25rem 0.7rem",
              borderRadius: "9999px",
              background: "rgba(108,43,217,0.14)",
              border: "1px solid rgba(108,43,217,0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <span>✓</span> Verified
          </span>
        </div>

        <h3
          style={{
            fontFamily: "Syne",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#f0e8ff",
            letterSpacing: "-0.015em",
            lineHeight: 1.25,
            marginBottom: "0.625rem",
          }}
        >
          {title}
        </h3>

        <div
          style={{
            fontFamily: "Syne",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#c9a7ff",
            marginBottom: "0.25rem",
          }}
        >
          {issuer}
        </div>

        <div
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: "0.78rem",
            color: "rgba(201,167,255,0.5)",
            marginBottom: "1.5rem",
          }}
        >
          {date} · ID: {credentialId}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {skills.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "Syne",
                fontSize: "0.7rem",
                color: "rgba(201,167,255,0.75)",
                background: "rgba(108,43,217,0.12)",
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
                border: "1px solid rgba(108,43,217,0.25)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <a
        href="#contact"
        style={{
          fontFamily: "Syne",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: hovered ? "#f0e8ff" : "rgba(201,167,255,0.7)",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          transition: "color 0.2s",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(108,43,217,0.18)",
        }}
      >
        View Credential Record →
      </a>
    </div>
  )
}

function CertificatesSection() {
  return (
    <section
      id="certificates"
      className="section-transition-bleed"
      style={{ padding: "9rem 2rem", position: "relative", zIndex: 2 }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <SectionLabel>04 / Credentials &amp; Accreditations</SectionLabel>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 4.2vw, 3.5rem)",
              color: "#f0e8ff",
              letterSpacing: "-0.028em",
            }}
          >
            Verified Certificates
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2rem",
          }}
        >
          {CERTIFICATES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.12} direction="up">
              <CertificateCard {...c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// â”€â”€â”€ Process Step Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProcessStep({ step, title, desc, icon }: typeof PROCESS[0]) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textAlign: "center", cursor: "default", padding: "0 0.5rem" }}
    >
      <div
        style={{
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          margin: "0 auto 2rem",
          border: `1px solid ${
            hovered ? "rgba(139,79,232,0.95)" : "rgba(108,43,217,0.38)"
          }`,
          background: hovered
            ? "rgba(108,43,217,0.25)"
            : "rgba(108,43,217,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? "#f0e8ff" : "#c9a7ff",
          boxShadow: hovered
            ? "0 0 32px rgba(108,43,217,0.75), 0 0 64px rgba(108,43,217,0.3)"
            : "none",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "Syne",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.22em",
          color: "#8b4fe8",
          marginBottom: "0.625rem",
          textTransform: "uppercase",
        }}
      >
        {step}
      </div>
      <h3
        style={{
          fontFamily: "Syne",
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "#f0e8ff",
          letterSpacing: "-0.018em",
          marginBottom: "0.875rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontSize: "0.875rem",
          lineHeight: 1.72,
          color: "rgba(201,167,255,0.65)",
          fontWeight: 300,
        }}
      >
        {desc}
      </p>
    </div>
  )
}

function ProcessSection() {
  return (
    <section
      id="process"
      className="section-transition-bleed"
      style={{ padding: "9rem 2rem", position: "relative", zIndex: 2 }}
    >
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "5.5rem" }}>
          <SectionLabel>05 / Methodology &amp; Workflow</SectionLabel>
          <h2
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "clamp(2.25rem, 4.2vw, 3.5rem)",
              color: "#f0e8ff",
              letterSpacing: "-0.028em",
            }}
          >
            The Mission Blueprint
          </h2>
        </Reveal>
        <div className="grid-process">
          <div className="process-connector" />
          {PROCESS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} direction="up">
              <ProcessStep {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// â”€â”€â”€ Main Root Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function App() {
  return (
    <div
      style={{
        background: "#0d0221",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <DynamicNebulaCanvas />
      <CustomCursor />
      <TopNav />
      <ScrollProgressIndicator />

      <main style={{ position: "relative", zIndex: 1, paddingTop: "5rem" }}>
        <Hero />
        <About />
        <ProjectsSection />
        <Certificates />
        <ProcessSection />
        <ContactSection />
      </main>
    </div>
  )
}
