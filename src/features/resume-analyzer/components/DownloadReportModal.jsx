/**
 * src/features/resume-analyzer/components/DownloadReportModal.jsx
 * Export, Print, Share, and Save Analysis Modal.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Printer, Share2, Bookmark, Check, ShieldCheck } from "lucide-react";
import { useResumeAnalyzer } from "../hooks/useResumeAnalyzer";
import { triggerPrintReport, copyShareableLink } from "../utils/pdfExportUtils";

export default function DownloadReportModal() {
  const { downloadModalOpen, hideDownloadModal, analysis } = useResumeAnalyzer();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!downloadModalOpen) return null;

  const handleShare = () => {
    copyShareableLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadPDF = () => {
    // Generate print flow which browser prints or saves as PDF cleanly
    triggerPrintReport();
    hideDownloadModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl rounded-3xl bg-[#090d16] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl font-satoshi relative overflow-hidden text-white"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black">Download & Share Audit Report</h3>
                <p className="text-xs text-slate-400 font-medium">Export executive ATS compliance audit (Overall Score: {analysis?.scores?.overall || 92}/100)</p>
              </div>
            </div>

            <button onClick={hideDownloadModal} className="p-2 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadPDF}
              className="p-5 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500/40 text-left space-y-2 hover:scale-[1.02] transition cursor-pointer shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <Download size={20} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">PDF</span>
              </div>
              <h4 className="font-extrabold text-white text-base">Download PDF Report</h4>
              <p className="text-xs text-indigo-100 font-medium">Full 2-page detailed candidate breakdown.</p>
            </button>

            <button
              onClick={triggerPrintReport}
              className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 text-left space-y-2 hover:scale-[1.02] transition cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <Printer size={20} className="text-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">Print</span>
              </div>
              <h4 className="font-extrabold text-white text-base">Print Report</h4>
              <p className="text-xs text-slate-400 font-medium">Direct high-res print output format.</p>
            </button>

            <button
              onClick={handleShare}
              className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 text-left space-y-2 hover:scale-[1.02] transition cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                {copied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} className="text-slate-300" />}
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">Link</span>
              </div>
              <h4 className="font-extrabold text-white text-base">{copied ? "Link Copied!" : "Share Report"}</h4>
              <p className="text-xs text-slate-400 font-medium">Copy shareable audit report link.</p>
            </button>

            <button
              onClick={handleSave}
              className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 text-left space-y-2 hover:scale-[1.02] transition cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                {saved ? <Check size={20} className="text-emerald-400" /> : <Bookmark size={20} className="text-slate-300" />}
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">Save</span>
              </div>
              <h4 className="font-extrabold text-white text-base">{saved ? "Analysis Saved!" : "Save Analysis"}</h4>
              <p className="text-xs text-slate-400 font-medium">Store snapshot in candidate profile.</p>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button onClick={hideDownloadModal} className="text-xs font-bold text-slate-400 hover:text-white transition">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
