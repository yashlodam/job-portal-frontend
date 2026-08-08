/**
 * src/features/resume-builder/components/Editor/SummaryForm.jsx
 * Professional summary editor with AI generation.
 * AI result writes directly into currentResume.summary via Redux (appears in textarea immediately).
 */

import React, { useEffect, useRef } from "react";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";
import { useToast } from "../../../../components/ui/ToastNotification";

export default function SummaryForm({ summary, onChange }) {
  const toast = useToast();
  const { generateAiSummary, aiLoading, currentResume, aiSuggestion } = useResumeBuilder();
  const prevAiLoadingRef = useRef(false);

  // Detect when AI finishes and show a success toast
  useEffect(() => {
    if (prevAiLoadingRef.current && !aiLoading && aiSuggestion?.applied) {
      toast.success("AI summary generated and applied!");
    }
    prevAiLoadingRef.current = aiLoading;
  }, [aiLoading]);

  const handleAIGenerate = async () => {
    if (!currentResume?.id) {
      toast.error("Please save your resume first before generating with AI.");
      return;
    }
    toast.info("AI is generating your professional summary...");
    await generateAiSummary(currentResume.id);
  };

  const isJustGenerated = aiSuggestion?.targetField === "summary" && aiSuggestion?.applied;

  return (
    <div className="space-y-5 font-satoshi text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" /> Professional Summary
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Write a high-impact 3–4 sentence overview of your domain expertise and key achievements.
          </p>
        </div>

        <button
          onClick={handleAIGenerate}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Sparkles size={14} className={aiLoading ? "animate-spin text-amber-300" : "text-amber-300"} />
          <span>{aiLoading ? "AI Generating..." : "Generate with AI"}</span>
        </button>
      </div>

      {/* AI Applied Badge */}
      {isJustGenerated && !aiLoading && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 size={14} />
          AI summary has been applied to your resume. You can edit it below.
        </div>
      )}

      <div className="space-y-2">
        <textarea
          rows={6}
          value={summary || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Results-driven Full Stack Java Developer with 3+ years of experience building scalable Spring Boot microservices and React applications..."
          className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed transition resize-none"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Target length: 250 – 400 characters</span>
          <span className={summary && summary.length >= 250 && summary.length <= 400 ? "text-emerald-400" : ""}>
            {summary ? summary.length : 0} characters
          </span>
        </div>
      </div>
    </div>
  );
}
