"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Scale, ShieldAlert, Sparkles, FileWarning } from "lucide-react";

export default function TermsPage() {
  const disclaimers = [
    {
      title: "NOT A LAW FIRM",
      description: "Pacto is an AI formatting and cryptographic logging software. We do not provide legal advice, arbitration, or debt collection services.",
      icon: Scale,
      color: "text-cyan-400",
    },
    {
      title: "LLM GENERATION LIABILITY",
      description: "Contracts are drafted using Generative AI. Users bear absolute sole responsibility for proofreading the AI-generated preview prior to sealing the pact with counterparties. We are not liable for hallucinations or omitted clauses.",
      icon: ShieldAlert,
      color: "text-yellow-500",
    },
    {
      title: "ENFORCEABILITY",
      description: "Pacto guarantees text immutability and identity logging (IP/Email tracking). Enforcement of the generated document relies upon your local jurisdictions and courts (e.g., MSME Samadhaan in India).",
      icon: FileWarning,
      color: "text-purple-400",
    },
    {
      title: "'FUN MODE' CLAUSE",
      description: "Pacts generated under the 'Fun Mode' environment are strictly classified as parody/entertainment and hold zero legally binding validity.",
      icon: Sparkles,
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
            Legal Disclaimers
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            SAE PACE / PACTO platform terms of use and compliance notices.
          </p>
        </motion.div>

        {/* Disclaimers List */}
        <div className="space-y-8 prose prose-invert max-w-none">
          {disclaimers.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 p-8 backdrop-blur-xl bg-white/[0.01] border border-white/5 rounded-3xl"
              >
                <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white tracking-tight m-0">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm m-0">
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
