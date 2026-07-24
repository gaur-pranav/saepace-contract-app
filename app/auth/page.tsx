"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            router.push("/dashboard");
          }
        }
      } catch (e) {}
    };
    checkExistingSession();
  }, [router]);

  const validateForm = () => {
    if (!isLogin && !name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter (A-Z).");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter (a-z).");
      return false;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character or symbol (!@#$%^&*).");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: isLogin ? undefined : name.trim(),
          isRegister: !isLogin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = typeof data.error === "string" && data.error !== "{}"
          ? data.error 
          : (data.error?.message || "Authentication failed. Please check SMTP configuration in Supabase Dashboard.");
        throw new Error(msg);
      }

      if (data.requiresEmailVerification) {
        setInfoMessage(data.message || "Account registered! Please check your email inbox to verify your account with Supabase before signing in.");
        setIsLoading(false);
        setIsLogin(true);
        return;
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
            className="w-full max-w-md p-8 sm:p-10 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl"
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
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field (Register Mode Only) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="bg-transparent border-b-2 border-white/10 focus:border-cyan-400 py-2.5 text-base outline-none w-full transition-all placeholder:text-gray-600 text-white"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent border-b-2 border-white/10 focus:border-cyan-400 py-2.5 text-base outline-none w-full transition-all placeholder:text-gray-600 text-white"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars (A-Z, a-z, @#$...)"
                    className="bg-transparent border-b-2 border-white/10 focus:border-cyan-400 py-2.5 text-base outline-none w-full transition-all placeholder:text-gray-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-3 text-gray-500 hover:text-cyan-400 transition-colors p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Must be 8+ chars with uppercase, lowercase & symbol.
                </p>
              </div>

              {infoMessage && (
                <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs text-cyan-300 leading-relaxed font-medium">
                  ✉️ {infoMessage}
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 leading-relaxed">
                  {error}
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-glow-cyan group flex w-full items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-4 py-3.5 font-semibold text-black transition-all hover:bg-[#22d3ee] disabled:opacity-50 cursor-pointer"
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

            {/* Security badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span>End-to-End Encrypted Session</span>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
