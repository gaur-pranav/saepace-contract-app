"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Scale, ShieldAlert, Sparkles, FileWarning, CheckCircle } from "lucide-react";

export default function TermsPage() {
  const termsList = [
    {
      title: "1. SOFTWARE PROTOCOL (NOT A LAW FIRM)",
      description: "PACTO by SAE PACE is a software formatting engine and cryptographic logging protocol. We are not a law firm, nor do we provide legal representation, escrow arbitration, or legal advice. Users execute agreements independently.",
      icon: Scale,
      color: "text-cyan-400",
    },
    {
      title: "2. ELECTRONIC SIGNATURE & BINDING INTENT",
      description: "By completing 2-Step OTP email verification on a pact, both parties explicitly acknowledge their mutual intent to enter into a contract. Document hashing records the exact payload and email access timestamps.",
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      title: "3. AI GENERATION & USER PROOFREADING",
      description: "Contracts are generated using artificial intelligence (Gemini LLM). Users hold sole responsibility for inspecting and editing the draft preview prior to sealing the agreement. PACTO is not liable for omitted clauses or user typos.",
      icon: ShieldAlert,
      color: "text-amber-400",
    },
    {
      title: "4. CRYPTOGRAPHIC PROOF & INTEGRITY",
      description: "PACTO guarantees payload immutability through Level-3 HMAC-SHA256 hashing. Once signed by both parties, the document is locked and cannot be altered by either party.",
      icon: FileWarning,
      color: "text-purple-400",
    },
    {
      title: "5. 'FUN MODE' ENVIRONMENT CLAUSE",
      description: "Contracts generated under the 'FUN MODE' setting are strictly intended for entertainment/parody purposes and hold zero legally binding force.",
      icon: Sparkles,
      color: "text-cyan-400",
    },
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
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service & Rules
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            SAE PACE / PACTO platform terms of use, electronic signature rules, and legal compliance disclaimers.
          </p>
        </motion.div>

        {/* Terms Cards */}
        <div className="space-y-6">
          {termsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 backdrop-blur-xl bg-white/[0.01] border border-white/5 rounded-3xl"
              >
                <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                    {item.description}
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
