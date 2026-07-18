"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import { jsPDF } from "jspdf";
import type { ModeType } from "./Navbar";
import { Sparkles, FileText, Lock, Save, CheckCircle } from "lucide-react";

interface ContractGeneratorProps {
  mode: ModeType;
}

export function ContractGenerator({ mode }: ContractGeneratorProps) {
  const [party1, setParty1] = useState("");
  const [party1Email, setParty1Email] = useState("");
  const [party2, setParty2] = useState("");
  const [party2Email, setParty2Email] = useState("");
  const [userInput, setUserInput] = useState("");
  const [funAction, setFunAction] = useState("");
  const [funPenalty, setFunPenalty] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedHash, setSavedHash] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
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
          party2,
          mode,
          content: generatedMarkdown,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save to studio.");
      }
      
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
      const colors = ["#f43f5e", "#6366f1", "#f59e0b", "#a855f7", "#14b8a6", "#ffffff"];
      const size = Math.random() * 12 + 6;
      const emojis = ["✨", "🎈", "🎉", "🌟"];
      const emoji = Math.random() > 0.8 ? emojis[Math.floor(Math.random() * emojis.length)] : null;

      particle.style.position = "fixed";
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.zIndex = "100";
      particle.style.pointerEvents = "none";

      if (emoji) {
        particle.textContent = emoji;
        particle.style.fontSize = `${size}px`;
      } else {
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      }

      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 200 + Math.random() * 400;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;

      const animation = particle.animate(
        [
          { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0) rotate(${Math.random() * 720}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1500 + Math.random() * 1000, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
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

    const finalInput = mode === "fun" 
      ? `I, ${party1}, am making a pact with ${party2} to do ${funAction}. If I fail, I will ${funPenalty}.`
      : `Party 1: ${party1} (${party1Email}). Party 2: ${party2} (${party2Email}). Deal Parameters: ${userInput}`;

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
        body: JSON.stringify({ userInput: finalInput, mode, party1Email, party2Email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate contract.");

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
    // We use native browser print which allows the user to 'Save as PDF'.
    // This is far superior to html2canvas as it generates a vectorized, text-selectable PDF
    // rather than a rasterized image, which is essential for professional legal contracts.
    window.print();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as any },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      key={mode} 
      initial="hidden" animate="show" exit="exit" variants={cardVariants}
      className="relative mx-auto w-full max-w-[1500px] min-h-[100dvh] p-4 lg:p-8 pb-32 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 print:block print:p-0 print:h-auto"
    >
      {/* Dynamic Background Effects */}
      <div className="print:hidden">
        {mode === "pro" ? (
          <>
            <div className="pointer-events-none fixed -left-48 -top-48 z-0 h-96 w-96 rounded-full bg-[#3131c0]/10 blur-[100px]" />
            <div className="pointer-events-none fixed -bottom-48 -right-48 z-0 h-96 w-96 rounded-full bg-[#ffdadc]/5 blur-[100px]" />
          </>
        ) : (
          <>
            <div className="pointer-events-none fixed -left-20 top-20 z-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
            <div className="pointer-events-none fixed -right-20 bottom-40 z-0 h-[600px] w-[600px] rounded-full bg-rose-600/20 blur-[100px]" />
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
              <div className="absolute left-[10%] top-[15%] text-4xl opacity-40 animate-float-slow">🎭</div>
              <div className="absolute right-[15%] top-[25%] text-5xl opacity-30 animate-float-medium">🤝</div>
              <div className="absolute bottom-[20%] left-[20%] text-3xl opacity-50 animate-float-fast">✨</div>
            </div>
          </>
        )}
      </div>

      {/* Left Column (Boxes 1 & 2) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Box 1: Magic Header Bento (Top Left) */}
        <div className="rounded-3xl border border-white/5 bg-[#141415]/60 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all hover:border-white/20 print:hidden flex flex-col justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 space-y-4">
          {mode === "pro" ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-[#c4c7c8]">
                <span className="h-2 w-2 rounded-full bg-[#c0c1ff] animate-pulse" />
                PRO STUDIO v3.0
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">Drafting<br/>Workspace</h1>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 font-mono text-xs text-yellow-400">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                EXPERIMENTAL
              </div>
              <h1 className="bg-gradient-to-r from-yellow-300 via-rose-500 to-purple-500 bg-clip-text text-4xl lg:text-5xl font-black tracking-tight text-transparent">FunStudio<br/>Mode</h1>
            </>
          )}
        </div>
      </div>

      {/* Box 2: Magic Input Bento (Bottom Left) */}
      <div className="rounded-3xl border border-white/5 bg-[#141415]/60 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group transition-all hover:border-white/20 print:hidden flex flex-col flex-1">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full space-y-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1.5 text-left">
                <label className="text-xs font-medium text-gray-400">{mode === "pro" ? "First Party Name" : "Your Name"}</label>
                <input
                  className="w-full rounded-2xl border border-white/5 bg-black/40 px-4 py-3 text-base text-white placeholder-[#636565] focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none transition-all"
                  placeholder={mode === "pro" ? "e.g. Acme Corp" : "The hero"}
                  value={party1}
                  onChange={e => setParty1(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-1.5 text-left">
                <label className="text-xs font-medium text-gray-400">{mode === "pro" ? "Second Party Name" : "Their Name"}</label>
                <input
                  className="w-full rounded-2xl border border-white/5 bg-black/40 px-4 py-3 text-base text-white placeholder-[#636565] focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none transition-all"
                  placeholder={mode === "pro" ? "e.g. John Doe" : "The sidekick"}
                  value={party2}
                  onChange={e => setParty2(e.target.value)}
                />
              </div>
            </div>
            
            {mode === "pro" && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5 text-left">
                  <label className="text-xs font-medium text-gray-400">First Party Email</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-white/5 bg-black/40 px-4 py-3 text-base text-white placeholder-[#636565] focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none transition-all"
                    placeholder="acme@corp.com"
                    value={party1Email}
                    onChange={e => setParty1Email(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-left">
                  <label className="text-xs font-medium text-gray-400">Second Party Email</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-white/5 bg-black/40 px-4 py-3 text-base text-white placeholder-[#636565] focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none transition-all"
                    placeholder="john@doe.com"
                    value={party2Email}
                    onChange={e => setParty2Email(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 space-y-2">
            <label className="text-xs font-medium text-gray-400 text-left">{mode === "pro" ? "Contract Parameters" : "The Pact Terms"}</label>
            {mode === "pro" ? (
              <textarea
                className="flex-1 min-h-[150px] w-full resize-none rounded-2xl border border-white/5 bg-black/40 p-5 text-base text-[#e5e2e3] shadow-inner transition-all placeholder:text-[#636565] focus:border-indigo-500/50 focus:outline-none focus:ring-0"
                placeholder="Describe your deal parameters... (e.g. 'This is an NDA for 5 years regarding project Phoenix')"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            ) : (
              <div className="flex-1 min-h-[150px] w-full rounded-2xl border border-white/5 bg-black/40 p-5 shadow-inner overflow-y-auto">
                <div className="text-lg md:text-xl font-medium leading-relaxed text-white/90">
                  I, 
                  <span className="mx-2 inline-block min-w-[80px] border-b border-white/20 px-2 text-rose-400 font-bold bg-white/5 rounded-sm">{party1 || "___"}</span> 
                  am making a pact with 
                  <span className="mx-2 inline-block min-w-[80px] border-b border-white/20 px-2 text-indigo-300 font-bold bg-white/5 rounded-sm">{party2 || "___"}</span> 
                  to do 
                  <input 
                    required
                    className="mx-2 min-w-[120px] border-b-2 border-white/20 bg-transparent px-1 text-center text-rose-400 transition-all duration-300 placeholder:text-white/20 focus:scale-105 focus:border-yellow-400 focus:outline-none text-base" 
                    placeholder="the heroic act" 
                    value={funAction} onChange={e => setFunAction(e.target.value)}
                  />. 
                  If I fail, I will 
                  <input 
                    required
                    className="mx-2 min-w-[120px] border-b-2 border-white/20 bg-transparent px-1 text-center text-indigo-300 transition-all duration-300 placeholder:text-white/20 focus:scale-105 focus:border-yellow-400 focus:outline-none text-base" 
                    placeholder="the penalty" 
                    value={funPenalty} onChange={e => setFunPenalty(e.target.value)}
                  />.
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 shrink-0">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !party1.trim() || !party2.trim() || (mode === "pro" ? !userInput.trim() : (!funAction.trim() || !funPenalty.trim()))}
              className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xl font-semibold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none ${
                mode === "pro" 
                  ? "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]" 
                  : "bg-gradient-to-r from-yellow-500 via-rose-500 to-purple-600 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]"
              }`}
            >
              <span>{isLoading ? (mode === "pro" ? "Analyzing Draft..." : "Brewing Magic... 🔮") : (mode === "pro" ? "Generate Legal Contract" : "Seal The Pact 🤝")}</span>
              {mode === "pro" && <FileText className="h-6 w-6" />}
            </button>
            {error && <p className="mt-4 text-sm text-[#ffb4ab] text-center">{error}</p>}
          </div>
        </div>
      </div>
      </div> {/* End Left Column */}

      {/* Box 3: Magic Preview Bento (Right Side) */}
      <div className="lg:col-span-7 min-h-[600px] lg:min-h-0 lg:h-[calc(100vh-8rem)] rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl relative flex flex-col justify-center items-center overflow-hidden print:block print:w-full print:p-0 print:m-0 print:border-none print:bg-white group transition-all hover:border-white/20">
        <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 print:hidden" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.15] print:hidden" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        
        {/* A4 Document Container */}
        <div className={`relative z-10 flex aspect-[1/1.414] w-full max-w-[800px] shrink-0 flex-col justify-between overflow-hidden p-8 lg:p-14 my-8 print:p-0 print:aspect-auto print:shadow-none print:border-none print:w-full print:max-w-none print:h-auto print:my-0 ${mode === "fun" ? "border rounded-2xl border-rose-500/30 bg-[#1C1C1F] shadow-2xl before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,#f43f5e,#e879f9,#6366f1,#38bdf8,#f43f5e)] before:-z-10 before:opacity-10 before:blur-2xl print:bg-white" : "bg-white text-black shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-md"}`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent print:hidden" />
          
          {generatedMarkdown ? (
            <div className="flex h-full flex-col min-h-0 relative z-10 print:h-auto print:block">
              {mode === "fun" && (
                <div className="mb-6 text-center print:text-black">
                  <Sparkles className="mx-auto h-8 w-8 text-yellow-400 mb-2 animate-pulse-slow print:hidden" />
                  <h2 className="text-xl font-bold text-white print:text-black">Pact Sealed in Sparkles!</h2>
                </div>
              )}
              <div className="overflow-y-auto scrollbar-hide pb-24 flex-1 print:overflow-visible print:pb-0">
                <div
                  ref={previewRef}
                  className={`prose max-w-none ${
                    mode === "pro" 
                      ? "prose-headings:font-serif prose-headings:text-black font-serif text-[15px] leading-relaxed text-gray-900 prose-p:text-gray-800 prose-strong:text-black prose-strong:font-semibold prose-hr:border-gray-300 prose-hr:my-8 prose-li:marker:text-gray-800 prose-h1:text-center prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-8 prose-h2:text-lg prose-h2:font-semibold prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4 prose-p:my-3 prose-ul:my-3 prose-li:my-1" 
                      : "prose-invert print:prose-p:text-black font-sans text-base leading-loose prose-headings:text-rose-400 text-indigo-200 prose-strong:text-yellow-400"
                  }`}
                  dangerouslySetInnerHTML={{ __html: marked.parse(generatedMarkdown) as string }}
                />
              </div>

              {/* Sticky Action Footer */}
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-end bg-gradient-to-t from-white via-white to-transparent pt-12 pb-6 px-6 print:hidden gap-3">
                {savedHash ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-xs font-mono text-green-600 backdrop-blur-md">
                    <CheckCircle className="h-4 w-4" />
                    <span>Saved! Hash: {savedHash.substring(0, 8)}...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSaveToStudio}
                    disabled={isSaving}
                    className="rounded-2xl px-6 py-2.5 text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 bg-[#1C1C1F] text-white disabled:opacity-50 border border-white/10"
                  >
                    <Save className="h-4 w-4" /> {isSaving ? "Securing..." : "Save to Vault"}
                  </button>
                )}
                <button
                  onClick={handleDownloadPdf}
                  className={`rounded-2xl px-6 py-2.5 text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 ${mode === "fun" ? "bg-yellow-400 text-black" : "bg-indigo-600 text-white"}`}
                >
                  <FileText className="h-4 w-4" /> Export PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10 w-full h-full relative z-10 opacity-50 pointer-events-none">
              <div className="space-y-4">
                <div className={`h-2 w-24 rounded ${isLoading ? 'animate-shimmer bg-[linear-gradient(90deg,#e5e7eb_25%,#f3f4f6_50%,#e5e7eb_75%)] bg-[length:200%_100%]' : 'bg-gray-200'}`} />
                <div className={`h-6 w-48 rounded opacity-80 ${isLoading ? 'animate-shimmer bg-[linear-gradient(90deg,#e5e7eb_25%,#f3f4f6_50%,#e5e7eb_75%)] bg-[length:200%_100%]' : 'bg-gray-200'}`} />
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className={`h-3 w-full rounded ${isLoading ? 'animate-shimmer bg-[linear-gradient(90deg,#e5e7eb_25%,#f3f4f6_50%,#e5e7eb_75%)] bg-[length:200%_100%]' : 'bg-gray-200'}`} />
                    <div className={`h-3 w-full rounded ${isLoading ? 'animate-shimmer bg-[linear-gradient(90deg,#e5e7eb_25%,#f3f4f6_50%,#e5e7eb_75%)] bg-[length:200%_100%]' : 'bg-gray-200'}`} />
                    <div className={`h-3 w-3/4 rounded ${isLoading ? 'animate-shimmer bg-[linear-gradient(90deg,#e5e7eb_25%,#f3f4f6_50%,#e5e7eb_75%)] bg-[length:200%_100%]' : 'bg-gray-200'}`} />
                  </div>
                ))}
              </div>
              <footer className="absolute bottom-10 inset-x-10 flex items-center justify-between border-t border-gray-200 pt-8">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Digital Audit Trail: Pending</span>
                <Lock className="h-4 w-4 text-gray-300" />
              </footer>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
