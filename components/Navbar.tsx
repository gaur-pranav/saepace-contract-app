"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FileEdit,
  LayoutDashboard,
  User,
  Plus,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";

export type ModeType = "pro" | "fun";

interface NavbarProps {
  mode?: ModeType;
  setMode?: (mode: ModeType) => void;
  /** Set true to hide the main navbar (used in Studio) */
  hidden?: boolean;
}

export function Navbar({ mode, setMode, hidden }: NavbarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {}
    };
    fetchSession();
  }, [pathname]);

  if (hidden) return null;

  const isAuthenticated = !!user;

  // ─── Unauthenticated Navbar ───
  if (!isAuthenticated) {
    return (
      <>
        {/* Desktop */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 hidden lg:block w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-md"
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            {/* Left: Logo */}
            <Link href="/">
              <Logo mode="fun" size="sm" />
            </Link>

            {/* Center: Documentation */}
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>

            {/* Right: Sign In */}
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glow-cyan rounded-full bg-[#06B6D4] px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-[#22d3ee]"
              >
                Sign In / Up
              </motion.button>
            </Link>
          </div>
        </motion.header>

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#050505]/80 px-4 backdrop-blur-md">
          <Link href="/">
            <Logo mode="fun" size="sm" />
          </Link>
          <Link href="/auth">
            <button className="btn-glow-cyan rounded-full bg-[#06B6D4] px-4 py-1.5 text-xs font-semibold text-black">
              Sign In
            </button>
          </Link>
        </div>
      </>
    );
  }

  // ─── Authenticated Navbar ───
  const appLinks = [
    { name: "Vault", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const modes = [
    { id: "pro" as const, label: "PRO MODE" },
    { id: "fun" as const, label: "FUN MODE" },
  ];



  return (
    <>
      {/* Desktop Top Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 hidden lg:block w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Left: Logo */}
          <Link href="/">
            <Logo mode={mode || "fun"} size="sm" />
          </Link>

          {/* Center: Nav Links */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1 rounded-full border border-white/10 bg-[#141415]/50 p-1 backdrop-blur-xl"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {appLinks.map((link, idx) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {hoveredIndex === idx && (
                    <motion.div
                      layoutId="nav-bubble-bg"
                      className="absolute inset-0 z-0 rounded-full bg-white/10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Mode Switcher */}
            {mode && setMode && (
              <div className="flex space-x-1 rounded-full border border-white/10 bg-[#141415]/50 p-1 backdrop-blur-sm">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`relative rounded-full px-4 py-2 text-xs font-bold tracking-wider transition-colors ${
                      mode === m.id
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {mode === m.id && (
                      <motion.div
                        layoutId="active-mode-pill"
                        className={`absolute inset-0 z-0 rounded-full ${
                          m.id === "pro"
                            ? "bg-[#7C3AED]/20"
                            : "bg-[#06B6D4]/20"
                        }`}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Avatar + Create */}
          <div className="flex items-center gap-3">
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                New Pact
              </motion.button>
            </Link>

            {/* Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] text-sm font-bold text-white cursor-pointer">
              {user.email.charAt(0).toUpperCase()}
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#050505] bg-emerald-400" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#050505]/80 px-4 backdrop-blur-md print:hidden">
        <Link href="/">
          <Logo mode={mode || "fun"} size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          {mode && setMode && (
            <div className="flex space-x-1 rounded-full border border-white/10 bg-white/5 p-0.5">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                    mode === m.id
                      ? "bg-white/10 text-white"
                      : "text-gray-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          )}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] text-xs font-bold text-white">
            {user.email.charAt(0).toUpperCase()}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#050505] bg-emerald-400" />
          </div>
        </div>
      </div>

      {/* Mobile Dock */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] print:hidden">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#141415]/80 p-1.5 backdrop-blur-2xl shadow-2xl"
        >
          {appLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex h-11 w-11 flex-col items-center justify-center rounded-xl transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-white" />
                  )}
                </motion.div>
              </Link>
            );
          })}

          <div className="mx-1 h-7 w-px bg-white/10" />

          <Link href="/create">
            <motion.div
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED]/30 to-[#06B6D4]/30 text-white"
            >
              <Plus className="h-5 w-5" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
