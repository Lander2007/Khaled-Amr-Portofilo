import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TelemetryModalProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
}

function ActivityIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

export default function TelemetryModal({
  isOpen,
  onClose,
  activeSection,
}: TelemetryModalProps) {
  const [fps, setFps] = useState<number>(60)
  const [scrollY, setScrollY] = useState<number>(0)
  const [scrollVelocity, setScrollVelocity] = useState<number>(0)

  const lastScrollY = useRef<number>(0)
  const lastScrollTime = useRef<number>(Date.now())

  // FPS calculation loop
  useEffect(() => {
    if (!isOpen) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const calcFps = (time: number) => {
      frameCount++
      if (time > lastTime + 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (time - lastTime))))
        frameCount = 0
        lastTime = time
      }
      animationId = requestAnimationFrame(calcFps)
    }

    animationId = requestAnimationFrame(calcFps)

    return () => cancelAnimationFrame(animationId)
  }, [isOpen])

  // Scroll Y and velocity calculation
  useEffect(() => {
    if (!isOpen) return

    const handleScroll = () => {
      const currentScrollY = Math.round(window.scrollY)
      setScrollY(currentScrollY)

      const now = Date.now()
      const dt = now - lastScrollTime.current
      const dy = Math.abs(currentScrollY - lastScrollY.current)

      if (dt > 0) {
        const vel = Math.round((dy / dt) * 1000) // px/s
        setScrollVelocity(vel)
      }

      lastScrollY.current = currentScrollY
      lastScrollTime.current = now
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-full right-0 mt-3 z-50 w-72 p-4 rounded-2xl bg-[#0d0622]/95 backdrop-blur-xl border border-purple-500/30 shadow-[0_10px_30px_rgba(15,3,32,0.8),0_0_20px_rgba(168,85,247,0.15)] font-mono text-xs pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-[11px] text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ActivityIcon size={12} className="text-cyan-400" />
                TELEMETRY HUD
              </span>
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close telemetry popover"
              className="text-purple-400 hover:text-white cursor-pointer transition-colors focus:outline-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Compact 2x2 Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Metric 1: ENGINE FPS */}
            <div className="bg-purple-950/30 p-2 rounded-xl border border-purple-500/10 flex flex-col">
              <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                ENGINE FPS
              </span>
              <span className="text-sm font-semibold text-cyan-300 mt-0.5">
                {fps} <span className="text-[10px] font-normal text-cyan-500/70">FPS</span>
              </span>
            </div>

            {/* Metric 2: VELOCITY */}
            <div className="bg-purple-950/30 p-2 rounded-xl border border-purple-500/10 flex flex-col">
              <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                VELOCITY
              </span>
              <span className="text-sm font-semibold text-purple-200 mt-0.5">
                {scrollVelocity} <span className="text-[10px] font-normal text-purple-400/70">px/s</span>
              </span>
            </div>

            {/* Metric 3: LOCATION */}
            <div className="bg-purple-950/30 p-2 rounded-xl border border-purple-500/10 flex flex-col">
              <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                LOCATION
              </span>
              <span className="text-sm font-semibold text-fuchsia-300 mt-0.5 uppercase truncate">
                {activeSection || "HERO"}
              </span>
            </div>

            {/* Metric 4: SCROLL Y */}
            <div className="bg-purple-950/30 p-2 rounded-xl border border-purple-500/10 flex flex-col">
              <span className="text-[10px] text-purple-400/70 font-semibold uppercase tracking-wider">
                SCROLL Y
              </span>
              <span className="text-sm font-semibold text-emerald-300 mt-0.5">
                {scrollY} <span className="text-[10px] font-normal text-emerald-500/70">px</span>
              </span>
            </div>
          </div>

          {/* Footer Status Line */}
          <div className="pt-2.5 mt-2 border-t border-purple-500/10">
            <span className="text-[9px] text-purple-400/50 text-center block uppercase tracking-widest">
              SYSTEM_OK // LINK:VERIFIED
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
