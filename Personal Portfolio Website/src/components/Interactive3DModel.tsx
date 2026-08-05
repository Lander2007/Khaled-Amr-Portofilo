import { useEffect, useRef, useState, memo } from "react"

interface Particle {
  x: number // original / target 3D coords
  y: number
  z: number
  curX: number // current animated 3D coords
  curY: number
  curZ: number
  color: string
  size: number
}

function Interactive3DModel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0, rx: 0, ry: 0, targetRx: 0, targetRy: 0 })
  const scrollProgress = useRef(0)
  const [activeShape, setActiveShape] = useState<"torus" | "helix" | "sphere">(
    "torus",
  )

  // Generate three sets of 3D coordinates for morphing
  const generateShapes = () => {
    const numParticles = 400
    const tempParticles: Particle[] = []

    for (let i = 0; i < numParticles; i++) {
      // Shape 1: Torus Knot
      const theta = (i / numParticles) * Math.PI * 2 * 3 // 3 loops
      const phi = (i / numParticles) * Math.PI * 2 * 2 // 2 loops
      const r = 60 + 20 * Math.sin(phi)
      const tx = r * Math.cos(theta)
      const ty = r * Math.sin(theta)
      const tz = 30 * Math.cos(phi)

      // Color palette
      const hue = (i / numParticles) * 120 + 240 // Transition from royal blue (240) to magenta/pink (360)
      const color = `hsla(${hue}, 85%, 65%, 0.8)`

      tempParticles.push({
        x: tx,
        y: ty,
        z: tz,
        curX: tx * 2, // start exploded/scattered
        curY: ty * 2,
        curZ: tz * 2,
        color,
        size: Math.random() * 2 + 1,
      })
    }
    particles.current = tempParticles
  }

  useEffect(() => {
    generateShapes()

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = 450)
    let height = (canvas.height = 450)
    let isHovered = false

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = canvas.width = parent.clientWidth || 450
      height = canvas.height = parent.clientHeight || 450
    }
    window.addEventListener("resize", handleResize)
    handleResize()

    // Scroll Tracking
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = docHeight > 0 ? window.scrollY / docHeight : 0
      // Map scroll progress to a morph index
      scrollProgress.current = currentScroll

      // Determine active shape label for telemetry
      if (currentScroll < 0.25) {
        setActiveShape("torus")
      } else if (currentScroll < 0.55) {
        setActiveShape("helix")
      } else {
        setActiveShape("sphere")
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    // Mouse Parallax & Gravity attractor
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      // Target rotation based on mouse orientation relative to center
      mouse.current.targetRx = (my / height - 0.5) * Math.PI * 0.8
      mouse.current.targetRy = (mx / width - 0.5) * Math.PI * 0.8

      // Attraction center point relative to canvas center
      mouse.current.x = mx - width / 2
      mouse.current.y = my - height / 2
    }

    const handleMouseEnter = () => {
      isHovered = true
    }

    const handleMouseLeave = () => {
      isHovered = false
      mouse.current.targetRx = 0
      mouse.current.targetRy = 0
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    let animationId: number
    let angleX = 0
    let angleY = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Slow down auto-rotation, interpolate mouse driven target rotation
      mouse.current.rx += (mouse.current.targetRx - mouse.current.rx) * 0.1
      mouse.current.ry += (mouse.current.targetRy - mouse.current.ry) * 0.1

      angleX = 0.005 + mouse.current.rx
      angleY = 0.008 + mouse.current.ry

      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)

      const centerX = width / 2
      const centerY = height / 2
      const fov = 320 // depth projection factor

      const pList = particles.current
      const numParticles = pList.length

      // Morphed shape calculation based on scrollProgress
      const morphStage = scrollProgress.current * 3.5 // scale progress

      pList.forEach((p, idx) => {
        // Compute targets for each of the three shapes
        let targetX = 0
        let targetY = 0
        let targetZ = 0

        // Shape 1: Torus Knot (base)
        const thetaTorus = (idx / numParticles) * Math.PI * 2 * 3
        const phiTorus = (idx / numParticles) * Math.PI * 2 * 2
        const rTorus = 75 + 25 * Math.sin(phiTorus)
        const tX1 = rTorus * Math.cos(thetaTorus)
        const tY1 = rTorus * Math.sin(thetaTorus)
        const tZ1 = 40 * Math.cos(phiTorus)

        // Shape 2: Double Helix
        const tHelix = (idx / numParticles) * Math.PI * 10
        const isStrandB = idx % 2 === 0
        const helixPhase = isStrandB ? Math.PI : 0
        const tX2 = 45 * Math.cos(tHelix + helixPhase)
        const tY2 = tHelix * 22 - 110 // vertical stack
        const tZ2 = 45 * Math.sin(tHelix + helixPhase)

        // Shape 3: Cosmic Sphere
        const lat = Math.acos(2 * (idx / numParticles) - 1) - Math.PI / 2
        const lon = Math.PI * (1 + Math.sqrt(5)) * idx // Fibonacci distribution
        const tX3 = 90 * Math.cos(lat) * Math.cos(lon)
        const tY3 = 90 * Math.sin(lat)
        const tZ3 = 90 * Math.cos(lat) * Math.sin(lon)

        // Interpolate between the 3 targets based on morphStage
        if (morphStage < 1) {
          // Transition Torus -> Helix
          targetX = tX1 + (tX2 - tX1) * morphStage
          targetY = tY1 + (tY2 - tY1) * morphStage
          targetZ = tZ1 + (tZ2 - tZ1) * morphStage
        } else if (morphStage < 2) {
          // Transition Helix -> Sphere
          const t = morphStage - 1
          targetX = tX2 + (tX3 - tX2) * t
          targetY = tY2 + (tY3 - tY2) * t
          targetZ = tZ2 + (tZ3 - tZ2) * t
        } else {
          // Exploded galaxy form / sphere breathing
          const t = morphStage - 2
          const breathing = 1 + 0.15 * Math.sin(Date.now() * 0.003 + idx * 0.1)
          targetX = tX3 * breathing * (1 + t * 0.2)
          targetY = tY3 * breathing * (1 + t * 0.2)
          targetZ = tZ3 * breathing * (1 + t * 0.2)
        }

        // Animate towards morphed targets
        p.curX += (targetX - p.curX) * 0.08
        p.curY += (targetY - p.curY) * 0.08
        p.curZ += (targetZ - p.curZ) * 0.08

        // Apply 3D Rotations
        // Rotate Y
        let x1 = p.curX * cosY - p.curZ * sinY
        let z1 = p.curZ * cosY + p.curX * sinY

        // Rotate X
        let y2 = p.curY * cosX - z1 * sinX
        let z2 = z1 * cosX + p.curY * sinX

        // Mouse gravity pull vector
        if (isHovered) {
          const dx = mouse.current.x - x1
          const dy = mouse.current.y - y2
          const dist = Math.hypot(dx, dy)
          if (dist < 150) {
            const pull = (150 - dist) * 0.04
            x1 += (dx / dist) * pull
            y2 += (dy / dist) * pull
          }
        }

        // Perspective projection
        const scaleDepth = fov / (fov + z2)
        const projX = x1 * scaleDepth + centerX
        const projY = y2 * scaleDepth + centerY

        // Draw particle
        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          const size = p.size * scaleDepth * (isHovered ? 1.25 : 1)
          const alpha = Math.max(0.15, Math.min(1, scaleDepth * 0.95))

          ctx.fillStyle = p.color
          ctx.globalAlpha = alpha

          // Subtle neon blur on hover
          if (isHovered && idx % 3 === 0) {
            ctx.shadowBlur = 6
            ctx.shadowColor = p.color
          }

          ctx.beginPath()
          ctx.arc(projX, projY, size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1.0

      // Render futuristic grid overlay
      ctx.strokeStyle = "rgba(139, 92, 246, 0.07)"
      ctx.lineWidth = 1
      ctx.strokeRect(20, 20, width - 40, height - 40)

      // HUD crosshairs
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY)
      ctx.lineTo(centerX + 10, centerY)
      ctx.moveTo(centerX, centerY - 10)
      ctx.lineTo(centerX, centerY + 10)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)"
      ctx.stroke()

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center rounded-3xl overflow-hidden border border-purple-500/10 bg-purple-950/5 backdrop-blur-md"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "380px",
        boxShadow:
          "0 24px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Absolute telemetry dashboard readout overlay */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-cyan-400/80 uppercase tracking-widest flex flex-col gap-1">
        <div>System: Core.3D</div>
        <div>Render: Canvas2D_HQ</div>
        <div className="text-fuchsia-400">Geometry: {activeShape}</div>
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-purple-400/70 uppercase tracking-wider">
        Scroll morph enabled
      </div>

      <canvas ref={canvasRef} className="max-w-full max-h-full block z-10" />
    </div>
  )
}

export default memo(Interactive3DModel)
