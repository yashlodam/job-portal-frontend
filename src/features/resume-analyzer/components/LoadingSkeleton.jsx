/**
 * src/features/resume-analyzer/components/LoadingSkeleton.jsx
 * Reusable animated shimmer loading skeleton widget.
 */

import React from "react";
import { Cpu } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 font-satoshi max-w-6xl mx-auto py-8">
      {/* Top Banner Loader */}
      <div className="p-8 rounded-3xl bg-[#090d16]/90 border border-indigo-500/30 text-center space-y-4 shadow-2xl backdrop-blur-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto animate-bounce">
          <Cpu size={32} />
        </div>
        <h3 className="text-xl font-black text-white">AI Neural Engine Auditing Resume...</h3>
        <p className="text-xs text-slate-400 font-medium">Extracting technical competencies, scanning ATS algorithms, & forecasting salary tier...</p>
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse space-y-4">
            <div className="h-4 w-24 bg-white/10 rounded-full" />
            <div className="h-10 w-32 bg-white/10 rounded-2xl" />
            <div className="h-3 w-full bg-white/10 rounded-full" />
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-white/10 rounded-xl" />
        <div className="h-20 w-full bg-white/10 rounded-2xl" />
      </div>
    </div>
  );
}
