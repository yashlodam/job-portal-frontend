/**
 * src/features/resume-analyzer/components/SuggestionCard.jsx
 * Reusable AI Suggestion Card displaying Priority, Description, AI Reason, and Improve Button.
 */

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function SuggestionCard({
  section,
  title,
  priority = "High",
  description,
  reason,
  actionLabel = "Improve Section",
  onImprove,
}) {
  const isHigh = priority.toLowerCase() === "high";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-3xl bg-[#090d16]/95 border border-white/10 hover:border-indigo-500/40 backdrop-blur-2xl shadow-xl space-y-4 font-satoshi relative overflow-hidden group"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
            <Sparkles size={16} />
          </span>
          <span className="text-xs font-black text-slate-300 uppercase tracking-wider">{section}</span>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            isHigh
              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
          }`}
        >
          {priority} Priority
        </span>
      </div>

      <div>
        <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-medium">{description}</p>
      </div>

      {/* AI Reason Box */}
      <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed font-medium space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-indigo-400 uppercase tracking-widest text-[10px]">
          <Zap size={12} className="animate-pulse" /> AI Strategic Rationale
        </div>
        <p>{reason}</p>
      </div>

      {/* Improve Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onImprove}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:scale-105 transition cursor-pointer"
        >
          <span>{actionLabel}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
