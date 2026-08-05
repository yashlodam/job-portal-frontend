/**
 * src/LandingPage/DreamJob.jsx
 *
 * Ultra-Premium "Find Your Dream Job" Hero Component.
 * Features 3D Search Bar, ambient mesh glow lighting,
 * gold Sparkles badges, floating AI match indicators, and Satoshi typography.
 */

import React, { useState, useCallback, memo } from "react";
import { BadgeCheck, Sparkles, Search, MapPin, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/* ===========================
   Animation Variants
=========================== */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
};

const STATS = [
  ["10K+", "Active Jobs"],
  ["5K+", "Verified Companies"],
  ["50K+", "Tech Candidates"],
];

const POPULAR_TAGS = ["React", "Python", "Full-Stack", "Remote", "AI / ML", "UI/UX"];

const DreamJob = memo(() => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (jobTitle.trim()) params.set("keyword", jobTitle.trim());
      if (location.trim()) params.set("city", location.trim());
      navigate(`/find-jobs?${params.toString()}`);
    },
    [jobTitle, location, navigate]
  );

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-28 font-inter text-slate-200">
      {/* ── Background Mesh Glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-[650px] w-[650px] rounded-full bg-indigo-600/10 blur-[200px]" />
        <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[180px]" />
      </div>

      {/* Dot Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #A5B4FC 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          
          {/* ── LEFT HERO CONTENT ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6 text-center sm:gap-7 lg:items-start lg:gap-8 lg:text-left"
          >
            {/* Pill Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 shadow-sm"
            >
              <Sparkles size={14} className="text-amber-400 fill-amber-400/20 animate-pulse shrink-0" />
              <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider font-satoshi">
                #1 AI Career Intelligence Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl font-satoshi">
              <motion.span variants={fadeUp} className="block">
                Find Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Dream Job</span>
              </motion.span>
              <motion.span variants={fadeUp} className="block mt-1">
                Accelerated by AI.
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="max-w-md text-xs sm:text-base leading-relaxed text-slate-400 sm:max-w-lg font-medium"
            >
              Discover thousands of verified tech opportunities, auto-generate tailored AI cover letters, track applications in real time, and get hired faster.
            </motion.p>

            {/* ── SEARCH FORM ── */}
            <motion.form
              variants={fadeUp}
              className="relative w-full max-w-3xl my-6 sm:my-8"
              onSubmit={handleSearch}
            >
              {/* Outer Ambient Glow Halo */}
              <div
                className="pointer-events-none absolute -inset-3 rounded-3xl md:rounded-full bg-gradient-to-r from-indigo-600/35 via-purple-600/30 to-pink-500/30 opacity-90 blur-2xl"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-3xl md:rounded-full border border-indigo-500/40 bg-[#0c1222]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-2.5 sm:p-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
                  {/* Job title input */}
                  <div className="flex h-12 flex-1 items-center gap-3 px-5">
                    <Search size={19} className="shrink-0 text-indigo-400" />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Job title, skill or keyword..."
                      className="w-full bg-transparent text-xs sm:text-sm text-white border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Vertical Divider Line */}
                  <div className="hidden md:block h-7 w-px bg-white/15 shrink-0 mx-4" />

                  {/* Location input */}
                  <div className="flex h-12 flex-1 items-center gap-3 px-5">
                    <MapPin size={19} className="shrink-0 text-purple-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, state or remote..."
                      className="w-full bg-transparent text-xs sm:text-sm text-white border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="inline-flex h-12 sm:h-11 items-center justify-center gap-2 rounded-2xl md:rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 px-8 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer shrink-0"
                  >
                    <Sparkles size={15} className="text-amber-300 fill-amber-300/20" />
                    Search Jobs
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Popular Tags */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <span className="text-xs font-bold text-slate-400">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <Link
                  key={tag}
                  to={`/find-jobs?keyword=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={fadeUp}
              className="grid w-full grid-cols-3 gap-4 border-t border-white/10 pt-6"
            >
              {STATS.map(([value, label]) => (
                <div key={label} className="flex flex-col items-center lg:items-start">
                  <p className="text-2xl sm:text-3xl font-black text-white font-satoshi leading-none">
                    {value}
                  </p>
                  <p className="mt-1 text-center text-[11px] sm:text-xs text-slate-400 font-semibold lg:text-left">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT HERO ILLUSTRATION & FLOATING CARDS ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Glowing Aura */}
            <div className="absolute h-[320px] w-[320px] rounded-full bg-indigo-600/15 blur-[120px]" />

            {/* Floating Badge 1 — AI Match Score */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-10 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090d16]/95 p-3.5 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300">
                <Sparkles size={22} className="fill-amber-300/20 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white font-satoshi">95% AI Match Score</h4>
                <p className="text-[11px] font-semibold text-emerald-400 mt-0.5">High Candidate Fit</p>
              </div>
            </motion.div>

            {/* Floating Badge 2 — Live Pipeline */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -right-4 bottom-12 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#090d16]/95 p-3.5 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <BadgeCheck size={22} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white font-satoshi">10K+ Verified Jobs</h4>
                <p className="text-[11px] font-semibold text-indigo-300 mt-0.5">Updated Every Hour</p>
              </div>
            </motion.div>

            {/* Main Illustration Graphic */}
            <div className="relative z-10 w-full max-w-[440px] sm:max-w-[500px]">
              <img
                src="/jobs1.png"
                alt="AI Job Portal Career Dashboard"
                className="w-full object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.25)] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default DreamJob;