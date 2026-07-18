"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200">
      {/* Top-Left Pinned Logo */}
      <div className="absolute top-6 left-6 z-20 hidden md:block">
        <Link href="/">
          <Logo mode="fun" size="sm" />
        </Link>
      </div>

      {/* Desktop 50/50 Split */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* ─── Left Pane: Animated Meshes ─── */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#050505] p-8 lg:p-16 min-h-[300px] lg:min-h-0">
          {/* Mesh Blob 1 - Indigo */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[100px] mix-blend-screen animate-mesh-drift-1" />

          {/* Mesh Blob 2 - Cyan */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#06B6D4]/20 blur-[100px] mix-blend-screen animate-mesh-drift-2 translate-x-20 translate-y-20" />

          {/* Mesh Blob 3 - Subtle Purple */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[#7C3AED]/15 blur-[80px] mix-blend-screen animate-mesh-drift-1 -translate-x-32 -translate-y-16" />

          {/* Floating Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative z-10 text-center"
          >
            <p className="font-serif italic text-3xl lg:text-4xl text-white/90 leading-snug max-w-md">
              Handshakes break.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#7C3AED]">
                PACTO
              </span>{" "}
              binds.
            </p>
          </motion.div>
        </div>

        {/* ─── Right Pane: Auth Form ─── */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-16 relative">
          {/* Back to Home Link */}
          <div className="w-full max-w-md mb-4 self-center text-left">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-wider">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-md p-10 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl"
          >
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Link href="/">
                <Logo mode="fun" size="md" className="cursor-pointer" />
              </Link>
            </div>

            {/* Toggle */}
            <div className="mb-8 flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent border-b-2 border-white/10 focus:border-cyan-400 py-3 text-lg outline-none w-full transition-all placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-b-2 border-white/10 focus:border-cyan-400 py-3 text-lg outline-none w-full transition-all placeholder:text-gray-600"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-glow-cyan group flex w-full items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-4 py-3.5 font-semibold text-black transition-all hover:bg-[#22d3ee] disabled:opacity-50"
              >
                {isLoading
                  ? "Authenticating..."
                  : isLogin
                  ? "Enter PACTO"
                  : "Create Account"}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Button */}
            <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

            {/* Security badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
              <Lock className="h-3 w-3" />
              <span>End-to-End Encrypted Session</span>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
