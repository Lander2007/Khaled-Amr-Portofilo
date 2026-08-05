import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import LogoIcon from "./LogoIcon"

// Futuristic Text Scrambler Effect for Links
function ScrambledText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

  const doScramble = () => {
    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " "
            if (index < iteration) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
      iteration += 1 / 2
    }, 25)
  }

  useEffect(() => {
    if (active) {
      doScramble()
    } else {
      setDisplayText(text)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [active, text])

  return <span className="font-mono tracking-wider">{displayText}</span>
}

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Holographic telemetry panel stats
  const [telemetryOpen, setTelemetryOpen] = useState(false)
  const [fps, setFps] = useState(60)
  const [scrollSpeed, setScrollSpeed] = useState(0)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())

  // Scroll progress for the thin progress bar
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  })

  // FPS & scroll speed calculation
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const calcFps = (time: number) => {
      frameCount++
      if (time > lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)))
        frameCount = 0
        lastTime = time
      }
      animationId = requestAnimationFrame(calcFps)
    }
    animationId = requestAnimationFrame(calcFps)

    const calcScrollSpeed = () => {
      const now = Date.now()
      const sy = window.scrollY
      const dy = Math.abs(sy - lastScrollY.current)
      const dt = now - lastScrollTime.current
      if (dt > 0) {
        const speed = Math.round((dy / dt) * 1000) // pixels per second
        setScrollSpeed(speed)
      }
      lastScrollY.current = sy
      lastScrollTime.current = now
    }

    window.addEventListener("scroll", calcScrollSpeed, { passive: true })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("scroll", calcScrollSpeed)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const navSections = [
        "hero",
        "about",
        "projects",
        "certificates",
        "process",
        "contact",
      ]
      const scrollPos = window.scrollY + window.innerHeight * 0.35
      for (let i = navSections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(navSections[i])
        if (sec && scrollPos >= sec.offsetTop) {
          setActiveSection(navSections[i])
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { id: "about", label: "About", num: "01" },
    { id: "projects", label: "Projects", num: "02" },
    { id: "certificates", label: "Certs", num: "03" },
    { id: "process", label: "Process", num: "04" },
    { id: "contact", label: "Contact", num: "05" },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -28, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: scrolled ? "12px" : "20px",
          left: "50%",
          zIndex: 100,
          transition: "top 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="relative flex items-center gap-2 md:gap-3 py-2 pl-2 pr-2 rounded-full w-max max-w-[95%] sm:max-w-none"
      >
        {/* Liquid Glowing Border Sweeper background */}
        <div
          className="absolute inset-0 rounded-full p-[1.5px] overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.4) 0%, rgba(217,70,239,0.4) 50%, rgba(6,182,212,0.4) 100%)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        >
          {/* Tracing neon sweep light */}
          <div
            className="absolute w-[80px] h-[80px] rounded-full blur-md"
            style={{
              background:
                "radial-gradient(circle, #06b6d4 0%, #d946ef 60%, transparent 100%)",
              animation: "spin-border 6s linear infinite",
              transformOrigin: "center",
              top: "50%",
              left: "50%",
              marginTop: "-40px",
              marginLeft: "-40px",
            }}
          />
        </div>

        {/* ── Glass body ────────────────────────────────────────────────── */}
        <div
          className="absolute inset-[1.5px] rounded-full"
          style={{
            background: scrolled
              ? "rgba(6, 1, 18, 0.93)"
              : "rgba(13, 7, 34, 0.82)",
            backdropFilter: "blur(24px) saturate(2)",
            boxShadow: scrolled
              ? "0 0 40px rgba(108,43,217,0.25), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 0 20px rgba(108,43,217,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
            transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* ── Scroll-progress bar (bottom edge) ─────────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: "12px",
            right: "12px",
            height: "2px",
            scaleX: progressScaleX,
            transformOrigin: "left",
            background:
              "linear-gradient(90deg, #06b6d4 0%, #a855f7 50%, #d946ef 100%)",
            boxShadow: "0 0 12px rgba(6,182,212,0.95)",
            borderRadius: "9999px",
          }}
        />

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <a
          href="#hero"
          aria-label="Home"
          className="relative flex items-center justify-center p-1.5 rounded-full shrink-0 z-10 group"
          style={{
            border: "1px solid rgba(6,182,212,0.45)",
            background: "rgba(6,182,212,0.12)",
            boxShadow: "0 0 18px rgba(6,182,212,0.25)",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 32px rgba(217,70,239,0.7)"
            e.currentTarget.style.borderColor = "rgba(217,70,239,0.8)"
            e.currentTarget.style.background = "rgba(217,70,239,0.22)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 18px rgba(6,182,212,0.25)"
            e.currentTarget.style.borderColor = "rgba(6,182,212,0.45)"
            e.currentTarget.style.background = "rgba(6,182,212,0.12)"
          }}
        >
          <LogoIcon size={scrolled ? 24 : 28} />
          {/* Orbital dashed ring */}
          <span
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 group-hover:border-fuchsia-400/60"
            style={{
              transition: "transform 1.3s ease-in-out, border-color 0.3s",
              transform: "rotate(0deg)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "rotate(180deg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "rotate(0deg)")
            }
          />
        </a>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div
          className="w-px h-5 shrink-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(6,182,212,0.65), transparent)",
          }}
        />

        {/* ── Desktop nav links with glitch scrambled hover ────────────────── */}
        <div className="hidden md:flex items-center gap-0.5 z-10">
          {links.map((l) => {
            const isActive = activeSection === l.id
            const isHovered = hoveredId === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors duration-250 uppercase"
                style={{
                  color: isActive ? "#ffffff" : "rgba(201,167,255,0.6)",
                }}
                onMouseEnter={() => setHoveredId(l.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Active pill with cyan neon shadow */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(108,43,217,0.28)",
                      border: "1px solid rgba(6,182,212,0.6)",
                      boxShadow:
                        "0 0 24px rgba(6,182,212,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                {/* Hover pill */}
                {!isActive && isHovered && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-purple-500/10 border border-purple-500/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.58rem",
                      fontWeight: 600,
                      color: isActive ? "#06b6d4" : "rgba(108,43,217,0.6)",
                    }}
                  >
                    {l.num}
                  </span>
                  <ScrambledText text={l.label} active={isHovered} />
                </span>
              </a>
            )
          })}
        </div>

        {/* ── Right controls ────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 z-10">
          {/* Telemetry trigger icon button */}
          <button
            onClick={() => setTelemetryOpen(!telemetryOpen)}
            aria-label="Toggle Telemetry Panel"
            className="hidden sm:flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-cyan-500/10 border border-cyan-500/25 transition-all text-cyan-400"
            style={{
              background: telemetryOpen
                ? "rgba(6,182,212,0.2)"
                : "rgba(6,182,212,0.04)",
              boxShadow: telemetryOpen
                ? "0 0 12px rgba(6,182,212,0.3)"
                : "none",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </button>

          {/* Hire Me button */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-white font-bold text-xs tracking-wider uppercase"
            style={{
              background:
                "linear-gradient(135deg, #0284c7 0%, #7c3aed 50%, #db2777 100%)",
              boxShadow:
                "0 0 24px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
              transition: "box-shadow 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 38px rgba(217,70,239,0.85), inset 0 1px 0 rgba(255,255,255,0.25)"
              e.currentTarget.style.transform = "translateY(-1px) scale(1.04)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 22px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"
              e.currentTarget.style.transform = "translateY(0) scale(1)"
            }}
          >
            <span className="hire-me-shimmer" />
            <span className="relative z-10 font-mono">Hire Me</span>
            <svg
              className="relative z-10"
              width="9"
              height="9"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
            className="flex md:hidden p-2 rounded-full cursor-pointer shrink-0"
            style={{
              background: mobileOpen
                ? "rgba(217,70,239,0.2)"
                : "rgba(6,182,212,0.1)",
              border: `1px solid ${
                mobileOpen ? "rgba(217,70,239,0.55)" : "rgba(6,182,212,0.3)"
              }`,
              color: mobileOpen ? "#f0e8ff" : "#06b6d4",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="14" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </motion.svg>
          </button>
        </div>
      </motion.nav>

      {/* ── Holographic Telemetry Drawer Readout panel ──────────────────────── */}
      <AnimatePresence>
        {telemetryOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              position: "fixed",
              top: scrolled ? "72px" : "80px",
              left: "50%",
              zIndex: 99,
              width: "280px",
            }}
            className="rounded-2xl border border-cyan-500/30 bg-purple-950/80 backdrop-blur-md p-4 flex flex-col gap-3 shadow-[0_15px_45px_rgba(0,0,0,0.65)]"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-cyan-500/20 pb-2">
              <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Telemetry System v1.4
              </span>
              <button
                onClick={() => setTelemetryOpen(false)}
                className="text-[9px] font-mono text-fuchsia-400 uppercase tracking-wider hover:underline bg-transparent border-none cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Readouts grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-black/30 border border-purple-500/10">
                <div className="text-[8px] font-mono text-purple-400 uppercase">
                  Engine FPS
                </div>
                <div className="text-sm font-mono text-cyan-300 font-semibold">
                  {fps} / 60
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-purple-500/10">
                <div className="text-[8px] font-mono text-purple-400 uppercase">
                  Velocity
                </div>
                <div className="text-sm font-mono text-cyan-300 font-semibold">
                  {scrollSpeed} px/s
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-purple-500/10">
                <div className="text-[8px] font-mono text-purple-400 uppercase">
                  Location
                </div>
                <div className="text-[10px] font-mono text-fuchsia-300 font-bold uppercase truncate">
                  {activeSection}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-purple-500/10">
                <div className="text-[8px] font-mono text-purple-400 uppercase">
                  Scroll Y
                </div>
                <div className="text-sm font-mono text-fuchsia-300 font-semibold">
                  {window.scrollY} px
                </div>
              </div>
            </div>

            {/* Matrix overlay text */}
            <div className="text-[7px] font-mono text-cyan-400/40 select-none uppercase tracking-tight text-center">
              SYSTEM_SECURE_VERIFIED // LINK:OK
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile full-screen drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            style={{
              background: "rgba(4, 1, 13, 0.98)",
              backdropFilter: "blur(30px)",
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(217,70,239,0.06) 50%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.04,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-10 relative z-10"
            >
              <LogoIcon size={54} />
            </motion.div>

            {/* Links */}
            <div className="flex flex-col items-stretch gap-2.5 relative z-10 w-full max-w-[280px] px-4">
              {links.map((l, idx) => {
                const isActive = activeSection === l.id
                return (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.07 + idx * 0.055,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
                    style={{
                      background: isActive
                        ? "rgba(6,182,212,0.16)"
                        : "rgba(6,182,212,0.04)",
                      border: `1px solid ${
                        isActive
                          ? "rgba(6,182,212,0.5)"
                          : "rgba(6,182,212,0.15)"
                      }`,
                      boxShadow: isActive
                        ? "0 0 28px rgba(6,182,212,0.22)"
                        : "none",
                      transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: isActive ? "#ffffff" : "rgba(201,167,255,0.6)",
                      }}
                    >
                      {l.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.62rem",
                        color: isActive ? "#06b6d4" : "rgba(6,182,212,0.45)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {l.num}
                    </span>
                  </motion.a>
                )
              })}
            </div>

            {/* Hire Me */}
            <motion.a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.07 + links.length * 0.055,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 relative overflow-hidden px-10 py-3.5 rounded-full text-white font-bold text-sm tracking-wide z-10 flex items-center gap-2 uppercase"
              style={{
                background:
                  "linear-gradient(135deg, #0284c7 0%, #7c3aed 50%, #db2777 100%)",
                boxShadow: "0 0 36px rgba(124,58,237,0.6)",
              }}
            >
              <span className="hire-me-shimmer" />
              <span className="relative z-10 font-mono">Hire Me</span>
              <svg
                className="relative z-10"
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
