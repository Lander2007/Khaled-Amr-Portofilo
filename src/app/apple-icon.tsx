import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#381932",
          borderRadius: 40,
          border: "4px solid rgba(255, 243, 230, 0.2)",
        }}
      >
        <svg
          width="128"
          height="128"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="14" y="16" width="7" height="32" rx="1.5" fill="#FFF3E6" />
          <path d="M24 31 L39 16 H48 L31 34 Z" fill="#FFF3E6" />
          <path d="M30 30 L48 48 H39 L24 33 Z" fill="#FFF3E6" />
          <rect x="42" y="29" width="6" height="6" rx="1.5" fill="#C6F277" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
