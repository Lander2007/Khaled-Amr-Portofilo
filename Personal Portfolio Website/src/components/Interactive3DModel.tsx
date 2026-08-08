import { useEffect, useRef, useState, memo } from "react"

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(min-width: 768px)").matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return isDesktop
}

interface Particle {
  x: number
  y: number
  z: number
  curX: number
  curY: number
  curZ: number
  color: string
  size: number
}

interface TechNode {
  name: string
  angle: number
  orbitRadius: number
  color: string
  icon: string
}

function Interactive3DModel() {
  const isDesktop = useIsDesktop()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0, rx: 0, ry: 0, targetRx: 0, targetRy: 0 })
  const mouseCanvasPos = useRef({ x: -1000, y: -1000 })
  const scrollProgress = useRef(0)
  const [activeShape, setActiveShape] = useState<"core" | "expanding" | "constellation">(
    "core",
  )

  // Orbiting technology nodes
  const techNodes: TechNode[] = [
    { name: "React", angle: 0, orbitRadius: 140, color: "#61dafb", icon: "⚛" },
    { name: "JavaScript", angle: Math.PI / 3, orbitRadius: 140, color: "#f7df1e", icon: "JS" },
    { name: "Tailwind CSS", angle: (2 * Math.PI) / 3, orbitRadius: 140, color: "#38bdf8", icon: "🎨" },
    { name: "Vite", angle: Math.PI, orbitRadius: 140, color: "#a855f7", icon: "⚡" },
    { name: "TypeScript", angle: (4 * Math.PI) / 3, orbitRadius: 140, color: "#3178c6", icon: "TS" },
    { name: "Next.js", angle: (5 * Math.PI) / 3, orbitRadius: 140, color: "#ffffff", icon: "▲" },
  ]

  const generateParticleSphere = () => {
    const numParticles = 500
    const tempParticles: Particle[] = []

    for (let i = 0; i < numParticles; i++) {
      // Fibonacci sphere distribution
      const lat = Math.acos(2 * (i / numParticles) - 1) - Math.PI / 2
      const lon = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 80
      
      const x = r * Math.cos(lat) * Math.cos(lon)
      const y = r * Math.sin(lat)
      const z = r * Math.cos(lat) * Math.sin(lon)

      const hue = (i / numParticles) * 120 + 240
      const color = `hsla(${hue}, 85%, 65%, 0.85)`

      tempParticles.push({
        x,
        y,
        z,
        curX: x,
        curY: y,
        curZ: z,
        color,
        size: Math.random() * 2.5 + 1,
      })
    }
    particles.current = tempParticles
  }

  useEffect(() => {
    if (!isDesktop) return

    generateParticleSphere()

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = 450)
    let height = (canvas.height = 450)

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = canvas.width = parent.clientWidth || 450
      height = canvas.height = parent.clientHeight || 450
    }
    window.addEventListener("resize", handleResize, { passive: true })
    handleResize()

    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = docHeight > 0 ? window.scrollY / docHeight : 0
      scrollProgress.current = currentScroll

      if (currentScroll < 0.3) {
        setActiveShape("core")
      } else if (currentScroll < 0.6) {
        setActiveShape("expanding")
      } else {
        setActiveShape("constellation")
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      
      // Track mouse position relative to canvas for node hover detection
      mouseCanvasPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      mouse.current.x = (e.clientX - cx) / (rect.width / 2)
      mouse.current.y = (e.clientY - cy) / (rect.height / 2)
      mouse.current.targetRy = mouse.current.x * 0.8
      mouse.current.targetRx = -mouse.current.y * 0.8
    }

    const handleMouseLeave = () => {
      mouseCanvasPos.current = { x: -1000, y: -1000 }
      mouse.current.targetRx = 0
      mouse.current.targetRy = 0
    }

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true })
    canvas.addEventListener("mouseleave", handleMouseLeave)

    let animationFrameId: number
    let angleY = 0
    let angleX = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth rotation interpolation
      mouse.current.rx += (mouse.current.targetRx - mouse.current.rx) * 0.05
      mouse.current.ry += (mouse.current.targetRy - mouse.current.ry) * 0.05

      angleY += 0.008 + mouse.current.ry * 0.01
      angleX += 0.004 + mouse.current.rx * 0.01

      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)

      const cx = width / 2
      const cy = height / 2

      // Draw Orbit Rings
      ctx.strokeStyle = "rgba(108, 43, 217, 0.25)"
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.ellipse(cx, cy, 140, 50, angleY * 0.3, 0, Math.PI * 2)
      ctx.stroke()

      // Sort and project particles 3D -> 2D
      const projected = particles.current.map((p) => {
        // Morph target positions
        let targetX = p.x
        let targetY = p.y
        let targetZ = p.z

        if (activeShape === "expanding") {
          targetX *= 1.45
          targetY *= 1.45
          targetZ *= 1.45
        } else if (activeShape === "constellation") {
          const factor = Math.sin(p.x * 0.05 + angleY) * 30
          targetX += factor
          targetY += factor
        }

        p.curX += (targetX - p.curX) * 0.04
        p.curY += (targetY - p.curY) * 0.04
        p.curZ += (targetZ - p.curZ) * 0.04

        // 3D rotation Y
        const x1 = p.curX * cosY - p.curZ * sinY
        const z1 = p.curZ * cosY + p.curX * sinY

        // 3D rotation X
        const y2 = p.curY * cosX - z1 * sinX
        const z2 = z1 * cosX + p.curY * sinX

        // Perspective projection
        const fov = 350
        const scale = fov / (fov + z2 + 200)
        const projX = cx + x1 * scale
        const projY = cy + y2 * scale

        return {
          projX,
          projY,
          scale,
          z2,
          color: p.color,
          size: p.size * scale,
        }
      })

      // Sort by depth (back to front)
      projected.sort((a, b) => b.z2 - a.z2)

      // Draw Connection Lines between close particles
      ctx.lineWidth = 0.4
      for (let i = 0; i < projected.length; i += 8) {
        for (let j = i + 1; j < projected.length; j += 12) {
          const dx = projected[i].projX - projected[j].projX
          const dy = projected[i].projY - projected[j].projY
          const distSq = dx * dx + dy * dy
          if (distSq < 1600) {
            const alpha = (1 - Math.sqrt(distSq) / 40) * 0.25
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(projected[i].projX, projected[i].projY)
            ctx.lineTo(projected[j].projX, projected[j].projY)
            ctx.stroke()
          }
        }
      }

      // Draw Particles
      projected.forEach((p) => {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.projX, p.projY, Math.max(0.5, p.size), 0, Math.PI * 2)
        ctx.fill()
      })

      // Central Energy Core Glow
      const coreGradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, 60)
      coreGradient.addColorStop(0, "rgba(217, 70, 239, 0.45)")
      coreGradient.addColorStop(0.5, "rgba(108, 43, 217, 0.2)")
      coreGradient.addColorStop(1, "transparent")
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(cx, cy, 60, 0, Math.PI * 2)
      ctx.fill()

      let hasHoveredNode = false

      // Draw Orbiting Tech Stack Nodes
      techNodes.forEach((node, idx) => {
        const currentAngle = node.angle + angleY * 1.2 + idx * 0.2
        const nx = Math.cos(currentAngle) * node.orbitRadius
        const nz = Math.sin(currentAngle) * node.orbitRadius
        const ny = Math.sin(angleX * 2 + idx) * 35

        const fov = 350
        const scale = fov / (fov + nz + 200)
        const projX = cx + nx * scale
        const projY = cy + ny * scale

        const baseRadius = Math.max(5, 8.5 * scale)

        // Mouse hover hit detection for node ball
        const dx = mouseCanvasPos.current.x - projX
        const dy = mouseCanvasPos.current.y - projY
        const distSq = dx * dx + dy * dy
        const hitRadius = Math.max(22, baseRadius + 15)
        const isHovered = distSq <= hitRadius * hitRadius

        if (isHovered) {
          hasHoveredNode = true
        }

        const ballRadius = isHovered ? baseRadius * 1.6 : baseRadius

        // Node Glow & Ball Rendering
        ctx.fillStyle = node.color
        ctx.shadowColor = node.color
        ctx.shadowBlur = isHovered ? 24 * scale : 12 * scale
        ctx.beginPath()
        ctx.arc(projX, projY, ballRadius, 0, Math.PI * 2)
        ctx.fill()

        // White highlight ring on hover
        if (isHovered) {
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2 * scale
          ctx.beginPath()
          ctx.arc(projX, projY, ballRadius + 3 * scale, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.shadowBlur = 0 // reset shadow

        // REVEAL NAME ON HOVER ONLY
        if (isHovered) {
          const badgeText = `${node.icon} ${node.name}`
          ctx.font = "600 12px 'Space Grotesk', 'Syne', sans-serif"
          const textMetrics = ctx.measureText(badgeText)
          const textWidth = textMetrics.width
          const paddingX = 10
          const boxWidth = textWidth + paddingX * 2
          const boxHeight = 24
          const boxX = projX - boxWidth / 2
          const boxY = projY - ballRadius - 32

          // Tooltip container box
          ctx.fillStyle = "rgba(10, 4, 30, 0.92)"
          ctx.strokeStyle = node.color
          ctx.lineWidth = 1.5
          ctx.shadowColor = node.color
          ctx.shadowBlur = 14

          ctx.beginPath()
          ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6)
          ctx.fill()
          ctx.stroke()

          ctx.shadowBlur = 0 // reset shadow

          // Tooltip pointer triangle
          ctx.fillStyle = node.color
          ctx.beginPath()
          ctx.moveTo(projX - 5, boxY + boxHeight)
          ctx.lineTo(projX + 5, boxY + boxHeight)
          ctx.lineTo(projX, boxY + boxHeight + 5)
          ctx.closePath()
          ctx.fill()

          // Tooltip text
          ctx.fillStyle = "#ffffff"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(badgeText, projX, boxY + boxHeight / 2)
        }
      })

      // Change cursor pointer when hovering a node ball
      canvas.style.cursor = hasHoveredNode ? "pointer" : "default"

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [activeShape, isDesktop])

  // Completely unmount on mobile viewports (<768px)
  if (!isDesktop) return null

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      {/* Dynamic Mode HUD Tag */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 backdrop-blur-md text-[10px] font-mono text-purple-200 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>3D_CORE // {activeShape}</span>
      </div>

      {/* Control Hint */}
      <div className="absolute bottom-2 right-2 z-20 text-[9px] font-mono text-purple-400/60 uppercase tracking-wider">
        [ HOVER BALLS TO REVEAL TECH ]
      </div>

      {/* Render Canvas */}
      <canvas ref={canvasRef} className="max-w-full max-h-full block z-10" />
    </div>
  )
}

export default memo(Interactive3DModel)
