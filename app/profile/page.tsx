"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Camera, LogOut, CheckCircle, Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type SettingsTab = "profile" | "emails" | "preferences";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  
  // Profile State
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [signingEmail, setSigningEmail] = useState("");
  const [bio, setBio] = useState("");

  // Authorized Emails State
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>([]);
  const [newEmailInput, setNewEmailInput] = useState("");

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    autoFillParty1Name: true,
    darkTheme: true,
  });

  // UI Status
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          router.push("/auth");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setName(data.profile.name || "");
            setContactNo(data.profile.contactNo || "");
            setSigningEmail(data.profile.signingEmail || data.profile.userEmail || "");
            setBio(data.profile.bio || "");
            setAuthorizedEmails(data.profile.authorizedEmails || [data.profile.userEmail]);
            if (data.profile.preferences) {
              setPreferences(data.profile.preferences);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [router]);

  const handleSaveProfile = async (overrides?: any) => {
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      name,
      contactNo,
      signingEmail,
      bio,
      authorizedEmails,
      preferences,
      ...overrides,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSuccessMsg(data.message || "Settings saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.trim() || !newEmailInput.includes("@")) return;
    const clean = newEmailInput.trim().toLowerCase();
    if (authorizedEmails.includes(clean)) return;

    const updated = [...authorizedEmails, clean];
    setAuthorizedEmails(updated);
    setNewEmailInput("");
    handleSaveProfile({ authorizedEmails: updated });
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    if (authorizedEmails.length <= 1) {
      setErrorMsg("You must have at least one authorized signing email.");
      return;
    }
    const updated = authorizedEmails.filter((e) => e !== emailToRemove);
    setAuthorizedEmails(updated);
    handleSaveProfile({ authorizedEmails: updated });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/auth");
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const sidebarItems: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "emails", label: "Authorized Emails", icon: Mail },
    { id: "preferences", label: "Preferences", icon: Shield },
  ];

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#050505] text-gray-200">
      <Navbar />

      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your PACTO account profile, signing emails, and preferences.
          </p>
        </motion.div>

        {/* Global Notifications */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400 font-medium"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-400 font-medium"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content: Sidebar + Form */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Sidebar ─── */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/4 space-y-1"
          >
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSuccessMsg(null);
                    setErrorMsg(null);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
            <div className="my-4 border-t border-white/5" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </motion.nav>

          {/* ─── Form Pane ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-3/4 bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-10"
          >
            {/* ─── PROFILE TAB ─── */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-600 bg-gradient-to-br from-[#7C3AED]/30 to-[#06B6D4]/30 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                      {name ? name.charAt(0).toUpperCase() : signingEmail ? signingEmail.charAt(0).toUpperCase() : "?"}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {name || "Your Name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {signingEmail || "Verified PACTO Account"}
                    </p>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#06B6D4] transition-all"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#06B6D4] transition-all"
                    />
                  </div>

                  {/* Primary Signing Email */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                      Authorized Signing Email
                    </label>
                    <input
                      type="email"
                      value={signingEmail}
                      onChange={(e) => setSigningEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#06B6D4] transition-all"
                    />
                  </div>
                </div>

                {/* Bio / Skills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
                    Freelancer Bio / Industry Skills
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell counterparties about your services, experience, and domain skills..."
                    className="resize-none bg-black/40 border border-white/10 rounded-xl p-4 w-full h-32 text-white text-sm placeholder:text-gray-600 outline-none transition-all focus:border-[#06B6D4]"
                  />
                </div>

                {/* Save Action */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleSaveProfile()}
                    disabled={isSaving}
                    className="btn-glow-cyan flex items-center gap-2 bg-[#06B6D4] hover:bg-[#22d3ee] text-black font-bold rounded-xl px-6 py-3 text-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving Changes..." : "Save Profile Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ─── AUTHORIZED EMAILS TAB ─── */}
            {activeTab === "emails" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Authorized Signing Emails
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage verified email addresses authorized to sign micro-contracts on your behalf.
                  </p>
                </div>

                {/* Add Email Form */}
                <form onSubmit={handleAddEmail} className="flex gap-3">
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="Add new signing email..."
                    className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#06B6D4] transition-all"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 text-sm border border-white/10 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add Email
                  </button>
                </form>

                {/* Emails List */}
                <div className="space-y-3">
                  {authorizedEmails.map((email, idx) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{email}</p>
                          {idx === 0 && (
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                              Primary Account Email
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </span>
                        {authorizedEmails.length > 1 && (
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="p-2 text-gray-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── PREFERENCES TAB ─── */}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Application Preferences
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Customize verification defaults and notifications.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Option 1 */}
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Email Notifications for Pact Reviews
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Receive instant alerts when a counterparty adds you to a micro-contract.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => {
                        const updated = { ...preferences, emailNotifications: e.target.checked };
                        setPreferences(updated);
                        handleSaveProfile({ preferences: updated });
                      }}
                      className="h-5 w-5 rounded accent-[#06B6D4] cursor-pointer"
                    />
                  </div>

                  {/* Option 2 */}
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Pre-fill Party 1 Details Automatically
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Automatically pre-fill your saved profile name and primary email as First Party when drafting a pact.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.autoFillParty1Name}
                      onChange={(e) => {
                        const updated = { ...preferences, autoFillParty1Name: e.target.checked };
                        setPreferences(updated);
                        handleSaveProfile({ preferences: updated });
                      }}
                      className="h-5 w-5 rounded accent-[#06B6D4] cursor-pointer"
                    />
                  </div>

                  {/* Option 3 */}
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Deep Void Dark Theme
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Default cyber black layout theme.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.darkTheme}
                      onChange={(e) => {
                        const updated = { ...preferences, darkTheme: e.target.checked };
                        setPreferences(updated);
                        handleSaveProfile({ preferences: updated });
                      }}
                      className="h-5 w-5 rounded accent-[#06B6D4] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
