/**
 * src/features/resume-analyzer/components/MetricCard.jsx
 * Reusable Metric Analytics display card.
 */

import React from "react";

export default function MetricCard({
  title,
  value,
  subtitle = "",
  trend = "",
  icon: Icon = null,
  colorClass = "text-indigo-400",
}) {
  return (
    <div className="p-5 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-xl shadow-lg space-y-2 font-satoshi">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && <Icon size={18} className={colorClass} />}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className={`text-3xl font-black ${colorClass} tracking-tight`}>{value}</h3>
        {trend && (
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
    </div>
  );
}
