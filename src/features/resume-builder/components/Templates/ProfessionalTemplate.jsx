/**
 * src/features/resume-builder/components/Templates/ProfessionalTemplate.jsx
 * 1. Professional (Default): Clean single-column layout, ATS-friendly, professional typography, minimal colors.
 * Fully compatible with Spring Boot ResumeDocumentResponse DTO schema & Multi-Page PDF Print standards.
 */

import React from "react";

export default function ProfessionalTemplate({ resume }) {
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
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 text-left space-y-5 text-xs shadow-2xl leading-normal border border-slate-200">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
          {personalInfo.fullName || resume.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {personalInfo.professionalTitle || resume.professionalTitle || "Professional Title"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600 font-medium pt-1">
          {(personalInfo.email || resume.email) && <span>{personalInfo.email || resume.email}</span>}
          {(personalInfo.phone || resume.phone) && <span>• {personalInfo.phone || resume.phone}</span>}
          {(personalInfo.location || resume.location) && <span>• {personalInfo.location || resume.location}</span>}
          {(personalInfo.linkedIn || resume.linkedinUrl) && <span>• {personalInfo.linkedIn || resume.linkedinUrl}</span>}
          {(personalInfo.gitHub || resume.githubUrl) && <span>• {personalInfo.gitHub || resume.githubUrl}</span>}
        </div>
      </div>

      {/* Summary */}
      {(summary || resume.professionalSummary) && (
        <div className="space-y-1.5 break-inside-avoid-page">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-normal">{summary || resume.professionalSummary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Work Experience
          </h2>

          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-1 break-inside-avoid-page">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">{exp.position} — <span className="font-bold text-slate-700">{exp.company}</span></span>
                  <span className="text-slate-600 font-semibold">{exp.startDate} - {exp.currentlyWorking || exp.current ? "Present" : exp.endDate}</span>
                </div>
                {exp.description && (
                  <p className="text-[11px] text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Technical Projects
          </h2>

          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="space-y-1 break-inside-avoid-page">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                  <span>{proj.projectName || proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[10px] font-bold text-slate-600">[{formatTech(proj.technologies)}]</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-700 leading-relaxed font-normal">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillsArr.length > 0 && (
        <div className="space-y-1.5 break-inside-avoid-page">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Core Competencies & Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-800">
            {skillsArr.map((sk, idx) => (
              <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded font-bold border border-slate-200">
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-2 break-inside-avoid-page">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={cert.id || idx} className="flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-900">{cert.name || cert.certificationName}</span>
                {(cert.issuingOrganization || cert.issuer) && <span className="text-slate-600"> — {cert.issuingOrganization || cert.issuer}</span>}
              </div>
              <span className="text-slate-600 font-semibold">{cert.issueDate || cert.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2 break-inside-avoid-page">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Education
          </h2>

          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-900">{edu.degree}</span> in {edu.fieldOfStudy} — <span className="font-semibold text-slate-700">{edu.institution}</span> ({edu.grade})
              </div>
              <span className="text-slate-600 font-semibold">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-2 break-inside-avoid-page">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Achievements
          </h2>
          {achievements.map((ach, idx) => (
            <div key={ach.id || idx} className="space-y-0.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{ach.title || ach.achievementTitle}</span>
                {ach.date && <span className="text-slate-500">{ach.date}</span>}
              </div>
              {ach.description && <p className="text-[11px] text-slate-700">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="space-y-1 break-inside-avoid-page">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
            Languages
          </h2>
          <p className="text-[11px] text-slate-800 font-medium">
            {languages.map((l) => (typeof l === "string" ? l : l.language)).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
}
