"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, Camera, LogOut } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type SettingsTab = "profile" | "emails" | "preferences";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [signingEmail, setSigningEmail] = useState("");
  const [bio, setBio] = useState("");

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

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8">
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
            Manage your PACTO profile and preferences.
          </p>
        </motion.div>

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
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
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
            className="w-full lg:w-3/4 bg-[#111] border border-white/5 rounded-3xl p-10"
          >
            {activeTab === "profile" && (
              <div className="space-y-10">
                {/* Section A: Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border border-gray-600 bg-gradient-to-br from-[#7C3AED]/30 to-[#06B6D4]/30 flex items-center justify-center text-3xl font-bold text-white">
                      {name ? name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {name || "Your Name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Click the avatar to upload a photo
                    </p>
                  </div>
                </div>

                {/* Section B: Floating label inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="relative">
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-white/10 pb-2 pt-6 text-white text-base outline-none transition-all focus:border-[#06B6D4] placeholder-transparent"
                    />
                    <label
                      htmlFor="profile-name"
                      className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#06B6D4]"
                    >
                      Full Name
                    </label>
                  </div>

                  {/* Contact No */}
                  <div className="relative">
                    <input
                      id="profile-contact"
                      type="tel"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-white/10 pb-2 pt-6 text-white text-base outline-none transition-all focus:border-[#06B6D4] placeholder-transparent"
                    />
                    <label
                      htmlFor="profile-contact"
                      className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#06B6D4]"
                    >
                      Contact No.
                    </label>
                  </div>

                  {/* Authorized Signing Email */}
                  <div className="relative md:col-span-2">
                    <input
                      id="profile-email"
                      type="email"
                      value={signingEmail}
                      onChange={(e) => setSigningEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-white/10 pb-2 pt-6 text-white text-base outline-none transition-all focus:border-[#06B6D4] placeholder-transparent"
                    />
                    <label
                      htmlFor="profile-email"
                      className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#06B6D4]"
                    >
                      Authorized Signing Email
                    </label>
                  </div>
                </div>

                {/* Section C: Bio/Skills */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 block">
                    Freelancer Bio / Skills
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself and your skills..."
                    className="resize-none bg-[#1a1a1a] border border-white/5 rounded-lg p-4 w-full h-32 text-white text-sm placeholder:text-gray-600 outline-none transition-all focus:border-[#06B6D4]/50"
                  />
                </div>

                {/* Save Action */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-black font-semibold rounded-lg px-6 py-2 transition-all hover:bg-gray-200"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === "emails" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">
                  Authorized Emails
                </h2>
                <p className="text-sm text-gray-500">
                  Manage email addresses that are authorized to sign contracts
                  on your behalf.
                </p>
                <div className="rounded-xl border border-white/5 bg-[#1a1a1a] p-6 text-center text-gray-500 text-sm">
                  No authorized emails configured yet.
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">
                  Preferences
                </h2>
                <p className="text-sm text-gray-500">
                  Customize your PACTO experience.
                </p>
                <div className="rounded-xl border border-white/5 bg-[#1a1a1a] p-6 text-center text-gray-500 text-sm">
                  Preference settings coming soon.
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
