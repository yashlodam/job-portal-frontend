/**
 * src/features/resume-builder/components/ATS/ATSScoreIndicator.jsx
 * Live ATS Score Gauge & Missing Sections Checklist.
 */

import React from "react";
import { Award, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { calculateResumeCompletion } from "../../slices/resumeBuilderSlice";

export default function ATSScoreIndicator({ resume }) {
  if (!resume) return null;

  const completion = calculateResumeCompletion(resume);
  const atsScore = resume.atsScore || Math.min(98, completion + 12);

  const missingItems = [];
  if (!resume.summary || resume.summary.length < 20) missingItems.push("Professional Summary");
  if (!resume.personalInfo?.linkedIn) missingItems.push("LinkedIn Profile URL");
  if (!resume.projects || resume.projects.length === 0) missingItems.push("Technical Projects");
  if (!resume.certifications || resume.certifications.length === 0) missingItems.push("Professional Certifications");

  return (
    <div className="p-4 rounded-2xl bg-[#090d16]/90 border border-white/10 space-y-3 font-satoshi text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-wider text-white">ATS Compliance Strength</span>
        </div>
        <span className="text-base font-black text-emerald-400">{atsScore}/100</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>

      {missingItems.length > 0 && (
        <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px]">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <AlertCircle size={13} className="text-amber-400" /> Recommended Additions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {missingItems.map((item, idx) => (
              <span key={idx} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                + {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
