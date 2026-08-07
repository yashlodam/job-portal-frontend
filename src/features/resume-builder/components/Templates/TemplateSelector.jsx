/**
 * src/features/resume-builder/components/Templates/TemplateSelector.jsx
 * Interactive Template Selector rendering preview cards for all 6 enterprise ATS templates.
 * Data-decoupled: Preserves all user resume data when switching templates.
 */

import React from "react";
import { Check, Sparkles, Layout } from "lucide-react";
import { RESUME_TEMPLATES } from "../../constants/resumeTemplates";

export default function TemplateSelector({ selectedTemplateId, onSelectTemplate }) {
  return (
    <div className="space-y-4 font-satoshi text-white">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layout size={18} className="text-indigo-400" />
          <h3 className="text-base font-black text-white">Select ATS Template Layout</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">6 Enterprise Layouts Available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {RESUME_TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 relative group ${
                isSelected
                  ? "bg-indigo-600/15 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-[1.02]"
                  : "bg-white/[0.02] border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05]"
              }`}
            >
              {/* Card Banner Preview Color Header */}
              <div className={`h-16 rounded-xl bg-gradient-to-r ${tpl.previewColor} p-3 flex items-start justify-between relative overflow-hidden`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {tpl.badge}
                </span>

                {isSelected && (
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <Check size={14} />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition">{tpl.name}</h4>
                  {tpl.isPopular && (
                    <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-normal font-medium line-clamp-2">{tpl.description}</p>
              </div>

              {/* Select CTA Button */}
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {isSelected ? "Active Template" : "Use Template"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
