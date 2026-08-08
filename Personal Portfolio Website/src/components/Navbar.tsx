import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LogoIcon from "./LogoIcon"

interface NavItem {
  id: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
]

const TYPEWRITER_PHRASES = ["KHALED AMR", "FRONTEND DEV", "REACT // UI"]

function ActivityIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function TypewriterLogo() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex]
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (text.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1))
        }, 80)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, 3000)
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length - 1))
        }, 40)
      } else {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length)
      }
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, phraseIndex])

  return (
    <span
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      className="inline-block whitespace-nowrap tracking-wider font-semibold"
    >
      {text}
      <span className="animate-pulse text-cyan-400 font-bold ml-0.5">_</span>
    </span>
  )
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("hero")
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)

  // Live Telemetry Stats (Only updated when Telemetry HUD is open)
  const [fps, setFps] = useState<number>(60)
  const [scrollY, setScrollY] = useState<number>(0)
  const [scrollVelocity, setScrollVelocity] = useState<number>(0)

  const islandRef = useRef<HTMLElement>(null)

  // Performance-optimized Throttled Scroll Listener (requestAnimationFrame)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Telemetry stats calculation loop (ONLY active when isTelemetryOpen is true)
  useEffect(() => {
    if (!isTelemetryOpen) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number
    let lastScrollY = window.scrollY
    let lastScrollTime = Date.now()

    const calcStats = (time: number) => {
      frameCount++
      if (time > lastTime + 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (time - lastTime))))
        frameCount = 0
        lastTime = time
      }
      animationId = requestAnimationFrame(calcStats)
    }

    animationId = requestAnimationFrame(calcStats)

    const handleScrollStats = () => {
      const sy = Math.round(window.scrollY)
      setScrollY(sy)
      const now = Date.now()
      const dt = now - lastScrollTime
      const dy = Math.abs(sy - lastScrollY)
      if (dt > 0) {
        setScrollVelocity(Math.round((dy / dt) * 1000))
      }
      lastScrollY = sy
      lastScrollTime = now
    }

    window.addEventListener("scroll", handleScrollStats, { passive: true })
    handleScrollStats()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("scroll", handleScrollStats)
    }
  }, [isTelemetryOpen])

  // Active section intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px",
      threshold: 0.15,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Click outside listener to dismiss telemetry state
  useEffect(() => {
    if (!isTelemetryOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(event.target as Node)) {
        setIsTelemetryOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isTelemetryOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setActiveSection(id)
    setMobileOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  // Active Dynamic Island Mode
  const mode = isTelemetryOpen
    ? "telemetry"
    : isScrolled && !isHovered
    ? "compact"
    : "expanded"

  return (
    <>
      <motion.nav
        ref={islandRef}
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ type: "spring", stiffness: 450, damping: 35 }}
        aria-label="Dynamic Island Control Navigation"
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#060212]/90 backdrop-blur-2xl border border-purple-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(168,85,247,0.18)] transform-gpu will-change-transform overflow-hidden ${
          mode === "telemetry"
            ? "w-80 p-5 rounded-3xl flex flex-col gap-3"
            : mode === "compact"
            ? "w-auto px-4 py-2 rounded-full flex items-center gap-4"
            : "w-[92vw] max-w-4xl px-5 py-2.5 rounded-full flex items-center justify-between gap-6"
        }`}
      >
        {/* Top Edge Border Light Beam Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* MODE 1: TELEMETRY MORPH STATE */}
          {mode === "telemetry" && (
            <motion.div
              key="mode-telemetry"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="w-full flex flex-col gap-3 font-mono text-xs relative z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                  </span>
                  <span className="text-[11px] text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <ActivityIcon size={12} className="text-cyan-400" />
                    TELEMETRY HUD
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTelemetryOpen(false)}
                  aria-label="Close Telemetry"
                  className="text-purple-400 hover:text-white cursor-pointer transition-colors focus:outline-none"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20 flex flex-col">
                  <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                    ENGINE FPS
                  </span>
                  <span className="text-sm font-semibold text-cyan-300 mt-0.5">
                    {fps} <span className="text-[10px] font-normal text-cyan-500/70">FPS</span>
                  </span>
                </div>
                <div className="bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20 flex flex-col">
                  <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                    VELOCITY
                  </span>
                  <span className="text-sm font-semibold text-purple-200 mt-0.5">
                    {scrollVelocity} <span className="text-[10px] font-normal text-purple-400/70">px/s</span>
                  </span>
                </div>
                <div className="bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20 flex flex-col">
                  <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                    LOCATION
                  </span>
                  <span className="text-sm font-semibold text-fuchsia-300 mt-0.5 uppercase truncate">
                    {activeSection || "HERO"}
                  </span>
                </div>
                <div className="bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/20 flex flex-col">
                  <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                    SCROLL Y
                  </span>
                  <span className="text-sm font-semibold text-emerald-300 mt-0.5">
                    {scrollY} <span className="text-[10px] font-normal text-emerald-500/70">px</span>
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-purple-500/15">
                <span className="text-[9px] text-purple-400/50 text-center block uppercase tracking-widest">
                  SYSTEM_OK // LINK:VERIFIED
                </span>
              </div>
            </motion.div>
          )}

          {/* MODE 2: COMPACT DYNAMIC ISLAND STATE */}
          {mode === "compact" && (
            <motion.div
              key="mode-compact"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-4 w-full justify-between relative z-10"
            >
              <a
                href="#hero"
                onClick={(e) => handleNavClick(e, "hero")}
                className="flex items-center gap-2 group focus:outline-none"
                aria-label="Home"
              >
                <div className="w-6 h-6 rounded-full bg-purple-900/50 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)] shrink-0">
                  <LogoIcon size={14} />
                </div>
              </a>

              {/* Active Section Title with Pulsing Cyan Dot */}
              <span className="flex items-center gap-1.5 text-xs font-mono text-purple-200 tracking-wider uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                • {activeSection}
              </span>

              {/* Activity Icon Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsTelemetryOpen(true)
                }}
                aria-label="Open Telemetry HUD"
                className="relative p-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-cyan-400 hover:border-cyan-400/60 transition-all cursor-pointer focus:outline-none"
              >
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <ActivityIcon size={14} />
              </button>
            </motion.div>
          )}

          {/* MODE 3: FULL DOCK STATE */}
          {mode === "expanded" && (
            <motion.div
              key="mode-expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-between w-full gap-6 relative z-10"
            >
              {/* Left: Logo & Typewriter */}
              <a
                href="#hero"
                onClick={(e) => handleNavClick(e, "hero")}
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                className="min-w-[140px] sm:min-w-[185px] flex items-center gap-2.5 text-xs font-bold tracking-wider text-purple-200 group focus:outline-none"
                aria-label="Home"
              >
                <div className="relative flex items-center justify-center p-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 group-hover:border-purple-400/80 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.2)] shrink-0">
                  <LogoIcon size={18} />
                </div>
                <TypewriterLogo />
              </a>

              {/* Center: Navigation Links */}
              <div
                style={{ fontFamily: "'Space Grotesk', 'Syne', sans-serif" }}
                className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative px-4 py-1.5 text-xs font-medium transition-colors duration-150 focus:outline-none ${
                        isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-pill"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/35 to-violet-600/35 border border-purple-400/50 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)] -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {item.label}
                    </a>
                  )
                })}
              </div>

              {/* Right: Activity Icon & Connect Button */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTelemetryOpen(true)}
                  aria-label="Toggle Telemetry HUD"
                  className="relative p-2 rounded-full bg-purple-950/40 border border-purple-500/30 text-cyan-400 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] cursor-pointer flex items-center justify-center focus:outline-none"
                >
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <ActivityIcon size={16} />
                </button>

                <motion.a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: "'Space Grotesk', 'Syne', sans-serif" }}
                  className="relative group overflow-hidden text-xs font-semibold tracking-wider px-4 py-2 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-100 hover:border-purple-400/60 transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.2)] hidden sm:flex items-center gap-1.5 focus:outline-none"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>• Connect</span>
                </motion.a>

                {/* Mobile Hamburger Button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-expanded={mobileOpen}
                  aria-label="Toggle navigation menu"
                  className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-purple-900/40 border border-purple-500/20 focus:outline-none transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Holographic Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 backdrop-blur-3xl bg-[#080314]/95 flex flex-col justify-between p-6 sm:p-10 border border-purple-500/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                className="flex items-center gap-2 text-xs text-purple-200"
              >
                <LogoIcon size={20} />
                <TypewriterLogo />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                className="px-3 py-1.5 text-xs font-semibold text-purple-300 border border-purple-500/30 rounded bg-purple-950/40 hover:bg-purple-900/40 focus:outline-none"
              >
                CLOSE [X]
              </button>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col gap-3 my-auto">
              {NAV_ITEMS.map((item, index) => {
                const isActive = activeSection === item.id
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    style={{ fontFamily: "'Space Grotesk', 'Syne', sans-serif" }}
                    className={`relative p-4 text-sm rounded-xl border transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-purple-600/25 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                        : "bg-purple-950/20 border-purple-500/20 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="text-xs text-purple-400/60 font-bold"
                      >
                        0{index + 1}
                      </span>
                      <span className="font-semibold tracking-wider">{item.label}</span>
                    </div>
                    {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                  </a>
                )
              })}
            </div>

            {/* Footer CTA */}
            <div
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="border-t border-purple-500/20 pt-4 flex items-center justify-between text-xs"
            >
              <span className="text-slate-400 tracking-wider">READY TO COLLABORATE?</span>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="px-4 py-2 rounded-full bg-purple-600/30 border border-purple-400/50 text-white font-semibold shadow-[0_0_10px_rgba(168,85,247,0.3)] tracking-wider"
              >
                CONNECT &rarr;
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
