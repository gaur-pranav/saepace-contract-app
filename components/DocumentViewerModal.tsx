"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Printer, Lock, ShieldCheck, CheckCircle, Clock, AlertCircle, Edit3, Save, Sparkles, RefreshCw } from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { OtpVerificationModal } from "@/components/OtpVerificationModal";
import { Logo } from "@/components/Logo";

interface Contract {
  id: string;
  party1: string;
  party1Email?: string;
  party2: string;
  party2Email?: string;
  mode: string;
  hash: string;
  createdAt: string;
  content: string;
  status?: string;
  party1ApprovedAt?: string | null;
  party2ApprovedAt?: string | null;
  expirationDate?: string | null;
  editsRemaining?: number;
}

interface DocumentViewerModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  onRefresh?: () => void;
}

export function DocumentViewerModal({
  contract,
  isOpen,
  onClose,
  currentUserEmail,
  onRefresh,
}: DocumentViewerModalProps) {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (contract) {
        setEditContent(contract.content);
        setEditPrompt("");
        setIsEditing(false);
        setEditError(null);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, contract]);

  if (!isOpen || !contract) return null;

  const handlePrint = () => {
    window.print();
  };

  const isApproved = contract.status === "approved" || (Boolean(contract.hash) && Boolean(contract.party1ApprovedAt) && Boolean(contract.party2ApprovedAt));
  const userEmail = (currentUserEmail || "").toLowerCase();
  const p2Email = (contract.party2Email || "").toLowerCase();
  
  // Can current user approve this contract?
  const canUserApprove = !isApproved && (userEmail === p2Email || (!p2Email && userEmail !== (contract.party1Email || "").toLowerCase()));
  
  const editsRemaining = typeof contract.editsRemaining === "number" ? contract.editsRemaining : 3;
  const canEdit = !isApproved && editsRemaining > 0;

  const handleAiGenerateEdit = async () => {
    if (!editPrompt.trim()) {
      setEditError("Please enter your revision prompt describing the changes you want AI to make.");
      return;
    }

    setIsAiGenerating(true);
    setEditError(null);

    try {
      const promptInput = `EXISTING CONTRACT DOCUMENT:\n\n${contract.content}\n\nUSER REQUESTED REVISIONS & EDITS:\n${editPrompt}\n\nPlease regenerate the complete revised micro-contract incorporating the requested modifications cleanly in markdown.`;
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: promptInput,
          mode: contract.mode || "pro",
          party1Email: contract.party1Email,
          party2Email: contract.party2Email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI contract revision.");

      setEditContent(data.markdown);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      setEditError("Contract content cannot be empty.");
      return;
    }
    setIsSavingEdit(true);
    setEditError(null);

    try {
      const res = await fetch("/api/contracts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract.id,
          content: editContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update contract");

      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleOtpSuccess = () => {
    if (onRefresh) onRefresh();
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 print:static print:z-auto print:block print:bg-white print:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex w-full max-w-6xl flex-col lg:flex-row h-[92vh] lg:h-[85vh] rounded-3xl border border-white/10 bg-[#0A0A0B] shadow-2xl overflow-hidden print:w-full print:max-w-none print:h-auto print:rounded-none print:border-none print:bg-white print:shadow-none print:block"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-gray-400 hover:bg-white/20 hover:text-white transition-colors print:hidden"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Sidebar Pane: Metadata & Controls */}
            <div className="w-full lg:w-80 bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col justify-between shrink-0 print:hidden overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono font-bold text-cyan-400 mb-3">
                    <Logo mode={contract.mode === "fun" ? "fun" : "pro"} size="sm" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Contract Vault
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Multi-Party Verification &amp; Cryptographic Log
                  </p>
                </div>

                {/* Status & Free Edits Badge */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status:
                    </span>
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approved &amp; Sealed
                      </span>
                    ) : contract.status === "expired" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
                        <Clock className="h-3.5 w-3.5 animate-pulse" />
                        Pending Approval
                      </span>
                    )}
                  </div>

                  {!isApproved && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                      <Edit3 className="h-3 w-3" />
                      {editsRemaining} of 3 Free Edits Remaining
                    </div>
                  )}
                </div>

                {/* Parties Approval Breakdown */}
                <div className="space-y-3 rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                    Multi-Party Signatures
                  </span>
                  
                  {/* Party 1 */}
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white font-medium">{contract.party1}</p>
                      <p className="text-xs text-gray-500">{contract.party1Email || "Creator"}</p>
                    </div>
                    {contract.party1ApprovedAt ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Signed
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400">Pending</span>
                    )}
                  </div>

                  <div className="border-t border-white/5" />

                  {/* Party 2 */}
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white font-medium">{contract.party2}</p>
                      <p className="text-xs text-gray-500">{contract.party2Email || "Counterparty"}</p>
                    </div>
                    {contract.party2ApprovedAt ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Signed
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400">Pending</span>
                    )}
                  </div>
                </div>

                {/* Execution Hash Seal */}
                {isApproved && contract.hash && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Cryptographic Hash Seal
                      </span>
                    </div>
                    <p className="font-mono text-xs text-emerald-400/80 break-all leading-relaxed">
                      {contract.hash}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                {canEdit && (
                  <button
                    onClick={() => {
                      setEditContent(contract.content);
                      setIsEditing(!isEditing);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-4 py-3 text-sm font-semibold transition-all border border-indigo-500/20 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    {isEditing ? "Cancel AI Editing" : `AI Prompt Edit (${editsRemaining}/3 left)`}
                  </button>
                )}

                {canUserApprove && !isEditing && (
                  <button
                    onClick={() => setIsOtpOpen(true)}
                    className="btn-glow-cyan flex w-full items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-4 py-3.5 text-sm font-semibold text-black hover:bg-[#22d3ee] transition-all cursor-pointer"
                  >
                    Approve Deal (Sign via OTP)
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                )}

                {/* Export / Print PDF Button — ONLY APPEARS WHEN SEALED & HASHED */}
                {isApproved && contract.hash ? (
                  <button
                    onClick={handlePrint}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 font-semibold text-black transition-all hover:bg-gray-200 active:scale-95 text-sm cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Export / Print PDF
                  </button>
                ) : (
                  <div className="text-center text-xs text-gray-500 italic p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    🔒 PDF Export will unlock once all parties verify and seal the pact.
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Document Renderer / AI Editor Pane */}
            <div className="flex-1 overflow-y-auto bg-[#1C1C1F] p-6 lg:p-12 relative print:bg-white print:p-0 print:overflow-visible print:block">
              {/* Background Watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] print:hidden">
                <Lock className="h-96 w-96 text-white" />
              </div>

              {isEditing ? (
                /* ─── AI Prompt Contract Editor Mode ─── */
                <div className="relative z-10 mx-auto max-w-3xl bg-[#141416] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                        AI Contract Prompt Editor
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Describe the changes you want AI to make to this pact ({editsRemaining} edits left).
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                      AI REVISION STUDIO
                    </span>
                  </div>

                  {editError && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                      {editError}
                    </div>
                  )}

                  {/* AI Prompt Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                      1. Describe Your Requested Changes for AI:
                    </label>
                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl bg-black/60 border border-white/10 p-4 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-all leading-relaxed"
                      placeholder="e.g. Change payment terms to 50% upfront, extend project deadline to 14 days, and add a 30-day warranty clause..."
                    />
                    <button
                      onClick={handleAiGenerateEdit}
                      disabled={isAiGenerating || !editPrompt.trim()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isAiGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          AI is regenerating contract clauses...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Revised Contract via AI
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Generated Markdown Preview */}
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                      2. Preview AI Revised Document:
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={10}
                      className="w-full rounded-xl bg-black/80 border border-white/10 p-4 text-xs text-gray-300 font-mono outline-none focus:border-cyan-500 transition-all leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[11px] text-amber-400">
                      ⚠️ Saving will reset approval status requiring counterparty re-verification.
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSavingEdit || !editContent.trim()}
                        className="btn-glow-cyan flex items-center gap-2 rounded-xl bg-[#06B6D4] text-black px-6 py-2.5 text-xs font-bold hover:bg-[#22d3ee] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        {isSavingEdit ? "Saving..." : "Sign & Save to Vault"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── Contract Paper Display Mode ─── */
                <div className="contract-print-node relative z-10 mx-auto max-w-3xl bg-white rounded-md shadow-2xl p-8 sm:p-12 lg:p-16 print:shadow-none print:p-8 print:max-w-none print:w-full print:bg-white text-black">
                  
                  {/* Print Header: Centered PACTo Light Mode Logo */}
                  <div className="hidden print:flex flex-col items-center justify-center border-b border-gray-200 pb-6 mb-8 text-center">
                    <Logo variant="light" size="lg" />
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-2">
                      Cryptographic Micro-Contract Protocol
                    </p>
                  </div>

                  {/* Contract Markdown Content with High-Fidelity Legal Typography */}
                  <div
                    className="prose max-w-none 
                      prose-h1:font-bold prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:uppercase prose-h1:tracking-tight prose-h1:text-black prose-h1:border-b-2 prose-h1:border-black prose-h1:pb-4 prose-h1:mb-8 prose-h1:text-center
                      prose-h2:font-semibold prose-h2:text-lg prose-h2:uppercase prose-h2:tracking-wide prose-h2:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4
                      prose-h3:font-semibold prose-h3:text-base prose-h3:text-gray-900 prose-h3:mt-6 prose-h3:mb-2
                      prose-p:text-gray-800 prose-p:text-[15px] prose-p:leading-relaxed prose-p:my-3
                      prose-strong:font-bold prose-strong:text-black
                      prose-u:underline prose-u:underline-offset-4 prose-u:decoration-indigo-500/40
                      prose-hr:border-gray-300 prose-hr:my-8
                      prose-li:marker:text-black prose-li:text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(contract.content || "") as string,
                    }}
                  />

                  {/* Sealed Cryptographic Badge inside Paper */}
                  {isApproved && contract.hash && (
                    <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-600">
                      <div>
                        <p className="font-bold text-black uppercase tracking-wider">
                          Cryptographically Sealed Document
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {contract.mode === "fun" ? "Instant FUN Mode Cryptographic Seal" : "Level-3 HMAC-SHA256 Multi-Party Verification Hash"}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-300 text-center sm:text-right w-full sm:w-auto">
                        <p className="font-bold text-gray-900 text-[11px]">
                          {contract.hash.substring(0, 16)}...{contract.hash.substring(contract.hash.length - 8)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Official PACTo Brand Seal Image at Bottom of Paper */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center justify-center text-center">
                    <img
                      src="https://meytgtlepyocsfhknmjq.supabase.co/storage/v1/object/public/PACTo-asset-folder/light-mode-logo.png"
                      alt="PACTo Official Seal"
                      className="h-10 w-auto object-contain mx-auto opacity-90 filter drop-shadow-sm"
                    />
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-2">
                      Managed by SAE PACE Cryptographic Protocol
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        contractId={contract.id}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
}
