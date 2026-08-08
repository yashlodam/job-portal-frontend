/**
 * src/features/resume-builder/pages/ResumeEditorPage.jsx
 * 3-Panel Editor Page with spacious desktop A4 live sync canvas and cloud auto-save status.
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Save, CheckCircle2, Loader2, FileText, Download, ArrowLeft } from "lucide-react";
import { useResumeBuilder } from "../hooks/useResumeBuilder";
import { useToast } from "../../../components/ui/ToastNotification";
import SectionNav from "../components/Editor/SectionNav";
import PersonalInfoForm from "../components/Editor/PersonalInfoForm";
import SummaryForm from "../components/Editor/SummaryForm";
import ExperienceForm from "../components/Editor/ExperienceForm";
import EducationForm from "../components/Editor/EducationForm";
import ProjectsForm from "../components/Editor/ProjectsForm";
import SkillsForm from "../components/Editor/SkillsForm";
import CertificationsForm from "../components/Editor/CertificationsForm";
import AchievementsForm from "../components/Editor/AchievementsForm";
import ResumePreviewContainer from "../components/Preview/ResumePreviewContainer";
import AISuggestionModal from "../components/AI/AISuggestionModal";

export default function ResumeEditorPage() {
  const toast = useToast();
  const [activeSection, setActiveSection] = useState("personalInfo");

  const {
    currentResume,
    updatePersonalInfo,
    updateSummary,
    updateExperience,
    updateEducation,
    updateProjects,
    updateSkills,
    updateCertifications,
    updateAchievements,
    updateLanguages,
    updateResume,
    saveStatus,
    isDirty,
    setViewMode,
  } = useResumeBuilder();

  // Debounced auto-save effect (1.5s after user stops typing)
  useEffect(() => {
    if (!isDirty || !currentResume?.id) return;
    const timer = setTimeout(() => {
      updateResume({ id: currentResume.id, resumeData: currentResume });
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentResume, isDirty]);

  const handleManualSave = () => {
    if (currentResume?.id) {
      updateResume({ id: currentResume.id, resumeData: currentResume });
      toast.success("Resume saved successfully!");
    }
  };

  return (
    <div className="space-y-6 font-satoshi text-white pb-12">
      {/* Top Controls & Cloud Auto-Save Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#090d16]/95 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode("dashboard")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition cursor-pointer border border-white/10"
          >
            <ArrowLeft size={15} /> Dashboard
          </button>

          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 text-[11px] font-black text-indigo-400 uppercase tracking-widest">
              <Sparkles size={12} className="text-amber-300 animate-pulse" /> Live A4 Sync Active
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" />
              {currentResume?.title || "Untitled Resume"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            {saveStatus === "saving" ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Loader2 size={14} className="animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={14} /> Saved to Cloud
              </span>
            )}
          </div>

          <button
            onClick={handleManualSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-xl hover:scale-105"
          >
            <Save size={15} /> Save Draft
          </button>
        </div>
      </div>

      {/* Spacious 2-Column Desktop Grid Layout (Editor: 5 cols | Preview: 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Selector Nav & Dynamic Form Editor (5 cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Compact Section Navigation Bar */}
          <div className="p-4 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-xl">
            <SectionNav
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              resume={currentResume}
            />
          </div>

          {/* Form Editor Card */}
          <div className="p-6 rounded-3xl bg-[#090d16]/95 border border-white/10 backdrop-blur-2xl shadow-xl min-h-[550px]">
            {activeSection === "personalInfo" && (
              <PersonalInfoForm
                info={currentResume?.personalInfo}
                onChange={updatePersonalInfo}
              />
            )}

            {activeSection === "summary" && (
              <SummaryForm
                summary={currentResume?.summary}
                onChange={updateSummary}
              />
            )}

            {activeSection === "experience" && (
              <ExperienceForm
                experience={currentResume?.experience}
                onChange={updateExperience}
              />
            )}

            {activeSection === "education" && (
              <EducationForm
                education={currentResume?.education}
                onChange={updateEducation}
              />
            )}

            {activeSection === "projects" && (
              <ProjectsForm
                projects={currentResume?.projects}
                onChange={updateProjects}
              />
            )}

            {activeSection === "skills" && (
              <SkillsForm
                skills={currentResume?.skills}
                onChange={updateSkills}
              />
            )}

            {activeSection === "certifications" && (
              <CertificationsForm
                certifications={currentResume?.certifications}
                onChange={updateCertifications}
              />
            )}

            {activeSection === "achievements" && (
              <AchievementsForm
                achievements={currentResume?.achievements}
                onChange={updateAchievements}
              />
            )}
          </div>
        </div>

        {/* Right Column: Premium Desktop Live A4 Document Canvas (7 cols on Desktop) */}
        <div className="lg:col-span-7 sticky top-6">
          <ResumePreviewContainer resume={currentResume} />
        </div>
      </div>

      {/* AI Suggestion Modal — only shown for non-auto-applied suggestions */}
      <AISuggestionModal />
    </div>
  );
}
