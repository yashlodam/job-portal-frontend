/**
 * src/features/resume-analyzer/components/CareerInsightCard.jsx
 * Reusable AI Career Insights display card.
 */

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Lightbulb, Award, BookOpen, ArrowRight } from "lucide-react";

export default function CareerInsightCard({
  title,
  type = "strengths", // "strengths" | "weaknesses" | "suggestions" | "certifications" | "courses"
  items = [],
  icon: IconOverride,
}) {
  let config = {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    headerBg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "Key Advantage",
  };

  if (type === "weaknesses") {
    config = {
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      headerBg: "bg-amber-500/10 border-amber-500/20",
      badge: "Skill Gap",
    };
  } else if (type === "suggestions") {
    config = {
      icon: Lightbulb,
      iconColor: "text-indigo-400",
      headerBg: "bg-indigo-500/10 border-indigo-500/20",
      badge: "Career Growth",
    };
  } else if (type === "certifications") {
    config = {
      icon: Award,
      iconColor: "text-purple-400",
      headerBg: "bg-purple-500/10 border-purple-500/20",
      badge: "High Value Certs",
    };
  } else if (type === "courses") {
    config = {
      icon: BookOpen,
      iconColor: "text-cyan-400",
      headerBg: "bg-cyan-500/10 border-cyan-500/20",
      badge: "Upskilling Path",
    };
  }

  const Icon = IconOverride || config.icon;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4 font-satoshi flex flex-col justify-between"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${config.headerBg} ${config.iconColor}`}>
              <Icon size={20} />
            </div>
            <h4 className="font-extrabold text-white text-base">{title}</h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
            {config.badge}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const isObject = typeof item === "object";
            return (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                {isObject ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-sm">{item.title}</span>
                      {item.impact && (
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {item.impact}
                        </span>
                      )}
                    </div>
                    {item.duration && (
                      <span className="text-xs text-slate-400 font-medium block">
                        Estimated effort: {item.duration} {item.platform ? `• ${item.platform}` : ""}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
