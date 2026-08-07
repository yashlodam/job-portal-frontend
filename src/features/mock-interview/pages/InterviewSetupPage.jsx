/**
 * src/features/mock-interview/pages/InterviewSetupPage.jsx
 * 2. Interview Setup Page with comprehensive Toast Notification alerts.
 */

import React from "react";
import { Sliders } from "lucide-react";
import { useMockInterview } from "../hooks/useMockInterview";
import { useToast } from "../../../components/ui/ToastNotification";
import InterviewSetupForm from "../components/InterviewSetupForm";
import AIErrorBanner from "../../../components/ui/AIErrorBanner";

export default function InterviewSetupPage({ onGenerateQuestions }) {
  const { currentInterview, startInterview, loading, error } = useMockInterview();
  const toast = useToast();

  const handleFormSubmit = async (config) => {
    try {
      toast.info("Connecting to AI Engine & Generating Questions...", 3000);
      await startInterview(config).unwrap();
      toast.success("AI Interview session generated successfully!");
      if (onGenerateQuestions) onGenerateQuestions();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Failed to start AI interview session.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-satoshi py-4 text-white">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-black text-indigo-400 uppercase tracking-widest">
          <Sliders size={14} /> AI Interview Studio Configurator
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Configure Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Mock Interview</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
          Customize your target tech stack, experience level, interview format, and question count before launching your live practice session.
        </p>
      </div>

      {error && (
        <AIErrorBanner
          message={error}
          onRetry={() => handleFormSubmit(currentInterview)}
        />
      )}

      {/* Setup Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-2xl">
        <InterviewSetupForm
          initialConfig={currentInterview}
          onSubmit={handleFormSubmit}
          isLoading={loading === "generating"}
        />
      </div>
    </div>
  );
}
