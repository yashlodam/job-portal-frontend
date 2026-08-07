/**
 * src/features/mock-interview/components/AnswerEditor.jsx
 * Large answer response text editor with word count and code formatting tools.
 */

import React from "react";
import { Code, Bold, List, CheckCircle2, FileText } from "lucide-react";

export default function AnswerEditor({ value = "", onChange, placeholder = "Type your response here..." }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = document.getElementById("interview-answer-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || "code/text";

    const replacement = `${prefix}${selected}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);
  };

  return (
    <div className="rounded-3xl bg-[#090d16]/95 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl font-satoshi flex flex-col">
      {/* Formatting Toolbar */}
      <div className="p-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-black transition cursor-pointer flex items-center gap-1"
            title="Bold"
          >
            <Bold size={14} /> Bold
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n```java\n", "\n```\n")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 text-xs font-black transition cursor-pointer flex items-center gap-1"
            title="Code Block"
          >
            <Code size={14} /> Code Block
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n- ")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-black transition cursor-pointer flex items-center gap-1"
            title="Bullet Point"
          >
            <List size={14} /> Bullet
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={12} /> Auto-Saved
          </span>
          <span>•</span>
          <span>{wordCount} Words</span>
        </div>
      </div>

      {/* Main Textarea Editor */}
      <textarea
        id="interview-answer-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="w-full p-5 bg-transparent text-white text-sm sm:text-base font-mono leading-relaxed focus:outline-none resize-y placeholder:text-slate-600"
      />

      {/* Editor Footer */}
      <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium px-5">
        <span className="flex items-center gap-1">
          <FileText size={12} className="text-indigo-400" /> Structure: Technical Explanation + Code / Tradeoffs
        </span>
        <span>{charCount} Characters</span>
      </div>
    </div>
  );
}
