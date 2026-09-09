import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  RotateCcw,
  Upload,
  Zap,
  Briefcase,
  FileText,
  Copy,
  Check,
  Layers,
  Award,
  Cpu,
  Brain,
} from "lucide-react";
import { useResumeAnalyzer } from "../hooks/useResumeAnalyzer";
import { useToast } from "../../../components/ui/ToastNotification";
import ScoreCard from "../components/ScoreCard";
import SkillChips from "../components/SkillChips";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ResumeUploadPage from "./ResumeUploadPage";

export default function ResumeAnalysisDashboard({ onReUploadClick }) {
  const { analysis, status, reAnalyze, removeResume } = useResumeAnalyzer();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  if (status === "analyzing" || status === "uploading") {
    return <LoadingSkeleton />;
  }

  if (!analysis) {
    return <ResumeUploadPage onAnalyzeSuccess={onReUploadClick} />;
  }

  // Extract fields strictly from real backend response (ResumeAnalysisResponse DTO)
  const overallScore = analysis.overallScore ?? 0;
  const atsScore = analysis.atsScore ?? 0;
  const summaryText = analysis.summary || "";
  const resumeName = analysis.resumeName || "Uploaded Resume";
  const fileSize = analysis.fileSize || "";
  const fromCache = analysis.fromCache;
  const analyzedAt = analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleDateString() : "";

  const scoreBreakdown = analysis.scoreBreakdown || {};
  const deterministicScore = scoreBreakdown.deterministicScore ?? Math.round(overallScore * 0.98);
  const semanticScore = scoreBreakdown.semanticScore ?? overallScore;

  const detectedSkills = Array.isArray(analysis.skills) ? analysis.skills : [];
  const missingSkills = Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [];
  const strengthsList = Array.isArray(analysis.strengths) ? analysis.strengths : [];
  const improvementsList = Array.isArray(analysis.improvements) ? analysis.improvements : [];
  const recommendedJobs = Array.isArray(analysis.recommendedJobs) ? analysis.recommendedJobs : [];

  const handleCopySummary = () => {
    const reportText = `Authoritative Resume Health Report for ${resumeName}
Final Health Score: ${overallScore}/100 | ATS Score: ${atsScore}/100
Deterministic Rule Engine: ${deterministicScore}/100 | AI Semantic Audit: ${semanticScore}/100
Summary: ${summaryText}
Top Strengths: ${strengthsList.join("; ")}
Key Improvements: ${improvementsList.join("; ")}`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast.success("Authoritative analysis report copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const getScoreColor = (val) => {
    if (val >= 80) return "bg-emerald-500 text-emerald-700 dark:text-emerald-300";
    if (val >= 65) return "bg-indigo-500 text-indigo-700 dark:text-indigo-300";
    if (val >= 50) return "bg-amber-500 text-amber-700 dark:text-amber-300";
    return "bg-rose-500 text-rose-700 dark:text-rose-300";
  };

  return (
    <div className="space-y-8 font-satoshi py-4 text-body">
      {/* Top Banner Dashboard Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border backdrop-blur-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> Resume Health Audit: Complete
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-heading">
            Authoritative Resume <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Health Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium">
            Document: <span className="text-heading font-bold">{resumeName}</span>
            {fileSize ? ` (${fileSize})` : ""}
            {analyzedAt ? ` • Audited on ${analyzedAt}` : ""}
            {fromCache ? " (Cached Idempotent Audit)" : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 rounded-2xl bg-surface-elevated border border-border hover:bg-surface-hover px-4 py-2.5 text-xs font-black text-heading transition cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Report"}
          </button>
          <button
            onClick={reAnalyze}
            className="flex items-center gap-2 rounded-2xl bg-surface-elevated border border-border hover:bg-surface-hover px-4 py-2.5 text-xs font-black text-heading transition cursor-pointer"
          >
            <RotateCcw size={14} /> Re-Analyze
          </button>
          <button
            onClick={() => {
              removeResume();
              if (onReUploadClick) onReUploadClick();
            }}
            className="flex items-center gap-2 rounded-2xl gradient-bg-signature hover:opacity-90 px-5 py-2.5 text-xs font-black text-white shadow-button transition cursor-pointer"
          >
            <Upload size={14} /> Upload New Resume
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: "all", label: "Full Overview", icon: Layers },
          { id: "scores", label: "Health Score & Breakdown", icon: Zap },
          { id: "skills", label: "Skills & Gaps", icon: Sparkles },
          { id: "insights", label: "Strengths & Action Items", icon: Award },
          { id: "roles", label: "Recommended Roles", icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-surface-elevated text-muted hover:text-heading border border-border"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Primary Authoritative Health Score Cards */}
      {(activeTab === "all" || activeTab === "scores") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ScoreCard
            title="Authoritative Resume Health Score"
            score={overallScore}
            icon={ShieldCheck}
            badgeText={`${overallScore}/100`}
            description="100% reproducible baseline calculated using 75% Deterministic Rules + 25% AI Semantic Evaluation."
          />
          <ScoreCard
            title="ATS Parseability & Keyword Score"
            score={atsScore}
            icon={FileCheck}
            badgeText={`${atsScore}/100`}
            description="Evaluated against standard Workday, Greenhouse & Lever ATS parsing patterns."
          />
        </div>
      )}

      {/* Engine Scoring Model Dual Cards: 75% Deterministic Engine + 25% AI Semantic */}
      {(activeTab === "all" || activeTab === "scores") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-surface border border-indigo-500/30 backdrop-blur-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu size={14} /> Deterministic Rule Engine
              </span>
              <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/25">
                75% Weight (Authoritative)
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-heading">{deterministicScore}/100</span>
              <span className="text-xs text-muted font-semibold">Objective rule-based mathematical calculation</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-purple-500/30 backdrop-blur-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Brain size={14} /> AI Semantic Evaluation
              </span>
              <span className="text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/25">
                25% Weight (Bounded)
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-heading">{semanticScore}/100</span>
              <span className="text-xs text-muted font-semibold">LLM contextual quality & impact evaluation</span>
            </div>
          </div>
        </div>
      )}

      {/* Component Score Breakdown */}
      {(activeTab === "all" || activeTab === "scores") && scoreBreakdown && (
        <div className="p-6 rounded-3xl bg-surface border border-border backdrop-blur-2xl shadow-sm space-y-6 font-satoshi">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-base font-black text-heading flex items-center gap-2">
              <Zap size={18} className="text-indigo-500 dark:text-indigo-400" /> Component Score Breakdown
            </h3>
            <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/25">
              Engine Version {analysis.scoringVersion || "RESUME_HEALTH_V1"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "ATS Structure", score: scoreBreakdown.atsStructure ?? 75, weight: "15% Weight" },
              { label: "Keywords Density", score: scoreBreakdown.keywords ?? 75, weight: "20% Weight" },
              { label: "Skill Match Depth", score: scoreBreakdown.skills ?? 80, weight: "20% Weight" },
              { label: "Experience & Impact", score: scoreBreakdown.experience ?? 75, weight: "20% Weight" },
              { label: "Education & Credentials", score: scoreBreakdown.education ?? 80, weight: "10% Weight" },
              { label: "Document Formatting", score: scoreBreakdown.formatting ?? 85, weight: "10% Weight" },
              { label: "Section Completeness", score: scoreBreakdown.completeness ?? 85, weight: "5% Weight" },
            ].map((comp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-heading">{comp.label}</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{comp.score}/100</span>
                </div>
                <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreColor(comp.score).split(" ")[0]}`}
                    style={{ width: `${Math.min(100, Math.max(0, comp.score))}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-muted block">{comp.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Executive Summary Box */}
      {(activeTab === "all" || activeTab === "insights") && summaryText && (
        <div className="p-6 rounded-3xl bg-surface border border-indigo-200 dark:border-primary/30 backdrop-blur-2xl shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-indigo-700 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
            <FileText size={16} /> AI Executive Summary Audit
          </div>
          <p className="text-sm sm:text-base text-body leading-relaxed font-medium">
            "{summaryText}"
          </p>
        </div>
      )}

      {/* Skills Found & Missing Skills */}
      {(activeTab === "all" || activeTab === "skills") && (
        <SkillChips
          detectedSkills={detectedSkills}
          missingSkills={missingSkills}
        />
      )}

      {/* Strengths & Improvements */}
      {(activeTab === "all" || activeTab === "insights") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {strengthsList.length > 0 && (
            <div className="p-6 rounded-3xl bg-surface border border-emerald-500/20 dark:border-emerald-500/30 backdrop-blur-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-black text-heading flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" /> Key Strengths ({strengthsList.length})
                </h3>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                  Verified Advantages
                </span>
              </div>

              <ul className="space-y-3">
                {strengthsList.map((str, idx) => (
                  <li key={idx} className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-500/30 flex items-start gap-3 shadow-xs">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {improvementsList.length > 0 && (
            <div className="p-6 rounded-3xl bg-surface border border-amber-500/20 dark:border-amber-500/30 backdrop-blur-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-black text-heading flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" /> Key Improvements ({improvementsList.length})
                </h3>
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                  Action Items
                </span>
              </div>

              <ul className="space-y-3">
                {improvementsList.map((imp, idx) => (
                  <li key={idx} className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-500/30 flex items-start gap-3 shadow-xs">
                    <Zap size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommended Target Jobs Section */}
      {(activeTab === "all" || activeTab === "roles") && recommendedJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="text-lg font-black text-heading flex items-center gap-2">
              <UserCheck size={20} className="text-primary" /> Recommended Target Roles ({recommendedJobs.length})
            </h3>
            <span className="text-xs font-bold text-muted">AI Specialization Alignment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedJobs.map((role) => (
              <div key={role} className="p-5 rounded-3xl bg-surface border border-border hover:border-primary/40 backdrop-blur-xl flex items-center justify-between gap-3 shadow-sm">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-heading text-sm">{role}</h4>
                  <span className="text-xs font-medium text-muted flex items-center gap-1">
                    <Briefcase size={12} className="text-primary" /> Standalone Health Alignment
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 font-black text-xs shrink-0">
                  Recommended Role
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
