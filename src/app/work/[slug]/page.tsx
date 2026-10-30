import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Globe } from "lucide-react";
import { PROJECTS } from "@/data/projectsData";
import Navbar from "@/components/layout/Navbar";
import Scene05Contact from "@/components/scenes/Scene05Contact";
import TiltCard from "@/components/motion/TiltCard";
import MagneticButton from "@/components/motion/MagneticButton";
import ImageReveal from "@/components/motion/ImageReveal";
import TypographicMarquee from "@/components/motion/TypographicMarquee";


export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Khaled Amr | Case Study`,
    description: project.overview,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.overview,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const prevProject = PROJECTS.find((p) => p.slug === project.prevSlug) || PROJECTS[0];
  const nextProject = PROJECTS.find((p) => p.slug === project.nextSlug) || PROJECTS[0];

  return (
    <div className="min-h-screen bg-[#FFF3E6] text-[#381932] selection:bg-[#381932] selection:text-[#FFF3E6]">
      <Navbar />

      <main className="pt-28 sm:pt-36">
        {/* Top Back Navigation Bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pb-8 border-b border-[#381932]/15 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#381932]/70">
          <MagneticButton strength={0.3} maxOffset={8}>
            <Link
              href="/#work"
              className="flex items-center gap-2 hover:text-[#381932] transition-colors font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO WORK CATALOGUE</span>
            </Link>
          </MagneticButton>

          <div className="flex items-center gap-4">
            <span>PROJECT [{project.num} / {PROJECTS.length.toString().padStart(2, "0")}]</span>
            <span className="hidden sm:inline-block text-[#381932]/40">&bull;</span>
            <span className="hidden sm:inline-block">{project.year}</span>
          </div>
        </div>

        {/* Editorial Case Study Hero */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-12 sm:py-20 space-y-8">
          <div className="space-y-4">
            <span className="font-mono text-xs sm:text-sm font-bold bg-[#381932] text-[#FFF3E6] px-3 py-1 inline-block uppercase tracking-wider">
              {project.status}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-[#381932] leading-[0.9]">
              {project.title}
            </h1>
            <p className="font-serif italic text-2xl sm:text-4xl text-[#381932]/85 max-w-4xl">
              {project.subtitle}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#381932]/15 font-mono text-xs">
            <div>
              <div className="text-[#381932]/50 uppercase mb-1">ARCHITECTURAL ROLE</div>
              <div className="font-bold text-[#381932] text-sm">{project.role}</div>
            </div>
            <div>
              <div className="text-[#381932]/50 uppercase mb-1">RELEASE YEAR</div>
              <div className="font-bold text-[#381932] text-sm">{project.year}</div>
            </div>
            <div>
              <div className="text-[#381932]/50 uppercase mb-1">AUDIENCE & REACH</div>
              <div className="font-bold text-[#381932] text-sm">Production Platform</div>
            </div>
            <div>
              <div className="text-[#381932]/50 uppercase mb-1">EXTERNAL LINKS</div>
              <div className="flex flex-col gap-1">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-bold text-[#381932] hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Live Platform</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-bold text-[#381932] hover:underline flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>Source Repository</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image Viewport with Tilt and ImageReveal */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16">
          <TiltCard maxTilt={4} className="border border-[#381932] bg-[#240f20] shadow-2xl overflow-hidden">
            <div className="relative aspect-[16/9] w-full">
              <ImageReveal
                src={project.coverImage}
                alt={project.title}
                fill
                priority
                direction="bottom"
                imageClassName="object-cover object-top"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </TiltCard>
        </section>

        {/* Deep Dive Content Narrative */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          {/* Main Content Columns */}
          <div className="lg:col-span-8 space-y-16">
            {/* 01. Overview */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[#381932]/60 uppercase border-b border-[#381932]/15 pb-2">
                [ 01 // OVERVIEW & PURPOSE ]
              </h2>
              <p className="font-sans text-lg sm:text-xl text-[#381932]/90 leading-relaxed">
                {project.overview}
              </p>
            </div>

            {/* 02. Challenge */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[#381932]/60 uppercase border-b border-[#381932]/15 pb-2">
                [ 02 // PROBLEM & ARCHITECTURAL CHALLENGE ]
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#381932]/85 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* 03. Solution */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[#381932]/60 uppercase border-b border-[#381932]/15 pb-2">
                [ 03 // SOLUTION & IMPLEMENTATION ]
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#381932]/85 leading-relaxed">
                {project.solution}
              </p>
            </div>

            {/* 04. Key Engineering Decisions */}
            <div className="space-y-6">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[#381932]/60 uppercase border-b border-[#381932]/15 pb-2">
                [ 04 // KEY TECHNICAL & DESIGN DECISIONS ]
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {project.keyDecisions.map((dec, i) => (
                  <div
                    key={i}
                    className="p-6 border border-[#381932]/20 bg-[#FFFDF9] space-y-2"
                  >
                    <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-[#381932]">
                      <CheckCircle2 className="w-4 h-4 text-[#381932]" />
                      <span>{dec.title}</span>
                    </div>
                    <p className="text-sm font-sans text-[#381932]/80 leading-relaxed pl-6">
                      {dec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Screen Gallery with Tilt and ImageReveal */}
            {project.galleryImages.length > 0 && (
              <div className="space-y-6 pt-6">
                <h2 className="font-mono text-xs font-bold tracking-widest text-[#381932]/60 uppercase border-b border-[#381932]/15 pb-2">
                  [ 05 // SYSTEM INTERACTION SCREENS ]
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.galleryImages.map((img, i) => (
                    <TiltCard
                      key={i}
                      maxTilt={5}
                      className="border border-[#381932]/20 bg-[#381932]/5 overflow-hidden shadow-md"
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <ImageReveal
                          src={img}
                          alt={`${project.title} screen ${i + 1}`}
                          fill
                          direction={i % 2 === 0 ? "left" : "right"}
                          imageClassName="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column: Tech Specs & Metrics */}
          <div className="lg:col-span-4 space-y-10">
            {/* Tech Stack Box */}
            <div className="border border-[#381932] bg-[#381932] text-[#FFF3E6] p-6 sm:p-8 space-y-4">
              <div className="font-mono text-xs text-[#FFF3E6]/60 uppercase tracking-widest">
                TECHNOLOGY & TOOLCHAIN
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-2.5 py-1 border border-[#FFF3E6]/30 bg-[#FFF3E6]/10 text-[#FFF3E6]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Verifiable Highlights Box */}
            <div className="border border-[#381932]/25 bg-[#FFFDF9] p-6 sm:p-8 space-y-4">
              <div className="font-mono text-xs text-[#381932]/60 uppercase tracking-widest">
                VERIFIABLE PLATFORM HIGHLIGHTS
              </div>
              <ul className="space-y-3 font-mono text-xs text-[#381932]/90">
                {project.verifiableMetrics.map((met, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#381932] mt-1.5 shrink-0" />
                    <span>{met}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live CTA Button with Magnetic Interaction */}
            {project.liveUrl && (
              <MagneticButton className="w-full" strength={0.3} maxOffset={8}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-4 px-6 bg-[#381932] text-[#FFF3E6] font-mono text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-[#240f20] transition-colors"
                >
                  <span>OPEN LIVE PLATFORM</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </MagneticButton>
            )}
          </div>
        </section>

        {/* Marquee Break */}
        <TypographicMarquee
          theme="plum"
          items={[
            "NEXT.JS APP ROUTER",
            "TYPESCRIPT",
            "GSAP SCROLLTRIGGER",
            "ACCESSIBILITY COMPLIANT",
            "60 FPS ZERO-JANK",
            "KHALED AMR // 2026",
          ]}
        />

        {/* Project Navigation Between Case Studies */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-12 border-t border-[#381932]/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <MagneticButton className="w-full" strength={0.2} maxOffset={6}>
              <Link
                href={`/work/${prevProject.slug}`}
                className="p-6 border border-[#381932]/20 hover:border-[#381932] bg-[#FFFDF9] transition-all group block"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-[#381932]/60 uppercase mb-2">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>PREVIOUS CASE STUDY</span>
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold uppercase text-[#381932]">
                  {prevProject.title}
                </div>
              </Link>
            </MagneticButton>

            <MagneticButton className="w-full" strength={0.2} maxOffset={6}>
              <Link
                href={`/work/${nextProject.slug}`}
                className="p-6 border border-[#381932]/20 hover:border-[#381932] bg-[#FFFDF9] transition-all group text-right block"
              >
                <div className="flex items-center justify-end gap-2 font-mono text-xs text-[#381932]/60 uppercase mb-2">
                  <span>NEXT CASE STUDY</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold uppercase text-[#381932]">
                  {nextProject.title}
                </div>
              </Link>
            </MagneticButton>
          </div>
        </section>
      </main>

      <Scene05Contact />
    </div>
  );
}
