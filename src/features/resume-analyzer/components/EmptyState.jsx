/**
 * src/features/resume-analyzer/components/EmptyState.jsx
 * Reusable Empty State component when no resume is uploaded.
 */

import React from "react";
import { Upload, Sparkles } from "lucide-react";

export default function EmptyState({ onUploadClick }) {
  return (
    <div className="p-10 sm:p-14 text-center space-y-6 rounded-3xl bg-[#090d16]/90 border border-white/10 max-w-xl mx-auto font-satoshi shadow-2xl backdrop-blur-2xl">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 mx-auto shadow-xl">
        <Upload size={36} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white">No Resume Uploaded Yet</h3>
        <p className="text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
          Upload your PDF or DOCX resume to trigger instant neural parsing, ATS score auditing, skills extraction, and AI rewrite tools.
        </p>
      </div>

      <button
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 transition cursor-pointer font-satoshi"
      >
        <Sparkles size={16} /> Upload & Audit Resume Now
      </button>
    </div>
  );
}
