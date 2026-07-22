"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Lock,
  Save,
  CheckCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import type { ModeType } from "@/components/Navbar";

export default function CreatePage() {
  const [mode, setMode] = useState<ModeType>("pro");

  // ─── Form State ───
  const [party1, setParty1] = useState("");
  const [party1Email, setParty1Email] = useState("");
  const [party2, setParty2] = useState("");
  const [party2Email, setParty2Email] = useState("");
  const [userInput, setUserInput] = useState("");
  const [funAction, setFunAction] = useState("");
  const [funPenalty, setFunPenalty] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  // ─── Generation State ───
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedHash, setSavedHash] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGeneratedMarkdown(null);
    setError(null);
    setSavedHash("");
  }, [mode]);

  const handleSaveToStudio = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/contracts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          party1,
          party1Email,
          party2,
          party2Email,
          mode,
          content: generatedMarkdown,
          expirationDate: showDatePicker ? expirationDate : null,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to save to studio.");
      setSavedHash(data.hash);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerConfetti = () => {
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement("div");
      const colors = [
        "#06B6D4",
        "#7C3AED",
        "#f59e0b",
        "#a855f7",
        "#14b8a6",
        "#ffffff",
      ];
      const size = Math.random() * 12 + 6;

      particle.style.position = "fixed";
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.zIndex = "100";
      particle.style.pointerEvents = "none";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";

      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 200 + Math.random() * 400;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;

      const animation = particle.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            opacity: 1,
          },
          {
            transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0) rotate(${Math.random() * 720}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1500 + Math.random() * 1000,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        }
      );

      animation.onfinish = () => particle.remove();
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!party1.trim() || !party2.trim()) {
      setError("Please fill in all party names.");
      return;
    }

    if (mode === "pro" && (!party1Email.trim() || !party2Email.trim())) {
      setError("Please fill in all email addresses for professional contracts.");
      return;
    }

    const finalInput =
      mode === "fun"
        ? `I, ${party1}, am making a pact with ${party2} to do ${funAction}. If I fail, I will ${funPenalty}.`
        : `Party 1: ${party1} (${party1Email}). Party 2: ${party2} (${party2Email}). Deal Parameters: ${userInput}${expirationDate ? `. Expiration: ${expirationDate}` : ""}`;

    if (mode === "pro" && !userInput.trim()) {
      setError("Please provide contract parameters.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMarkdown(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: finalInput,
          mode,
          party1Email,
          party2Email,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to generate contract.");

      setGeneratedMarkdown(data.markdown);

      if (mode === "fun") {
        setTimeout(triggerConfetti, 100);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const modes = [
    { id: "fun" as const, label: "FUN MODE" },
    { id: "pro" as const, label: "PRO MODE" },
  ];

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200 overflow-hidden print:bg-white print:text-black print:overflow-visible print:min-h-0 print:h-auto print:block">
      {/* ─── Studio Header (replaces main Navbar) ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Logo mode={mode} size="sm" />
          </div>

          {/* Center: Mode Toggle */}
          <div className="flex items-center rounded-full border border-white/10 bg-[#141415]/50 p-1 backdrop-blur-xl">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`relative rounded-full px-5 py-2 text-xs font-bold tracking-wider transition-colors ${
                  mode === m.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {mode === m.id && (
                  <motion.div
                    layoutId="studio-mode-pill"
                    className={`absolute inset-0 z-0 rounded-full ${
                      m.id === "pro"
                        ? "bg-[#7C3AED]/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                        : "bg-[#06B6D4]/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
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

          {/* Right: Spacer */}
          <div className="w-20" />
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <AnimatePresence mode="wait">
        {mode === "pro" ? (
          <ProModeStudio
            key="pro"
            party1={party1}
            setParty1={setParty1}
            party1Email={party1Email}
            setParty1Email={setParty1Email}
            party2={party2}
            setParty2={setParty2}
            party2Email={party2Email}
            setParty2Email={setParty2Email}
            userInput={userInput}
            setUserInput={setUserInput}
            expirationDate={expirationDate}
            setExpirationDate={setExpirationDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            isLoading={isLoading}
            error={error}
            generatedMarkdown={generatedMarkdown}
            savedHash={savedHash}
            isSaving={isSaving}
            previewRef={previewRef}
            onGenerate={handleGenerate}
            onSave={handleSaveToStudio}
            onDownload={handleDownloadPdf}
          />
        ) : (
          <FunModeStudio
            key="fun"
            party1={party1}
            setParty1={setParty1}
            party2={party2}
            setParty2={setParty2}
            funAction={funAction}
            setFunAction={setFunAction}
            funPenalty={funPenalty}
            setFunPenalty={setFunPenalty}
            isLoading={isLoading}
            error={error}
            generatedMarkdown={generatedMarkdown}
            savedHash={savedHash}
            isSaving={isSaving}
            previewRef={previewRef}
            onGenerate={handleGenerate}
            onSave={handleSaveToStudio}
            onDownload={handleDownloadPdf}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ════════════════════════════════════════════════
   PRO MODE STUDIO — Strict 50/50 Split
   ════════════════════════════════════════════════ */

interface ProModeProps {
  party1: string;
  setParty1: (v: string) => void;
  party1Email: string;
  setParty1Email: (v: string) => void;
  party2: string;
  setParty2: (v: string) => void;
  party2Email: string;
  setParty2Email: (v: string) => void;
  userInput: string;
  setUserInput: (v: string) => void;
  expirationDate: string;
  setExpirationDate: (v: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (v: boolean) => void;
  isLoading: boolean;
  error: string | null;
  generatedMarkdown: string | null;
  savedHash: string;
  isSaving: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onGenerate: (e?: React.FormEvent) => void;
  onSave: () => void;
  onDownload: () => void;
}

function ProModeStudio(props: ProModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col lg:flex-row print:block"
    >
      {/* ─── Left: Input Area ─── */}
      <div className="w-full lg:w-1/2 bg-[#0a0a0c] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto print:hidden">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Studio Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-3 py-1 font-mono text-xs text-[#a78bfa]">
            <span className="h-2 w-2 rounded-full bg-[#a78bfa] animate-pulse-slow" />
            PRO STUDIO v3.0
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Contract Parameters
          </h2>

          {/* Party Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">
                First Party
              </label>
              <input
                className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#7C3AED]/50 focus:outline-none transition-all"
                placeholder="e.g. Acme Corp"
                value={props.party1}
                onChange={(e) => props.setParty1(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">
                Second Party
              </label>
              <input
                className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#7C3AED]/50 focus:outline-none transition-all"
                placeholder="e.g. John Doe"
                value={props.party2}
                onChange={(e) => props.setParty2(e.target.value)}
              />
            </div>
          </div>

          {/* Email Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">
                First Party Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#7C3AED]/50 focus:outline-none transition-all"
                placeholder="acme@corp.com"
                value={props.party1Email}
                onChange={(e) => props.setParty1Email(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">
                Second Party Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#7C3AED]/50 focus:outline-none transition-all"
                placeholder="john@doe.com"
                value={props.party2Email}
                onChange={(e) => props.setParty2Email(e.target.value)}
              />
            </div>
          </div>

          {/* Expiration Date Toggle */}
          <div>
            <button
              onClick={() => props.setShowDatePicker(!props.showDatePicker)}
              className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5" />
              {props.showDatePicker
                ? "Hide Expiration Date"
                : "Add Expiration Date"}
            </button>
            {props.showDatePicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-3"
              >
                <input
                  type="date"
                  value={props.expirationDate}
                  onChange={(e) => props.setExpirationDate(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#7C3AED]/50 focus:outline-none transition-all"
                />
              </motion.div>
            )}
          </div>

          {/* AI Instructions Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">
              Contract Instructions (AI-Powered)
            </label>
            <textarea
              className="w-full min-h-[200px] resize-none rounded-xl border border-white/5 bg-black/40 p-4 text-sm text-white placeholder-gray-600 focus:border-[#7C3AED]/50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
              placeholder="Describe your deal parameters in detail... (e.g. 'This is a 5-year NDA regarding Project Phoenix with a penalty clause of $50,000')"
              value={props.userInput}
              onChange={(e) => props.setUserInput(e.target.value)}
            />
          </div>

          {/* CTA */}
          <motion.button
            onClick={() => props.onGenerate()}
            disabled={
              props.isLoading ||
              !props.party1.trim() ||
              !props.party2.trim() ||
              !props.userInput.trim()
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-glow-pro flex w-full items-center justify-center gap-3 rounded-xl bg-[#7C3AED] py-4 text-base font-semibold text-white transition-all hover:bg-[#6d28d9] disabled:opacity-50 disabled:shadow-none"
          >
            {props.isLoading ? "Analyzing Draft..." : "Generate Legal Contract"}
            <FileText className="h-5 w-5" />
          </motion.button>

          {props.error && (
            <p className="text-sm text-red-400 text-center">{props.error}</p>
          )}
        </div>
      </div>

      {/* ─── Right: Contract Preview ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto print:block print:w-full print:p-0">
        <div className="relative w-full max-w-[640px] aspect-[1/1.414] bg-[#131316] shadow-2xl border border-white/10 rounded-md p-8 lg:p-12 flex flex-col justify-between overflow-hidden print:bg-white print:shadow-none print:border-none print:max-w-none print:aspect-auto print:p-0">
          {/* Subtle grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] print:hidden"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {props.generatedMarkdown ? (
            <div className="relative z-10 flex flex-col h-full min-h-0 print:h-auto print:block">
              <div className="overflow-y-auto scrollbar-hide flex-1 pb-20 print:overflow-visible print:pb-0">
                <div
                  ref={props.previewRef}
                  className="prose max-w-none prose-headings:font-serif prose-headings:text-white font-serif text-[14px] leading-relaxed text-gray-300 prose-p:text-gray-300 prose-strong:text-white prose-strong:font-semibold prose-hr:border-gray-700 prose-hr:my-8 prose-li:marker:text-gray-400 prose-h1:text-center prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-8 prose-h2:text-lg prose-h2:font-semibold prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4 prose-p:my-3 print:text-black print:prose-headings:text-black print:prose-p:text-gray-800 print:prose-strong:text-black"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(props.generatedMarkdown) as string,
                  }}
                />
              </div>

              {/* Action Footer */}
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-end bg-gradient-to-t from-[#131316] via-[#131316] to-transparent pt-12 pb-4 px-4 print:hidden gap-3">
                {props.savedHash ? (
                  <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-mono text-green-400 backdrop-blur-md">
                    <CheckCircle className="h-4 w-4" />
                    Saved! Hash: {props.savedHash.substring(0, 8)}...
                  </div>
                ) : (
                  <button
                    onClick={props.onSave}
                    disabled={props.isSaving}
                    className="rounded-xl px-5 py-2 text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50 border border-white/10"
                  >
                    <Save className="h-4 w-4" />
                    {props.isSaving ? "Securing..." : "Save to Vault"}
                  </button>
                )}
                <button
                  onClick={props.onDownload}
                  className="rounded-xl px-5 py-2 text-sm font-semibold bg-[#7C3AED] text-white hover:bg-[#6d28d9] transition-all flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 space-y-8 opacity-40 pointer-events-none h-full flex flex-col justify-between">
              {/* Mock Document Skeleton */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div
                    className={`h-2 w-20 rounded ${props.isLoading ? "animate-shimmer bg-[linear-gradient(90deg,#333_25%,#444_50%,#333_75%)] bg-[length:200%_100%]" : "bg-gray-700"}`}
                  />
                  <div
                    className={`h-5 w-48 rounded ${props.isLoading ? "animate-shimmer bg-[linear-gradient(90deg,#333_25%,#444_50%,#333_75%)] bg-[length:200%_100%]" : "bg-gray-700"}`}
                  />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div
                      className={`h-3 w-full rounded ${props.isLoading ? "animate-shimmer bg-[linear-gradient(90deg,#333_25%,#444_50%,#333_75%)] bg-[length:200%_100%]" : "bg-gray-700"}`}
                    />
                    <div
                      className={`h-3 w-full rounded ${props.isLoading ? "animate-shimmer bg-[linear-gradient(90deg,#333_25%,#444_50%,#333_75%)] bg-[length:200%_100%]" : "bg-gray-700"}`}
                    />
                    <div
                      className={`h-3 w-3/4 rounded ${props.isLoading ? "animate-shimmer bg-[linear-gradient(90deg,#333_25%,#444_50%,#333_75%)] bg-[length:200%_100%]" : "bg-gray-700"}`}
                    />
                  </div>
                ))}
              </div>

              {/* Crypto Audit Footer */}
              <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
                  🔒 CRYPTO AUDIT: PENDING
                </span>
                <Lock className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   FUN MODE STUDIO — Stacked Centered
   ════════════════════════════════════════════════ */

interface FunModeProps {
  party1: string;
  setParty1: (v: string) => void;
  party2: string;
  setParty2: (v: string) => void;
  funAction: string;
  setFunAction: (v: string) => void;
  funPenalty: string;
  setFunPenalty: (v: string) => void;
  isLoading: boolean;
  error: string | null;
  generatedMarkdown: string | null;
  savedHash: string;
  isSaving: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onGenerate: (e?: React.FormEvent) => void;
  onSave: () => void;
  onDownload: () => void;
}

function FunModeStudio(props: FunModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto print:block"
    >
      {/* Ambient cyan light overlays */}
      <div className="absolute w-[500px] h-[500px] bg-[#06B6D4]/10 blur-[120px] rounded-full pointer-events-none top-1/4 -translate-y-1/2" />
      <div className="absolute w-[300px] h-[300px] bg-[#7C3AED]/10 blur-[100px] rounded-full pointer-events-none bottom-1/4 translate-x-32" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12 print:hidden">
        {props.generatedMarkdown ? (
          /* ─── Result View ─── */
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 lg:p-12">
            <div className="text-center mb-6">
              <Sparkles className="mx-auto h-8 w-8 text-[#06B6D4] mb-2 animate-pulse-slow" />
              <h2 className="text-2xl font-black text-white">
                Pact Sealed! ✨
              </h2>
            </div>

            <div className="max-h-[50vh] overflow-y-auto scrollbar-hide rounded-xl bg-black/30 p-6 border border-white/5">
              <div
                ref={props.previewRef}
                className="prose max-w-none prose-invert font-sans text-base leading-loose prose-headings:text-[#06B6D4] text-gray-300 prose-strong:text-[#67e8f9] print:text-black print:prose-headings:text-black"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(props.generatedMarkdown) as string,
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {props.savedHash ? (
                <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-mono text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Saved! Hash: {props.savedHash.substring(0, 8)}...
                </div>
              ) : (
                <button
                  onClick={props.onSave}
                  disabled={props.isSaving}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {props.isSaving ? "Saving..." : "Save to Vault"}
                </button>
              )}
              <button
                onClick={props.onDownload}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold bg-[#06B6D4] text-black hover:bg-[#22d3ee] transition-all flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        ) : (
          /* ─── Input View: Conversational / Mad-Libs ─── */
          <div className="bg-white/5 border border-white/10 p-10 lg:p-12 backdrop-blur-xl rounded-[2rem]">
            {/* Fun Label */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#06B6D4]/20 bg-[#06B6D4]/10 px-3 py-1 font-mono text-xs text-[#67e8f9] mb-4">
                <span className="h-2 w-2 rounded-full bg-[#67e8f9] animate-pulse-slow" />
                FUN MODE
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Make a Pact ✨
              </h2>
            </div>

            {/* Mad-Libs Flow */}
            <div className="text-xl lg:text-2xl font-medium leading-relaxed text-white/80 space-y-4">
              <p>
                I,{" "}
                <input
                  className="inline-block min-w-[120px] max-w-[200px] border-b-4 border-[#06B6D4] text-xl font-black bg-transparent text-[#67e8f9] outline-none text-center transition-all focus:border-[#22d3ee] placeholder:text-white/20 placeholder:font-normal"
                  placeholder="your name"
                  value={props.party1}
                  onChange={(e) => props.setParty1(e.target.value)}
                />{" "}
                am making a pact with{" "}
                <input
                  className="inline-block min-w-[120px] max-w-[200px] border-b-4 border-[#06B6D4] text-xl font-black bg-transparent text-[#67e8f9] outline-none text-center transition-all focus:border-[#22d3ee] placeholder:text-white/20 placeholder:font-normal"
                  placeholder="their name"
                  value={props.party2}
                  onChange={(e) => props.setParty2(e.target.value)}
                />{" "}
                to do{" "}
                <input
                  className="inline-block min-w-[140px] max-w-[250px] border-b-4 border-[#06B6D4] text-xl font-black bg-transparent text-[#67e8f9] outline-none text-center transition-all focus:border-[#22d3ee] placeholder:text-white/20 placeholder:font-normal"
                  placeholder="the heroic act"
                  value={props.funAction}
                  onChange={(e) => props.setFunAction(e.target.value)}
                />
                .
              </p>
              <p>
                If I fail, I will{" "}
                <input
                  className="inline-block min-w-[140px] max-w-[250px] border-b-4 border-[#06B6D4] text-xl font-black bg-transparent text-[#67e8f9] outline-none text-center transition-all focus:border-[#22d3ee] placeholder:text-white/20 placeholder:font-normal"
                  placeholder="the penalty"
                  value={props.funPenalty}
                  onChange={(e) => props.setFunPenalty(e.target.value)}
                />
                .
              </p>
            </div>

            {/* CTA */}
            <motion.button
              onClick={() => props.onGenerate()}
              disabled={
                props.isLoading ||
                !props.party1.trim() ||
                !props.party2.trim() ||
                !props.funAction.trim() ||
                !props.funPenalty.trim()
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glow-cyan mt-10 flex w-full items-center justify-center gap-3 rounded-xl bg-[#06B6D4] py-4 text-lg font-black text-black transition-all hover:bg-[#22d3ee] disabled:opacity-50 disabled:shadow-none"
            >
              {props.isLoading
                ? "Brewing Magic... 🔮"
                : "GENERATE PACT"}
            </motion.button>

            {props.error && (
              <p className="mt-4 text-sm text-red-400 text-center">
                {props.error}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
