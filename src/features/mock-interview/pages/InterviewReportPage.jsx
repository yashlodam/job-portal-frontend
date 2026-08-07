/**
 * src/features/mock-interview/pages/InterviewReportPage.jsx
 * 6. Interview Report Page matching exact Spring Boot InterviewReportResponse DTO.
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  BarChart2,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Target,
} from "lucide-react";
import { useMockInterview } from "../hooks/useMockInterview";
import ScoreCard from "../components/ScoreCard";
import StrengthCard from "../components/StrengthCard";
import WeaknessCard from "../components/WeaknessCard";

export default function InterviewReportPage({ reportData, onStartNewSession }) {
  const { evaluation, currentInterview } = useMockInterview();
  const rawData = reportData || evaluation;

  if (!rawData) {
    return (
      <div className="py-16 text-center space-y-4 font-satoshi text-white">
        <h3 className="text-xl font-black">No Report Selected</h3>
        <p className="text-xs text-slate-400">Please select an interview session from history to view its detailed report.</p>
      </div>
    );
  }

  // Safely extract backend data payload
  const data = rawData.data || rawData;

  const evaluationsList = Array.isArray(data.evaluations) ? data.evaluations : [];
  const calculatedAvgScore =
    evaluationsList.length > 0
      ? Math.round(evaluationsList.reduce((sum, item) => sum + (item.score || 0), 0) / evaluationsList.length)
      : 0;

  const overallScore = data.overallScore !== null && data.overallScore !== undefined
    ? Math.round(Number(data.overallScore))
    : calculatedAvgScore;

  const technicalScore = data.technicalScore ?? overallScore;
  const problemSolvingScore = data.problemSolvingScore ?? overallScore;

  const strengths = Array.isArray(data.overallStrengths)
    ? data.overallStrengths
    : Array.isArray(data.strengths)
    ? data.strengths
    : [];

  const weaknesses = Array.isArray(data.overallWeaknesses)
    ? data.overallWeaknesses
    : Array.isArray(data.weaknesses)
    ? data.weaknesses
    : [];

  const learningPath = Array.isArray(data.overallRecommendations)
    ? data.overallRecommendations
    : Array.isArray(data.learningPath)
    ? data.learningPath
    : [];

  const candidateName = data.candidateName || "Candidate";
  const trackTitle = data.track || currentInterview?.trackTitle || "Technical Interview";

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-satoshi py-4 text-white">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-black text-indigo-400 uppercase tracking-widest">
            <BarChart2 size={14} /> Comprehensive Analytical Report
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Performance Report for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{candidateName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Session Track: <span className="text-white font-bold">{trackTitle}</span>
          </p>
        </div>

        <button
          onClick={onStartNewSession}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shrink-0"
        >
          <RotateCcw size={14} /> New Practice Session
        </button>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ScoreCard
          title="Overall Performance"
          score={overallScore}
          icon={Award}
          category="Performance"
        />
        <ScoreCard
          title="Technical Competency"
          score={technicalScore}
          icon={ShieldCheck}
          category="Code Precision"
        />
        <ScoreCard
          title="Problem Solving"
          score={problemSolvingScore}
          icon={TrendingUp}
          category="Architecture"
        />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthCard strengths={strengths} />
        <WeaknessCard weaknesses={weaknesses} />
      </div>

      {/* Recommended Next Learning Path */}
      {learningPath.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16]/95 border border-indigo-500/30 backdrop-blur-2xl shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Target size={20} className="text-indigo-400" /> Recommended AI Next Learning Path
            </h3>
            <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Personalized Curriculum
            </span>
          </div>

          <div className="space-y-4">
            {learningPath.map((path, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-4"
              >
                <span className="h-8 w-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white">{typeof path === "string" ? path : path.title || path.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {typeof path === "object" && path.description ? path.description : "Targeted learning recommendation generated by Spring Boot AI engine."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
