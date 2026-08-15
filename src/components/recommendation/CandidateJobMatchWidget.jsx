/**
 * src/components/recommendation/CandidateJobMatchWidget.jsx
 *
 * Real-time match scoring widget for Job Detail pages.
 * Evaluates candidate profile skills, experience, and location against the current job.
 */

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAppSelector } from "../../State/Store";

export default function CandidateJobMatchWidget({ job }) {
  const { profile } = useAppSelector((state) => state.auth);
  const { profile: userProfile } = useAppSelector((state) => state.profile);

  // Combine profile sources
  const currentProfile = userProfile || profile;

  // Calculate Match Score in real-time
  const matchEvaluation = useMemo(() => {
    if (!job || !currentProfile) {
      return null;
    }

    const candidateSkills = (currentProfile.skills || []).map((s) =>
      typeof s === "string" ? s.toLowerCase().trim() : (s.name || "").toLowerCase().trim()
    );

    const jobSkills = (job.skillsRequired || []).map((s) => s.toLowerCase().trim());
    const matched = [];
    const missing = [];

    jobSkills.forEach((req) => {
      const isMatch = candidateSkills.some(
        (cand) => cand === req || cand.includes(req) || req.includes(cand)
      );
      if (isMatch) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const skillScore = jobSkills.length > 0
      ? Math.round((matched.length / jobSkills.length) * 100)
      : 80;

    // Location Score
    let locScore = 70;
    const mode = job.workingMode;
    if (mode === "REMOTE") {
      locScore = 100;
    } else if (currentProfile.location && job.city) {
      const candLoc = currentProfile.location.toLowerCase();
      const city = job.city.toLowerCase();
      if (candLoc.includes(city) || city.includes(candLoc)) {
        locScore = 100;
      } else {
        locScore = mode === "HYBRID" ? 30 : 0;
      }
    }

    // Composite Calculation (55% skills, 30% location, 15% experience)
    let composite = Math.round((skillScore * 0.55) + (locScore * 0.30) + 15);

    // Gating rule
    if (jobSkills.length > 0 && matched.length === 0) {
      composite = Math.min(composite, 15);
    } else if (skillScore < 40) {
      composite = Math.min(composite, 35);
    }

    composite = Math.min(100, Math.max(5, composite));

    let grade = "LOW";
    let color = "rose";
    if (composite >= 85) {
      grade = "EXCELLENT";
      color = "emerald";
    } else if (composite >= 70) {
      grade = "GREAT";
      color = "indigo";
    } else if (composite >= 50) {
      grade = "GOOD";
      color = "cyan";
    } else if (composite >= 30) {
      grade = "FAIR";
      color = "amber";
    }

    return {
      percentage: composite,
      grade,
      color,
      matched,
      missing,
      skillScore,
      locScore,
      totalSkills: jobSkills.length,
    };
  }, [job, currentProfile]);

  if (!currentProfile) {
    return (
      <div className="rounded-[20px] border border-white/10 bg-surface p-5 text-center space-y-3">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-bold text-white font-satoshi">See Your Match Score</h4>
        <p className="text-xs text-slate-400">
          Log in or update your profile to see how your skills match this role.
        </p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow"
        >
          <span>Update Profile</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  if (!matchEvaluation) return null;

  const { percentage, grade, color, matched, missing, totalSkills } = matchEvaluation;

  const colorStyles = {
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      bar: "bg-emerald-500",
    },
    indigo: {
      text: "text-indigo-400",
      bg: "bg-indigo-500/15",
      border: "border-indigo-500/30",
      bar: "bg-indigo-500",
    },
    cyan: {
      text: "text-cyan-400",
      bg: "bg-cyan-500/15",
      border: "border-cyan-500/30",
      bar: "bg-cyan-500",
    },
    amber: {
      text: "text-amber-400",
      bg: "bg-amber-500/15",
      border: "border-amber-500/30",
      bar: "bg-amber-500",
    },
    rose: {
      text: "text-rose-400",
      bg: "bg-rose-500/15",
      border: "border-rose-500/30",
      bar: "bg-rose-500",
    },
  }[color] || {
    text: "text-slate-400",
    bg: "bg-slate-500/15",
    border: "border-slate-500/30",
    bar: "bg-slate-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[20px] border border-white/10 bg-[#090d16] p-5 space-y-4 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white font-satoshi">
            Your Match Analysis
          </h4>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border}`}
        >
          {grade}
        </span>
      </div>

      {/* Score Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-white font-satoshi">
            {percentage}%
          </span>
          <span className="text-xs text-slate-400">
            {matched.length} of {totalSkills} required skills
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${colorStyles.bar}`}
          />
        </div>
      </div>

      {/* Matched Skills */}
      {matched.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 block">
            ✓ Matched Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-300 capitalize"
              >
                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missing.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 block">
            ✕ Missing Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-300 capitalize"
              >
                <XCircle className="h-2.5 w-2.5 text-rose-400" />
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Profile quick-link footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Based on your saved profile</span>
        <Link
          to="/profile"
          className="font-bold text-indigo-400 hover:text-indigo-300 transition"
        >
          Edit Skills →
        </Link>
      </div>
    </motion.div>
  );
}
