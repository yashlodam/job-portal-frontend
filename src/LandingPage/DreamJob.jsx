import React, { useState, useCallback, memo } from "react";
import { BadgeCheck, Sparkles, Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/* ──────────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const stats = [
  ["10K+", "Active Jobs"],
  ["5K+", "Companies"],
  ["50K+", "Candidates"],
];

const POPULAR_TAGS = ["React", "Python", "Design", "Remote", "AI/ML"];

/* ──────────────────────────────────────────────
   DreamJob — Hero Component
   ────────────────────────────────────────────── */

const DreamJob = memo(() => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (jobTitle.trim()) params.set("q", jobTitle.trim());
      if (location.trim()) params.set("location", location.trim());
      navigate(`/find-jobs?${params.toString()}`);
    },
    [jobTitle, location, navigate]
  );

  return (
    <section className="relative overflow-hidden section-padding">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* LEFT CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6 text-center sm:gap-7 lg:items-start lg:gap-8 lg:text-left"
          >
            {/* Badge */}
            <motion.span
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(99,102,241,0.22)] bg-[rgba(99,102,241,0.09)] px-4 py-1.5 text-xs font-semibold text-[#818CF8] sm:text-sm"
            >
              <Sparkles size={13} className="shrink-0" />
              #1 AI Career Intelligence Platform
            </motion.span>

            {/* Headline */}
            <h1
              className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-[#F1F5F9] sm:text-5xl sm:leading-[1.06] lg:text-[3.75rem] xl:text-[4.5rem]"
              style={{ fontFamily: "var(--font-satoshi)" }}
            >
              <motion.span variants={fadeUp} className="block">
                Find your
              </motion.span>
              <motion.span variants={fadeUp} className="block">
                <span className="gradient-text">dream job</span>
              </motion.span>
              <motion.span variants={fadeUp} className="block">
                with AI
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="max-w-md text-[15px] leading-7 text-[#94A3B8] sm:max-w-lg sm:text-lg sm:leading-[1.75]"
            >
              Discover thousands of verified opportunities, build an AI-powered
              resume, prepare for interviews, and land your dream job faster than
              ever.
            </motion.p>

            {/* SEARCH FORM */}
            <motion.form
  variants={fadeUp}
  className="relative w-full"
  onSubmit={handleSearch}
>
  {/* Ambient glow – untouched */}
  <div
    className="pointer-events-none absolute -inset-2 rounded-[28px] bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-cyan-500/20 opacity-70 blur-2xl lg:rounded-[32px]"
    aria-hidden="true"
  />

  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-3xl ring-1 ring-white/5 shadow-2xl transition-all duration-300 hover:border-indigo-400/30 focus-within:border-indigo-500/60 focus-within:shadow-[0_0_40px_rgba(99,102,241,0.25)] lg:rounded-3xl">
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
      {/* Job title input */}
      <div className="flex h-14 items-center gap-3 px-4 py-4 sm:px-5 sm:py-4 lg:flex-1 lg:px-6">
        <label htmlFor="job-search-title" className="sr-only">
          Job title or keyword
        </label>
        <Search
          size={18}
          className="shrink-0 text-indigo-400 transition-colors duration-300 group-focus-within:text-indigo-300"
          aria-hidden="true"
        />
        <input
          id="job-search-title"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job title, company or keyword"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
        />
      </div>

      {/* Divider (mobile) */}
      <div className="h-px bg-white/[0.07] lg:hidden" aria-hidden="true" />
      {/* Divider (desktop) */}
      <div
        className="hidden h-auto w-px shrink-0 bg-white/[0.07] lg:block"
        aria-hidden="true"
      />

      {/* Location input */}
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 lg:flex-1 lg:px-6">
        <label htmlFor="job-search-location" className="sr-only">
          Location
        </label>
        <MapPin
          size={18}
          className="shrink-0 text-indigo-400 transition-colors duration-300"
          aria-hidden="true"
        />
        <input
          id="job-search-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, state or remote"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
        />
      </div>

      {/* Submit button – redesigned with shine effect, improved gradient, and refined hover */}
      <div className="p-2.5 lg:p-2 bg-gradient-to-r
                from-[#6366F1]
                to-[#8B5CF6]">
        <button
          type="submit"
          aria-label="Search for jobs"
          className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-500/50 active:scale-95 sm:h-[52px] sm:text-base lg:h-full lg:w-auto lg:px-8"
        >
          {/* Shine overlay on hover */}
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
            aria-hidden="true"
          />
          <Search
            size={16}
            className="relative z-10 transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="relative z-10 ">Search Jobs</span>
        </button>
      </div>
    </div>
  </div>
</motion.form>

            {/* Popular Tags */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-start"
            >
              <span className="text-xs text-[#708090]">Popular:</span>
              <div role="list" className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {POPULAR_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    to={`/find-jobs?q=${encodeURIComponent(tag)}`}
                    role="listitem"
                    className="rounded-full border border-[rgba(148,163,184,0.08)] bg-[#0D1117] px-3 py-1 text-xs font-medium text-[#94A3B8] transition-colors duration-200 hover:border-[rgba(99,102,241,0.30)] hover:text-[#F1F5F9]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={fadeUp}
              className="grid w-full grid-cols-3 gap-4 border-t border-white/[0.06] pt-6 sm:gap-6 sm:pt-7"
            >
              {stats.map(([value, label]) => (
                <div key={label} className="flex flex-col items-center lg:items-start">
                  <p
                    className="text-xl font-extrabold text-[#F1F5F9] sm:text-2xl lg:text-3xl"
                    style={{ fontFamily: "var(--font-satoshi)" }}
                  >
                    {value}
                  </p>
                  <p className="mt-0.5 text-center text-[11px] text-[#708090] sm:text-xs lg:text-left lg:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT ILLUSTRATION */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center pt-4 lg:justify-end lg:pt-0"
          >
            {/* Glow halos */}
            <div
              className="absolute h-[260px] w-[260px] rounded-full sm:h-[380px] sm:w-[380px] lg:h-[420px] lg:w-[420px]"
              style={{ background: "rgba(99,102,241,0.12)", filter: "blur(100px)" }}
              aria-hidden="true"
            />
            <div
              className="absolute h-[140px] w-[140px] translate-x-10 translate-y-6 rounded-full sm:h-[180px] sm:w-[180px] sm:translate-x-16 sm:translate-y-8"
              style={{ background: "rgba(6,182,212,0.08)", filter: "blur(80px)" }}
              aria-hidden="true"
            />

            {/* Floating badge – AI Resume Score */}
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute left-0 top-6 z-20 flex items-center gap-3 whitespace-nowrap rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-3.5 lg:-left-8 xl:-left-10 max-sm:left-2 max-sm:top-4 max-sm:scale-90"
              style={{ willChange: "transform" }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                className="shrink-0 sm:h-11 sm:w-11"
                aria-label="92% score"
              >
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - 0.92)}
                  transform="rotate(-90 24 24)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <text x="24" y="29" textAnchor="middle" fontSize="12" fontWeight="700" fill="#F1F5F9">
                  92
                </text>
              </svg>
              <div>
                <h4 className="text-xs font-semibold text-[#F1F5F9] sm:text-sm">AI Resume Score</h4>
                <p className="mt-0.5 text-[11px] text-[#708090] sm:text-xs">Excellent match</p>
              </div>
            </motion.div>

            {/* Floating badge – 10K+ Jobs */}
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="glass absolute bottom-0 right-0 z-20 flex items-center gap-2.5 whitespace-nowrap rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:gap-3 sm:p-3.5 max-sm:right-2 max-sm:bottom-2 max-sm:scale-90"
              style={{ willChange: "transform" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
              >
                <BadgeCheck className="text-white" size={18} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F1F5F9] sm:text-sm">10K+ Jobs</h4>
                <p className="mt-0.5 text-[11px] text-[#708090] sm:text-xs">Updated Daily</p>
              </div>
            </motion.div>

            {/* Floating badge – Match Rate (desktop) */}
            <motion.div
              aria-hidden="true"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="glass absolute right-2 top-6 z-20 hidden items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] lg:flex max-lg:hidden"
              style={{ willChange: "transform" }}
            >
              <span className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#10B981]" />
              <span className="text-xs font-semibold text-[#F1F5F9]">98% Match Rate</span>
            </motion.div>

            {/* Main illustration */}
            <div className="relative z-10 w-full max-w-[300px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[520px]">
              <img
                src="/jobs1.png"
                alt="Software engineer reviewing AI-powered job matches on a laptop"
                loading="eager"
                width={520}
                height={520}
                className="w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default DreamJob;