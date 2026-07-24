"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Share2,
  Zap,
  Lock,
  FileCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Key,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const guideSteps = [
    {
      step: "01",
      title: "Choose Studio Mode",
      desc: "Select PRO Studio for formal freelancing, consulting & client agreements, or FUN Mode for casual bets, social promises & friendly pacts.",
    },
    {
      step: "02",
      title: "Input Deal Parameters",
      desc: "Fill in First & Second Party names and authorized email addresses. Use the 1-click 'Auto-Fill Details' button to populate your saved profile automatically.",
    },
    {
      step: "03",
      title: "Review & Collaborate",
      desc: "Your counterparty receives an instant notification under 'Pending Review' on their Dashboard. Both parties have a 3-edit allowance to refine deal clauses before final signing.",
    },
    {
      step: "04",
      title: "Cryptographic OTP Seal",
      desc: "Click 'Approve Deal' to receive a secure 6-digit OTP code in your email inbox. Once verified by both parties, PACTO generates an immutable HMAC-SHA256 cryptographic seal.",
    },
  ];

  const sections = [
    {
      title: "1. Core Purpose & Usecase",
      icon: Zap,
      color: "text-cyan-400",
      content:
        "PACTO by SAE PACE bridges the gap between casual verbal agreements and formal legal contracts. Designed for freelancers, creators, agencies, and consultants, PACTO converts plain-text deal parameters into formatted, legally structured micro-contracts in under 30 seconds.",
    },
    {
      title: "2. Effortless Sharing & Dual Counterparty Review",
      icon: Share2,
      color: "text-purple-400",
      content:
        "Sharing agreements with counterparties is seamless. Simply enter the counterparty's email address during creation. They receive instant access on their Dashboard under 'Pending Review' to inspect, edit, or approve the deal terms before sealing.",
    },
    {
      title: "3. Cryptographic Security & Immutability",
      icon: ShieldCheck,
      color: "text-emerald-400",
      content:
        "Once both parties verify approval using a 6-digit OTP security code sent to their inbox, PACTO generates a Level-3 HMAC-SHA256 cryptographic signature. This seal locks the document content, party emails, and exact timestamps into an immutable hash payload.",
    },
    {
      title: "4. Verification & PDF Export",
      icon: FileCheck,
      color: "text-blue-400",
      content:
        "Sealed contracts can be exported as high-resolution PDFs embedded with cryptographic verification codes. Anyone holding the PDF can verify its authenticity without third-party escrow or legal overhead.",
    },
  ];

  const highlights = [
    "30-Second AI Micro-Contract Drafting",
    "Multi-Party Real-Time Review & 3-Edit Allowance",
    "2-Step Email OTP Signature Verification",
    "HMAC-SHA256 Triple-Timestamp Cryptographic Seals",
    "Permanent Cloud Vault & Printable PDF Exports",
  ];

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200">
      <Navbar />

      <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full pb-28 lg:pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-bold text-cyan-400 mb-4">
            <Lock className="h-3.5 w-3.5" /> PACTO Protocol Guide & Documentation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Security, Ease of Use & Sharing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Welcome to PACTO by SAE PACE. Everything you need to know about creating, sharing, and cryptographically sealing micro-contracts.
          </p>
        </motion.div>

        {/* Quick Start How-To Steps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-14 p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                How to Create & Seal a Pact (Step-by-Step)
              </h2>
              <p className="text-xs text-gray-400">Quick guide for new users</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guideSteps.map((s) => (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                    STEP {s.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/create">
              <button className="btn-glow-cyan inline-flex items-center gap-2 rounded-full bg-[#06B6D4] px-6 py-2.5 text-xs font-bold text-black hover:bg-[#22d3ee] transition-all cursor-pointer">
                Create Your First Pact Now
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/10"
        >
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-300">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Core Sections */}
        <div className="space-y-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className="p-6 sm:p-8 backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center shrink-0 w-11 h-11 rounded-2xl bg-white/5 border border-white/10">
                    <Icon className={`h-5 w-5 ${sec.color}`} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                  {sec.content}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
