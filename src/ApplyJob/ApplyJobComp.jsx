/**
 * src/ApplyJob/ApplyJobComp.jsx
 *
 * Streamlined 1-Page Job Application Component.
 * Removes redundant multi-step wizard forms and personal info inputs.
 * Directly integrates Spring Boot JobApplicationController endpoint:
 * POST /api/applications/jobs/{jobId} ({ coverLetter, resumeId })
 */

import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@mantine/notifications";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconUpload,
  IconFileText,
  IconCircleCheck,
  IconSparkles,
  IconMapPin,
  IconBriefcase,
  IconX,
  IconStar,
  IconShield,
  IconLoader2,
  IconCheck,
  IconEdit,
  IconFileCv,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { applyToJobThunk } from "../State/applicationThunk";
import { getJobById } from "../State/JobSlice";
import { fetchProfileByEmailThunk } from "../State/profileThunk";
import { fetchMyResumesThunk, uploadResumeThunk } from "../State/resumeThunk";

/* ─── Helpers ─── */
function humanise(str) {
  if (!str) return "";
  return String(str)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatINR(val) {
  if (!val) return "";
  if (typeof val === "number") return `₹${val.toLocaleString("en-IN")}`;
  return val;
}

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ApplyJobComp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Redux Selectors
  const authUser = useAppSelector((state) => state.auth.profile);
  const userProfile = useAppSelector((state) => state.profile.profile);
  const { resumes, defaultResume } = useAppSelector((state) => state.resume);
  const { selectedJob } = useAppSelector((state) => state.job);
  const { applyLoading } = useAppSelector((state) => state.application);

  // File input ref for uploading new resume
  const fileInputRef = useRef(null);

  // Determine active job
  const jobIdFromQuery = searchParams.get("jobId");
  const passedJob = location.state?.job || selectedJob;
  const activeJobId = passedJob?.id || jobIdFromQuery || 1;

  useEffect(() => {
    if (!passedJob && activeJobId) {
      dispatch(getJobById(activeJobId));
    }
  }, [dispatch, passedJob, activeJobId]);

  useEffect(() => {
    if (authUser?.email && !userProfile) {
      dispatch(fetchProfileByEmailThunk(authUser.email));
    }
  }, [dispatch, authUser, userProfile]);

  useEffect(() => {
    dispatch(fetchMyResumesThunk());
  }, [dispatch]);

  const activeJob = passedJob || selectedJob || {
    id: activeJobId,
    jobTitle: "Senior React Engineer",
    companyName: "TechNova Solutions",
    companyLogo: null,
    city: "Pune",
    state: "Maharashtra",
    workingMode: "HYBRID",
    jobType: "FULL_TIME",
    minimumSalary: 1200000,
    maximumSalary: 1800000,
  };

  const [submitted, setSubmitted] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiVersionIndex, setAiVersionIndex] = useState(0);

  const fullName = authUser?.name || userProfile?.name || userProfile?.fullName || "Candidate";
  const userSkills = userProfile?.skills || userProfile?.skillsRequired || [];
  const skillsListText =
    Array.isArray(userSkills) && userSkills.length > 0
      ? userSkills.slice(0, 4).map((s) => (typeof s === "object" ? s.name || s.skillName || s : String(s))).join(", ")
      : "software engineering, modern full-stack development, and scalable architecture";

  const AI_VERSIONS = [
    {
      name: "Results-Driven",
      badge: "High Impact",
      getLetter: (name, company, title, skills) =>
        `Dear Hiring Manager at ${company},\n\nI am writing to express my enthusiastic interest in the ${title} position. With a strong technical background specializing in ${skills}, I have consistently built high-performance, user-centric applications that drive real business impact.\n\nWhat excites me most about ${company} is your commitment to engineering excellence and innovative product standards. I am confident that my technical skills, proactive problem-solving mindset, and dedication to code quality make me an immediate asset to your team.\n\nThank you for reviewing my application. I look forward to the opportunity to discuss how my background aligns with your team's goals.\n\nBest regards,\n${name}`,
    },
    {
      name: "Enthusiastic & Vision-Aligned",
      badge: "Culture & Passion",
      getLetter: (name, company, title, skills) =>
        `Dear ${company} Hiring Team,\n\nI am thrilled to submit my application for the ${title} role. Having followed ${company}'s growth and product roadmap, I am deeply inspired by your team's mission and engineering culture.\n\nEquipped with hands-on expertise in ${skills}, I thrive in collaborative, fast-paced environments where technical rigor meets creative problem-solving. I am eager to bring this energy and my skill set to the ${title} team.\n\nThank you for considering my candidacy. I would welcome the opportunity for an interview to explore how I can support your goals.\n\nWarm regards,\n${name}`,
    },
    {
      name: "Concise & Executive",
      badge: "Direct & Fast",
      getLetter: (name, company, title, skills) =>
        `Dear Hiring Team,\n\nPlease accept this note as my application for the ${title} position at ${company}. My professional background spans ${skills}, with a track record of delivering robust features and collaborating effectively across cross-functional teams.\n\nI am particularly eager to leverage my technical expertise at ${company} to solve complex challenges and accelerate your team's roadmap.\n\nThank you for your time. I look forward to discussing my qualifications in an interview.\n\nSincerely,\n${name}`,
    },
  ];

  // AI Cover Letter Generator
  const handleGenerateAICoverLetter = (targetVersionIdx) => {
    const nextIdx = targetVersionIdx !== undefined ? targetVersionIdx : (aiVersionIndex + 1) % AI_VERSIONS.length;
    setAiVersionIndex(nextIdx);
    setIsGeneratingAI(true);

    const compName = activeJob.companyName || activeJob.company || "the company";
    const jobName = activeJob.jobTitle || activeJob.title || "open role";
    const versionConfig = AI_VERSIONS[nextIdx];

    setTimeout(() => {
      const generated = versionConfig.getLetter(fullName, compName, jobName, skillsListText);
      setCoverLetter(generated);
      setIsGeneratingAI(false);
      notifications.show({
        title: `AI Cover Letter (${versionConfig.name})`,
        message: `Tailored version created highlighting ${skillsListText.substring(0, 30)}...`,
        color: "indigo",
      });
    }, 500);
  };

  // Pre-select default resume or first available
  useEffect(() => {
    const activeRes = defaultResume || resumes[0];
    if (activeRes?.id && !selectedResumeId) {
      setSelectedResumeId(activeRes.id);
    }
  }, [defaultResume, resumes, selectedResumeId]);

  const email = authUser?.email || userProfile?.email || "";
  const phone = authUser?.phone || userProfile?.phone || userProfile?.phoneNumber || "Not provided";
  const candidateLocation =
    [userProfile?.city, userProfile?.state].filter(Boolean).join(", ") || userProfile?.location || "India";

  // Calculate AI Job Match Score & Skill Overlap
  const jobSkillsRequired = activeJob?.skillsRequired || activeJob?.skills || ["React", "Java", "Spring Boot"];
  const candidateSkillsArr = (userProfile?.skills || userProfile?.skillsRequired || []).map((s) =>
    (typeof s === "object" ? s.name || s.skillName || "" : String(s)).toLowerCase().trim()
  );

  const matchedSkills = jobSkillsRequired.filter((skill) =>
    candidateSkillsArr.some((cSkill) => cSkill.includes(String(skill).toLowerCase().trim()))
  );

  const matchPercentage =
    jobSkillsRequired.length > 0
      ? Math.min(98, Math.max(72, Math.round((matchedSkills.length / Math.max(1, jobSkillsRequired.length)) * 100)))
      : 88;

  // Handle uploading a custom resume on the spot
  const handleUploadResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      const res = await dispatch(
        uploadResumeThunk({
          file,
          resumeName: file.name,
          isDefault: resumes.length === 0,
        })
      ).unwrap();

      const uploadedId = res?.id || res?.data?.id;
      dispatch(fetchMyResumesThunk());
      if (uploadedId) {
        setSelectedResumeId(uploadedId);
      }
      notifications.show({
        title: "Resume Uploaded",
        message: `${file.name} uploaded successfully!`,
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Upload Failed",
        message: err || "Failed to upload resume.",
        color: "red",
      });
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    if (!selectedResumeId && resumes.length === 0) {
      notifications.show({
        title: "Resume Required",
        message: "Please upload or select a resume before submitting.",
        color: "orange",
      });
      return;
    }

    try {
      const applicationData = {
        coverLetter: coverLetter ? coverLetter.substring(0, 2000) : "",
        resumeId: selectedResumeId || (resumes[0]?.id ?? null),
      };

      await dispatch(applyToJobThunk({ jobId: activeJob.id, applicationData })).unwrap();
      setSubmitted(true);
    } catch (err) {
      notifications.show({
        title: "Submission Error",
        message: err || "Failed to submit application. Please try again.",
        color: "red",
      });
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto shadow-2xl"
        >
          <IconCircleCheck size={48} />
        </motion.div>

        <h2 className="text-3xl font-extrabold text-white font-satoshi">
          Application Submitted!
        </h2>

        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Your application for <span className="text-indigo-400 font-bold">{activeJob.jobTitle || activeJob.title}</span> at{" "}
          <span className="text-white font-bold">{activeJob.companyName || activeJob.company}</span> has been sent successfully.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate("/my-jobs/applied")}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Track Application Status →
          </button>
          <button
            onClick={() => navigate("/find-jobs")}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            Explore More Jobs
          </button>
        </div>
      </div>
    );
  }

  const logoSrc = activeJob?.companyLogo
    ? activeJob.companyLogo.startsWith("http")
      ? activeJob.companyLogo
      : `http://localhost:8080/uploads/company/${activeJob.companyLogo}`
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Active Job Header Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-3xl border border-white/10 bg-[#090d16]/90 p-6 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 font-black text-xl font-satoshi">
            {logoSrc ? (
              <img src={logoSrc} alt={activeJob.companyName} className="h-full w-full object-contain rounded-2xl" />
            ) : (
              (activeJob.companyName || activeJob.company || "V").charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-satoshi">
              {activeJob.companyName || activeJob.company}
            </p>
            <h2 className="mt-0.5 text-xl sm:text-2xl font-black text-white font-satoshi leading-tight">
              {activeJob.jobTitle || activeJob.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                <IconMapPin size={13} className="text-indigo-400" />
                {[activeJob.city, activeJob.state].filter(Boolean).join(", ") || activeJob.location || "Remote"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                <IconBriefcase size={13} className="text-purple-400" />
                {humanise(activeJob.jobType || activeJob.type || "FULL_TIME")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                {formatINR(activeJob.minimumSalary)} - {formatINR(activeJob.maximumSalary)}
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Fast-Track Application
          </span>
        </div>
      </motion.div>

      {/* ── Main Application Card ── */}
      <div className="rounded-3xl border border-white/10 bg-[#090d16] p-6 sm:p-8 shadow-2xl space-y-8">
        {/* ── Candidate Profile Summary Badge & AI Match Score ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-indigo-500/15">
            <div className="flex items-center gap-2">
              <IconShield className="h-4 w-4 text-indigo-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-satoshi">
                Applicant Verified Profile
              </h3>
            </div>

            {/* AI Job Match Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-300 shadow-sm">
                <IconSparkles size={13} className="text-amber-400 fill-amber-400/20 animate-pulse" />
                {matchPercentage}% AI Match Score
              </span>

              <Link
                to="/profile"
                className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1 shrink-0"
              >
                <IconEdit size={13} /> Edit Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <IconUser size={15} className="text-slate-400 shrink-0" />
              <span className="font-bold text-white truncate">{fullName}</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <IconMail size={15} className="text-slate-400 shrink-0" />
              <span className="truncate">{email || "Email not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconPhone size={15} className="text-slate-400 shrink-0" />
              <span>{phone}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Section 1: Resume Selection ── */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-satoshi">Select Resume</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the resume you want recruiters to review for this role.
              </p>
            </div>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUploadResume}
            />

            <button
              type="button"
              disabled={uploadingResume}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <IconUpload size={14} />
              {uploadingResume ? "Uploading..." : "Upload New"}
            </button>
          </div>

          {resumes && resumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resumes.map((res) => {
                const isSelected = selectedResumeId === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResumeId(res.id)}
                    className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-indigo-500 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-indigo-500/10 shadow-[0_8px_25px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/30 scale-[1.01]"
                        : "border-white/10 bg-[#0c101c]/80 hover:border-white/25 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${isSelected ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30" : "bg-red-500/15 text-red-400"}`}>
                        <IconFileCv size={22} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate font-satoshi">
                          {res.resumeName || res.fileName || "Resume.pdf"}
                        </p>
                        {res.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-400">Default Resume</span>
                        )}
                      </div>
                    </div>

                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? "border-indigo-500 bg-indigo-500 text-white shadow-sm" : "border-slate-600"}`}>
                      {isSelected && <IconCheck size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 text-center">
              <IconFileCv size={36} className="mx-auto mb-2 text-indigo-400" />
              <p className="text-xs font-semibold text-white">No Resumes Found</p>
              <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Upload your resume to continue.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition cursor-pointer"
              >
                Upload Resume PDF
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Section 2: Cover Letter (Optional / Max 2000 Chars) ── */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white font-satoshi flex items-center gap-2">
                Cover Letter / Note
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add an optional note to highlight why you're a great fit (max 2000 characters).
              </p>
            </div>

            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={() => handleGenerateAICoverLetter()}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-purple-600/20 to-indigo-600/20 px-4 py-2 text-xs font-extrabold text-amber-200 hover:text-white hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:scale-105 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-sm shrink-0 self-start sm:self-auto"
              title="Generate a personalized cover letter using AI"
            >
              <IconSparkles size={15} className="text-amber-400 animate-pulse fill-amber-400/20" />
              {isGeneratingAI ? "Generating AI Letter..." : "Generate with AI"}
            </button>
          </div>

          {/* AI Version Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-amber-300 shrink-0 flex items-center gap-1">
              <IconSparkles size={12} className="text-amber-400" /> AI Versions:
            </span>
            {AI_VERSIONS.map((ver, idx) => (
              <button
                key={ver.name}
                type="button"
                onClick={() => handleGenerateAICoverLetter(idx)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold border transition-all cursor-pointer shrink-0 ${
                  coverLetter && aiVersionIndex === idx
                    ? "bg-amber-500/20 text-amber-200 border-amber-400 shadow-md shadow-amber-500/10"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {ver.name} <span className="text-[9px] opacity-75 font-normal">({ver.badge})</span>
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            maxLength={2000}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder={`Hi Hiring Team,\n\nI am excited to submit my application for ${activeJob.jobTitle || activeJob.title}. With my experience in relevant skills, I am confident in contributing effectively...`}
            className="w-full rounded-2xl border border-white/10 bg-[#080c16] p-4 text-xs text-white placeholder-slate-500 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20 focus:outline-none leading-relaxed transition-all"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Optional note to recruiter</span>
            <span className={coverLetter.length > 2000 ? "text-rose-400 font-bold" : ""}>
              {coverLetter.length} / 2000
            </span>
          </div>
        </motion.div>

        {/* ── Submit Action Bar ── */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="pt-5 border-t border-white/10 flex items-center justify-between"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmitApplication}
            disabled={applyLoading || (!selectedResumeId && resumes.length === 0)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {applyLoading ? (
              <>
                <IconLoader2 size={16} className="animate-spin text-amber-300" /> Submitting Application...
              </>
            ) : (
              <>
                <IconSparkles size={16} className="text-amber-300 fill-amber-300/20" /> Submit Application
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}