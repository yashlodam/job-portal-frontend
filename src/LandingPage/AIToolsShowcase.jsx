/**
 * src/LandingPage/AIToolsShowcase.jsx
 *
 * Ultra-Premium "Supercharge Your Career with AI" Bento Showcase Section.
 * Features 3D glassmorphic cards, radial background glow washes,
 * gold Sparkles tags, and direct navigation to platform AI tools.
 */

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Sparkles,
  FileText,
  MessageSquare,
  Mic,
  Bot,
  Zap,
  CheckCircle2,
  Video,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const AI_TOOLS_DATA = [
  {
    id: 1,
    title: "AI ATS Resume Studio",
    description:
      "Create high-scoring, ATS-compliant resumes with real-time AI bullet enhancements, keyword optimization, and multi-template export.",
    icon: FileText,
    link: "/career-hub/resume-builder",
    gradient: { from: "#6366F1", to: "#8B5CF6", glow: "rgba(99, 102, 241, 0.35)", text: "#A5B4FC" },
    stats: "50K+ Resumes Optimized",
    tag: "ATS Grade A+",
  },
  {
    id: 2,
    title: "AI Neural Job Match Fit",
    description:
      "Evaluate your skill alignment against 15,000+ live jobs with instant 0–100% Match Scores and personalized skill gap reports.",
    icon: Zap,
    link: "/find-jobs",
    gradient: { from: "#06B6D4", to: "#3B82F6", glow: "rgba(6, 182, 212, 0.35)", text: "#67E8F9" },
    stats: "98.4% Match Accuracy",
    tag: "Top Rated",
  },
  {
    id: 3,
    title: "AI Mock Technical Interview",
    description:
      "Practice coding, system design, and behavioral questions with an intelligent AI interviewer that gives actionable feedback on your answers.",
    icon: Video,
    link: "/career-hub/interview-coach",
    gradient: { from: "#EC4899", to: "#F43F5E", glow: "rgba(236, 72, 153, 0.35)", text: "#F472B6" },
    stats: "Interactive Voice & Code",
    tag: "Candidate Favorite",
  },
  {
    id: 4,
    title: "Live Application Stepper",
    description:
      "Track your application status in real-time across all 8 recruitment pipeline stages with direct messaging to hiring recruiters.",
    icon: Bot,
    link: "/my-jobs/applied",
    gradient: { from: "#10B981", to: "#14B8A6", glow: "rgba(16, 185, 129, 0.35)", text: "#6EE7B7" },
    stats: "8 Pipeline Stages",
    tag: "Zero Ghosting",
  },
];

/* ===========================
    Animation Variants
=========================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ===========================
    AI Tool Card
=========================== */
function AIToolCard({ tool }) {
  const navigate = useNavigate();
  const IconComponent = tool.icon;
  const gradient = tool.gradient;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={() => navigate(tool.link)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#090d16]/90 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)] cursor-pointer"
    >
      {/* Glow Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
        style={{
          background: `radial-gradient(400px circle at top left, ${gradient.glow}, transparent 70%)`,
        }}
      />

      <div>
        {/* Top Tag & Sparkles */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold shadow-sm"
            style={{
              borderColor: `${gradient.from}40`,
              backgroundColor: `${gradient.from}18`,
              color: gradient.text,
            }}
          >
            <Sparkles size={12} className="text-amber-300 fill-amber-300/20 animate-pulse" />
            {tool.tag}
          </span>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <BarChart3 size={13} className="text-indigo-400" />
            <span>{tool.stats}</span>
          </div>
        </div>

        {/* Icon Container */}
        <div
          className="relative z-10 mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 shadow-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            boxShadow: `0 8px 24px ${gradient.glow}`,
          }}
        >
          <IconComponent size={26} className="text-white" />
        </div>

        {/* Title */}
        <h3 className="relative z-10 mt-6 text-xl font-extrabold text-white font-satoshi group-hover:text-indigo-300 transition-colors leading-tight">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="relative z-10 mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-400 font-medium">
          {tool.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition flex items-center gap-1">
          <CheckCircle2 size={13} className="text-emerald-400" /> AI Intelligence Enabled
        </span>

        <span
          className="inline-flex items-center gap-1.5 text-xs font-extrabold transition-all group-hover:translate-x-1"
          style={{ color: gradient.text }}
        >
          Try Feature <ArrowRight size={14} />
        </span>
      </div>
    </motion.div>
  );
}

/* ===========================
    AIToolsShowcase Section
=========================== */
export default function AIToolsShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-24 font-inter text-slate-200">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[550px] w-[550px] rounded-full bg-purple-600/10 blur-[200px]" />
        <div className="absolute left-0 bottom-0 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[180px]" />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge="AI Career Intelligence"
          title={
            <>
              Supercharge your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Career Journey</span>
            </>
          }
          subtitle="Leverage cutting-edge AI tools built directly into our platform to give your job applications an immediate competitive advantage."
        />

        {/* Bento Grid — 2 columns */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {AI_TOOLS_DATA.map((tool) => (
            <AIToolCard key={tool.id} tool={tool} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
