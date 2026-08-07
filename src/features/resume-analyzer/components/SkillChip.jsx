/**
 * src/features/resume-analyzer/components/SkillChip.jsx
 * Reusable animated chip badge for Detected, Missing, and Recommended skills.
 */

import React from "react";
import { motion } from "framer-motion";
import { Check, Plus, AlertCircle, Sparkles } from "lucide-react";

export default function SkillChip({
  name,
  category = "",
  matchScore = null,
  type = "detected", // "detected" | "missing" | "recommended"
  priority = "",
  reason = "",
  onAction = null,
}) {
  let styles = {
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-300",
    icon: Check,
    iconColor: "text-emerald-400",
  };

  if (type === "missing") {
    styles = {
      bg: "bg-rose-500/10 hover:bg-rose-500/20",
      border: "border-rose-500/30",
      text: "text-rose-300",
      icon: AlertCircle,
      iconColor: "text-rose-400",
    };
  } else if (type === "recommended") {
    styles = {
      bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
      border: "border-indigo-500/30",
      text: "text-indigo-300",
      icon: Sparkles,
      iconColor: "text-indigo-400",
    };
  }

  const Icon = styles.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-2xl border ${styles.bg} ${styles.border} px-3.5 py-2 text-xs font-black font-satoshi shadow-sm transition-all duration-200 cursor-pointer`}
      title={reason || `${category} - ${type}`}
      onClick={onAction}
    >
      <Icon size={14} className={styles.iconColor} />
      <span className={styles.text}>{name}</span>

      {category && (
        <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
          {category}
        </span>
      )}

      {matchScore !== null && (
        <span className="text-[10px] text-emerald-400 font-extrabold ml-0.5">
          {matchScore}%
        </span>
      )}

      {priority && (
        <span className="text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
          {priority}
        </span>
      )}

      {onAction && type === "missing" && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/30 text-rose-200 hover:bg-rose-500/50">
          <Plus size={10} />
        </span>
      )}
    </motion.div>
  );
}
