"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Check, ArrowUp } from "lucide-react";
import { PERSONAL_DETAILS } from "@/data/projectsData";
import MagneticButton from "@/components/motion/MagneticButton";
import TiltCard from "@/components/motion/TiltCard";
import LiquidDivider from "@/components/motion/LiquidDivider";
import FooterWordWall from "@/components/motion/FooterWordWall";
import ContactForm from "@/components/forms/ContactForm";

export default function Scene05Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_DETAILS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const channels = [
    {
      num: "01",
      label: "Direct Email",
      value: PERSONAL_DETAILS.email,
      href: `mailto:${PERSONAL_DETAILS.email}`,
      actionText: "SEND EMAIL",
      isExternal: false,
    },
    {
      num: "02",
      label: "GitHub Repertoire",
      value: "github.com/Lander2007",
      href: PERSONAL_DETAILS.github,
      actionText: "VIEW SOURCE",
      isExternal: true,
    },
    {
      num: "03",
      label: "LinkedIn",
      value: "linkedin.com/in/khaled-amr",
      href: PERSONAL_DETAILS.linkedin,
      actionText: "CONNECT",
      isExternal: true,
    },
    {
      num: "04",
      label: "X (Twitter)",
      value: "x.com/KhaledA33912144",
      href: PERSONAL_DETAILS.twitter,
      actionText: "FOLLOW",
      isExternal: true,
    },
    {
      num: "05",
      label: "Location",
      value: "Alexandria, Egypt (Available Globally)",
      href: `mailto:${PERSONAL_DETAILS.email}?subject=Project%20Inquiry%20from%20Portfolio`,
      actionText: "INQUIRE",
      isExternal: false,
    },
  ];

  return (
    <footer
      id="contact"
      className="relative w-full bg-[var(--bg-canvas)] text-[var(--ink-primary)] pt-16 sm:pt-24 pb-16 px-6 sm:px-12 md:px-16 overflow-hidden select-none border-t border-[var(--border-hairline)]"
    >
      {/* Top Liquid Contour Divider */}
      <LiquidDivider fillColor="currentColor" direction="top" className="mb-12 opacity-15" />

      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 sm:space-y-24">
        {/* Top Header Tag & Back to Top */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest text-[var(--ink-muted)] border-b border-[var(--border-hairline)] pb-6 uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D4FF33] inline-block" />
            <span className="text-[var(--ink-primary)] font-bold">CONTACT &amp; INQUIRIES</span>
          </div>

          <MagneticButton strength={0.3} maxOffset={8}>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[var(--ink-primary)] hover:text-[#D4FF33] transition-colors cursor-pointer group"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </MagneticButton>
        </div>

        {/* ============================================================== */}
        {/* EDITORIAL CONTACT EXPERIENCE: TYPOGRAPHY & BESPOKE INTAKE FORM */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start">
          {/* Left Column: Monumental Editorial Statement & Contact Info */}
          <div className="lg:col-span-6 space-y-8 relative z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-[#D4FF33] uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#D4FF33]" />
              <span>{"GET IN TOUCH // LET'S CONNECT"}</span>
            </div>

            {/* Main Dominant Heading */}
            <h2 className="font-display text-[clamp(2.4rem,4.4vw,4.5rem)] font-black uppercase tracking-tight leading-[0.94] text-[var(--ink-primary)] break-words">
              HAVE A PROJECT
              <br />
              <span className="font-serif italic font-normal lowercase tracking-normal text-[#D4FF33] block mt-1">
                in mind?
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="font-serif italic text-xl sm:text-2xl text-[var(--ink-secondary)] max-w-xl leading-relaxed">
              &ldquo;Have an idea, a project, or an opportunity in mind? I&apos;d love to hear about it. Let&apos;s create something meaningful together.&rdquo;
            </p>

            {/* Compact Direct Contact Information Area */}
            <div className="pt-6 border-t border-[var(--border-hairline)] space-y-4 font-mono text-xs">
              <span className="text-[10px] tracking-[0.25em] text-[var(--ink-muted)] uppercase block">
                {"// DIRECT COMMS CHANNELS"}
              </span>

              <div className="space-y-3">
                {/* Email */}
                <a
                  href={`mailto:${PERSONAL_DETAILS.email}`}
                  className="group flex items-center justify-between p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--ink-primary)]/50 hover:bg-[var(--bg-elevated)] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                    <span className="text-[var(--ink-muted)] group-hover:text-[var(--ink-primary)] font-mono text-xs transition-colors duration-200">
                      EMAIL:
                    </span>
                    <span className="font-bold text-[var(--ink-primary)] group-hover:text-[#D4FF33] font-mono text-xs transition-colors duration-200">
                      {PERSONAL_DETAILS.email}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#D4FF33] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </a>

                {/* GitHub */}
                <a
                  href={PERSONAL_DETAILS.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--ink-primary)]/50 hover:bg-[var(--bg-elevated)] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                    <span className="text-[var(--ink-muted)] group-hover:text-[var(--ink-primary)] font-mono text-xs transition-colors duration-200">
                      GITHUB:
                    </span>
                    <span className="font-bold text-[var(--ink-primary)] group-hover:text-[#D4FF33] font-mono text-xs transition-colors duration-200">
                      github.com/Lander2007
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#D4FF33] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </a>

                {/* LinkedIn */}
                <a
                  href={PERSONAL_DETAILS.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[var(--ink-primary)]/50 hover:bg-[var(--bg-elevated)] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF33]" />
                    <span className="text-[var(--ink-muted)] group-hover:text-[var(--ink-primary)] font-mono text-xs transition-colors duration-200">
                      LINKEDIN:
                    </span>
                    <span className="font-bold text-[var(--ink-primary)] group-hover:text-[#D4FF33] font-mono text-xs transition-colors duration-200">
                      linkedin.com/in/khaled-amr
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#D4FF33] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 w-full">
            <ContactForm />
          </div>
        </div>

        {/* The Typographic Afterimage Word Wall */}
        <FooterWordWall />

        {/* Strict 1px Bordered Swiss Grid Channels */}
        <div className="border-t border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
          {channels.map((ch) => (
            <a
              key={ch.num}
              href={ch.href}
              target={ch.isExternal ? "_blank" : undefined}
              rel={ch.isExternal ? "noreferrer noopener" : undefined}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-6 sm:py-8 px-4 hover:bg-[var(--ink-primary)] transition-colors duration-200 overflow-hidden"
            >
              <div className="flex items-baseline gap-4 sm:gap-8">
                <span className="font-mono text-xs sm:text-sm text-[#D4FF33] group-hover:text-[var(--bg-canvas)] font-bold transition-colors duration-200">
                  [{ch.num}]
                </span>
                <span className="font-display text-base sm:text-xl font-bold uppercase tracking-tight text-[var(--ink-primary)] group-hover:text-[var(--bg-canvas)] transition-colors duration-200">
                  {ch.label}
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 mt-3 md:mt-0 font-mono text-xs sm:text-sm">
                <span className="text-[var(--ink-secondary)] group-hover:text-[var(--bg-canvas)]/80 transition-colors duration-200">
                  {ch.value}
                </span>
                <div className="flex items-center gap-2 font-bold text-[var(--ink-primary)] group-hover:text-[var(--bg-canvas)] transition-colors duration-200">
                  <span className="hidden sm:inline text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {ch.actionText}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#D4FF33] group-hover:text-[var(--bg-canvas)] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Rapid One-Click Intake Box with TiltCard & MagneticButton */}
        <TiltCard maxTilt={3} className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[var(--ink-primary)]/40 transition-colors duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--ink-muted)] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D4FF33]" />
              <span>DIRECT CLIPBOARD DISPATCH</span>
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-[var(--ink-primary)]">
              {PERSONAL_DETAILS.email}
            </div>
          </div>

          <MagneticButton strength={0.3} maxOffset={8}>
            <button
              onClick={copyEmail}
              className="group relative px-5 py-3 bg-[var(--ink-primary)] text-[var(--bg-canvas)] border border-transparent hover:bg-[#D4FF33] hover:text-[#0B0A0E] hover:border-[#D4FF33] font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {copied ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0B0A0E]" />
                  <span>COPIED TO CLIPBOARD</span>
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  <span>COPY EMAIL ADDRESS</span>
                </span>
              )}
            </button>
          </MagneticButton>
        </TiltCard>

        {/* Colophon & Architectural Specs */}
        <div className="border-t border-[var(--border-hairline)] pt-8 flex flex-col md:flex-row md:items-center justify-between font-mono text-[11px] text-[var(--ink-muted)] gap-4">
          <div>
            ARCHITECTURAL PALETTE // NOCTURNAL OBSIDIAN &bull; WARM MILK &bull; ACID LIME (#D4FF33)
          </div>
          <div>
            TYPESET // SYNE &bull; INSTRUMENT SERIF &bull; JETBRAINS MONO &bull; INTER
          </div>
          <div>
            &copy; 2026 KHALED AMR &bull; ALEXANDRIA, EGYPT
          </div>
        </div>
      </div>
    </footer>
  );
}
