/**
 * src/LandingPage/HowItWorks.jsx
 *
 * Ultra-Premium 3-Step "How AI Matching Works" Section.
 * Explains the platform's core differentiator with interactive cards,
 * connecting gradient lines, and an animated AI Match preview card.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Bot,
  MessageSquare,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const STEPS = [
  {
    step: "01",
    title: "Smart Resume & Skill Extraction",
    description:
      "Upload your PDF resume or build one with our AI Resume Studio. The engine automatically indexes your core tech stack, achievements, and ATS keywords.",
    icon: FileText,
    gradient: "from-indigo-500 to-purple-600",
    badge: "ATS Indexed",
    badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    metrics: "Parses 40+ Tech Formats",
  },
  {
    step: "02",
    title: "Neural AI Match & Fit Analysis",
    description:
      "Our matching algorithm compares your profile against 15,000+ live jobs, calculating real-time 0–100% Match Scores and highlighting missing high-value skills.",
    icon: Zap,
    gradient: "from-cyan-500 to-blue-600",
    badge: "98% Accuracy",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    metrics: "Instant Skill Gap Report",
  },
  {
    step: "03",
    title: "1-Click Apply & Live Pipeline Tracker",
    description:
      "Generate tailored cover letters in seconds, apply in 1 click, and monitor your progress across all 8 recruitment pipeline stages with zero ghosting.",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-600",
    badge: "Zero Ghosting",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    metrics: "Direct Recruiter Chat",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HowItWorks() {
  const [activePreview, setActivePreview] = useState(1);

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-24 font-inter text-slate-200" aria-label="How it works">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[200px]" />
        <div className="absolute right-10 bottom-10 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[180px]" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Intelligent Recruitment"
          title={
            <>
              How Our AI Matches You to{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dream Roles
              </span>
            </>
          }
          subtitle="A frictionless, transparent hiring journey designed to land you interviews 3x faster than traditional job boards."
        />

        {/* 3 Step Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {STEPS.map((stepItem, index) => {
            const Icon = stepItem.icon;

            return (
              <motion.div
                key={stepItem.step}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#090d16]/90 p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
              >
                {/* Step Number Watermark */}
                <span className="absolute top-4 right-6 text-5xl font-black text-white/5 font-satoshi select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors">
                  {stepItem.step}
                </span>

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${stepItem.gradient} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={24} />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-extrabold shadow-sm ${stepItem.badgeColor}`}
                    >
                      <Sparkles size={11} className="animate-pulse" />
                      {stepItem.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 text-lg sm:text-xl font-extrabold text-white font-satoshi group-hover:text-indigo-300 transition-colors leading-snug">
                    {stepItem.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400 font-medium">
                    {stepItem.description}
                  </p>
                </div>

                {/* Footer Metric */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    {stepItem.metrics}
                  </span>
                  <span className="text-slate-500 font-extrabold font-mono text-[11px]">
                    STEP {stepItem.step}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Live Interactive AI Match Preview Box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0c1122] via-[#090d16] to-[#05070d] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Radial Wash */}
          <div
            className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full"
            style={{ background: "rgba(99,102,241,0.15)", filter: "blur(90px)" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Explanatory Copy */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
                <Cpu size={14} className="text-emerald-400" />
                <span>Live AI Match Engine Demo</span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-black text-white font-satoshi tracking-tight leading-tight">
                See How Your Resume Scores in Real Time
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Our embedding engine evaluates semantic fit across tech competencies, required years of experience, and project complexity — giving you clarity before you apply.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/career-hub/resume-analyzer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition cursor-pointer font-satoshi"
                >
                  <Sparkles size={14} className="text-amber-300 fill-amber-300/20" />
                  <span>Analyze My Resume (Free)</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/find-jobs"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/25 transition cursor-pointer"
                >
                  <Zap size={14} className="text-indigo-400" />
                  <span>Explore Matched Jobs</span>
                </Link>
              </div>
            </div>

            {/* Right: Realistic AI Match Score Simulation Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/10 bg-[#070b14]/90 p-5 sm:p-6 shadow-xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-satoshi">
                      Target Role: Senior Fullstack Engineer
                    </span>
                    <h5 className="text-base font-extrabold text-white font-satoshi">
                      Stripe • Remote
                    </h5>
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5">
                    <Zap size={16} className="text-emerald-400" />
                    <span className="text-base font-black text-emerald-300 font-satoshi">94%</span>
                    <span className="text-[10px] font-bold text-emerald-400">Match</span>
                  </div>
                </div>

                {/* Skill Matrix */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-400">Matched Competencies (5/6)</span>
                    <span className="text-emerald-400">High Compatibility</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["React 19", "TypeScript", "Node.js", "GraphQL", "PostgreSQL"].map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300"
                      >
                        <CheckCircle2 size={11} className="text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                      <Sparkles size={11} className="text-amber-400" />
                      Docker (Recommended)
                    </span>
                  </div>
                </div>

                {/* AI Summary note */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 leading-relaxed">
                  💡 <strong>AI Recommendation:</strong> Strong match on modern frontend and relational architecture. Highlight your recent distributed system experience in your cover letter.
                </div>

                {/* Direct Action Link */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Want to see your resume score?</span>
                  <Link
                    to="/career-hub/resume-analyzer"
                    className="inline-flex items-center gap-1 font-bold text-indigo-400 hover:text-indigo-300 transition group"
                  >
                    <span>Test Your Resume Now</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
