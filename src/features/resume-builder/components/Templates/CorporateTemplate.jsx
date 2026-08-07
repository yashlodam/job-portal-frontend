/**
 * src/features/resume-builder/components/Templates/CorporateTemplate.jsx
 * 5. Corporate: Executive style suitable for experienced professionals, managers, architects, and senior developers.
 * Fully compatible with Spring Boot ResumeDocumentResponse DTO schema.
 */

import React from "react";

export default function CorporateTemplate({ resume }) {
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
    <div className="bg-white text-slate-900 font-serif p-8 sm:p-10 text-left space-y-6 text-xs shadow-2xl border border-slate-300 leading-normal">
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-none text-center space-y-1.5 -mx-8 sm:-mx-10 -mt-8 sm:-mt-10 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
          {personalInfo.fullName || resume.fullName || "Executive Name"}
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
          {personalInfo.professionalTitle || resume.professionalTitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300 font-sans pt-1">
          {(personalInfo.email || resume.email) && <span>{personalInfo.email || resume.email}</span>}
          {(personalInfo.phone || resume.phone) && <span>• {personalInfo.phone || resume.phone}</span>}
          {(personalInfo.location || resume.location) && <span>• {personalInfo.location || resume.location}</span>}
          {(personalInfo.linkedIn || resume.linkedinUrl) && <span>• {personalInfo.linkedIn || resume.linkedinUrl}</span>}
        </div>
      </div>

      {/* Summary */}
      {(summary || resume.professionalSummary) && (
        <div className="space-y-1 font-sans">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1">
            Executive Summary & Vision
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed italic">{summary || resume.professionalSummary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-4 font-sans">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1">
            Professional & Leadership Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span>{exp.position} — <span className="font-bold text-amber-900">{exp.company}</span></span>
                <span className="text-slate-600 font-semibold">{exp.startDate} - {exp.currentlyWorking || exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.description && <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-3 font-sans">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1">
            Enterprise Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between font-bold text-xs">
                <span>{proj.projectName || proj.name}</span>
                {proj.technologies && <span className="text-[10px] text-slate-600">[{formatTech(proj.technologies)}]</span>}
              </div>
              {proj.description && <p className="text-[11px] text-slate-700">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Core Competencies & Skills */}
      {skillsArr.length > 0 && (
        <div className="space-y-2 font-sans">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1">
            Strategic Competencies & Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {skillsArr.map((sk, idx) => (
              <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded font-bold border border-slate-200">
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education & Credentials */}
      {education.length > 0 && (
        <div className="space-y-2 font-sans">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1">
            Education & Academic Background
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-xs text-slate-900">
              <span className="font-bold">{edu.degree} in {edu.fieldOfStudy} — {edu.institution} ({edu.grade})</span>
              <span className="text-slate-600">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
