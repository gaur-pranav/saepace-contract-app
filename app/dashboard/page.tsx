"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Clock,
  CheckCircle,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pill } from "@/components/ui/Pill";
import { DocumentViewerModal } from "@/components/DocumentViewerModal";

interface Contract {
  id: string;
  party1: string;
  party2: string;
  mode: string;
  hash: string;
  createdAt: string;
  content: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch("/api/contracts/list");
        if (res.status === 401) {
          router.push("/auth");
          return;
        }
        if (!res.ok) throw new Error("Failed to load contracts");

        const data = await res.json();
        setContracts(data.contracts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [router]);

  // Derive metrics from contracts
  const totalPacts = contracts.length;
  const sealedCount = contracts.filter(
    (c) => c.hash && c.hash.length > 0
  ).length;
  const pendingCount = totalPacts - sealedCount;

  const metrics = [
    {
      label: "Total Pacts",
      value: totalPacts,
      icon: FileText,
      color: "text-white",
    },
    {
      label: "Sealed",
      value: sealedCount,
      icon: Shield,
      color: "text-emerald-400",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-400",
    },
  ];

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200">
      <Navbar />

      <DocumentViewerModal
        contract={selectedContract}
        isOpen={!!selectedContract}
        onClose={() => setSelectedContract(null)}
      />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Document Vault
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your secure digital contracts, cryptographically verified.
          </p>
        </motion.div>

        {/* ─── Metrics Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <p
                  className={`text-5xl font-black tracking-tight ${metric.color}`}
                >
                  {isLoading ? "—" : metric.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── The Vault (List View) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/10 rounded-2xl bg-[#0c0c0c] overflow-hidden"
        >
          {/* List Header */}
          <div className="flex items-center px-6 py-4 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span className="flex-1">Document</span>
            <span className="w-32 hidden md:block">Date</span>
            <span className="w-48 hidden lg:block">Client</span>
            <span className="w-24 text-center">Type</span>
            <span className="w-28 text-center">Status</span>
            <span className="w-20 text-right">Action</span>
          </div>

          {/* List Body */}
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 text-sm">{error}</div>
          ) : contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-12 w-12 text-white/10 mb-4" />
              <h2 className="text-lg font-semibold text-white mb-1">
                No Contracts Yet
              </h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Draft your first contract to populate the vault.
              </p>
              <button
                onClick={() => router.push("/create")}
                className="rounded-xl bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Create First Pact
              </button>
            </div>
          ) : (
            <div>
              {contracts.map((contract, i) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Document Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {contract.party1} & {contract.party2}
                    </p>
                    <div className="flex items-center gap-2 mt-1 md:hidden">
                      <span className="text-[10px] text-gray-500">
                        {new Date(contract.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="w-32 hidden md:block text-xs text-gray-500">
                    {new Date(contract.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  {/* Client Email */}
                  <span className="w-48 hidden lg:block text-xs text-gray-500 truncate">
                    {contract.party2}
                  </span>

                  {/* Type Pill */}
                  <div className="w-24 flex justify-center">
                    <Pill
                      type={
                        contract.mode === "pro" || contract.mode === "fun"
                          ? contract.mode
                          : "pro"
                      }
                    />
                  </div>

                  {/* Status Pill */}
                  <div className="w-28 flex justify-center">
                    <Pill
                      status={
                        contract.hash && contract.hash.length > 0
                          ? "approved"
                          : "pending"
                      }
                    />
                  </div>

                  {/* Action */}
                  <div className="w-20 flex justify-end">
                    <button
                      onClick={() => setSelectedContract(contract)}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
