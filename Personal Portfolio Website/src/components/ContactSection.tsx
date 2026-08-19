import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, CheckCircle2 } from "lucide-react"
import emailjs from "@emailjs/browser"
import LogoIcon from "./LogoIcon"

// ─── Constants ─────────────────────────────────────────────────────────────────

const CONTACT_REASONS = [
  "Job Opportunity",
  "Collaboration",
  "Freelance Inquiry",
  "Just Saying Hi",
  "Question",
  "Other",
]

const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com/Lander2007",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/KhaledA33912144",
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kh%E1%A5%B2%E1%A5%A3%E1%A5%B1d-amr-263334343/",
    svg: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

// ─── Validation ─────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MIN = 10
const MESSAGE_MAX = 500

function validateName(v: string): string {
  return v.trim().length < 2 ? "Name must be at least 2 characters." : ""
}
function validateEmail(v: string): string {
  return !EMAIL_REGEX.test(v.trim())
    ? "Please enter a valid email (e.g., name@domain.com)."
    : ""
}
function validateMessage(v: string): string {
  return v.trim().length < MESSAGE_MIN
    ? `Message must be at least ${MESSAGE_MIN} characters.`
    : ""
}

// ─── Small helpers ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: "Syne",
        fontSize: "0.72rem",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "#8b4fe8",
        marginBottom: "1rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "28px",
          height: "1px",
          background: "#6c2bd9",
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  )
}

function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "scale"
}) {
  const initialY = direction === "up" ? 48 : direction === "down" ? -48 : 0
  const initialScale = direction === "scale" ? 0.86 : 0.96
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: initialY,
        scale: initialScale,
        filter: "blur(6px)",
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated error badge ───────────────────────────────────────────────────────

function ErrorBadge({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginTop: "0.45rem",
              fontFamily: "Plus Jakarta Sans",
              fontSize: "0.78rem",
              fontWeight: 500,
              color: "#fb7185",
            }}
          >
            {/* Warning icon */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Field state icons ──────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#34d399"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 10 8 14 16 6" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="#fb7185">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// ─── Determine border / glow for a field ───────────────────────────────────────

type FieldStatus = "idle" | "valid" | "error"

function getFieldStatus(
  touched: boolean,
  error: string,
  value: string,
): FieldStatus {
  if (!touched) return "idle"
  if (error) return "error"
  if (value.trim().length > 0) return "valid"
  return "idle"
}

function getBorderColor(status: FieldStatus, focused: boolean): string {
  if (status === "valid") return "rgba(52, 211, 153, 0.6)"
  if (status === "error") return "rgba(251, 113, 133, 0.8)"
  if (focused) return "#c9a7ff"
  return "rgba(108, 43, 217, 0.35)"
}

function getBoxShadow(status: FieldStatus, focused: boolean): string {
  if (status === "valid")
    return focused
      ? "0 0 0 3px rgba(52,211,153,0.12), 0 2px 20px rgba(52,211,153,0.15)"
      : "none"
  if (status === "error")
    return focused
      ? "0 0 0 3px rgba(251,113,133,0.12), 0 2px 20px rgba(251,113,133,0.15)"
      : "none"
  if (focused) return "0 2px 20px rgba(201, 167, 255, 0.25)"
  return "none"
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function ContactSection() {
  // Form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  })

  // Focus state
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    message: false,
  })

  // Touched (field received at least one blur or change-after-focus)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  })

  // Live errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const formRef = useRef<HTMLFormElement>(null)

  // Proximity glow effect
  useEffect(() => {
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (formRef.current) {
            const rect = formRef.current.getBoundingClientRect()
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // ── Validation helpers ─────────────────────────────────────────────────────

  const runValidation = (
    field: "name" | "email" | "message",
    value: string,
  ) => {
    let err = ""
    if (field === "name") err = validateName(value)
    if (field === "email") err = validateEmail(value)
    if (field === "message") err = validateMessage(value)
    setErrors((prev) => ({ ...prev, [field]: err }))
    return err
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Validate live only once the field has been touched
    if (touched[(name as keyof typeof touched)]) {
      runValidation(name as "name" | "email" | "message", value)
    }
  }

  const handleFocus = (field: "name" | "email" | "message") => {
    setFocused((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field: "name" | "email" | "message") => {
    setFocused((prev) => ({ ...prev, [field]: false }))
    // Mark touched on first blur and validate immediately
    setTouched((prev) => ({ ...prev, [field]: true }))
    runValidation(field, formData[field])
  }

  // After first blur, also validate on every subsequent change in real-time
  const handleChangeWithTouch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (touched[(name as keyof typeof touched)]) {
      runValidation(name as "name" | "email" | "message", value)
    }
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const hasAnyError =
    errors.name !== "" || errors.email !== "" || errors.message !== ""
  const requiredEmpty =
    formData.name.trim() === "" ||
    formData.email.trim() === "" ||
    formData.message.trim() === ""
  const isDisabled = isSubmitting || submitted || hasAnyError || requiredEmpty

  const nameStatus = getFieldStatus(touched.name, errors.name, formData.name)
  const emailStatus = getFieldStatus(
    touched.email,
    errors.email,
    formData.email,
  )
  const messageStatus = getFieldStatus(
    touched.message,
    errors.message,
    formData.message,
  )

  const msgLen = formData.message.trim().length
  const msgMetMin = msgLen >= MESSAGE_MIN

  // ── Submission ─────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation pass
    const nameErr = validateName(formData.name)
    const emailErr = validateEmail(formData.email)
    const msgErr = validateMessage(formData.message)
    setErrors({ name: nameErr, email: emailErr, message: msgErr })
    setTouched({ name: true, email: true, message: true })
    if (nameErr || emailErr || msgErr) return

    setIsSubmitting(true)
    try {
      await emailjs.send(
        "service_t7cvpvk",
        "template_a3mitgu",
        {
          from_name: formData.name,
          user_email: formData.email,
          reason: formData.reason,
          message: formData.message,
        },
        "nc-ws_AZd65JDBg4a",
      )

      setIsSubmitting(false)
      setSubmitted(true)

      // Reset everything after success display
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: "", email: "", reason: "", message: "" })
        setTouched({ name: false, email: false, message: false })
        setErrors({ name: "", email: "", message: "" })
      }, 4000)
    } catch (error) {
      console.error("Failed to send email:", error)
      setIsSubmitting(false)
      alert("Failed to send message. Please try again.")
    }
  }

  // ── Shared input container style ───────────────────────────────────────────

  const inputWrapStyle: React.CSSProperties = {
    position: "relative",
    borderRadius: "12px",
    border: "1px solid",
    background: "rgba(13, 7, 34, 0.80)",
    transition: "border-color 0.25s, box-shadow 0.25s",
    overflow: "hidden",
  }

  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 44px 14px 16px",
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "Plus Jakarta Sans",
    fontSize: "1rem",
    color: "#f0e8ff",
    transition: "all 0.25s",
  }

  // ── Icon overlay (checkmark / warning) ────────────────────────────────────

  function FieldIcon({ status }: { status: FieldStatus }) {
    if (status === "idle") return null
    return (
      <div
        style={{
          position: "absolute",
          right: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {status === "valid" ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
            >
              <CheckIcon />
            </motion.span>
          ) : (
            <motion.span
              key="warn"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
            >
              <WarningIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      id="contact"
      className="section-transition-bleed"
      style={{ padding: "10rem 2rem 5rem", position: "relative", zIndex: 2 }}
    >
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Reveal direction="down" delay={0.05}>
          <SectionLabel>06 / Contact &amp; Inquiries</SectionLabel>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <h2
            className="text-glow-bright"
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 5.8vw, 4.5rem)",
              color: "#f0e8ff",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            Let&apos;s connect.
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.25}>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: "1.08rem",
              lineHeight: 1.8,
              color: "rgba(201,167,255,0.72)",
              marginBottom: "4rem",
              fontWeight: 300,
              textAlign: "center",
            }}
          >
            Whether you have a question, want to collaborate, or just want to
            say hello — I&apos;d love to hear from you. Drop me a message and
            I&apos;ll get back to you soon.
          </p>
        </Reveal>

        {/* ── Form card ──────────────────────────────────────────────────── */}
        <Reveal direction="scale" delay={0.35}>
          <div style={{ position: "relative" }}>
            {/* Success overlay banner */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 20,
                    borderRadius: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(13, 2, 33, 0.92)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(52,211,153,0.45)",
                    boxShadow:
                      "0 0 80px rgba(52,211,153,0.25), inset 0 1px 0 rgba(52,211,153,0.1)",
                    gap: "1rem",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(52,211,153,0.15)",
                      border: "2px solid rgba(52,211,153,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      boxShadow: "0 0 30px rgba(52,211,153,0.4)",
                    }}
                  >
                    ✓
                  </motion.div>
                  <p
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 700,
                      fontSize: "1.35rem",
                      color: "#34d399",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Message sent successfully!
                  </p>
                  <p
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: "0.9rem",
                      color: "rgba(201,167,255,0.6)",
                      fontWeight: 300,
                    }}
                  >
                    I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              style={{
                position: "relative",
                padding: "3.5rem 3rem",
                borderRadius: "32px",
                background: "rgba(13, 2, 33, 0.65)",
                backdropFilter: "blur(28px) saturate(1.8)",
                border: "1px solid rgba(108, 43, 217, 0.35)",
                boxShadow:
                  "0 30px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,167,255,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Proximity glow */}
              <div
                style={{
                  position: "absolute",
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(108,43,217,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                  transform: `translate(${mousePos.x - 150}px, ${mousePos.y - 150}px)`,
                  transition: "transform 0.15s ease-out",
                  zIndex: 0,
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* ── Name ──────────────────────────────────────────────── */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label
                    htmlFor="name"
                    style={{
                      display: "block",
                      fontFamily: "Syne",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "rgba(201,167,255,0.65)",
                      marginBottom: "0.55rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Full Name
                  </label>
                  <div
                    style={{
                      ...inputWrapStyle,
                      borderColor: getBorderColor(nameStatus, focused.name),
                      boxShadow: getBoxShadow(nameStatus, focused.name),
                    }}
                  >
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChangeWithTouch}
                      onFocus={() => handleFocus("name")}
                      onBlur={() => handleBlur("name")}
                      placeholder="e.g. Jane Smith"
                      style={{
                        ...baseInputStyle,
                        caretColor:
                          nameStatus === "error" ? "#fb7185" : "#c9a7ff",
                      }}
                    />
                    <FieldIcon status={nameStatus} />
                  </div>
                  <ErrorBadge message={errors.name} />
                </div>

                {/* ── Email ─────────────────────────────────────────────── */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontFamily: "Syne",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "rgba(201,167,255,0.65)",
                      marginBottom: "0.55rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Email Address
                  </label>
                  <div
                    style={{
                      ...inputWrapStyle,
                      borderColor: getBorderColor(emailStatus, focused.email),
                      boxShadow: getBoxShadow(emailStatus, focused.email),
                    }}
                  >
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChangeWithTouch}
                      onFocus={() => handleFocus("email")}
                      onBlur={() => handleBlur("email")}
                      placeholder="name@domain.com"
                      style={{
                        ...baseInputStyle,
                        caretColor:
                          emailStatus === "error" ? "#fb7185" : "#c9a7ff",
                      }}
                    />
                    <FieldIcon status={emailStatus} />
                  </div>
                  <ErrorBadge message={errors.email} />
                </div>

                {/* ── Contact Reason chips ───────────────────────────────── */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "Syne",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "rgba(201,167,255,0.65)",
                      marginBottom: "0.85rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    What&apos;s this about?
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.65rem",
                    }}
                  >
                    {CONTACT_REASONS.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, reason: type }))
                        }
                        style={{
                          padding: "0.6rem 1.2rem",
                          borderRadius: "9999px",
                          border: `1px solid ${
                            formData.reason === type
                              ? "rgba(139,79,232,0.75)"
                              : "rgba(108,43,217,0.35)"
                          }`,
                          background:
                            formData.reason === type
                              ? "rgba(108,43,217,0.3)"
                              : "rgba(108,43,217,0.08)",
                          color:
                            formData.reason === type
                              ? "#f0e8ff"
                              : "rgba(201,167,255,0.6)",
                          fontFamily: "Syne",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                          boxShadow:
                            formData.reason === type
                              ? "0 0 20px rgba(108,43,217,0.4)"
                              : "none",
                          outline: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (formData.reason !== type) {
                            e.currentTarget.style.borderColor =
                              "rgba(108,43,217,0.55)"
                            e.currentTarget.style.background =
                              "rgba(108,43,217,0.15)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.reason !== type) {
                            e.currentTarget.style.borderColor =
                              "rgba(108,43,217,0.35)"
                            e.currentTarget.style.background =
                              "rgba(108,43,217,0.08)"
                          }
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Message ───────────────────────────────────────────── */}
                <div style={{ marginBottom: "2.5rem" }}>
                  <label
                    htmlFor="message"
                    style={{
                      display: "block",
                      fontFamily: "Syne",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "rgba(201,167,255,0.65)",
                      marginBottom: "0.55rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Message
                  </label>
                  <div
                    style={{
                      ...inputWrapStyle,
                      borderColor: getBorderColor(
                        messageStatus,
                        focused.message,
                      ),
                      boxShadow: getBoxShadow(messageStatus, focused.message),
                    }}
                  >
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChangeWithTouch}
                      onFocus={() => handleFocus("message")}
                      onBlur={() => handleBlur("message")}
                      rows={5}
                      placeholder="Tell me what's on your mind…"
                      style={{
                        ...baseInputStyle,
                        padding: "14px 44px 14px 16px",
                        resize: "vertical",
                        minHeight: "130px",
                        caretColor:
                          messageStatus === "error" ? "#fb7185" : "#c9a7ff",
                      }}
                    />
                    {/* Icon anchored to top-right of textarea */}
                    {messageStatus !== "idle" && (
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "16px",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {messageStatus === "valid" ? (
                            <motion.span
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.18 }}
                            >
                              <CheckIcon />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="warn"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.18 }}
                            >
                              <WarningIcon />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Character counter */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.4rem",
                    }}
                  >
                    <ErrorBadge message={errors.message} />
                    <span
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        marginLeft: "auto",
                        color: msgMetMin
                          ? "rgba(52,211,153,0.85)"
                          : formData.message.length > 0
                            ? "rgba(251,113,133,0.8)"
                            : "rgba(201,167,255,0.35)",
                        transition: "color 0.2s",
                      }}
                    >
                      {formData.message.length}/{MESSAGE_MIN} characters minimum
                      {formData.message.length > MESSAGE_MAX && (
                        <span style={{ color: "#fb7185" }}>
                          {" "}
                          (max {MESSAGE_MAX})
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* ── Submit ─────────────────────────────────────────────── */}
                <div style={{ textAlign: "center" }}>
                  <button
                    type="submit"
                    disabled={isDisabled}
                    style={{
                      position: "relative",
                      padding: "1rem 3rem",
                      borderRadius: "9999px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #6c2bd9 0%, #8b4fe8 100%)",
                      color: "#ffffff",
                      fontFamily: "Syne",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isDisabled
                        ? "none"
                        : "0 0 40px rgba(108,43,217,0.6)",
                      outline: "none",
                      overflow: "hidden",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow =
                          "0 0 60px rgba(108,43,217,0.9)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow =
                          "0 0 40px rgba(108,43,217,0.6)"
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#ffffff",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                          }}
                        />
                        Launching...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 group">
                        <span>Send Message</span>
                        <Send className="w-4 h-4 text-cyan-300 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 icon-glow-cyan" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Success particle burst */}
            {submitted && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "rgba(52,211,153,0.9)",
                      boxShadow: "0 0 10px rgba(52,211,153,0.8)",
                      animation: `particle-burst-${i} 1.2s ease-out forwards`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* ── Email link ─────────────────────────────────────────────────── */}
        <Reveal direction="up" delay={0.45}>
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "3rem",
              marginBottom: "3rem",
            }}
          >
            <a
              href="mailto:kaled.amr0210@gmail.com"
              style={{
                fontFamily: "Syne",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "rgba(201,167,255,0.7)",
                textDecoration: "none",
                transition: "color 0.25s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a7ff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(201,167,255,0.7)")
              }
            >
              kaled.amr0210@gmail.com
            </a>
          </div>
        </Reveal>

        {/* ── Social icons ───────────────────────────────────────────────── */}
        <Reveal direction="up" delay={0.5}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.35rem",
              marginBottom: "5rem",
            }}
          >
            {SOCIAL.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid rgba(108,43,217,0.38)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(201,167,255,0.6)",
                  textDecoration: "none",
                  background: "rgba(108,43,217,0.08)",
                  transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139,79,232,0.85)"
                  e.currentTarget.style.color = "#f0e8ff"
                  e.currentTarget.style.boxShadow =
                    "0 0 25px rgba(108,43,217,0.7)"
                  e.currentTarget.style.background = "rgba(108,43,217,0.25)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(108,43,217,0.38)"
                  e.currentTarget.style.color = "rgba(201,167,255,0.6)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.background = "rgba(108,43,217,0.08)"
                }}
              >
                {link.svg}
              </a>
            ))}
          </div>
        </Reveal>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <Reveal direction="up" delay={0.55}>
          <div
            style={{
              borderTop: "1px solid rgba(108,43,217,0.18)",
              paddingTop: "2.5rem",
              fontFamily: "Plus Jakarta Sans",
              fontSize: "0.825rem",
              color: "rgba(201,167,255,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <LogoIcon size={32} />
              <div
                style={{
                  fontFamily: "Syne",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f0e8ff",
                  letterSpacing: "-0.01em",
                }}
              >
                Khaled Amr
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.875rem",
              }}
            >
              <span>
                © 2026 Khaled Amr · Web Developer @ WaveDev. All rights
                reserved.
              </span>
              <span>Crafted with precision &amp; intention</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
