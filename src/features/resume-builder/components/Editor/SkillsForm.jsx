/**
 * src/features/resume-builder/components/Editor/SkillsForm.jsx
 * Categorized Skills Form with AI Suggest Skills feature.
 * AI suggestions are merged into skills.technical via Redux directly.
 */

import React from "react";
import { Cpu, Code2, Wrench, Layers, UserCheck, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";
import { useToast } from "../../../../components/ui/ToastNotification";

export default function SkillsForm({ skills = {}, onChange }) {
  const toast = useToast();
  const { suggestSkills, aiLoading, aiSuggestion, currentResume } = useResumeBuilder();

  const handleCategoryChange = (category, rawText) => {
    onChange({
      [category]: rawText,
    });
  };

  const getCategoryText = (val) => {
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "string") return val;
    return "";
  };

  const handleSuggestSkills = async () => {
    if (!currentResume?.id) {
      toast.error("Please save your resume before using AI skill suggestions.");
      return;
    }
    toast.info("AI is analyzing your resume and suggesting skills...");
    try {
      await suggestSkills(currentResume.id);
      toast.success("AI skill suggestions merged into your Technical Skills!");
    } catch {
      toast.error("AI skill suggestion failed. Please try again.");
    }
  };

  const isSkillsApplied = aiSuggestion?.targetField === "skills" && aiSuggestion?.applied;

  return (
    <div className="space-y-6 font-satoshi text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Cpu size={20} className="text-indigo-400" /> Skills & Technical Stack
          </h3>
          <p className="text-xs text-slate-400 font-medium">Categorize your languages, frameworks, developer tools, and soft skills.</p>
        </div>

        <button
          onClick={handleSuggestSkills}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {aiLoading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Sparkles size={13} className="text-amber-300" />
          )}
          {aiLoading ? "Suggesting..." : "Suggest with AI"}
        </button>
      </div>

      {/* AI Applied Banner */}
      {isSkillsApplied && !aiLoading && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <CheckCircle2 size={14} />
          AI suggested skills have been merged into your Technical Skills below.
        </div>
      )}

      <div className="space-y-5 text-xs font-bold">
        {/* Technical Languages */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <label className="text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Code2 size={15} className="text-indigo-400" /> Programming Languages (Comma Separated)
          </label>
          <input
            type="text"
            value={getCategoryText(skills.technical)}
            onChange={(e) => handleCategoryChange("technical", e.target.value)}
            placeholder="Java 21, JavaScript (ES6+), TypeScript, Python, SQL"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium transition"
          />
        </div>

        {/* Frameworks & Libraries */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <label className="text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers size={15} className="text-purple-400" /> Frameworks & Libraries (Comma Separated)
          </label>
          <input
            type="text"
            value={getCategoryText(skills.frameworks)}
            onChange={(e) => handleCategoryChange("frameworks", e.target.value)}
            placeholder="Spring Boot 3, React 19, Redux Toolkit, Tailwind CSS, FastAPI"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium transition"
          />
        </div>

        {/* Developer Tools & Infrastructure */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <label className="text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Wrench size={15} className="text-amber-400" /> Developer Tools & Infrastructure (Comma Separated)
          </label>
          <input
            type="text"
            value={getCategoryText(skills.tools)}
            onChange={(e) => handleCategoryChange("tools", e.target.value)}
            placeholder="Docker, Git, PostgreSQL, Redis, Kafka, Postman"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium transition"
          />
        </div>

        {/* Soft Skills & Leadership */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <label className="text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <UserCheck size={15} className="text-emerald-400" /> Soft Skills & Leadership (Comma Separated)
          </label>
          <input
            type="text"
            value={getCategoryText(skills.soft)}
            onChange={(e) => handleCategoryChange("soft", e.target.value)}
            placeholder="System Architecture, Technical Leadership, Agile/Scrum, Problem Solving"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium transition"
          />
        </div>
      </div>
    </div>
  );
}
