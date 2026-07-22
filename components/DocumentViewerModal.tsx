"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Printer, Lock, ShieldCheck, CheckCircle, Clock, AlertCircle, Edit3, Save, RotateCcw } from "lucide-react";
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
  const [editContent, setEditContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (contract) {
        setEditContent(contract.content);
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

  const isApproved = contract.status === "approved" || (contract.party1ApprovedAt && contract.party2ApprovedAt);
  const userEmail = (currentUserEmail || "").toLowerCase();
  const p2Email = (contract.party2Email || "").toLowerCase();
  
  // Can current user approve this contract?
  const canUserApprove = !isApproved && (userEmail === p2Email || (!p2Email && userEmail !== (contract.party1Email || "").toLowerCase()));
  
  const editsRemaining = typeof contract.editsRemaining === "number" ? contract.editsRemaining : 3;
  const canEdit = !isApproved && editsRemaining > 0;

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

            {/* Left Sidebar: Metadata & Multi-Party Signature Status */}
            <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#141415] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto print:hidden">
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center justify-center rounded-2xl bg-white/5 p-3 mb-3 border border-white/5">
                    <FileText className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Contract Vault
                  </h2>
                  <p className="text-gray-400 text-xs">
                    Multi-Party Verification & Cryptographic Log
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
                        Approved & Sealed
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-sm font-semibold transition-all border border-white/10 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4 text-indigo-400" />
                    {isEditing ? "Cancel Editing" : `Edit / Recreate Draft (${editsRemaining}/3 left)`}
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

                {/* Export / Print PDF Button */}
                {isApproved ? (
                  <button
                    onClick={handlePrint}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 font-semibold text-black transition-all hover:bg-gray-200 active:scale-95 text-sm cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Export / Print PDF
                  </button>
                ) : (
                  <div className="text-center text-xs text-gray-500 italic">
                    🔒 PDF Export will unlock once all parties verify and seal the pact.
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Document Renderer / Editor Pane */}
            <div className="flex-1 overflow-y-auto bg-[#1C1C1F] p-6 lg:p-12 relative print:bg-white print:p-0 print:overflow-visible print:block">
              {/* Background Watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] print:hidden">
                <Lock className="h-96 w-96 text-white" />
              </div>

              {isEditing ? (
                /* ─── Document Edit Mode ─── */
                <div className="relative z-10 mx-auto max-w-3xl bg-[#141416] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Recreate / Edit Draft</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Free Plan: {editsRemaining} edits remaining before signature approval.
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                      MARKDOWN EDITOR
                    </span>
                  </div>

                  {editError && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                      {editError}
                    </div>
                  )}

                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={16}
                    className="w-full rounded-xl bg-black/60 border border-white/10 p-4 text-sm text-gray-200 font-mono outline-none focus:border-indigo-500 transition-all leading-relaxed"
                    placeholder="Enter revised contract markdown text..."
                  />

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSavingEdit}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      {isSavingEdit ? "Saving Revision..." : `Save Revision (${editsRemaining - 1} edits left)`}
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── Contract Paper Display Mode ─── */
                <div className="contract-print-node relative z-10 mx-auto max-w-3xl bg-white rounded-md shadow-2xl p-8 sm:p-12 lg:p-16 print:shadow-none print:p-8 print:max-w-none print:w-full print:bg-white text-black">
                  
                  {/* Print Header: Centered PACTO Logo */}
                  <div className="hidden print:flex flex-col items-center justify-center border-b border-gray-200 pb-6 mb-8 text-center">
                    <Logo mode="pro" className="text-3xl text-black tracking-[0.25em]" />
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-2">
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
                      prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5
                      prose-li:my-1.5 prose-li:text-[15px] prose-li:text-gray-800 prose-li:marker:text-black"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(contract.content) as string,
                    }}
                  />

                  {/* Digital Verification Footer */}
                  <div className="mt-16 border-t border-gray-300 pt-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500 font-mono">
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>{" "}
                        {isApproved ? "CRYPTOGRAPHICALLY SEALED" : "DRAFT / PENDING SIGNATURE"}
                      </div>
                      {isApproved && contract.hash && (
                        <div>
                          <span className="font-semibold text-gray-700">Hash:</span>{" "}
                          {contract.hash.substring(0, 20)}...
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-gray-700">Date:</span>{" "}
                        {new Date(contract.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        contractId={contract.id}
        contractTitle={`${contract.party1} & ${contract.party2}`}
        userEmail={currentUserEmail}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
}
