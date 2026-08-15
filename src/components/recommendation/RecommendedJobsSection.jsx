/**
 * src/components/recommendation/RecommendedJobsSection.jsx
 *
 * Applicant-facing Personalized Job Recommendations feed.
 * Synced with updated backend API response shape:
 *  - matchedSkills         → matched required skills
 *  - missingSkills         → missing required skills
 *  - matchedPreferredSkills → preferred skills candidate has (bonus)
 *  - skillMatchScore       → 0-100
 *  - experienceMatchScore  → 0-100
 *  - locationMatchScore    → 0-100
 *  - freshnessScore        → 0-100 (new)
 *  - matchReason           → human-readable string
 *  - matchGrade            → EXCELLENT / GREAT / GOOD / FAIR / LOW
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
  Star,
  Flame,
  ArrowRight,
  RefreshCw,
  Zap,
  Plus,
  Check,
  Clock,
  Target,
  Award,
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

// ── Grade helpers ──────────────────────────────────────────────────────────────

function getMatchColors(percentage) {
  if (percentage >= 85)
    return {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      bar: "bg-emerald-500",
      badgeBg: "bg-emerald-500",
      badgeText: "text-slate-950",
    };
  if (percentage >= 70)
    return {
      bg: "bg-indigo-500/15",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      bar: "bg-indigo-500",
      badgeBg: "bg-indigo-500",
      badgeText: "text-white",
    };
  if (percentage >= 55)
    return {
      bg: "bg-cyan-500/15",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      bar: "bg-cyan-500",
      badgeBg: "bg-cyan-500",
      badgeText: "text-slate-950",
    };
  if (percentage >= 35)
    return {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      border: "border-amber-500/30",
      bar: "bg-amber-500",
      badgeBg: "bg-amber-500",
      badgeText: "text-slate-950",
    };
  return {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/30",
    bar: "bg-rose-500",
    badgeBg: "bg-rose-500",
    badgeText: "text-white",
  };
}

function ScoreBar({ label, value, colorClass }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-semibold">{label}</span>
        <span className={`font-black ${colorClass}`}>{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
        />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function RecommendedJobsSection({ limit = 10, showHeading = true, className = "" }) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { recommendations, loading } = useAppSelector((s) => s.recommendations);
  const { profile: authUser } = useAppSelector((s) => s.auth);
  const { profile: userProfile } = useAppSelector((s) => s.profile);
  const { savedJobs } = useAppSelector((s) => s.savedJob);

  const [minMatch, setMinMatch] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [addingSkill, setAddingSkill] = useState(null);

  const candidateSkills = (userProfile?.skills || authUser?.skills || []).map((s) =>
    typeof s === "string" ? s.trim() : (s.name || "").trim()
  );

  useEffect(() => {
    dispatch(fetchRecommendations({ limit, minMatch }));
  }, [dispatch, limit, minMatch]);

  const handleRefresh = () => dispatch(fetchRecommendations({ limit, minMatch }));

  const handleQuickAddSkill = async (skillName) => {
    if (candidateSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      toast.info(`"${skillName}" is already in your profile.`);
      return;
    }
    setAddingSkill(skillName);
    try {
      await dispatch(updateSkillsThunk({ skills: [...candidateSkills, skillName] })).unwrap();
      toast.success(`Added "${skillName}"! Recalculating…`);
      dispatch(fetchRecommendations({ limit, minMatch }));
    } catch {
      toast.error("Failed to add skill. Try from Profile page.");
    } finally {
      setAddingSkill(null);
    }
  };

  const handleToggleSave = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();
    const alreadySaved = savedJobs?.some((sj) => sj.job?.id === job.id || sj.id === job.id);
    try {
      if (alreadySaved) {
        await dispatch(unsaveJobThunk(job.id)).unwrap();
        toast.info(`Removed "${job.jobTitle}" from saved jobs`);
      } else {
        await dispatch(saveJobThunk(job.id)).unwrap();
        toast.success(`Saved "${job.jobTitle}" to bookmarks`);
      }
    } catch (err) {
      toast.error(err || "Failed to update saved job");
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>

      {/* ── Section Header ──────────────────────────────────────────────────── */}
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
              Ranked by your skills, experience fit, location, and posting freshness.
            </p>
          </div>

          {/* Filters & Refresh */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1 text-xs">
              {[
                { label: "All", value: 0 },
                { label: "50%+ Fit", value: 50 },
                { label: "75%+ Top", value: 75 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMinMatch(opt.value)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    minMatch === opt.value
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh recommendations"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </div>
      )}

      {/* ── Quick-Skill Onboarding (new users with ≤ 2 skills) ──────────────── */}
      {candidateSkills.length <= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#0a0f1d] to-[#090d16] p-5 sm:p-6 space-y-4 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-white font-satoshi">
                  ✨ Quick Start: Select your top skills to unlock instant matches
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any skill below to add it and immediately recalculate your match scores.
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
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 cursor-default"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white shadow-sm cursor-pointer"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : isAdding ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                  ) : (
                    <Plus className="h-3 w-3 text-slate-400" />
                  )}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Loading Skeleton ─────────────────────────────────────────────────── */}
      {loading && recommendations.length === 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${limit > 4 ? "xl:grid-cols-3" : "xl:grid-cols-2"} gap-5`}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-2xl border border-white/10 bg-[#090d16] p-5 space-y-4 animate-pulse">
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

      {/* ── Empty State ──────────────────────────────────────────────────────── */}
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

      {/* ── Recommendations Grid ──────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${limit > 4 ? "xl:grid-cols-3" : "xl:grid-cols-2"} gap-5`}>
        {recommendations.map((job, idx) => {
          const colors = getMatchColors(job.matchPercentage);
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
                {/* Company Logo + Title + Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
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

                  {/* Match Badge */}
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
                    <MapPin className="h-3 w-3" />
                    {job.workingMode === "REMOTE"
                      ? "Remote"
                      : job.city
                      ? `${job.city}${job.state ? `, ${job.state}` : ""}`
                      : "Flexible"}
                  </span>

                  {job.workingMode && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/5 font-semibold text-slate-300">
                      {job.workingMode}
                    </span>
                  )}

                  {job.minimumSalary && job.maximumSalary && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 font-semibold">
                      ₹{(job.minimumSalary / 100000).toFixed(1)}–{(job.maximumSalary / 100000).toFixed(1)} LPA
                    </span>
                  )}

                  {job.urgentHiring && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 text-rose-300 px-2 py-0.5 border border-rose-500/30 text-[10px] font-extrabold uppercase">
                      <Flame className="h-3 w-3 text-rose-400 fill-rose-400" /> Urgent
                    </span>
                  )}

                  {job.featured && !job.urgentHiring && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 text-amber-300 px-2 py-0.5 border border-amber-500/30 text-[10px] font-extrabold uppercase">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> Featured
                    </span>
                  )}
                </div>

                {/* Why Recommended Banner */}
                {job.matchReason && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2 text-[11px] text-slate-300 flex items-center justify-between gap-2">
                    <span className="truncate">
                      💡 <strong className="text-white">Why:</strong> {job.matchReason}
                    </span>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 shrink-0 underline ml-1 cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                )}

                {/* Matched Required Skills */}
                {job.matchedSkills?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">
                      Matched:
                    </span>
                    {job.matchedSkills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                    {job.matchedSkills.length > 4 && (
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition"
                      >
                        +{job.matchedSkills.length - 4} more
                      </button>
                    )}
                  </div>
                )}

                {/* Matched Preferred Skills (bonus) */}
                {job.matchedPreferredSkills?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">
                      Bonus:
                    </span>
                    {job.matchedPreferredSkills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[11px] font-medium text-indigo-300"
                      >
                        <Star className="h-2.5 w-2.5 text-indigo-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Missing Skills */}
                {job.missingSkills?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mr-1">
                      Missing:
                    </span>
                    {job.missingSkills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-300"
                      >
                        <XCircle className="h-2.5 w-2.5 text-rose-400" />
                        {skill}
                      </span>
                    ))}
                    {job.missingSkills.length > 3 && (
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition"
                      >
                        +{job.missingSkills.length - 3} more
                      </button>
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

                <Link
                  to={`/jobs/${job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>View & Apply</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Match Breakdown Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedJob && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#090d16] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 mb-1">
                    <Sparkles className="h-3 w-3" /> Match Scoring Breakdown
                  </div>
                  <h3 className="text-lg font-bold text-white font-satoshi leading-tight">
                    {selectedJob.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedJob.companyName}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Overall Score */}
              {(() => {
                const c = getMatchColors(selectedJob.matchPercentage);
                return (
                  <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 text-center space-y-1`}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Overall Match
                    </p>
                    <p className={`text-4xl font-black font-satoshi ${c.text}`}>
                      {selectedJob.matchPercentage}%
                    </p>
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider ${c.badgeBg} ${c.badgeText}`}
                    >
                      {selectedJob.matchGrade}
                    </span>
                  </div>
                );
              })()}

              {/* Score Breakdown Bars (4 dimensions) */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Score Breakdown
                </p>
                <ScoreBar label="Skill Match (55% weight)" value={selectedJob.skillMatchScore ?? 0} />
                <ScoreBar label="Location Fit (25% weight)" value={selectedJob.locationMatchScore ?? 0} />
                <ScoreBar label="Experience Fit (15% weight)" value={selectedJob.experienceMatchScore ?? 0} />
                <ScoreBar label="Job Freshness (5% weight)" value={selectedJob.freshnessScore ?? 0} />
              </div>

              {/* Matched Required Skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Matched Required Skills
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {selectedJob.matchedSkills?.length > 0 ? (
                    selectedJob.matchedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-300"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No exact required skill matches</span>
                  )}
                </div>
              </div>

              {/* Matched Preferred Skills */}
              {selectedJob.matchedPreferredSkills?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-indigo-400" />
                    Preferred Skills You Have (Bonus)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.matchedPreferredSkills.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-medium text-indigo-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Required Skills */}
              {selectedJob.missingSkills?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                    Skills to Learn for This Role
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {selectedJob.missingSkills.map((s, i) => (
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

              {/* Why Recommended */}
              {selectedJob.matchReason && (
                <div className="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 text-xs text-slate-300 leading-relaxed">
                  💡 <strong className="text-white">Why recommended:</strong> {selectedJob.matchReason}
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  Close
                </button>
                <Link
                  to={`/jobs/${selectedJob.id}`}
                  onClick={() => setSelectedJob(null)}
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
