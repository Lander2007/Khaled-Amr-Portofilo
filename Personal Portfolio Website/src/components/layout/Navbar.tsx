"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import MagneticButton from "@/components/motion/MagneticButton";
import BrandLogo from "@/components/ui/BrandLogo";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "skills", label: "Capabilities", href: "/#skills" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const scrolledRef = useRef(false);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // 1. Passive scroll listener strictly for header background blur boundary
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Off-main-thread IntersectionObserver for section spy (Zero Layout Thrashing)
    const sectionIds = ["hero", "transform", "work", "about", "skills", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FFF3E6]/95 backdrop-blur-md border-b border-[#381932]/10 py-3 shadow-sm"
            : "bg-transparent py-5 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Wordmark & Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 font-display tracking-tight text-lg sm:text-xl font-bold uppercase transition-opacity hover:opacity-85 outline-none focus-visible:ring-2 focus-visible:ring-[#381932]"
            aria-label="Khaled Amr — Return to top"
          >
            <BrandLogo className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="tracking-normal transition-colors duration-200 text-[#381932]">
              KHALED AMR
            </span>
            <span className="hidden md:inline-block font-mono text-[10px] tracking-widest uppercase ml-1 border-l pl-2.5 font-normal transition-colors duration-200 text-[#381932]/60 border-[#381932]/20">
              FORM / SHIFT
            </span>
          </Link>

          {/* Desktop Navigation with Sliding Indicator & Refined Typography Hover */}
          <nav
            ref={navRef}
            onMouseLeave={() => setHoveredSection(null)}
            className="relative hidden md:flex items-center gap-7 lg:gap-8 font-mono text-xs tracking-wider uppercase font-medium"
            aria-label="Primary Navigation"
          >
            {/* Sliding Indicator with Refined Editorial Motion */}
            <div
              ref={indicatorRef}
              className="absolute -bottom-1 h-[2px] bg-[#381932] pointer-events-none rounded-full"
              style={{ left: 0, width: 0, opacity: 0 }}
              aria-hidden="true"
            />

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
                  onMouseEnter={() => setHoveredSection(item.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onFocus={() => setHoveredSection(item.id)}
                  onBlur={() => setHoveredSection(null)}
                  className="group relative py-1 px-1 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#381932] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF3E6] rounded-xs"
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Subtle Magnetic Response (restrained 2-3px offset on desktop) */}
                  <MagneticButton strength={0.14} maxOffset={3} className="inline-block">
                    <span
                      className={`inline-block transition-all duration-200 ease-out select-none ${
                        isHovered ? "-translate-y-0.5 text-[#381932] font-semibold" : "translate-y-0"
                      } ${
                        isActive
                          ? "text-[#381932] font-bold"
                          : "text-[#381932]/75 hover:text-[#381932]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </MagneticButton>
                </Link>
              );
            })}

            {/* Direct CTA Button */}
            <MagneticButton strength={0.2} maxOffset={5}>
              <a
                href="mailto:kaled.amr0210@gmail.com"
                className="ml-2 px-4 py-2 border border-[#381932] text-[#381932] hover:bg-[#381932] hover:text-[#FFF3E6] transition-all duration-250 flex items-center gap-1.5 text-xs font-bold tracking-wider cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#381932]"
              >
                <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                  Get in Touch
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </MagneticButton>

            {/* Developer Console Quick Launcher (Easter Egg 2 Trigger) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-developer-terminal"))}
              className="ml-1 px-2.5 py-2 border border-[#381932]/25 text-[#381932]/75 hover:text-[#381932] hover:border-[#381932] hover:bg-[#381932]/5 transition-colors rounded-xs flex items-center gap-1.5 text-xs font-mono cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#381932]"
              title="Open Developer Console (Ctrl + K / Cmd + K)"
              aria-label="Open Developer Terminal"
            >
              <span className="text-[#381932] font-bold">&gt;_</span>
              <kbd className="hidden lg:inline text-[10px] bg-[#381932]/10 px-1 py-0.5 rounded font-mono">⌘K</kbd>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#381932] hover:opacity-75 focus:outline-none cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
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
        className={`fixed inset-0 z-40 bg-[#FFF3E6] pt-24 px-8 pb-12 flex flex-col justify-between md:hidden border-b border-[#381932]/20 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="space-y-6">
          <p className="font-mono text-xs text-[#381932]/50 tracking-widest uppercase">
            {"// INDEX NAVIGATION"}
          </p>
          <div className="flex flex-col space-y-4 font-display text-2xl font-bold uppercase text-[#381932]">
            <Link
              href="/#work"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:translate-x-2 transition-transform hover:text-[#381932]"
            >
              01. SELECTED WORK
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:translate-x-2 transition-transform hover:text-[#381932]"
            >
              02. ABOUT KHALED AMR
            </Link>
            <Link
              href="/#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:translate-x-2 transition-transform hover:text-[#381932]"
            >
              03. TECHNICAL CAPABILITIES
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:translate-x-2 transition-transform hover:text-[#381932]"
            >
              04. CONTACT & INTAKE
            </Link>
          </div>
        </div>

        <div className="border-t border-[#381932]/15 pt-6 space-y-3 font-mono text-xs text-[#381932]/80">
          {/* Mobile Terminal Entry Point */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent("open-developer-terminal"));
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 border border-[#381932]/30 hover:bg-[#381932] hover:text-[#FFF3E6] transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <span className="text-[#C6F277] bg-[#381932] px-1.5 py-0.5 font-bold rounded-xs">&gt;_</span>
              <span className="font-bold">DEVELOPER TERMINAL</span>
            </span>
            <span className="text-[10px] opacity-70 group-hover:text-[#FFF3E6]">[LAUNCH]</span>
          </button>

          <div>LOCATION: ALEXANDRIA, EGYPT</div>
          <div>STATUS: AVAILABLE FOR 2026 ENGAGEMENTS</div>
          <a
            href="mailto:kaled.amr0210@gmail.com"
            className="inline-block mt-2 font-bold underline"
          >
            kaled.amr0210@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
