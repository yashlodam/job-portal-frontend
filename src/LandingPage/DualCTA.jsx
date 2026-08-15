/**
 * src/LandingPage/DualCTA.jsx
 *
 * Ultra-Premium Dual-Sided Call-To-Action (Job Seekers vs. Employers/Recruiters).
 * Distinct value propositions, verified feature checkmarks, and targeted CTAs.
 */

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  UserCheck,
  Building2,
  Bot,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DualCTA() {
  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-24 font-inter text-slate-200" aria-label="Join Velora">
      {/* Background Lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[180px]" />
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-purple-600/10 blur-[180px]" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Job Seekers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0c1122]/95 via-[#090d16]/95 to-[#05070d]/95 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl transition hover:border-indigo-500/60 hover:shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
          >
            {/* Top Accent */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/15 px-3.5 py-1 text-xs font-extrabold text-indigo-300">
                <UserCheck size={13} className="text-indigo-400" />
                <span>For Tech Candidates</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-satoshi tracking-tight leading-tight">
                  Ready to Land Your{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Next Dream Role?
                  </span>
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Supercharge your search with real-time AI Match Scores, automated cover letters, and live application tracking.
                </p>
              </div>

              {/* Benefits List */}
              <ul className="space-y-3 text-xs text-slate-300">
                {[
                  "Evaluate your resume fit with 0–100% AI Match Scores",
                  "Auto-generate 3 customized cover letter tones",
                  "Prepare with AI Mock Technical & HR Interviews",
                  "Direct messaging with verified company recruiters",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 font-medium">
                    <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              <Link
                to="/find-jobs"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>Find Jobs Now</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Build Smart Profile
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Employers & Recruiters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#120c1f]/95 via-[#090d16]/95 to-[#05070d]/95 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl transition hover:border-purple-500/60 hover:shadow-[0_20px_50px_rgba(168,85,247,0.2)]"
          >
            {/* Top Accent */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3.5 py-1 text-xs font-extrabold text-purple-300">
                <Building2 size={13} className="text-purple-400" />
                <span>For Employers & Hiring Teams</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-satoshi tracking-tight leading-tight">
                  Hiring the Top 1%{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                    Engineering Talent?
                  </span>
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Automate candidate screening with neural skill ranking, reduce time-to-hire by 60%, and manage full hiring pipelines.
                </p>
              </div>

              {/* Benefits List */}
              <ul className="space-y-3 text-xs text-slate-300">
                {[
                  "Post engineering and product roles in under 2 minutes",
                  "AI candidate ranking & deterministic skill gap scoring",
                  "8-stage visual recruitment pipeline & direct chat",
                  "Verified employer trust badge & enterprise priority",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 font-medium">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              <Link
                to="/upload-job"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>Post a Job Free</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/recruiter/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Recruiter Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
