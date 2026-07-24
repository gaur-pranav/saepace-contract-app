"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Plus,
  BookOpen,
  HelpCircle,
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
  const [userName, setUserName] = useState<string>("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dockHoveredIndex, setDockHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user?.email) {
            const profRes = await fetch("/api/profile");
            if (profRes.ok) {
              const profData = await profRes.json();
              if (profData.profile?.name) setUserName(profData.profile.name);
            }
          }
        }
      } catch (e) {}
    };
    fetchSession();
  }, []);

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
          className="sticky top-0 z-50 hidden lg:block w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-md print:hidden"
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
                className="btn-glow-cyan rounded-full bg-[#06B6D4] px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-[#22d3ee] cursor-pointer"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.header>

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#050505]/80 px-4 backdrop-blur-md print:hidden">
          <Link href="/">
            <Logo mode="fun" size="sm" />
          </Link>
          <Link href="/auth">
            <button className="btn-glow-cyan rounded-full bg-[#06B6D4] px-4 py-1.5 text-xs font-semibold text-black cursor-pointer">
              Sign In
            </button>
          </Link>
        </div>
      </>
    );
  }

  // ─── Authenticated Navbar ───
  const appLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const dockLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Pact", href: "/create", icon: Plus, isCta: true },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Docs", href: "/docs", icon: BookOpen },
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
        className="sticky top-0 z-50 hidden lg:block w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-md print:hidden"
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

          {/* Right: New Pact CTA + Profile Reroute Avatar */}
          <div className="flex items-center gap-4">
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                New Pact
              </motion.button>
            </Link>

            {/* Profile Avatar Reroute */}
            <Link href="/profile" title={userName ? `Profile: ${userName}` : "View Profile & Settings"}>
              <motion.div 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] text-sm font-bold text-white cursor-pointer transition-all ${
                  pathname === "/profile" ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-black" : ""
                }`}
              >
                {(userName && userName.trim()) ? userName.trim().charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#050505] bg-emerald-400" />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Mobile Top Header - Centered Logo Only */}
      <div className="lg:hidden sticky top-0 z-50 flex h-14 w-full items-center justify-center border-b border-white/5 bg-[#050505]/80 px-4 backdrop-blur-md print:hidden">
        <Link href="/" className="flex items-center justify-center">
          <Logo mode={mode || "fun"} size="sm" />
        </Link>
      </div>

      {/* ─── REACT BITS FLOATING MOBILE DOCK ─── */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] print:hidden">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="flex items-center gap-2 rounded-3xl border border-white/10 bg-[#0c0c0e]/85 px-3 py-2 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
          onMouseLeave={() => setDockHoveredIndex(null)}
        >
          {dockLinks.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isHovered = dockHoveredIndex === idx;

            return (
              <Link key={item.name} href={item.href} className="relative">
                {/* Tooltip Label */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -42, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-lg bg-[#18181c] border border-white/10 px-2.5 py-1 text-[10px] font-bold text-white whitespace-nowrap shadow-xl z-50"
                    >
                      {item.name}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  onMouseEnter={() => setDockHoveredIndex(idx)}
                  onTouchStart={() => setDockHoveredIndex(idx)}
                  whileHover={{ scale: 1.25, y: -6 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                    item.isCta
                      ? "bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                      : isActive
                      ? "bg-white/15 text-cyan-400 border border-white/15"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {isActive && !item.isCta && (
                    <motion.span
                      layoutId="active-dock-dot"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-cyan-400"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
