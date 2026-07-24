"use client";

export type LogoMode = "pro" | "fun" | "light" | "dark";

interface LogoProps {
  mode?: LogoMode;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "hero";
  className?: string;
  imgClassName?: string;
}

export function Logo({
  mode = "fun",
  variant,
  size = "md",
  className = "",
  imgClassName = "",
}: LogoProps) {
  const heightClasses = {
    sm: "h-7 sm:h-8",
    md: "h-9 sm:h-10",
    lg: "h-11 sm:h-13",
    xl: "h-13 sm:h-15",
    "2xl": "h-16 sm:h-18",
    "3xl": "h-18 sm:h-20",
    hero: "h-11 sm:h-13 lg:h-16",
  };

  // Hosted Supabase Storage CDN Logo URLs
  const isLight = variant === "light" || mode === "light";
  const logoSrc = isLight
    ? "https://meytgtlepyocsfhknmjq.supabase.co/storage/v1/object/public/PACTo-asset-folder/light-mode-logo.png"
    : "https://meytgtlepyocsfhknmjq.supabase.co/storage/v1/object/public/PACTo-asset-folder/dark-mode-logo.png";

  return (
    <span className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}>
      <img
        src={logoSrc}
        alt="PACTo Logo"
        className={`w-auto object-contain transition-all drop-shadow-md ${heightClasses[size]} ${imgClassName}`}
      />
    </span>
  );
}
