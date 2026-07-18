"use client";

export type LogoMode = "pro" | "fun";

interface LogoProps {
  mode?: LogoMode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ mode = "fun", size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const strokeColor = mode === "pro" ? "#7C3AED" : "#06B6D4";

  return (
    <span
      className={`
        font-[var(--font-pixel)] font-black tracking-[0.2em] uppercase select-none
        text-white
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        fontFamily: "'LoRes 9 Plus OT', 'Press Start 2P', var(--font-pixel), monospace",
        fontWeight: 900,
        WebkitTextStroke: `3px ${strokeColor}`,
        paintOrder: "stroke fill",
      }}
    >
      PACTO
    </span>
  );
}
