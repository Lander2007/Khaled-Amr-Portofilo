import { CSSProperties } from "react"

export default function LogoIcon({
  size = 36,
  style,
}: {
  size?: number
  style?: CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id="ka-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b4fe8" />
          <stop offset="50%" stopColor="#c9a7ff" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id="ka-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c9a7ff" />
        </linearGradient>
        <filter id="ka-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#ka-grad-1)"
        strokeWidth="3.5"
        fill="rgba(13,2,33,0.75)"
        filter="url(#ka-glow)"
      />
      <circle
        cx="50"
        cy="50"
        r="37"
        stroke="rgba(201,167,255,0.3)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path
        d="M 35 25 L 35 75 M 35 50 L 65 25 M 35 50 L 65 75"
        stroke="url(#ka-grad-2)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ka-glow)"
      />
      <circle cx="65" cy="25" r="3" fill="#ffffff" />
      <circle cx="65" cy="75" r="3" fill="#c9a7ff" />
    </svg>
  )
}
