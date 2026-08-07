/**
 * src/features/resume-analyzer/pages/ResumeUploadPage.jsx
 * Strict two-step Resume Upload Page:
 * Step 1: Upload file -> Show Uploaded Resume Card & Analyze Button.
 * Step 2: Click "Analyze Resume" button -> Trigger AI Analysis & Loading Screen.
 */

import React, { useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { useResumeAnalyzer } from "../hooks/useResumeAnalyzer";
import { useToast } from "../../../components/ui/ToastNotification";
import AIErrorBanner from "../../../components/ui/AIErrorBanner";
import ResumeUploader from "../components/ResumeUploader";
import UploadedResumeCard from "../components/UploadedResumeCard";
import AnalyzeButton from "../components/AnalyzeButton";
import LoadingAnalyzer from "../components/LoadingAnalyzer";
import UploadProgress from "../components/UploadProgress";

export default function ResumeUploadPage({ onAnalyzeSuccess }) {
  const {
    currentResume,
    uploadProgress,
    status,
    error,
    uploadResumeOnly,
    triggerAnalysis,
    removeResume,
    dismissError,
  } = useResumeAnalyzer();

  const toast = useToast();
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);

  const handleFileSelect = (file) => {
    uploadResumeOnly(file);
    toast.success("Resume uploaded successfully! Click Analyze Resume to start.");
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzingLocal(true);
    toast.info("Connecting to AI Resume Analyzer...", 3000);
    try {
      await triggerAnalysis().unwrap();
      toast.success("Resume AI Analysis completed!");
    } catch (err) {
      setIsAnalyzingLocal(false);
      const errMsg = typeof err === "string" ? err : err?.message || "AI Analysis failed.";
      toast.error(errMsg);
      console.error("[ResumeUploadPage] Analysis error:", err);
    }
  };

  const handleLoadingComplete = () => {
    setIsAnalyzingLocal(false);
    if (onAnalyzeSuccess) {
      onAnalyzeSuccess();
    }
  };

  // If status is analyzing or local analyzing is active, display Loading Screen
  if (status === "analyzing" || isAnalyzingLocal) {
    return <LoadingAnalyzer onComplete={handleLoadingComplete} />;
  }

  const isUploading = status === "uploading";

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-satoshi py-4">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-black text-indigo-400 uppercase tracking-widest shadow-sm">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" /> AI Resume Analyzer
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Score & Match Your Resume Against <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Target Jobs</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Upload your resume, then click <span className="text-indigo-400 font-bold">Analyze Resume</span> to trigger your AI audit.
        </p>
      </div>

      {error && (
        <AIErrorBanner
          message={error}
          onRetry={handleStartAnalysis}
        />
      )}

      {/* Main Flow Area */}
      <div className="space-y-6">
        {!currentResume && !isUploading ? (
          <ResumeUploader onFileSelect={handleFileSelect} error={error} />
        ) : isUploading ? (
          <UploadProgress
            fileName="Uploading resume file..."
            progress={uploadProgress}
          />
        ) : (
          <div className="space-y-6">
            {/* Uploaded Resume Card */}
            <UploadedResumeCard
              fileName={currentResume.name}
              fileSize={currentResume.size}
              uploadDate={new Date(currentResume.uploadedAt || Date.now()).toLocaleDateString()}
              onDelete={removeResume}
            />

            {/* Analyze Button — triggers AI Analysis ONLY on click */}
            <div className="text-center pt-4">
              <AnalyzeButton onClick={handleStartAnalysis} isLoading={isAnalyzingLocal || status === "analyzing"} />
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
