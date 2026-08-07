/**
 * src/features/resume-builder/components/Editor/SummaryForm.jsx
 * Professional summary editor with AI generation trigger matching Spring Boot POST /{id}/ai/summary.
 */

import React from "react";
import { FileText, Sparkles } from "lucide-react";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";

export default function SummaryForm({ summary, onChange }) {
  const { generateAiSummary, aiLoading, currentResume } = useResumeBuilder();

  const handleAIGenerate = () => {
    generateAiSummary(currentResume?.id || 1);
  };

  return (
    <div className="space-y-5 font-satoshi text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" /> Professional Summary
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Write a high-impact 3-4 sentence overview of your domain expertise and key achievements.
          </p>
        </div>

        <button
          onClick={handleAIGenerate}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg disabled:opacity-50 shrink-0"
        >
          <Sparkles size={14} className="text-amber-300 animate-pulse" />
          <span>{aiLoading ? "AI Generating..." : "Generate with AI"}</span>
        </button>
      </div>

      <div className="space-y-2">
        <textarea
          rows={6}
          value={summary || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Results-driven Senior Full Stack Software Engineer with 4+ years of experience designing scalable microservices..."
          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed transition"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Target length: 250 - 400 characters</span>
          <span>{summary ? summary.length : 0} characters</span>
        </div>
      </div>
    </div>
  );
}
