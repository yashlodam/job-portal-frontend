/**
 * src/features/resume-analyzer/components/LoadingAnalyzer.jsx
 * Professional AI Analyzing loading screen with dynamic step animations.
 * Fixed React state update side-effect lifecycle warning.
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, CheckCircle2, Sparkles, FileText, Search, ShieldCheck } from "lucide-react";

export default function LoadingAnalyzer({ onComplete }) {
  const steps = [
    { title: "Parsing Resume Document Structure...", icon: FileText },
    { title: "Scanning ATS Parsing Algorithms & Layout...", icon: Search },
    { title: "Extracting Core Hard & Soft Technical Skills...", icon: Cpu },
    { title: "Evaluating Quantified Experience Impact...", icon: ShieldCheck },
    { title: "Generating Targeted Job Match Rankings & Insights...", icon: Sparkles },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // If reached last step, trigger parent completion safely after a brief pause
    if (currentStep >= steps.length - 1) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Step progression interval
    const interval = setInterval(() => {
      setCurrentStep((prev) => prev + 1);
    }, 400);

    return () => clearInterval(interval);
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-8 font-satoshi">
      {/* Glow Avatar Circle */}
      <div className="relative inline-block">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-2xl animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#090d16] border border-indigo-500/40 text-indigo-400 mx-auto shadow-2xl">
          <Cpu size={48} className="animate-pulse text-indigo-400" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          AI Neural Analysis <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">In Progress</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">
          Please wait while our AI engine scans your resume against enterprise applicant tracking systems.
        </p>
      </div>

      {/* Step Progress List */}
      <div className="p-6 rounded-3xl bg-[#090d16]/95 border border-white/10 space-y-3 text-left shadow-2xl backdrop-blur-2xl">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold transition-all ${
                isDone
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : isCurrent
                  ? "bg-indigo-500/20 text-white border border-indigo-500/40 shadow-md"
                  : "text-slate-500 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={isDone ? "text-emerald-400" : isCurrent ? "text-indigo-400 animate-spin" : "text-slate-600"} />
                <span>{step.title}</span>
              </div>

              {isDone && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
