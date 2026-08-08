/**
 * src/features/resume-builder/components/Preview/ResumePreviewContainer.jsx
 * Enterprise Production-Ready A4 PDF Generator & Preview Canvas.
 * Generates 1-Page, High-DPI ATS-Friendly PDF downloads directly using pdfGenerationService (100% Decoupled from AI).
 */

import React, { useState } from "react";
import { ZoomIn, ZoomOut, Download, Layout, Loader2 } from "lucide-react";
import { useResumeBuilder } from "../../hooks/useResumeBuilder";
import { useToast } from "../../../../components/ui/ToastNotification";
import { RESUME_TEMPLATES } from "../../constants/resumeTemplates";
import { pdfGenerationService } from "../../services/pdfGenerationService";
import A4Sheet from "./A4Sheet";

export default function ResumePreviewContainer({ resume }) {
  const toast = useToast();
  const { setSelectedTemplate } = useResumeBuilder();
  const [zoom, setZoom] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (isDownloading) return;

    const sourceElement = document.getElementById("printable-resume-sheet");
    if (!sourceElement) {
      toast.error("Unable to generate resume. Please try again.");
      return;
    }

    const candidateName = resume?.personalInfo?.fullName || resume?.fullName || "Candidate";

    try {
      setIsDownloading(true);
      toast.info("Generating Resume...");
      await pdfGenerationService.generateResumePdf(sourceElement, candidateName);
      toast.success("Resume Downloaded Successfully");
    } catch (err) {
      toast.error("Unable to generate resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  return (
    <div className="space-y-4 font-satoshi text-white">
      {/* Premium Controls Bar */}
      <div className="p-3.5 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Template Selector Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Layout size={14} className="text-indigo-400" /> Template:
          </span>
          <select
            value={resume?.templateId || "professional"}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-extrabold text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
          >
            {RESUME_TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id} className="bg-[#090d16] text-white font-medium">
                {tpl.name}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom & Direct PDF Download Actions */}
        <div className="flex items-center gap-2.5">
          {/* Zoom Control Group */}
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-xl text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 10))}
              className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleZoomReset}
              className="text-[11px] font-mono font-black text-indigo-300 w-12 text-center hover:text-white transition cursor-pointer"
              title="Reset Zoom to 100%"
            >
              {zoom}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Direct Download PDF CTA Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-xl hover:scale-105 disabled:opacity-50"
            title="Download 1-Page ATS PDF Resume"
          >
            {isDownloading ? (
              <>
                <Loader2 size={16} className="animate-spin text-amber-300" />
                <span>Generating Resume...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* A4 Paper Scalable Canvas */}
      <div className="overflow-auto max-h-[820px] p-6 sm:p-8 bg-[#030712]/90 rounded-3xl border border-white/10 flex justify-center shadow-inner relative">
        <div
          id="printable-resume-sheet"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-200 w-full max-w-[210mm] shadow-2xl bg-white"
        >
          <A4Sheet resume={resume} />
        </div>
      </div>
    </div>
  );
}
