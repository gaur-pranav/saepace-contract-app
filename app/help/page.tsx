"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  ShieldCheck,
  Lock,
  ChevronDown,
  Sparkles,
  FileText,
  Key,
  UserCheck,
  Send,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface FaqItem {
  question: string;
  category: "General" | "Security & Immutability" | "Signatures & OTP" | "Editing & Export";
  answer: string;
}

const faqs: FaqItem[] = [
  {
    category: "General",
    question: "What is PACTo and how does it work?",
    answer:
      "PACTo by SAE PACE is a cryptographic micro-contract platform designed for freelancers, creators, agencies, and friends. It converts casual deal parameters into structured, legally clear micro-contracts in under 30 seconds using AI-powered drafting.",
  },
  {
    category: "General",
    question: "What is the difference between PRO Mode and FUN Mode?",
    answer:
      "PRO Mode is for professional agreements, requiring dual-party email verification via 6-digit OTP and producing formal legal terms under the Indian Contract Act framework. FUN Mode is designed for casual agreements (wagers, commitments, favors), instant cryptographic sealing, and immediate PDF export without requiring counterparty OTP verification.",
  },
  {
    category: "Security & Immutability",
    question: "How does Level-3 HMAC-SHA256 Cryptographic Immutability work?",
    answer:
      "Once both parties verify an agreement, PACTo generates a unique 64-character Level-3 HMAC-SHA256 cryptographic seal. This hash combines the exact document text, party email identities, and verification timestamps. If even a single character in the document is altered after sealing, the cryptographic hash breaks, ensuring absolute tamper-proof immutability.",
  },
  {
    category: "Signatures & OTP",
    question: "How do counterparty OTP signatures work?",
    answer:
      "When a contract is created in PRO Mode, PACTo dispatches a secure 6-digit One-Time Password (OTP) to the party's email inbox. Entering this OTP serves as a legally binding electronic signature and logs an immutable timestamped verification record.",
  },
  {
    category: "Signatures & OTP",
    question: "What happens if the counterparty does not have a PACTo account yet?",
    answer:
      "No problem! When you create a PRO Mode pact with an unregistered counterparty email, PACTo automatically sends a automated onboarding invitation email to their inbox with a direct link to sign up, review the agreement, and sign.",
  },
  {
    category: "Editing & Export",
    question: "Can a contract be edited after creation?",
    answer:
      "Before a contract is fully sealed, parties can use the AI Prompt Revision Studio to request changes (up to 3 free revisions). Whenever an edit is made, all previous approvals reset to pending so both parties must review and re-sign the updated terms. Once a pact is fully sealed with a cryptographic hash, it is permanently locked and cannot be edited.",
  },
  {
    category: "Editing & Export",
    question: "When can I download or export the contract as a PDF?",
    answer:
      "In PRO Mode, PDF Export unlocks immediately once all parties verify and seal the pact with a cryptographic hash. In FUN Mode, PDF Export is unlocked instantly upon saving.",
  },
  {
    category: "General",
    question: "How can I contact PACTo customer support?",
    answer:
      "You can reach out directly to our team by emailing sae.pace.official@gmail.com. We respond to all queries, contract verifications, and technical support requests within 24 to 48 hours.",
  },
];

export default function HelpPage() {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "General", "Security & Immutability", "Signatures & OTP", "Editing & Export"];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("sae.pace.official@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFaqs =
    selectedCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <main className="relative flex min-h-screen flex-col bg-[#050505] text-gray-200 overflow-hidden">
      <Navbar />

      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#7C3AED]/15 via-[#06B6D4]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 lg:py-16 relative z-10">
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <HelpCircle className="h-4 w-4" />
            HELP CENTER & SUPPORT
          </motion.div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">help you?</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed">
            Find answers to frequently asked questions about cryptographic sealing, deal parameters, OTP verification, and direct support.
          </p>
        </div>

        {/* Contact Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121216] via-[#0b0b0d] to-[#15151c] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#06B6D4]/10 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                <Mail className="h-3.5 w-3.5" /> Direct Support Email
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Have a specific question or issue?
              </h2>
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                Our support team is available to assist you with contract verifications, account setup, or technical assistance.
              </p>
            </div>

            {/* Email Contact Action Box */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 bg-black/40 border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="flex items-center gap-2 px-3 text-sm font-mono text-cyan-300 font-bold select-all">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                sae.pace.official@gmail.com
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer border border-white/5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Email
                    </>
                  )}
                </button>
                <a
                  href="mailto:sae.pace.official@gmail.com"
                  className="flex-1 sm:flex-none btn-glow-cyan flex items-center justify-center gap-2 rounded-xl bg-[#06B6D4] hover:bg-[#22d3ee] px-5 py-2.5 text-xs font-bold text-black transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Everything you need to know about using PACTo micro-contracts.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "bg-white/[0.03] text-gray-400 border border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? "bg-[#121215] border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                      : "bg-[#0b0b0d] border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <span className="font-semibold text-white text-base sm:text-lg flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#06B6D4] shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-cyan-400" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Documentation Link CTA */}
        <div className="mt-16 text-center rounded-3xl border border-white/5 bg-[#0a0a0c] p-8 sm:p-12">
          <BookOpen className="mx-auto h-10 w-10 text-cyan-400 mb-4 animate-pulse-slow" />
          <h3 className="text-xl font-bold text-white mb-2">
            Want to dive deeper into protocol rules?
          </h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">
            Read our step-by-step protocol documentation guide covering verification hashes, legal terms, and contract management.
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 text-sm transition-all border border-white/10 cursor-pointer"
          >
            Visit Documentation Guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
