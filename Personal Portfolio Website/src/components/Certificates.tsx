import { motion } from "framer-motion";
import { certificatesData } from "@/data/certificatesData";
import { useState } from "react";

export default function Certificates() {
  return (
    <section id="certificates" className="relative py-24 px-6 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20"
          >
            <span className="text-sm font-mono text-purple-300 tracking-wide">
              OFFICIAL CERTIFICATIONS
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Certified Skills
          </h2>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {certificatesData.map((cert, index) => (
            <CertificateCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function CertificateCard({ cert, index }: { cert: typeof certificatesData[0]; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <div className="group relative h-full">
        {/* Certificate Card */}
        <div className="relative h-full bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-cyan-950/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 overflow-hidden transition-all duration-300">
          
          <div className="relative p-6 flex flex-col justify-between h-full">
            {/* Certificate Image Preview Container */}
            <div className="relative mb-6 aspect-[4/3] border border-purple-500/20 bg-purple-950/30 rounded-2xl overflow-hidden">
              {!imageError ? (
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-contain p-2 rounded-2xl bg-[#080415] transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                // Fallback placeholder with credential icon
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#080415] rounded-2xl">
                  <svg 
                    className="w-16 h-16 text-purple-400/40 mb-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <span className="text-sm text-purple-400/60 font-mono">Certificate Preview</span>
                </div>
              )}
            </div>

            {/* Certificate Info */}
            <div className="flex flex-col flex-1">
              {/* Title and Verified Badge Row */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {cert.title}
                </h3>
                {/* Verified badge */}
                <motion.div
                  className="flex-shrink-0 bg-green-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-400/30 flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                >
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="text-[10px] font-mono text-green-300">Verified</span>
                </motion.div>
              </div>

              {/* Issuer and Date Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/80 mb-4 font-mono">
                <span>{cert.issuer}</span>
                <span className="opacity-40">•</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200">
                  {cert.date}
                </span>
              </div>

              {/* Skills Section */}
              <div className="mt-auto">
                <span className="text-[10px] uppercase tracking-wider text-purple-400 font-mono font-semibold block mb-2.5">
                  Skills Covered
                </span>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + idx * 0.1 }}
                      className="text-xs px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/20 text-purple-200 font-medium transition-colors duration-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
