/**
 * src/features/resume-builder/components/Templates/CreativeTemplate.jsx
 * 6. Creative: Modern creative layout, enhanced typography & visual accents for UI/UX, Product Designers, Marketing.
 * Fully compatible with Spring Boot ResumeDocumentResponse DTO schema.
 */

import React from "react";

export default function CreativeTemplate({ resume }) {
  if (!resume) return null;

  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    projects = [],
    skills = {},
    certifications = [],
    achievements = [],
    languages = [],
  } = resume;

  const formatTech = (tech) => {
    if (Array.isArray(tech)) return tech.join(", ");
    if (typeof tech === "string") return tech;
    return "";
  };

  const getSkillsList = () => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "object") {
      return [
        ...(skills.technical || []),
        ...(skills.frameworks || []),
        ...(skills.tools || []),
        ...(skills.soft || []),
      ];
    }
    return [];
  };

  const skillsArr = getSkillsList();

  return (
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 text-left space-y-6 text-xs shadow-2xl border border-slate-200">
      {/* Header Accent Bar */}
      <div className="border-l-4 border-purple-600 pl-4 py-1 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 uppercase tracking-tight">
          {personalInfo.fullName || resume.fullName || "Creative Leader"}
        </h1>
        <p className="text-xs font-black text-purple-600 uppercase tracking-wider">
          {personalInfo.professionalTitle || resume.professionalTitle}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 font-semibold pt-1">
          {(personalInfo.email || resume.email) && <span>{personalInfo.email || resume.email}</span>}
          {(personalInfo.phone || resume.phone) && <span>• {personalInfo.phone || resume.phone}</span>}
          {(personalInfo.location || resume.location) && <span>• {personalInfo.location || resume.location}</span>}
          {(personalInfo.portfolio || resume.portfolioUrl) && <span>• {personalInfo.portfolio || resume.portfolioUrl}</span>}
        </div>
      </div>

      {/* Summary */}
      {(summary || resume.professionalSummary) && (
        <div className="space-y-1.5 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <h2 className="text-xs font-black uppercase tracking-widest text-purple-950">About & Professional Bio</h2>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">{summary || resume.professionalSummary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-purple-950 border-b border-purple-100 pb-1">
            Experience & Design Work
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-900">{exp.position} — <span className="text-purple-700 font-bold">{exp.company}</span></span>
                <span className="text-slate-500 font-semibold">{exp.startDate} - {exp.currentlyWorking || exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.description && <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects / Portfolio Highlights */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-purple-950 border-b border-purple-100 pb-1">
            Portfolio Highlights & Applications
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span>{proj.projectName || proj.name}</span>
                {proj.technologies && <span className="text-[10px] text-purple-800">[{formatTech(proj.technologies)}]</span>}
              </div>
              {proj.description && <p className="text-[11px] text-slate-700 leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills & Stack Badges */}
      {skillsArr.length > 0 && (
        <div className="space-y-2 text-[11px]">
          <h2 className="text-xs font-black uppercase tracking-widest text-purple-950 border-b border-purple-100 pb-1">Core Tech & Tools</h2>
          <div className="flex flex-wrap gap-1.5">
            {skillsArr.map((sk, idx) => (
              <span key={idx} className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-purple-200">
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-1 text-[11px]">
          <h2 className="text-xs font-black uppercase tracking-widest text-purple-950 border-b border-purple-100 pb-1">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-slate-900 font-bold">
              <span>{edu.degree} in {edu.fieldOfStudy} — {edu.institution} ({edu.grade})</span>
              <span className="text-slate-500">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
