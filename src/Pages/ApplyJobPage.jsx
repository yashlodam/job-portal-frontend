import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconShield,
  IconClock,
  IconCircleCheck,
  IconSparkles,
} from "@tabler/icons-react";
import ApplyJobComp from "../ApplyJob/ApplyJobComp";

/* ─── Trust Badges ─── */
const trustBadges = [
  { icon: IconShield, label: "Secure & Private", desc: "Your data is encrypted" },
  { icon: IconClock, label: "Quick Apply", desc: "Takes under 5 minutes" },
  { icon: IconCircleCheck, label: "Instant Confirmation", desc: "You'll hear back soon" },
];

function ApplyJobPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d] font-inter text-slate-200">
      {/* ── Ambient Glow & Mesh Background Effects ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#05070d] to-[#05070d]" />
      <div aria-hidden="true" className="pointer-events-none fixed -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[180px]" />
      <div aria-hidden="true" className="pointer-events-none fixed top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[160px]" />
      <div aria-hidden="true" className="pointer-events-none fixed bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-600/5 blur-[150px]" />

      {/* Dot Grid Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #A5B4FC 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Page Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-24">

        {/* ── Back Button ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer mb-8 shadow-sm"
          >
            <IconArrowLeft
              size={15}
              className="text-slate-400 group-hover:text-indigo-300 transition-all duration-200 group-hover:-translate-x-0.5"
            />
            Back to Job Details
          </button>
        </motion.div>

        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-3 shadow-inner">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-extrabold text-indigo-300 tracking-wider uppercase font-satoshi">Fast-Track Application</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-satoshi leading-tight">
            Apply for this <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Position</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
            Review your candidate details and submit your application directly to the hiring team.
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Main Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="flex-1 min-w-0 w-full"
          >
            <ApplyJobComp />
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="w-full lg:w-80 shrink-0 space-y-5"
          >
            {/* Trust badges */}
            <div className="rounded-3xl border border-white/10 bg-[#090d16]/90 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
              <h3 className="text-sm font-bold text-white font-satoshi uppercase tracking-wider">Why apply here?</h3>
              {trustBadges.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="rounded-3xl border border-white/10 bg-[#090d16]/90 p-6 backdrop-blur-xl shadow-2xl">
              <h3 className="text-sm font-bold text-white font-satoshi uppercase tracking-wider mb-4">Tips for success</h3>
              <ul className="space-y-3">
                {[
                  "Choose a clear, ATS-friendly PDF resume",
                  "Highlight measurable achievements",
                  "Use AI to generate a tailored cover letter note",
                  "Ensure your phone and email are up to date",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <IconCircleCheck size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="rounded-3xl border border-white/10 bg-[#090d16]/90 p-5 text-center backdrop-blur-xl shadow-2xl">
              <p className="text-xs text-slate-400">Need help with your application?</p>
              <a
                href="mailto:support@jobportal.com"
                className="mt-1.5 inline-block text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
              >
                Contact Support →
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

export default ApplyJobPage;