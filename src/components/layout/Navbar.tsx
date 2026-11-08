"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import MagneticButton from "@/components/motion/MagneticButton";
import BrandLogo from "@/components/ui/BrandLogo";
import PixelThemeToggle from "@/components/PixelThemeToggle";
import { usePrefersReducedMotion, setMotionPreference } from "@/hooks/usePrefersReducedMotion";

interface NavItem {
  id: string;
  label: string;
  href: string;
  num: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home", href: "/#hero", num: "00" },
  { id: "work", label: "Work", href: "/#work", num: "01" },
  { id: "about", label: "About", href: "/#about", num: "02" },
  { id: "skills", label: "Capabilities", href: "/#skills", num: "03" },
  { id: "contact", label: "Contact", href: "/#contact", num: "04" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const scrolledRef = useRef(false);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const prefersReduced = usePrefersReducedMotion();

  const toggleMotion = () => {
    setMotionPreference(prefersReduced ? "full" : "reduced");
  };

  // 1. Passive scroll listener strictly for header background blur boundary & top-of-page hero snap
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }

      // If at the very top of the page, guarantee hero is marked active
      if (window.scrollY < 100) {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Off-main-thread IntersectionObserver for section spy (Zero Layout Thrashing)
    const sectionIds = ["hero", "transform", "work", "about", "skills", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        // If near top, prefer hero
        if (window.scrollY < 100) {
          setActiveSection("hero");
          return;
        }

        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Map transform section back to hero/work sensibly
            if (entry.target.id === "transform") {
              setActiveSection("work");
            } else {
              setActiveSection(entry.target.id);
            }
            break;
          }
        }
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // 3. Sliding Active & Hover Indicator Coordination
  const targetSection =
    hoveredSection ||
    (NAV_ITEMS.some((n) => n.id === activeSection) ? activeSection : null);

  const updateIndicator = useCallback(() => {
    const navEl = navRef.current;
    const indicator = indicatorRef.current;
    if (!navEl || !indicator) return;

    const targetEl = targetSection ? itemRefs.current[targetSection] : null;

    if (targetEl) {
      const navRect = navEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const x = targetRect.left - navRect.left;
      const width = targetRect.width;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.to(indicator, {
        x,
        width,
        opacity: 1,
        duration: prefersReducedMotion ? 0 : 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(indicator, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [targetSection]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator, { passive: true });
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts?.ready?.then(updateIndicator);
    }
    const currentIndicator = indicatorRef.current;
    return () => {
      window.removeEventListener("resize", updateIndicator);
      if (currentIndicator) {
        gsap.killTweensOf(currentIndicator);
      }
    };
  }, [updateIndicator]);

  // Navigation click handler: smooth in-page scrolling with accurate history/hash update
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("hero");
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${id}`);
          setActiveSection(id);
        }
      }
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveSection("hero");
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--surface-primary)]/95 backdrop-blur-md border-b border-current/10 py-3.5 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark & Logo (Primary Home Controller) */}
          <Link
            href="/#hero"
            onClick={handleHomeClick}
            className="group flex items-center gap-2.5 sm:gap-3 font-display tracking-tight text-lg sm:text-xl font-bold uppercase transition-opacity hover:opacity-85 outline-none focus-visible:ring-2 focus-visible:ring-current rounded-xs cursor-pointer"
            aria-label="Khaled Amr — Return to Home section"
            title="Khaled Amr — Return to top"
          >
            <BrandLogo className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105" />
            <span className="tracking-normal transition-colors duration-200 text-current">
              KHALED AMR
            </span>
            <span className="hidden md:inline-block font-mono text-[10px] tracking-widest uppercase ml-1 border-l pl-2.5 font-normal transition-colors duration-200 text-current/60 border-current/20">
              FORM / SHIFT
            </span>
          </Link>

          {/* Desktop Navigation Row: Nav Links + PixelThemeToggle + Action Buttons */}
          <nav
            ref={navRef}
            onMouseLeave={() => setHoveredSection(null)}
            className="relative hidden md:flex items-center gap-5 lg:gap-7 font-mono text-xs tracking-wider uppercase font-medium"
            aria-label="Primary Navigation"
          >
            {/* Sliding Indicator with Refined Motion */}
            <div
              ref={indicatorRef}
              className="absolute -bottom-1 h-[2px] bg-current pointer-events-none rounded-full"
              style={{ left: 0, width: 0, opacity: 0 }}
              aria-hidden="true"
            />

            {/* Navigation Links */}
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredSection === item.id;

              return (
                <Link
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  onMouseEnter={() => setHoveredSection(item.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onFocus={() => setHoveredSection(item.id)}
                  onBlur={() => setHoveredSection(null)}
                  className="group relative py-1 px-1 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-current rounded-xs"
                  aria-current={isActive ? "page" : undefined}
                >
                  <MagneticButton strength={0.14} maxOffset={3} className="inline-block">
                    <span
                      className={`inline-block transition-all duration-200 ease-out select-none ${
                        isHovered ? "-translate-y-0.5 text-current font-semibold" : "translate-y-0"
                      } ${
                        isActive
                          ? "text-current font-bold"
                          : "text-current/75 hover:text-current"
                      }`}
                    >
                      {item.label}
                    </span>
                  </MagneticButton>
                </Link>
              );
            })}

            {/* Hairline Separator */}
            <div className="h-4 w-[1px] bg-current/15 mx-0.5 pointer-events-none" aria-hidden="true" />

            {/* Directly Integrated Pixel-Particle Theme Polarity Toggle */}
            <div className="flex items-center py-0.5">
              <PixelThemeToggle />
            </div>

            {/* Hairline Separator */}
            <div className="h-4 w-[1px] bg-current/15 mx-0.5 pointer-events-none" aria-hidden="true" />

            {/* Direct CTA Button */}
            <MagneticButton strength={0.2} maxOffset={5}>
              <a
                href="mailto:kaled.amr0210@gmail.com"
                className="px-4 py-2 border border-current text-current hover:bg-current hover:text-[var(--bg-primary)] transition-all duration-200 flex items-center gap-1.5 text-xs font-bold tracking-wider cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-current rounded-xs"
              >
                <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                  Get in Touch
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </MagneticButton>

            {/* Developer Console Quick Launcher (Cmd+K / Ctrl+K) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-developer-terminal"))}
              className="px-2.5 py-2 border border-current/25 text-current/80 hover:text-current hover:border-current hover:bg-current/5 transition-colors rounded-xs flex items-center gap-1.5 text-xs font-mono cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-current"
              title="Open Developer Console (Ctrl + K / Cmd + K)"
              aria-label="Open Developer Terminal"
            >
              <span className="font-bold">&gt;_</span>
              <kbd className="hidden lg:inline text-[10px] bg-current/10 px-1 py-0.5 rounded font-mono">⌘K</kbd>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-current hover:opacity-75 focus:outline-none cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-current rounded-xs"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--surface-primary)] pt-20 px-8 pb-12 flex flex-col justify-between md:hidden border-b border-current/20 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="space-y-6">
          <p className="font-mono text-xs opacity-50 tracking-widest uppercase">
            {"// INDEX NAVIGATION"}
          </p>
          <div className="flex flex-col space-y-3 font-display text-2xl font-bold uppercase">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  className={`hover:translate-x-2 transition-all flex items-center justify-between py-2 border-b border-current/10 ${
                    isActive
                      ? "font-black pl-3 border-l-4 border-l-current"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>
                    {item.num}. {item.label}
                  </span>
                  <span className="font-mono text-xs opacity-50 tracking-normal">
                    [{item.num}]
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-current/15 pt-6 space-y-3 font-mono text-xs text-current/80">
          {/* Mobile Theme Polarity Toggle */}
          <div className="flex items-center justify-between px-3 py-2 border border-current/20 bg-current/5 rounded-xs">
            <span className="font-semibold text-[11px]">THEME POLARITY</span>
            <PixelThemeToggle />
          </div>

          {/* Mobile Motion Toggle */}
          <div className="flex items-center justify-between px-3 py-2 border border-current/20 bg-current/5 rounded-xs">
            <span className="font-semibold text-[11px]">CREATIVE MOTION (FX)</span>
            <button
              type="button"
              onClick={toggleMotion}
              className={`px-2.5 py-1 text-[11px] font-bold border rounded-xs flex items-center gap-1.5 ${
                prefersReduced
                  ? "border-current/30 text-current/60"
                  : "border-current bg-current text-[var(--bg-primary)]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${prefersReduced ? "bg-current/40" : "bg-[#C6F277]"}`} />
              <span>{prefersReduced ? "OFF" : "ON"}</span>
            </button>
          </div>

          {/* Mobile Terminal Entry Point */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent("open-developer-terminal"));
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-current/30 hover:bg-current hover:text-[var(--bg-primary)] transition-colors cursor-pointer group rounded-xs"
          >
            <span className="flex items-center gap-2">
              <span className="text-[#C6F277] bg-[#381932] px-1.5 py-0.5 font-bold rounded-xs">&gt;_</span>
              <span className="font-bold">DEVELOPER TERMINAL</span>
            </span>
            <span className="text-[10px] opacity-70 group-hover:opacity-100">[LAUNCH]</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <span>LOCATION: ALEXANDRIA, EGYPT</span>
            <span className="text-[#C6F277] bg-[#381932] px-2 py-0.5 font-bold text-[10px] rounded-xs">ACTIVE</span>
          </div>
          <div>STATUS: AVAILABLE FOR 2026 ENGAGEMENTS</div>
          <a
            href="mailto:kaled.amr0210@gmail.com"
            className="inline-block mt-2 font-bold underline hover:opacity-80"
          >
            kaled.amr0210@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
