"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Printer, Lock, ShieldCheck } from "lucide-react";
import { marked } from "marked";
import { useEffect } from "react";

interface Contract {
  id: string;
  party1: string;
  party2: string;
  mode: string;
  hash: string;
  createdAt: string;
  content: string;
}

interface DocumentViewerModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewerModal({ contract, isOpen, onClose }: DocumentViewerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !contract) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center print:static print:z-auto print:block print:bg-white">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm print:hidden"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative flex w-full max-w-6xl flex-col lg:flex-row h-[90vh] lg:h-[85vh] rounded-3xl border border-white/10 bg-[#0A0A0B] shadow-2xl overflow-hidden print:w-full print:max-w-none print:h-auto print:rounded-none print:border-none print:bg-white print:shadow-none print:block"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-gray-400 hover:bg-white/20 hover:text-white transition-colors print:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Sidebar: Metadata & Actions */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#141415] p-8 flex flex-col print:hidden">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 mb-4 border border-white/5">
                <FileText className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Digital Contract</h2>
              <p className="text-gray-400 text-sm">Secured in your Personal Studio Vault.</p>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parties Involved</label>
                <div className="mt-2 text-white font-medium text-lg">{contract.party1}</div>
                <div className="text-white/40 text-sm italic my-1">and</div>
                <div className="text-white font-medium text-lg">{contract.party2}</div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Execution Date</label>
                <div className="mt-1 text-white">{new Date(contract.createdAt).toLocaleString()}</div>
              </div>

              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 relative overflow-visible group">
                <div className="absolute inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-green-400">Cryptographic Signature</span>
                    
                    {/* Tooltip Wrapper */}
                    <div className="relative group/tooltip cursor-help ml-auto">
                      <div className="rounded-full border border-white/20 text-white/40 h-4 w-4 flex items-center justify-center text-[10px] font-bold hover:text-white hover:border-white transition-colors">?</div>
                      <div className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-lg bg-[#1C1C1F] border border-white/10 shadow-2xl text-xs text-gray-300 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                        <strong className="text-white block mb-1">HMAC-SHA256 Encryption</strong>
                        This hash mathematically seals the document. It was generated using the precise document text, execution timestamp, and your session. If a single comma is altered, the entire hash breaks.
                      </div>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-green-500/70 break-all leading-relaxed">
                    {contract.hash}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button
                onClick={handlePrint}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-4 font-semibold text-black transition-all hover:bg-gray-200 active:scale-95"
              >
                <Printer className="h-5 w-5" />
                Export / Print PDF
              </button>
            </div>
          </div>

          {/* Right Pane: The Document Itself */}
          <div className="flex-1 overflow-y-auto bg-[#1C1C1F] p-6 lg:p-12 relative print:bg-white print:p-0 print:overflow-visible print:block">
            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.05]">
              <Lock className="h-96 w-96 text-white print:text-black" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl bg-white rounded-md shadow-2xl p-10 lg:p-16 print:shadow-none print:p-0 print:max-w-none">
              <div
                className={`prose max-w-none ${
                  contract.mode === "pro" 
                    ? "prose-headings:font-serif prose-headings:text-black font-serif text-[15px] leading-relaxed text-gray-900 prose-p:text-gray-800 prose-strong:text-black prose-strong:font-semibold prose-hr:border-gray-300 prose-hr:my-8 prose-li:marker:text-gray-800 prose-h1:text-center prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-8 prose-h2:text-xl prose-h2:font-semibold prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-10 prose-h2:mb-4 prose-p:my-3 prose-ul:my-3 prose-li:my-1" 
                    : "prose-invert print:prose-p:text-black font-sans text-base leading-loose prose-headings:text-rose-400 text-black prose-strong:text-indigo-600 print:text-black print:prose-strong:text-black print:prose-headings:text-black"
                }`}
                dangerouslySetInnerHTML={{ __html: marked.parse(contract.content) as string }}
              />

              {/* Digital Footer for PDF Export */}
              <div className="mt-20 border-t border-gray-300 pt-8 print:block">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <div>Document Hash: {contract.hash.substring(0, 16)}...</div>
                  <div>Timestamp: {new Date(contract.createdAt).toISOString()}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
