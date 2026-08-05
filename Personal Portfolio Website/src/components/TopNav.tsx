import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import LogoIcon from "./LogoIcon"

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileOpen, setMobileOpen] = useState(false)

  // Scroll progress for the thin progress bar
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  })

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
        className="relative flex items-center gap-2 md:gap-3 py-2 pl-2 pr-2 rounded-full overflow-hidden w-max max-w-[95%] sm:max-w-none"
      >
        {/* ── Glass body ────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: scrolled
              ? "rgba(6, 1, 18, 0.88)"
              : "rgba(13, 7, 34, 0.72)",
            backdropFilter: "blur(22px) saturate(1.9)",
            boxShadow: scrolled
              ? "0 0 0 1px rgba(139,79,232,0.38), 0 0 50px rgba(108,43,217,0.2), 0 8px 36px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 0 0 1px rgba(108,43,217,0.24), 0 0 22px rgba(108,43,217,0.1), 0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
            transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* ── Scroll-progress bar (bottom edge) ─────────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            scaleX: progressScaleX,
            transformOrigin: "left",
            background:
              "linear-gradient(90deg, #6c2bd9 0%, #a855f7 50%, #06b6d4 100%)",
            boxShadow: "0 0 10px rgba(168,85,247,0.85)",
            borderRadius: "0 0 9999px 9999px",
          }}
        />

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <a
          href="#hero"
          aria-label="Home"
          className="relative flex items-center justify-center p-1.5 rounded-full shrink-0 z-10 group"
          style={{
            border: "1px solid rgba(108,43,217,0.38)",
            background: "rgba(108,43,217,0.12)",
            boxShadow: "0 0 18px rgba(108,43,217,0.18)",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 32px rgba(139,79,232,0.55)"
            e.currentTarget.style.borderColor = "rgba(139,79,232,0.7)"
            e.currentTarget.style.background = "rgba(108,43,217,0.22)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 18px rgba(108,43,217,0.18)"
            e.currentTarget.style.borderColor = "rgba(108,43,217,0.38)"
            e.currentTarget.style.background = "rgba(108,43,217,0.12)"
          }}
        >
          <LogoIcon size={scrolled ? 24 : 28} />
          {/* Orbital dashed ring */}
          <span
            className="absolute inset-0 rounded-full border border-dashed border-purple-400/20 group-hover:border-purple-400/40"
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
              "linear-gradient(to bottom, transparent, rgba(108,43,217,0.45), transparent)",
          }}
        />

        {/* ── Desktop nav links ─────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-0 z-10">
          {links.map((l) => {
            const isActive = activeSection === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-250"
                style={{
                  color: isActive ? "#f0e8ff" : "rgba(201,167,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color = "#c9a7ff"
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(201,167,255,0.5)"
                }}
              >
                {/* Active pill */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(108,43,217,0.24)",
                      border: "1px solid rgba(139,79,232,0.52)",
                      boxShadow:
                        "0 0 22px rgba(108,43,217,0.45), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {/* Section number */}
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', monospace",
                      fontSize: "0.58rem",
                      fontWeight: 500,
                      color: isActive
                        ? "rgba(168,85,247,0.9)"
                        : "rgba(108,43,217,0.48)",
                      letterSpacing: "0.04em",
                      transition: "color 0.3s",
                    }}
                  >
                    {l.num}
                  </span>
                  {l.label}
                </span>
              </a>
            )
          })}
        </div>

        {/* ── Right controls ────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 z-10">
          {/* Hire Me button */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-white font-semibold text-xs tracking-wide"
            style={{
              background:
                "linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #a855f7 100%)",
              boxShadow:
                "0 0 22px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
              transition: "box-shadow 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 38px rgba(139,79,232,0.8), inset 0 1px 0 rgba(255,255,255,0.22)"
              e.currentTarget.style.transform = "translateY(-1px) scale(1.04)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 22px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"
              e.currentTarget.style.transform = "translateY(0) scale(1)"
            }}
          >
            {/* Shimmer sweep */}
            <span className="hire-me-shimmer" />
            <span className="relative z-10">Hire Me</span>
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
                ? "rgba(139,79,232,0.28)"
                : "rgba(108,43,217,0.1)",
              border: `1px solid ${
                mobileOpen ? "rgba(139,79,232,0.55)" : "rgba(108,43,217,0.3)"
              }`,
              color: mobileOpen ? "#f0e8ff" : "#c9a7ff",
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
              background: "rgba(4, 1, 13, 0.97)",
              backdropFilter: "blur(28px)",
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(108,43,217,0.18) 0%, rgba(139,79,232,0.06) 50%, transparent 70%)",
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
            <div className="flex flex-col items-stretch gap-2 relative z-10 w-full max-w-[280px] px-4">
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
                        ? "rgba(108,43,217,0.24)"
                        : "rgba(108,43,217,0.07)",
                      border: `1px solid ${
                        isActive
                          ? "rgba(139,79,232,0.5)"
                          : "rgba(108,43,217,0.2)"
                      }`,
                      boxShadow: isActive
                        ? "0 0 28px rgba(108,43,217,0.28)"
                        : "none",
                      transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        color: isActive ? "#f0e8ff" : "rgba(201,167,255,0.6)",
                      }}
                    >
                      {l.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.62rem",
                        color: isActive
                          ? "rgba(168,85,247,0.85)"
                          : "rgba(108,43,217,0.45)",
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
              className="mt-8 relative overflow-hidden px-10 py-3.5 rounded-full text-white font-semibold text-sm tracking-wide z-10 flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, #5b21b6 0%, #7c3aed 45%, #a855f7 100%)",
                boxShadow: "0 0 36px rgba(108,43,217,0.6)",
              }}
            >
              <span className="hire-me-shimmer" />
              <span className="relative z-10">Hire Me</span>
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
