/**
 * src/features/resume-analyzer/components/SkillChips.jsx
 * Reusable component displaying chips for detected and missing skills.
 */

import React from "react";
import SkillChip from "./SkillChip";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SkillChips({ detectedSkills = [], missingSkills = [] }) {
  return (
    <div className="space-y-6 font-satoshi">
      {/* Detected Skills */}
      {detectedSkills.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#090d16]/95 border border-white/10 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" /> Skills Found ({detectedSkills.length})
            </h3>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Verified Stack
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {detectedSkills.map((skill) => {
              const name = typeof skill === "string" ? skill : skill.name;
              return <SkillChip key={name} name={name} type="detected" />;
            })}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#090d16]/95 border border-rose-500/20 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-400" /> Missing Skills ({missingSkills.length})
            </h3>
            <span className="text-[10px] font-black text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              Recommended Additions
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {missingSkills.map((skill) => {
              const name = typeof skill === "string" ? skill : skill.name;
              return <SkillChip key={name} name={name} type="missing" />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
