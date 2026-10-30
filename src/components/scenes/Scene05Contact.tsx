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
      className="relative w-full bg-[#381932] text-[#FFF3E6] pt-16 sm:pt-24 pb-16 px-6 sm:px-12 md:px-16 overflow-hidden select-none"
    >
      {/* Top Liquid Contour Divider */}
      <LiquidDivider fillColor="#381932" direction="top" className="mb-12" />

      {/* Background Architectural Grid Lines in Milk */}
      <div className="absolute inset-0 pointer-events-none bg-grid-plum opacity-15 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16 sm:space-y-24">
        {/* Top Header Tag & Back to Top */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest text-[#FFF3E6]/60 border-b border-[#FFF3E6]/20 pb-6 uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#C6F277] inline-block shadow-[0_0_8px_rgba(198,242,119,0.5)]" />
            <span className="text-[#FFF3E6] font-bold">CONTACT &amp; INQUIRIES</span>
          </div>

          <MagneticButton strength={0.3} maxOffset={8}>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:text-[#C6F277] transition-colors cursor-pointer group"
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
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-[#C6F277] uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C6F277] shadow-[0_0_8px_rgba(198,242,119,0.8)] animate-pulse" />
              <span>{"GET IN TOUCH // LET'S CONNECT"}</span>
            </div>

            {/* Main Dominant Heading */}
            <h2 className="font-display text-[clamp(2.4rem,4.4vw,4.5rem)] font-black uppercase tracking-tight leading-[0.94] text-[#FFF3E6] break-words">
              HAVE A PROJECT
              <br />
              <span className="font-serif italic font-normal lowercase tracking-normal text-[#C6F277] drop-shadow-[0_0_20px_rgba(198,242,119,0.3)] block mt-1">
                in mind?
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="font-serif italic text-xl sm:text-2xl text-[#FFF3E6]/85 max-w-xl leading-relaxed">
              &ldquo;Have an idea, a project, or an opportunity in mind? I&apos;d love to hear about it. Let&apos;s create something meaningful together.&rdquo;
            </p>

            {/* Compact Direct Contact Information Area */}
            <div className="pt-6 border-t border-[#FFF3E6]/15 space-y-4 font-mono text-xs">
              <span className="text-[10px] tracking-[0.25em] text-[#FFF3E6]/40 uppercase block">
                {"// DIRECT COMMS CHANNELS"}
              </span>

              <div className="space-y-3">
                {/* Email */}
                <a
                  href={`mailto:${PERSONAL_DETAILS.email}`}
                  className="group flex items-center justify-between p-3.5 border border-[#FFF3E6]/10 bg-[#240f20]/40 hover:border-[#C6F277]/50 hover:bg-[#240f20]/90 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] group-hover:scale-125 transition-transform duration-200" />
                    <span className="text-[#FFF3E6]/50 group-hover:text-[#FFF3E6] font-mono text-xs transition-colors duration-200">
                      EMAIL:
                    </span>
                    <span className="font-bold text-[#FFF3E6] group-hover:text-[#C6F277] font-mono text-xs transition-colors duration-200">
                      {PERSONAL_DETAILS.email}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C6F277] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </a>

                {/* GitHub */}
                <a
                  href={PERSONAL_DETAILS.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between p-3.5 border border-[#FFF3E6]/10 bg-[#240f20]/40 hover:border-[#C6F277]/50 hover:bg-[#240f20]/90 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] group-hover:scale-125 transition-transform duration-200" />
                    <span className="text-[#FFF3E6]/50 group-hover:text-[#FFF3E6] font-mono text-xs transition-colors duration-200">
                      GITHUB:
                    </span>
                    <span className="font-bold text-[#FFF3E6] group-hover:text-[#C6F277] font-mono text-xs transition-colors duration-200">
                      github.com/Lander2007
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C6F277] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </a>

                {/* LinkedIn */}
                <a
                  href={PERSONAL_DETAILS.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between p-3.5 border border-[#FFF3E6]/10 bg-[#240f20]/40 hover:border-[#C6F277]/50 hover:bg-[#240f20]/90 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6F277] group-hover:scale-125 transition-transform duration-200" />
                    <span className="text-[#FFF3E6]/50 group-hover:text-[#FFF3E6] font-mono text-xs transition-colors duration-200">
                      LINKEDIN:
                    </span>
                    <span className="font-bold text-[#FFF3E6] group-hover:text-[#C6F277] font-mono text-xs transition-colors duration-200">
                      linkedin.com/in/khaled-amr
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#C6F277] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
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
        <div className="border-t border-[#FFF3E6]/25 divide-y divide-[#FFF3E6]/20">
          {channels.map((ch) => (
            <a
              key={ch.num}
              href={ch.href}
              target={ch.isExternal ? "_blank" : undefined}
              rel={ch.isExternal ? "noreferrer noopener" : undefined}
              className="group flex flex-col md:flex-row md:items-center justify-between py-6 sm:py-8 px-4 hover:bg-[#FFF3E6] transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-baseline gap-4 sm:gap-8">
                <span className="font-mono text-xs sm:text-sm text-[#C6F277] group-hover:text-[#381932]/60 font-bold transition-colors">
                  [{ch.num}]
                </span>
                <span className="font-display text-base sm:text-xl font-bold uppercase tracking-tight text-[#FFF3E6] group-hover:text-[#381932] transition-colors">
                  {ch.label}
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 mt-3 md:mt-0 font-mono text-xs sm:text-sm">
                <span className="text-[#FFF3E6]/70 group-hover:text-[#381932]/80 transition-colors">
                  {ch.value}
                </span>
                <div className="flex items-center gap-2 font-bold text-[#FFF3E6] group-hover:text-[#381932] transition-colors">
                  <span className="hidden sm:inline text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {ch.actionText}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#C6F277] group-hover:text-[#381932] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Rapid One-Click Intake Box with TiltCard & MagneticButton */}
        <TiltCard maxTilt={3} className="border border-[#FFF3E6]/30 bg-[#240f20] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#C6F277]/40 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-[#FFF3E6]/70 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C6F277] shadow-[0_0_8px_rgba(198,242,119,0.8)] animate-pulse" />
              <span>DIRECT CLIPBOARD DISPATCH</span>
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-[#FFF3E6]">
              {PERSONAL_DETAILS.email}
            </div>
          </div>

          <MagneticButton strength={0.3} maxOffset={8}>
            <button
              onClick={copyEmail}
              className="px-5 py-3 bg-[#FFF3E6] text-[#381932] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#C6F277] hover:text-[#381932] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#381932]" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY EMAIL ADDRESS</span>
                </>
              )}
            </button>
          </MagneticButton>
        </TiltCard>

        {/* Colophon & Architectural Specs */}
        <div className="border-t border-[#FFF3E6]/15 pt-8 flex flex-col md:flex-row md:items-center justify-between font-mono text-[11px] text-[#FFF3E6]/50 gap-4">
          <div>
            ARCHITECTURAL PALETTE // PLUM (#381932) &bull; MILK (#FFF3E6) &bull; ELECTRIC LIME (#C6F277)
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
