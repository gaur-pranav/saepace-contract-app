"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Shield,
  Clock,
  CheckCircle,
  ExternalLink,
  Lock,
  Bell,
  AlertCircle,
  ShieldCheck,
  Check,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pill } from "@/components/ui/Pill";
import { DocumentViewerModal } from "@/components/DocumentViewerModal";

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
  status?: "pending_review" | "pending_approval" | "approved" | "expired";
  party1ApprovedAt?: string | null;
  party2ApprovedAt?: string | null;
  expirationDate?: string | null;
}

type FilterTab = "all" | "pending_review" | "pending_approval" | "approved" | "expired";

export default function DashboardPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const fetchContracts = async () => {
    try {
      const res = await fetch("/api/contracts/list");
      if (res.status === 401) {
        router.push("/auth");
        return;
      }
      if (!res.ok) throw new Error("Failed to load contracts");

      const data = await res.json();
      setContracts(data.contracts || []);
      setUserEmail(data.userEmail || "");
      
      // Update selected contract if open
      if (selectedContract) {
        const updated = (data.contracts || []).find((c: Contract) => c.id === selectedContract.id);
        if (updated) setSelectedContract(updated);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [router]);

  // Derived Categorizations
  const pendingReviewContracts = contracts.filter((c) => c.status === "pending_review");
  const pendingApprovalContracts = contracts.filter((c) => c.status === "pending_approval");
  const approvedContracts = contracts.filter((c) => c.status === "approved");
  const expiredContracts = contracts.filter((c) => c.status === "expired");

  const filteredContracts = contracts.filter((c) => {
    if (activeTab === "pending_review") return c.status === "pending_review";
    if (activeTab === "pending_approval") return c.status === "pending_approval";
    if (activeTab === "approved") return c.status === "approved";
    if (activeTab === "expired") return c.status === "expired";
    return true; // "all"
  });

  const metrics = [
    {
      label: "Total Pacts",
      value: contracts.length,
      icon: FileText,
      color: "text-white",
    },
    {
      label: "Pending Review",
      value: pendingReviewContracts.length,
      icon: Clock,
      color: "text-amber-400",
    },
    {
      label: "Sealed & Approved",
      value: approvedContracts.length,
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
  ];

  // Notifications alerts list
  const notificationItems = [
    ...pendingReviewContracts.map((c) => ({
      id: `review-${c.id}`,
      contract: c,
      title: `Action Needed: Pact Review`,
      message: `${c.party1} added you to a new micro-contract. Verify & sign with OTP.`,
      time: c.createdAt,
      type: "action" as const,
    })),
    ...approvedContracts.slice(0, 3).map((c) => ({
      id: `sealed-${c.id}`,
      contract: c,
      title: `Pact Cryptographically Sealed`,
      message: `Agreement between ${c.party1} & ${c.party2} is fully approved.`,
      time: c.createdAt,
      type: "info" as const,
    })),
  ];

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200">
      <Navbar />

      <DocumentViewerModal
        contract={selectedContract}
        isOpen={!!selectedContract}
        onClose={() => setSelectedContract(null)}
        currentUserEmail={userEmail}
        onRefresh={fetchContracts}
      />

      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8 print:hidden">
        {/* Page Header + Notifications Center */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Multi-party verified contracts & cryptographic signatures.
            </p>
          </div>

          {/* Notifications Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-[#141415] px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="h-4 w-4 text-[#06B6D4]" />
              <span>Notifications</span>
              {notificationItems.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#06B6D4] text-[10px] font-bold text-black">
                  {notificationItems.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0e0e10] p-4 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Alerts & Updates
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {notificationItems.length} Recent
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2.5">
                    {notificationItems.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-500">
                        No pending notifications.
                      </div>
                    ) : (
                      notificationItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedContract(item.contract);
                            setShowNotifications(false);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            item.type === "action"
                              ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15"
                              : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                          }`}
                        >
                          <p className={`text-xs font-semibold ${item.type === "action" ? "text-amber-400" : "text-emerald-400"}`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-gray-500 mt-2 block">
                            {new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  <Icon className="h-5 w-5 text-gray-500" />
                </div>
                <p className={`text-5xl font-black tracking-tight ${metric.color}`}>
                  {isLoading ? "—" : metric.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Vault Tabs Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: "all", label: "All Pacts", count: contracts.length },
            { id: "pending_review", label: "Pending Review", count: pendingReviewContracts.length, badgeColor: "bg-amber-500/20 text-amber-300" },
            { id: "pending_approval", label: "Pending Approval", count: pendingApprovalContracts.length },
            { id: "approved", label: "Approved & Sealed", count: approvedContracts.length, badgeColor: "bg-emerald-500/20 text-emerald-300" },
            { id: "expired", label: "Expired", count: expiredContracts.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-[#111] text-gray-400 border border-white/5 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    tab.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-white/5 text-gray-500")
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* The Vault List View */}
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
            <span className="w-48 hidden lg:block">Counterparty</span>
            <span className="w-24 text-center">Type</span>
            <span className="w-36 text-center">Status</span>
            <span className="w-24 text-right">Action</span>
          </div>

          {/* List Body */}
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 text-sm">{error}</div>
          ) : filteredContracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-12 w-12 text-white/10 mb-4" />
              <h2 className="text-lg font-semibold text-white mb-1">
                No Contracts Found
              </h2>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                No contracts match the selected "{activeTab.replace("_", " ")}" filter.
              </p>
              <button
                onClick={() => router.push("/create")}
                className="rounded-xl bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Create New Pact
              </button>
            </div>
          ) : (
            <div>
              {filteredContracts.map((contract, i) => {
                const isNeedsReview = contract.status === "pending_review";
                const isFullyApproved = contract.status === "approved";

                return (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Title */}
                    <div className="flex-1 min-w-0 pr-4">
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

                    {/* Counterparty */}
                    <span className="w-48 hidden lg:block text-xs text-gray-400 truncate">
                      {contract.party2Email || contract.party2}
                    </span>

                    {/* Mode Pill */}
                    <div className="w-24 flex justify-center">
                      <Pill
                        type={
                          contract.mode === "pro" || contract.mode === "fun"
                            ? contract.mode
                            : "pro"
                        }
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="w-36 flex justify-center">
                      {isFullyApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle className="h-3 w-3" /> Sealed
                        </span>
                      ) : contract.status === "expired" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-400">
                          Expired
                        </span>
                      ) : isNeedsReview ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                          <Clock className="h-3 w-3 animate-pulse" /> Review Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-gray-400">
                          Pending Counterparty
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="w-24 flex justify-end">
                      {isNeedsReview ? (
                        <button
                          onClick={() => setSelectedContract(contract)}
                          className="rounded-xl bg-[#06B6D4] text-black font-semibold text-xs px-3 py-1.5 hover:bg-[#22d3ee] transition-all cursor-pointer shadow-sm"
                        >
                          Review & Sign
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedContract(contract)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
