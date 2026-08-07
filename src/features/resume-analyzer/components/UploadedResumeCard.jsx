/**
 * src/features/resume-analyzer/components/UploadedResumeCard.jsx
 * Uploaded Resume Card displaying File name, Upload date, File size, View Resume, and Delete Resume.
 */

import React from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Trash2, CheckCircle2 } from "lucide-react";

export default function UploadedResumeCard({
  fileName,
  fileSize,
  uploadDate,
  onView,
  onDelete,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-5 sm:p-6 rounded-3xl bg-[#090d16]/95 border border-indigo-500/30 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-satoshi"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shrink-0 shadow-md">
          <FileText size={28} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-black text-white line-clamp-1">{fileName}</h4>
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={12} /> Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Size: <span className="text-slate-200 font-bold">{fileSize}</span> • Uploaded on{" "}
            <span className="text-slate-200 font-bold">{uploadDate}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
        {onView && (
          <button
            onClick={onView}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-black transition cursor-pointer"
          >
            <Eye size={14} className="text-indigo-400" /> View Resume
          </button>
        )}

        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black transition cursor-pointer"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </motion.div>
  );
}
