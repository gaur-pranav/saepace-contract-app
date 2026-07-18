"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  const [inputVal, setInputVal] = useState("");
  const router = useRouter();

  const editorialFeatures = [
    {
      number: "01",
      title: "Casual agreements, formalized.",
      desc: "Draft micro-contracts in plain, casual language. PACTO formats your intentions into a clean, structured agreement.",
    },
    {
      number: "02",
      title: "Mathematically sealed.",
      desc: "Instant HMAC-SHA256 signature verification makes document tampering mathematically impossible.",
    },
    {
      number: "03",
      title: "Digital Vault.",
      desc: "A clean, permanent archive of all signed and pending agreements, hosted securely for instant retrieval.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    router.push(`/create?prompt=${encodeURIComponent(inputVal)}`);
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-[#000000] text-white overflow-x-hidden font-sans">
      
      {/* ─── 1. FLOATING NAVIGATION BAR (SPECIFIC TO LANDING PAGE) ─── */}
      <nav className="absolute top-6 right-6 md:right-12 z-50 flex items-center gap-8 backdrop-blur-md bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
        <Link 
          href="/docs" 
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Documentation
        </Link>
        <Link href="/auth">
          <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer">
            Sign In
          </button>
        </Link>
      </nav>

      {/* ─── 2. GLOBAL HERO LAYOUT (SIDE-BY-SIDE SPLIT) ─── */}
      <section className="min-h-screen w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 pt-32 lg:pt-24 pb-12 relative z-10">
        
        {/* LEFT COLUMN: VISUAL BRAND NODE */}
        <div className="w-full lg:w-[45%] flex items-center justify-center relative">
          <div className="relative w-[340px] h-[340px] lg:w-[450px] lg:h-[450px] bg-[#020202] shadow-[0_0_100px_inset_rgba(124,58,237,0.1)] rounded-full border border-white/5 flex items-center justify-center">
            
            {/* Layer 1: Orbiting Ring SVG */}
            <div className="absolute inset-4 pointer-events-none">
              <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              >
                <path
                  id="circlePath"
                  d="M 50,11 A 39,39 0 1,1 49.9,11 Z"
                  fill="none"
                />
                <text className="fill-gray-600 opacity-40 text-[5.8px] font-mono uppercase tracking-[0.18em] font-bold">
                  <textPath href="#circlePath">
                    SAE PACE • CREATE • BIND • PROTECT • SAE PACE • CREATE • BIND • PROTECT •
                  </textPath>
                </text>
              </motion.svg>
            </div>

            {/* Layer 2: Central Identity (PACTO Logo floating) */}
            <motion.div 
              animate={{ y: [-6, 6, -6] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute z-20 flex items-center justify-center pointer-events-none"
            >
              <Logo mode="pro" className="text-3xl lg:text-4xl leading-none tracking-[0.25em] translate-x-[0.12em]" />
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONVERSION & TYPOGRAPHY */}
        <div className="w-full lg:w-[55%] flex flex-col items-start justify-center text-left">
          <h1 className="text-[3.5rem] lg:text-[5rem] leading-[1.05] font-bold tracking-tight text-white mb-6">
            Handshakes break.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Pacts bind.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
            The cryptographic protocol for everyday trust. Turn casual deals into mathematically sealed micro-contracts in 30 seconds.
          </p>

          {/* Interactive Prompt Box */}
          <div className="w-full max-w-lg relative">
            <form 
              onSubmit={handleSubmit}
              className="w-full h-16 md:h-[72px] rounded-full bg-white/5 border border-white/20 backdrop-blur-2xl pl-6 pr-2 flex items-center shadow-lg transition focus-within:border-cyan-400 focus-within:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
            >
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="E.g., Website design for Rohan, ₹50k, 50% upfront..."
                className="w-full h-full bg-transparent outline-none text-white text-base md:text-lg placeholder:text-gray-500 mr-4"
              />
              <button 
                type="submit"
                className="bg-white hover:bg-gray-200 text-black px-6 py-3 h-12 md:h-14 rounded-full font-bold ml-4 hover:scale-[1.03] transition-transform flex items-center justify-center flex-shrink-0 text-sm md:text-base cursor-pointer"
              >
                Draft ➔
              </button>
            </form>
            
            <p className="mt-4 text-sm text-gray-500 font-medium pl-2">
              100% free to draft. No credit card required. ✨
            </p>
          </div>
        </div>

      </section>

      {/* ─── 3. EDITORIAL FEATURES GRID ─── */}
      <section className="relative z-20 max-w-7xl mx-auto px-8 py-24 border-t border-white/5 bg-[#000000]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {editorialFeatures.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="space-y-4"
            >
              <div className="text-sm font-mono text-gray-600 border-b border-white/5 pb-2">
                {feat.number}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight font-[var(--font-space-grotesk)]">
                {feat.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
