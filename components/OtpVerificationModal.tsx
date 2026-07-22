"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, ShieldCheck, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  contractTitle?: string;
  userEmail?: string;
  onSuccess: () => void;
}

export function OtpVerificationModal({
  isOpen,
  onClose,
  contractId,
  contractTitle,
  userEmail,
  onSuccess,
}: OtpVerificationModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && contractId) {
      setDigits(["", "", "", "", "", ""]);
      setError(null);
      setDevOtpNotice(null);
      sendOtp();
    }
  }, [isOpen, contractId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && isOpen) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, isOpen]);

  if (!isOpen) return null;

  const sendOtp = async () => {
    setIsSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send verification OTP");
      
      if (data.devOtp) {
        setDevOtpNotice(`DEV MODE OTP: ${data.devOtp}`);
      }
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const val = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits of the OTP code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, otpCode: code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0c0c0e] p-8 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 mb-5">
              <Key className="h-7 w-7 text-[#a78bfa]" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              2-Step Signature OTP
            </h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-xs">
              Enter the 6-digit verification code sent to{" "}
              <span className="font-semibold text-white">{userEmail || "your email"}</span> to approve deal signing.
            </p>

            {devOtpNotice && (
              <div className="mt-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-xs font-mono font-semibold text-cyan-400">
                ⚡ {devOtpNotice}
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs text-rose-400 w-full text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* OTP 6-Digit Form */}
            <form onSubmit={handleVerify} className="mt-6 w-full space-y-6">
              <div className="flex justify-center gap-2 xs:gap-3">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="h-12 w-11 rounded-xl border border-white/10 bg-white/5 text-center text-xl font-bold font-mono text-white outline-none transition-all focus:border-[#06B6D4] focus:bg-white/10"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || digits.join("").length !== 6}
                className="btn-glow-cyan flex w-full items-center justify-center gap-2 rounded-xl bg-[#06B6D4] py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#22d3ee] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  "Verifying & Sealing..."
                ) : (
                  <>
                    Confirm & Sign Deal
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Resend Link */}
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                onClick={sendOtp}
                disabled={isSending || resendTimer > 0}
                className="flex items-center gap-1 font-semibold text-[#06B6D4] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isSending ? "animate-spin" : ""}`} />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
