/**
 * src/features/mock-interview/components/InterviewHero.jsx
 * Premium SaaS Landing Hero Section with glassmorphism glow and stat highlights.
 */

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, ArrowRight, ShieldCheck, Award, Zap, Terminal } from "lucide-react";

export default function InterviewHero({ onStartClick, onExploreTracksClick }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0d1322] via-[#090d16] to-[#05070c] border border-white/10 p-8 sm:p-12 font-satoshi shadow-2xl">
      {/* Background Animated Glow Orb */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-r from-indigo-600/30 to-purple-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-r from-pink-600/20 to-indigo-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-xs font-black text-indigo-400 uppercase tracking-widest shadow-md"
        >
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span>Next-Gen AI Mock Interview Platform</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight"
        >
          Master Technical Interviews with <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Real-Time AI Feedback
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Simulate realistic technical and behavioral interviews for Java, React, System Design, and AI engineering roles. Receive instant grading, detailed code analysis, and targeted learning recommendations.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_45px_rgba(99,102,241,0.7)] hover:scale-105 transition duration-300 cursor-pointer"
          >
            <Bot size={20} />
            <span>Start AI Interview Now</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onExploreTracksClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 font-black text-sm transition cursor-pointer"
          >
            <Terminal size={18} className="text-indigo-400" />
            <span>Explore Track Library</span>
          </button>
        </motion.div>

        {/* Key Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10"
        >
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <h4 className="text-xl sm:text-2xl font-black text-indigo-400">12,500+</h4>
            <p className="text-xs text-slate-400 font-medium">Interviews Completed</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <h4 className="text-xl sm:text-2xl font-black text-purple-400">94.8%</h4>
            <p className="text-xs text-slate-400 font-medium">Interview Pass Rate</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <h4 className="text-xl sm:text-2xl font-black text-pink-400">500+</h4>
            <p className="text-xs text-slate-400 font-medium">AI Question Models</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <h4 className="text-xl sm:text-2xl font-black text-emerald-400">4.9/5.0</h4>
            <p className="text-xs text-slate-400 font-medium">Candidate Rating</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
