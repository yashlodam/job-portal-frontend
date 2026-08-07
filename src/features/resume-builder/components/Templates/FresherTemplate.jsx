/**
 * src/features/resume-builder/components/Templates/FresherTemplate.jsx
 * Graduate / Academic Fresher ATS Template.
 */

import React from "react";

export default function FresherTemplate({ resume }) {
  if (!resume) return null;

  const { personalInfo = {}, summary = "", education = [], projects = [], skills = {}, certifications = [] } = resume;

  return (
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 text-left space-y-6 text-xs shadow-2xl border border-slate-200">
      <div className="border-b-2 border-emerald-800 pb-4 space-y-1">
        <h1 className="text-2xl font-black text-emerald-950 uppercase">{personalInfo.fullName || "Graduate Candidate"}</h1>
        <p className="text-xs font-bold text-emerald-700 uppercase">{personalInfo.professionalTitle}</p>
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 pt-1 font-semibold">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {/* Education First for Freshers */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-emerald-900 border-b border-slate-300 pb-1">Education & Academics</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-extrabold text-slate-900 text-xs">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-slate-500 font-semibold">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-slate-700 font-semibold">{edu.institution} — <span className="text-emerald-700 font-bold">{edu.grade}</span></p>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-emerald-900 border-b border-slate-300 pb-1">Academic & Personal Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{proj.name}</span>
                {proj.technologies?.length > 0 && <span className="text-[10px] text-emerald-800 font-mono">[{proj.technologies.join(", ")}]</span>}
              </div>
              {proj.description && <p className="text-[11px] text-slate-700 leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {(skills.technical?.length > 0 || skills.frameworks?.length > 0) && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-black uppercase tracking-widest text-emerald-900 border-b border-slate-300 pb-1">Technical Skills</h2>
          <p className="text-[11px] text-slate-800 font-medium">
            <strong>Stack:</strong> {[...(skills.technical || []), ...(skills.frameworks || [])].join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
