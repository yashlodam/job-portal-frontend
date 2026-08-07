/**
 * src/features/resume-analyzer/pages/ResumeAnalyzerMain.jsx
 * Parent main entry point managing user flow between Upload and AI Analysis Dashboard views.
 * Automatically fetches latest analysis on mount and seamlessly switches views.
 */

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, BarChart3, Sparkles } from "lucide-react";
import { useResumeAnalyzer } from "../hooks/useResumeAnalyzer";
import { fetchLatestAnalysisThunk } from "../slices/analysisSlice";
import ResumeUploadPage from "./ResumeUploadPage";
import ResumeAnalysisDashboard from "./ResumeAnalysisDashboard";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function ResumeAnalyzerMain() {
  const dispatch = useDispatch();
  const { status, currentResume, analysis } = useResumeAnalyzer();

  // Mode: "dashboard" (if analysis or currentResume exists) or "upload"
  const [viewMode, setViewMode] = useState(analysis || currentResume ? "dashboard" : "upload");

  // Automatically fetch latest analysis from backend on mount if not already loaded
  useEffect(() => {
    if (!analysis && status === "idle") {
      dispatch(fetchLatestAnalysisThunk(1));
    }
  }, [dispatch, analysis, status]);

  // Sync viewMode whenever analysis is successfully loaded
  useEffect(() => {
    if (analysis) {
      setViewMode("dashboard");
    }
  }, [analysis]);

  if (status === "analyzing") {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 font-satoshi text-white">
      {/* Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">AI Resume Analyzer</h2>
            <p className="text-xs text-slate-400 font-medium">ATS Document Compliance, Skill Extraction & Analysis Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white/[0.03] border border-white/10 p-1.5 font-satoshi">
          <button
            onClick={() => setViewMode("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              viewMode === "upload"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload size={14} /> Upload Resume
          </button>
          <button
            onClick={() => setViewMode("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              viewMode === "dashboard"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 size={14} /> Analysis Dashboard
          </button>
        </div>
      </div>

      {/* View Switcher Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "upload" || (!analysis && !currentResume) ? (
            <ResumeUploadPage onAnalyzeSuccess={() => setViewMode("dashboard")} />
          ) : (
            <ResumeAnalysisDashboard onReUploadClick={() => setViewMode("upload")} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
