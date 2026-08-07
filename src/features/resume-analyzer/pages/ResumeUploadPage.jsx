/**
 * src/features/resume-analyzer/pages/ResumeUploadPage.jsx
 * Clean, modern Resume Upload Page incorporating ResumeUploader, UploadedResumeCard, AnalyzeButton, and LoadingAnalyzer.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { useResumeAnalyzer } from "../hooks/useResumeAnalyzer";
import ResumeUploader from "../components/ResumeUploader";
import UploadedResumeCard from "../components/UploadedResumeCard";
import AnalyzeButton from "../components/AnalyzeButton";
import LoadingAnalyzer from "../components/LoadingAnalyzer";

export default function ResumeUploadPage({ onAnalyzeSuccess }) {
  const {
    currentResume,
    error,
    uploadResume,
    removeResume,
    reAnalyze,
  } = useResumeAnalyzer();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (file) => {
    uploadResume(file);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  const handleLoadingComplete = () => {
    setIsAnalyzing(false);
    if (onAnalyzeSuccess) {
      onAnalyzeSuccess();
    }
  };

  if (isAnalyzing) {
    return <LoadingAnalyzer onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-satoshi py-4">
      {/* Top Banner Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-black text-indigo-400 uppercase tracking-widest shadow-sm">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" /> AI Resume Analyzer
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Score & Match Your Resume Against <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Target Jobs</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Upload your resume to receive an instant ATS compatibility score, skill breakdown, and AI recommendations.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {!currentResume ? (
          <ResumeUploader onFileSelect={handleFileSelect} error={error} />
        ) : (
          <div className="space-y-6">
            <UploadedResumeCard
              fileName={currentResume.name}
              fileSize={currentResume.size}
              uploadDate={new Date(currentResume.uploadedAt || Date.now()).toLocaleDateString()}
              onDelete={removeResume}
            />

            <div className="text-center pt-2">
              <AnalyzeButton onClick={handleStartAnalysis} isLoading={isAnalyzing} />
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-4">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-400" /> Enterprise ATS Parser
        </span>
        <span>•</span>
        <span>Private & Confidential</span>
      </div>
    </div>
  );
}
