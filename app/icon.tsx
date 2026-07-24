import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#060608",
          borderRadius: "8px",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="pactoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path
            d="M7 10V7a5 5 0 0 1 10 0v3"
            stroke="url(#pactoGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <rect
            x="4"
            y="10"
            width="16"
            height="11"
            rx="3"
            fill="url(#pactoGrad)"
          />
          <circle cx="12" cy="15" r="1.5" fill="#060608" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
