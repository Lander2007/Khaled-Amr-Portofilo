import { motion, AnimatePresence } from "framer-motion"
import { certificatesData } from "@/data/certificatesData"
import { useState, useRef } from "react"

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<typeof certificatesData[0] | null>(null)

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
            <CertificateCard
              key={cert.id}
              cert={cert}
              index={index}
              onView={() => setSelectedCert(cert)}
            />
          ))}
        </div>
      </div>

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl w-full bg-gradient-to-br from-purple-950/90 via-purple-900/80 to-cyan-950/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30 text-white hover:bg-purple-500/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8">
                {/* Certificate Image */}
                <div className="mb-6 rounded-2xl overflow-hidden bg-purple-950/50 border border-purple-500/20">
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                    decoding="async"
                    width="1200"
                    height="800"
                  />
                </div>

                {/* Certificate Details */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{selectedCert.title}</h3>
                      <div className="flex items-center gap-3 text-purple-300 font-mono text-sm">
                        <span>{selectedCert.issuer}</span>
                        <span className="opacity-40">•</span>
                        <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200">
                          {selectedCert.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-400/30 flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm font-mono text-green-300">Verified</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-purple-400 font-mono font-semibold block mb-3">
                      Skills Covered
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-sm px-4 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/20 text-purple-200 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verification Link */}
                  {selectedCert.verificationUrl && (
                    <a
                      href={selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      View Verification
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function CertificateCard({
  cert,
  index,
  onView,
}: {
  cert: typeof certificatesData[0]
  index: number
  onView: () => void
}) {
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y })

    // Calculate tilt
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const rotateX = ((mouseY - centerY) / centerY) * -8
    const rotateY = ((mouseX - centerX) / centerX) * 8
    
    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <motion.div
        className="group relative h-full cursor-pointer"
        onClick={onView}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovering ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Certificate Card */}
        <div className="relative h-full bg-gradient-to-br from-purple-950/40 via-purple-900/30 to-cyan-950/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 overflow-hidden transition-all duration-300">
          {/* Radial spotlight effect */}
          {isHovering && (
            <div
              className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 300px at ${spotlight.x}% ${spotlight.y}%, rgba(168, 85, 247, 0.4), transparent 50%)`,
              }}
            />
          )}

          <div className="relative p-6 flex flex-col justify-between h-full">
            {/* Certificate Image Preview Container */}
            <div className="relative mb-6 aspect-[4/3] border border-purple-500/20 bg-purple-950/30 rounded-2xl overflow-hidden">
              {!imageError ? (
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-contain p-2 rounded-2xl bg-[#080415] transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="450"
                  onError={() => setImageError(true)}
                />
              ) : (
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
                  <span className="text-sm text-purple-400/60 font-mono">
                    Certificate Preview
                  </span>
                </div>
              )}
            </div>

            {/* Certificate Info */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {cert.title}
                </h3>
                <motion.div
                  className="flex-shrink-0 bg-green-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-green-400/30 flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                >
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="text-[10px] font-mono text-green-300">
                    Verified
                  </span>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/80 mb-4 font-mono">
                <span>{cert.issuer}</span>
                <span className="opacity-40">•</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200">
                  {cert.date}
                </span>
              </div>

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
      </motion.div>
    </motion.div>
  )
}
