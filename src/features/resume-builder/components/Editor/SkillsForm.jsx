/**
 * src/features/resume-builder/components/Editor/SkillsForm.jsx
 * Categorized Skills Form allowing fluid typing for Programming Languages, Frameworks, Tools, and Soft Skills.
 */

import React from "react";
import { Cpu, Code2, Wrench, Layers, UserCheck } from "lucide-react";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";

export default function SkillsForm({ skills = {}, onChange }) {
  const { currentResume } = useResumeBuilder();

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

  return (
    <div className="space-y-6 font-satoshi text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Cpu size={20} className="text-indigo-400" /> Skills & Technical Stack
          </h3>
          <p className="text-xs text-slate-400 font-medium">Categorize your languages, frameworks, developer tools, and soft skills.</p>
        </div>
      </div>

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
