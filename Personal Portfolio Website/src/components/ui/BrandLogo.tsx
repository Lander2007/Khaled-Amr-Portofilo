export default function BrandLogo({
  className = "w-7 h-7",
  showHover = true,
}: {
  className?: string;
  showHover?: boolean;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        showHover ? "group-hover:scale-105 transition-transform duration-300" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Deep Plum Container */}
        <rect width="64" height="64" rx="14" fill="#381932" />
        {/* Subtle Hairline Border */}
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="11.5"
          stroke="#FFF3E6"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
        {/* Left Vertical Structural Pillar */}
        <rect x="14" y="16" width="7" height="32" rx="1.5" fill="#FFF3E6" />
        {/* Dynamic Shift Diagonal Slash (K Upper Ray) */}
        <path d="M24 31 L39 16 H48 L31 34 Z" fill="#FFF3E6" />
        {/* K Lower Dynamic Leg */}
        <path d="M30 30 L48 48 H39 L24 33 Z" fill="#FFF3E6" />
        {/* Precision Engineering Focal Accent in Electric Lime */}
        <rect x="42" y="29" width="6" height="6" rx="1.5" fill="#C6F277" />
      </svg>
    </div>
  );
}
