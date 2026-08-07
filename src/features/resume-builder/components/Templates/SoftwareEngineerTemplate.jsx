/**
 * src/features/resume-builder/components/Templates/SoftwareEngineerTemplate.jsx
 * 4. Software Engineer: Specifically engineered for tech professionals, highlighting technical stack, GitHub, live projects, and certifications.
 * Fully compatible with Spring Boot ResumeDocumentResponse DTO schema.
 */

import React from "react";

export default function SoftwareEngineerTemplate({ resume }) {
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
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 text-left space-y-5 text-xs shadow-2xl border border-slate-200">
      {/* Header */}
      <div className="border-b-2 border-blue-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
            {personalInfo.fullName || resume.fullName || "Software Engineer"}
          </h1>
          <p className="text-xs font-black text-blue-600 uppercase tracking-wider">
            {personalInfo.professionalTitle || resume.professionalTitle}
          </p>
        </div>

        <div className="text-right text-[11px] text-slate-600 space-y-0.5 font-semibold">
          {(personalInfo.email || resume.email) && <p>{personalInfo.email || resume.email}</p>}
          {(personalInfo.phone || resume.phone) && <p>{personalInfo.phone || resume.phone}</p>}
          {(personalInfo.location || resume.location) && <p>{personalInfo.location || resume.location}</p>}
          {(personalInfo.gitHub || resume.githubUrl) && <p className="text-blue-700 font-bold">{personalInfo.gitHub || resume.githubUrl}</p>}
          {(personalInfo.linkedIn || resume.linkedinUrl) && <p className="text-blue-700 font-bold">{personalInfo.linkedIn || resume.linkedinUrl}</p>}
          {(personalInfo.portfolio || resume.portfolioUrl) && <p className="text-blue-700 font-bold">{personalInfo.portfolio || resume.portfolioUrl}</p>}
        </div>
      </div>

      {/* Summary */}
      {(summary || resume.professionalSummary) && (
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-950 border-b border-blue-100 pb-1">
            Engineering Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary || resume.professionalSummary}</p>
        </div>
      )}

      {/* Technical Stack Grid Banner */}
      {skillsArr.length > 0 && (
        <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-1.5 text-[11px]">
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-950">
            Technical Stack & Languages
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skillsArr.map((sk, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md font-bold text-[10px] border border-blue-200">
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-950 border-b border-blue-100 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">{exp.position} — <span className="text-blue-800 font-bold">{exp.company}</span></span>
                <span className="text-slate-500 font-semibold">{exp.startDate} - {exp.currentlyWorking || exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.description && <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Technical Projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-blue-950 border-b border-blue-100 pb-1">
            Featured Repositories & Key Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-1 border-l-2 border-blue-500 pl-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span>{proj.projectName || proj.name}</span>
                {proj.technologies && (
                  <span className="text-[10px] font-mono text-blue-800">[{formatTech(proj.technologies)}]</span>
                )}
              </div>
              {proj.githubUrl && <p className="text-[10px] text-blue-700 font-mono font-semibold">{proj.githubUrl}</p>}
              {proj.description && <p className="text-[11px] text-slate-700 leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {education.length > 0 && (
          <div className="space-y-1 text-[11px]">
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-950 border-b border-blue-100 pb-1">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-extrabold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</p>
                <p className="text-slate-600">{edu.institution} ({edu.grade || "N/A"})</p>
                <p className="text-slate-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="space-y-1 text-[11px]">
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-950 border-b border-blue-100 pb-1">Certifications</h2>
            {certifications.map((cert, idx) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-extrabold text-slate-900">{cert.name || cert.certificationName}</p>
                <p className="text-slate-600">{cert.issuingOrganization || cert.issuer} • {cert.issueDate || cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
