/**
 * src/Pages/SettingsPage.jsx
 *
 * Clean Candidate Settings Center.
 * Includes:
 * 1. Profile & Bio (Name, Email, Title, Phone, Location, Recruiter Visibility)
 * 2. Password & Security (Password update, 2FA toggle)
 * 3. Data & Privacy (Export Data, Delete Account)
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Sparkles,
  Lock,
  CheckCircle2,
  Save,
  Key,
} from "lucide-react";
import { useAppSelector } from "../State/Store";

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.profile);

  // Tab State: 'profile' | 'security' | 'privacy'
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [name, setName] = useState(user?.name || "Vitthal Lodam");
  const [email, setEmail] = useState(user?.email || "vitthal.lodam@example.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [title, setTitle] = useState(user?.title || "Senior Full Stack Software Engineer");
  const [location, setLocation] = useState(user?.location || "Mumbai, India (Open to Remote)");
  const [visibility, setVisibility] = useState("public"); // 'public' | 'stealth'

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Feedback Banner
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070d] py-10 px-4 sm:px-6 lg:px-8 font-inter text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 text-xs font-black text-indigo-300 font-satoshi shadow-sm">
            <Sparkles size={14} className="text-amber-300 fill-amber-300/20" /> Candidate Settings
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-satoshi tracking-tight mt-1.5">
            Account <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium max-w-xl">
            Manage your candidate profile details, visibility settings, password security, and data privacy options.
          </p>
        </div>

        {/* Success Banner */}
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            Your settings have been saved successfully!
          </motion.div>
        )}

        {/* Main 2-Column Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Tabs (Left Sidebar) */}
          <div className="lg:col-span-3 space-y-1.5 bg-[#090d16]/90 border border-white/10 p-3 rounded-3xl backdrop-blur-xl shadow-xl font-satoshi">
            {[
              { id: "profile", label: "Profile & Bio", icon: User },
              { id: "security", label: "Password & Security", icon: Lock },
              { id: "privacy", label: "Data & Privacy", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-extrabold"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-indigo-400"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area (Right Main Column) */}
          <div className="lg:col-span-9 rounded-3xl border border-white/10 bg-[#090d16]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            
            {/* ── TAB 1: Profile & Bio ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <h3 className="text-lg font-black text-white font-satoshi border-b border-white/10 pb-3">
                  Personal & Professional Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Professional Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-300 mb-1.5">Preferred Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>
                </div>

                {/* Profile Visibility */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-satoshi">
                    Recruiter Visibility Mode
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        visibility === "public"
                          ? "border-indigo-500/50 bg-indigo-600/15 text-white shadow-md"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <h5 className="font-extrabold text-sm font-satoshi text-white">🟢 Public Candidate</h5>
                      <p className="mt-1 text-[11px] leading-relaxed font-medium">Visible to verified executive recruiters & hiring managers.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisibility("stealth")}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                        visibility === "stealth"
                          ? "border-indigo-500/50 bg-indigo-600/15 text-white shadow-md"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <h5 className="font-extrabold text-sm font-satoshi text-white">🕵️ Stealth Mode</h5>
                      <p className="mt-1 text-[11px] leading-relaxed font-medium">Only visible to companies you explicitly apply to.</p>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 transition cursor-pointer font-satoshi"
                >
                  <Save size={15} /> Save Profile Changes
                </button>
              </form>
            )}

            {/* ── TAB 2: Password & Security ── */}
            {activeTab === "security" && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <h3 className="text-lg font-black text-white font-satoshi border-b border-white/10 pb-3">
                  Password & Security Credentials
                </h3>

                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Current Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Confirm New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 font-medium"
                    />
                  </div>
                </div>

                {/* 2FA Toggle */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white font-satoshi">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Secure your candidate account with an extra verification code on login.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                      twoFactor ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" : "bg-white/5 border border-white/10 text-slate-400"
                    }`}
                  >
                    {twoFactor ? "Enabled" : "Disabled"}
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 transition cursor-pointer font-satoshi"
                >
                  <Key size={15} /> Update Password & Security
                </button>
              </form>
            )}

            {/* ── TAB 3: Data & Privacy ── */}
            {activeTab === "privacy" && (
              <div className="space-y-6 text-xs">
                <h3 className="text-lg font-black text-white font-satoshi border-b border-white/10 pb-3">
                  Data Portability & Account Management
                </h3>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white font-satoshi">Export My Candidate Data</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Download a JSON archive of your applications, saved jobs, and profile history.</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
                  >
                    Export Data
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-rose-300 font-satoshi">Delete Account & Erase Profile</h4>
                    <p className="text-[11px] text-rose-300/70 mt-0.5 font-medium">Permanently delete your profile, resume files, and message history.</p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-2xl bg-rose-600 text-xs font-extrabold text-white shadow hover:bg-rose-500 transition cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
