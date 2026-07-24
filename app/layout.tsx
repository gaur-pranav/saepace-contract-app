import type { Metadata } from "next";
import { Space_Grotesk, Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

const PACTO_LOGO_URL =
  "https://meytgtlepyocsfhknmjq.supabase.co/storage/v1/object/public/PACTo-asset-folder/dark-mode-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://saepace-pacto.netlify.app"),
  title: {
    default: "PACTo — Legal-Tech by SAE PACE",
    template: "%s | PACTo Legal-Tech",
  },
  description:
    "Cryptographic protocol for everyday trust. Turn casual deals into mathematically sealed micro-contracts in 30 seconds.",
  keywords: [
    "PACTo",
    "SAE PACE",
    "Legal Tech",
    "Cryptographic Micro-Contracts",
    "E-Signatures",
    "HMAC-SHA256",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PACTo — Legal-Tech by SAE PACE",
    description:
      "Cryptographic protocol for everyday trust. Turn casual deals into mathematically sealed micro-contracts in 30 seconds.",
    url: "https://saepace-pacto.netlify.app",
    siteName: "PACTo by SAE PACE",
    images: [
      {
        url: PACTO_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "PACTo — Managed by SAE PACE Cryptographic Protocol",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PACTo — Legal-Tech by SAE PACE",
    description:
      "Cryptographic protocol for everyday trust. Turn casual deals into mathematically sealed micro-contracts in 30 seconds.",
    images: [PACTO_LOGO_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
