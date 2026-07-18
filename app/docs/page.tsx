"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, Brain, PenTool, Key } from "lucide-react";

export default function DocsPage() {
  const steps = [
    {
      number: "1",
      title: "Prompt Intention",
      description: "Enter your deal terms in plain English or Hinglish into the Generation Studio.",
      icon: PenTool,
      color: "text-cyan-400",
    },
    {
      number: "2",
      title: "AI Execution",
      description: "Our custom-tuned Gemini LLM formats your intent into a strictly mapped, markdown-based micro-contract based on the Indian Contract Act structure.",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      number: "3",
      title: "Signature & Cryptography",
      description: "Counterparties sign via verified email access. The backend immediately generates a Level-3 HMAC-SHA256 hash using the document payload, emails, and timestamp, making tampering mathematically impossible.",
      icon: Key,
      color: "text-[#7C3AED]",
    },
    {
      number: "4",
      title: "Vault Storage",
      description: "The sealed PDF and corresponding verification hash are stored securely in your dashboard for lifetime retrieval.",
      icon: FileText,
      color: "text-[#06B6D4]",
    },
  ];

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200">
      <Navbar />

      <div className="flex-1 p-8 max-w-4xl mx-auto w-full pb-28 lg:pb-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            How PACTO Works
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            A secure, decentralized protocol for executing instant micro-agreements.
          </p>
        </motion.div>

        {/* Steps List */}
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 p-8 backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10">
                  <Icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase">
                    Step {step.number}
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {step.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
