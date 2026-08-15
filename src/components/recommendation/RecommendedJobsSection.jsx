/**
 * src/components/recommendation/RecommendedJobsSection.jsx
 *
 * Applicant-facing Personalized Job Recommendations feed.
 * Features:
 * - Deterministic scoring engine integration (skills, location, experience, freshness).
 * - Instant Quick-Skill Onboarding for first-time / new users.
 * - Interactive Match Breakdown Modal.
 * - 5-tier color coded match badges.
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  MapPin,
  Building2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Flame,
  Award,
  ArrowRight,
  Info,
  RefreshCw,
  Zap,
  Plus,
  Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchRecommendations } from "../../State/recommendationSlice";
import { saveJobThunk, unsaveJobThunk } from "../../State/savedJobThunk";
import { updateSkillsThunk } from "../../State/profileThunk";
import { useToast } from "../ui/ToastNotification";

const POPULAR_SKILLS = [
  "Java",
  "Spring Boot",
  "React",
  "Python",
  "Node.js",
  "AWS",
  "SQL",
  "Docker",
  "TypeScript",
  "Next.js",
  "Kubernetes",
  "DevOps",
];

export default function RecommendedJobsSection({ limit = 10, showHeading = true, className = "" }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { recommendations, loading, error } = useAppSelector((state) => state.recommendations);
  const { profile: authUser } = useAppSelector((state) => state.auth);
  const { profile: userProfile } = useAppSelector((state) => state.profile);
  const { savedJobs } = useAppSelector((state) => state.savedJob);

  const [minMatch, setMinMatch] = useState(0);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [addingSkill, setAddingSkill] = useState(null);

  // Active skills in candidate profile
  const candidateSkills = (userProfile?.skills || authUser?.skills || []).map((s) =>
    typeof s === "string" ? s.trim() : (s.name || "").trim()
  );

  useEffect(() => {
    dispatch(fetchRecommendations({ limit, minMatch }));
  }, [dispatch, limit, minMatch]);

  const handleRefresh = () => {
    dispatch(fetchRecommendations({ limit, minMatch }));
  };

  const handleQuickAddSkill = async (skillName) => {
    if (candidateSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      toast.info(`"${skillName}" is already in your profile.`);
      return;
    }

    setAddingSkill(skillName);
    try {
      const updatedSkillsList = [...candidateSkills, skillName];
      await dispatch(updateSkillsThunk({ skills: updatedSkillsList })).unwrap();
      toast.success(`Added "${skillName}"! Recalculating recommendations…`);
      // Refresh recommendations immediately
      dispatch(fetchRecommendations({ limit, minMatch }));
    } catch (err) {
      toast.error("Failed to add skill. Please try from Profile page.");
    } finally {
      setAddingSkill(null);
    }
  };

  const handleToggleSave = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();

    const isSaved = savedJobs?.some((sj) => sj.job?.id === job.id || sj.id === job.id);
    try {
      if (isSaved) {
        await dispatch(unsaveJobThunk(job.id)).unwrap();
        toast.info(`Removed "${job.jobTitle}" from saved jobs`);
      } else {
        await dispatch(saveJobThunk(job.id)).unwrap();
        toast.success(`Saved "${job.jobTitle}" to your bookmarks`);
      }
    } catch (err) {
      toast.error(err || "Failed to update saved job");
    }
  };

  const getMatchGradeColor = (percentage) => {
    if (percentage >= 85) {
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        ring: "ring-emerald-500/20",
        badge: "bg-emerald-500 text-slate-950",
      };
    }
    if (percentage >= 70) {
      return {
        bg: "bg-indigo-500/15",
        text: "text-indigo-400",
        border: "border-indigo-500/30",
        ring: "ring-indigo-500/20",
        badge: "bg-indigo-500 text-white",
      };
    }
    if (percentage >= 50) {
      return {
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        ring: "ring-cyan-500/20",
        badge: "bg-cyan-500 text-slate-950",
      };
    }
    if (percentage >= 30) {
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/30",
        ring: "ring-amber-500/20",
        badge: "bg-amber-500 text-slate-950",
      };
    }
    return {
      bg: "bg-rose-500/15",
      text: "text-rose-400",
      border: "border-rose-500/30",
      ring: "ring-rose-500/20",
      badge: "bg-rose-500 text-white",
    };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ── Section Header ─────────────────────────────────────────────────── */}
      {showHeading && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Personalized Career Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-satoshi tracking-tight">
              Recommended Jobs for You
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ranked by your skills, experience fit, and work preferences.
            </p>
          </div>

          {/* Filters & Refresh Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1 text-xs">
              <button
                onClick={() => setMinMatch(0)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  minMatch === 0 ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                All Matches
              </button>
              <button
                onClick={() => setMinMatch(50)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  minMatch === 50 ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                50%+ Fit
              </button>
              <button
                onClick={() => setMinMatch(75)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  minMatch === 75 ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                75%+ Top
              </button>
            </div>

            <button
              onClick={handleRefresh}
              title="Refresh recommendations"
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </div>
      )}

      {/* ── New User Quick-Skill Onboarding Banner (If user has <= 2 skills) ── */}
      {candidateSkills.length <= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#0a0f1d] to-[#090d16] p-5 sm:p-6 space-y-4 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-white font-satoshi">
                  ✨ Quick Start: Select your top skills to unlock instant matches
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any skill below to add it to your profile and immediately recalculate your match scores.
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 self-start sm:self-auto shrink-0"
            >
              <span>Full Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Quick-add Skill Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {POPULAR_SKILLS.map((skill) => {
              const isSelected = candidateSkills.some(
                (s) => s.toLowerCase() === skill.toLowerCase()
              );
              const isAdding = addingSkill === skill;

              return (
                <button
                  key={skill}
                  onClick={() => handleQuickAddSkill(skill)}
                  disabled={isSelected || isAdding}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 cursor-default"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white shadow-sm"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : isAdding ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                  ) : (
                    <Plus className="h-3 w-3 text-slate-400 group-hover:text-white" />
                  )}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Loading Skeleton ────────────────────────────────────────────────── */}
      {loading && recommendations.length === 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${limit > 4 ? "xl:grid-cols-3" : "xl:grid-cols-2"} gap-5`}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-white/10 bg-[#090d16] p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-4 w-44 rounded bg-white/10" />
                    <div className="h-3 w-28 rounded bg-white/5" />
                  </div>
                </div>
                <div className="h-8 w-16 rounded-full bg-white/10" />
              </div>
              <div className="h-12 rounded-xl bg-white/5" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-white/5" />
                <div className="h-6 w-24 rounded-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ────────────────────────────────────────────────────── */}
      {!loading && recommendations.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-[#090d16] p-8 sm:p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Zap className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-extrabold text-white font-satoshi">
            {minMatch > 0 ? "No Jobs Matching Filter" : "Explore Active Opportunities"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {minMatch > 0
              ? `No jobs reached the ${minMatch}% match threshold. Try resetting to "All Matches".`
              : "Select 3+ skills in the quick-start banner above to unlock instant job matching."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {minMatch > 0 && (
              <button
                onClick={() => setMinMatch(0)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
              >
                Reset to All Matches
              </button>
            )}
            <Link
              to="/find-jobs"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      )}

      {/* ── Recommendations Grid ────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${limit > 4 ? "xl:grid-cols-3" : "xl:grid-cols-2"} gap-5`}>
        {recommendations.map((job, idx) => {
          const colors = getMatchGradeColor(job.matchPercentage);
          const isSaved = savedJobs?.some((sj) => sj.job?.id === job.id || sj.id === job.id);

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#090d16] hover:bg-[#0c1220] hover:border-indigo-500/30 transition-all p-5 shadow-lg shadow-black/20"
            >
              <div className="space-y-3.5">
                {/* Header: Company + Title + Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName || "Company"}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Building2 className="h-5 w-5 text-indigo-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-bold text-white text-base hover:text-indigo-400 transition truncate block font-satoshi"
                      >
                        {job.jobTitle}
                      </Link>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {job.companyName || "Verified Company"}
                      </p>
                    </div>
                  </div>

                  {/* Match Percentage Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-black text-xs border ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{job.matchPercentage}% Fit</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                      {job.matchGrade}
                    </span>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {job.city ? `${job.city}${job.state ? `, ${job.state}` : ""}` : "Remote"}
                  </span>

                  {job.workingMode && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/5 font-semibold text-slate-300">
                      {job.workingMode}
                    </span>
                  )}

                  {job.minimumSalary && job.maximumSalary && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 font-semibold">
                      ₹{(job.minimumSalary / 100000).toFixed(1)}-{(job.maximumSalary / 100000).toFixed(1)} LPA
                    </span>
                  )}

                  {job.urgentHiring && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 text-rose-300 px-2 py-0.5 border border-rose-500/30 text-[10px] font-extrabold uppercase">
                      <Flame className="h-3 w-3 text-rose-400 fill-rose-400" /> Urgent
                    </span>
                  )}
                </div>

                {/* Reason Banner */}
                {job.matchReason && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2 text-[11px] text-slate-300 flex items-center justify-between gap-2">
                    <span className="truncate">
                      💡 <strong className="text-white">Why Recommended:</strong> {job.matchReason}
                    </span>
                    <button
                      onClick={() => setSelectedJobForModal(job)}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 shrink-0 underline ml-1 cursor-pointer"
                    >
                      View Breakdown
                    </button>
                  </div>
                )}

                {/* Skills Preview */}
                {job.matchedSkills && job.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">
                      Matched:
                    </span>
                    {job.matchedSkills.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                    {job.matchedSkills.length > 4 && (
                      <span className="text-[10px] font-bold text-slate-500">
                        +{job.matchedSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Missing Skills Preview */}
                {job.missingSkills && job.missingSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">
                      Missing:
                    </span>
                    {job.missingSkills.slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-300"
                      >
                        <XCircle className="h-2.5 w-2.5 text-rose-400" />
                        {skill}
                      </span>
                    ))}
                    {job.missingSkills.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-500">
                        +{job.missingSkills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={(e) => handleToggleSave(e, job)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                    isSaved
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Match Breakdown Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedJobForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#090d16] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 mb-1">
                    <Sparkles className="h-3 w-3" /> Match Scoring Breakdown
                  </div>
                  <h3 className="text-lg font-bold text-white font-satoshi">
                    {selectedJobForModal.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedJobForModal.companyName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJobForModal(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Match Score Gauges */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skill Match</span>
                  <p className="text-xl font-extrabold text-indigo-400 font-satoshi">
                    {selectedJobForModal.skillMatchScore}%
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Experience</span>
                  <p className="text-xl font-extrabold text-indigo-400 font-satoshi">
                    {selectedJobForModal.experienceMatchScore}%
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                  <p className="text-xl font-extrabold text-indigo-400 font-satoshi">
                    {selectedJobForModal.locationMatchScore}%
                  </p>
                </div>
              </div>

              {/* Matched Skills List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  ✓ Matched Required Skills:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                  {selectedJobForModal.matchedSkills && selectedJobForModal.matchedSkills.length > 0 ? (
                    selectedJobForModal.matchedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-300"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No exact skill matches</span>
                  )}
                </div>
              </div>

              {/* Missing Skills List */}
              {selectedJobForModal.missingSkills && selectedJobForModal.missingSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block">
                    ✕ Recommended Skills to Learn:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                    {selectedJobForModal.missingSkills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-medium text-rose-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedJobForModal(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  Close
                </button>
                <Link
                  to={`/jobs/${selectedJobForModal.id}`}
                  onClick={() => setSelectedJobForModal(null)}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                >
                  Apply to Job
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
