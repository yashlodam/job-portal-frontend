/**
 * src/features/resume-builder/components/Templates/ModernTemplate.jsx
 * 2. Modern: Modern clean layout, slight color accents, visual hierarchy for engineers & product roles.
 * Fully compatible with Spring Boot ResumeDocumentResponse DTO schema.
 */

import React from "react";

export default function ModernTemplate({ resume }) {
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
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 text-left space-y-6 text-xs shadow-2xl border border-slate-200 grid grid-cols-12 gap-6 leading-normal">
      {/* Sidebar Column (4 of 12 cols = 33.3% width) */}
      <div className="col-span-4 border-r border-indigo-100 pr-5 space-y-5">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-indigo-950 uppercase tracking-tight leading-tight">
            {personalInfo.fullName || resume.fullName || "Your Name"}
          </h1>
          <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-wide">
            {personalInfo.professionalTitle || resume.professionalTitle}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-[11px] text-slate-700">
          <h3 className="font-black text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">Contact Details</h3>
          {(personalInfo.email || resume.email) && <p className="break-words font-medium">{personalInfo.email || resume.email}</p>}
          {(personalInfo.phone || resume.phone) && <p className="font-medium">{personalInfo.phone || resume.phone}</p>}
          {(personalInfo.location || resume.location) && <p className="font-medium">{personalInfo.location || resume.location}</p>}
          {(personalInfo.linkedIn || resume.linkedinUrl) && <p className="break-all text-indigo-700 font-semibold">{personalInfo.linkedIn || resume.linkedinUrl}</p>}
          {(personalInfo.gitHub || resume.githubUrl) && <p className="break-all text-indigo-700 font-semibold">{personalInfo.gitHub || resume.githubUrl}</p>}
          {(personalInfo.portfolio || resume.portfolioUrl) && <p className="break-all text-indigo-700 font-semibold">{personalInfo.portfolio || resume.portfolioUrl}</p>}
        </div>

        {/* Skills List */}
        {skillsArr.length > 0 && (
          <div className="space-y-2 text-[11px]">
            <h3 className="font-black text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">Skills & Stack</h3>
            <div className="flex flex-wrap gap-1">
              {skillsArr.map((sk, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded font-bold border border-indigo-100">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="space-y-1.5 text-[11px]">
            <h3 className="font-black text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">Languages</h3>
            <p className="text-slate-700 font-semibold">{languages.map((l) => (typeof l === "string" ? l : l.language)).join(", ")}</p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2 text-[11px]">
            <h3 className="font-black text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">Education</h3>
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-extrabold text-slate-900">{edu.degree}</p>
                <p className="text-slate-700 font-medium">{edu.institution} ({edu.grade})</p>
                <p className="text-slate-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2 text-[11px]">
            <h3 className="font-black text-xs uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1">Certifications</h3>
            {certifications.map((cert, idx) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-extrabold text-slate-900">{cert.name || cert.certificationName}</p>
                <p className="text-slate-600">{cert.issueDate || cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Column (8 of 12 cols = 66.6% width) */}
      <div className="col-span-8 space-y-5">
        {(summary || resume.professionalSummary) && (
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 border-b border-indigo-100 pb-1">Executive Summary</h2>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">{summary || resume.professionalSummary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 border-b border-indigo-100 pb-1">Work Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-slate-900">{exp.position}</span>
                  <span className="text-slate-500 font-semibold">{exp.startDate} - {exp.currentlyWorking || exp.current ? "Present" : exp.endDate}</span>
                </div>
                <p className="text-xs font-bold text-indigo-700">{exp.company} {exp.location && `• ${exp.location}`}</p>
                {exp.description && <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 border-b border-indigo-100 pb-1">Featured Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-1 border-l-2 border-indigo-500 pl-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900">{proj.projectName || proj.name}</p>
                </div>
                {proj.technologies && (
                  <p className="text-[10px] text-indigo-700 font-mono font-bold">[{formatTech(proj.technologies)}]</p>
                )}
                {proj.description && <p className="text-[11px] text-slate-700 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {achievements.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 border-b border-indigo-100 pb-1">Key Achievements</h2>
            {achievements.map((ach, idx) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-extrabold text-slate-900 text-xs">{ach.title || ach.achievementTitle}</p>
                {ach.description && <p className="text-[11px] text-slate-700">{ach.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
