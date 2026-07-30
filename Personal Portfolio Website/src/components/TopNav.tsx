import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LogoIcon from "./LogoIcon"

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileOpen, setMobileOpen] = useState(false)

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
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "certificates", label: "Certificates" },
    { id: "process", label: "Process" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: scrolled ? "12px" : "20px",
          left: "50%",
          zIndex: 100,
        }}
        className={`
          flex items-center gap-3 md:gap-5 py-2 px-3 md:px-4
          bg-[#0d0722]/70 backdrop-blur-xl
          border border-purple-500/20 hover:border-purple-500/40
          rounded-full shadow-[0_0_20px_rgba(139,92,246,0.12)]
          transition-all duration-300 ease-in-out
          w-max max-w-[95%] sm:max-w-none
        `}
      >
        {/* Logo (Left) */}
        <a
          href="#hero"
          className="relative flex items-center justify-center p-1 rounded-full border border-purple-500/20 hover:border-purple-500/40 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.15)] group shrink-0"
          aria-label="Khaled Amr Portfolio Home"
        >
          <LogoIcon size={scrolled ? 26 : 30} />
          {/* Subtle animated orbital element */}
          <span className="absolute inset-0 rounded-full border border-dashed border-purple-400/30 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
        </a>

        {/* Vertical divider */}
        <div className="w-px h-5 bg-purple-500/20 shrink-0" />

        {/* Nav Links (Centered) */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = activeSection === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`
                  relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors duration-300
                  ${isActive ? "text-white" : "text-slate-400 hover:text-white"}
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            )
          })}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* "Hire Me" Button (hidden on mobile) */}
          <a
            href="#contact"
            className="
              hidden sm:inline-block shrink-0
              bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium text-xs px-5 py-2.5 rounded-full
              hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 transition-all duration-300
            "
          >
            Hire Me
          </a>

          {/* Mobile Menu Trigger (hidden on desktop) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Mobile Navigation"
            className="
              flex md:hidden p-2 rounded-full cursor-pointer shrink-0
              bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:text-white
              hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300
            "
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#060112]/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-6"
          >
            {/* Logo in mobile menu */}
            <div className="mb-4">
              <LogoIcon size={56} />
            </div>

            {/* Links */}
            {links.map((l, idx) => (
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setMobileOpen(false)}
                className={`text-lg font-medium tracking-wide transition-colors ${
                  activeSection === l.id ? "text-purple-400 font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                {l.label}
              </motion.a>
            ))}

            {/* Hire Me Button inside Mobile Menu */}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: links.length * 0.05 }}
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium text-xs px-8 py-3 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
            >
              Hire Me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
