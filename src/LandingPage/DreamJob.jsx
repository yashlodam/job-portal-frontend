/**
 * src/LandingPage/DreamJob.jsx
 *
 * Senior 15+ Year Production-Grade Hero Component.
 * Masterfully integrates:
 * - High-impact value proposition & command search center
 * - Preserved /jobs1.png illustration with 3D ambient glow pedestal
 * - Seamlessly anchored telemetry stats strip (no awkward disconnected floating boxes)
 * - Silicon-Valley grade editorial typography with Satoshi hierarchy
 */

import React, { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  MapPin,
  ArrowRight,
  Zap,
  CheckCircle2,
  Star,
  ShieldCheck,
  Building2,
  Briefcase,
  TrendingUp,
  Clock,
  MessageSquare,
  Bot,
  Flame,
  Globe,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../State/Store";

/* =========================================================================
   CONSTANTS & CONFIGURATION
   ========================================================================= */

const QUICK_FILTERS = [
  { id: "all", label: "All Tech Roles", icon: Compass },
  { id: "remote", label: "Remote First", icon: Globe, query: "Remote" },
  { id: "ai", label: "AI & Machine Learning", icon: Bot, query: "AI" },
  { id: "high_ctc", label: "₹25L+ High Package", icon: Flame, query: "Senior" },
];

const POPULAR_KEYWORDS = [
  { label: "React 19", query: "React" },
  { label: "Fullstack", query: "Fullstack" },
  { label: "Python & AI", query: "Python" },
  { label: "Java Spring Boot", query: "Java" },
  { label: "DevOps & Cloud", query: "DevOps" },
  { label: "Product UI/UX", query: "UI/UX" },
];

const HERO_STATS = [
  {
    id: "jobs",
    label: "Active Tech Roles",
    value: "15,420+",
    subtext: "140+ new roles added today",
    icon: Briefcase,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "companies",
    label: "Verified Employers",
    value: "3,280+",
    subtext: "Google, Microsoft, Stripe & more",
    icon: Building2,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "precision",
    label: "AI Match Precision",
    value: "98.4%",
    subtext: "Semantic skill & ATS scoring",
    icon: Zap,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "salary",
    label: "Avg. Tech Package",
    value: "₹18.5 LPA",
    subtext: "+24% YoY salary growth",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
  },
];

/* =========================================================================
   ANIMATION VARIANTS
   ========================================================================= */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const imageContainerVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
};

/* =========================================================================
   MAIN HERO COMPONENT
   ========================================================================= */

const DreamJob = memo(() => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { profile } = useAppSelector((state) => state.auth);
  const allJobs = useAppSelector((state) => state.job.allJobs);
  const liveJobCount =
    Array.isArray(allJobs) && allJobs.length > 0
      ? `${allJobs.length.toLocaleString()}+`
      : "15,420+";

  const handleSearch = useCallback(
    (e) => {
      e?.preventDefault();
      const params = new URLSearchParams();
      if (jobTitle.trim()) params.set("keyword", jobTitle.trim());
      if (location.trim()) params.set("city", location.trim());
      navigate(`/find-jobs?${params.toString()}`);
    },
    [jobTitle, location, navigate]
  );

  const handleFilterClick = (filter) => {
    setActiveFilter(filter.id);
    if (filter.query) {
      navigate(`/find-jobs?keyword=${encodeURIComponent(filter.query)}`);
    } else {
      navigate("/find-jobs");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#05070d] pt-12 pb-16 sm:pt-18 sm:pb-20 lg:pt-20 lg:pb-24 font-inter text-slate-200">
      
      {/* ── Multi-Layer Ambient Background Atmosphere ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-gradient-to-b from-indigo-600/18 via-purple-600/12 to-transparent blur-[220px]" />
        <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[180px]" />
        <div className="absolute top-1/3 -right-32 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[190px]" />
      </div>

      {/* Subtle Engineered Dot Matrix Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #A5B4FC 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="section-container relative z-10">
        
        {/* ── 2-COLUMN HERO TOP SECTION ── */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          
          {/* ══════════════════════════════════════════════════════════
              LEFT HERO COLUMN: VALUE PROPOSITION & COMMAND SEARCH
             ══════════════════════════════════════════════════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-span-7 space-y-6 sm:space-y-7"
          >
            {/* Top Innovation Badge */}
            <motion.div variants={fadeUp}>
              {profile?.name ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-emerald-500/15 px-4 py-1.5 shadow-[0_0_25px_rgba(99,102,241,0.25)] backdrop-blur-2xl">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-200 font-satoshi">
                    Welcome back, {profile.name.split(" ")[0]} 👋
                  </span>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                    Matches Ready
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 px-4 py-1.5 shadow-[0_0_25px_rgba(99,102,241,0.25)] backdrop-blur-2xl">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-300 font-satoshi">
                    Next-Gen AI Career Platform
                  </span>
                  <span className="rounded-full bg-indigo-500/25 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    2026 Edition
                  </span>
                </div>
              )}
            </motion.div>

            {/* High-Impact Editorial Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[66px] font-black leading-[1.08] tracking-tight text-white font-satoshi"
            >
              Where Top Talent Meets Their{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                Dream Roles.
              </span>
            </motion.h1>

            {/* Explanatory Subtitle */}
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-300 font-medium"
            >
              Discover 15,000+ verified engineering, AI, and design positions. Evaluate your resume match fit instantly, auto-generate tailored cover letters, and get hired faster with zero ghosting.
            </motion.p>

            {/* ── COMMAND SEARCH CENTER ── */}
            <motion.div variants={fadeUp} className="w-full max-w-2xl pt-1">
              
              {/* Quick Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 mb-3">
                {QUICK_FILTERS.map((f) => {
                  const Icon = f.icon;
                  const isSelected = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleFilterClick(f)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/50"
                          : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
                      }`}
                    >
                      <Icon size={13} className={isSelected ? "text-white" : "text-indigo-400"} />
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Glassmorphic Search Bar Container */}
              <form
                onSubmit={handleSearch}
                className="relative rounded-3xl border border-white/15 bg-[#080d1a]/95 p-2 sm:p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition duration-300 hover:border-indigo-500/50 hover:shadow-[0_25px_60px_rgba(99,102,241,0.2)]"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1">
                  
                  {/* Job Title / Skill Input */}
                  <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-white/[0.03] md:bg-transparent px-4 border border-white/5 md:border-none focus-within:border-indigo-500/40">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm">
                      <Search size={16} />
                    </div>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Role, skill, or tech stack…"
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 font-medium outline-none focus:outline-none"
                    />
                  </div>

                  {/* Vertical Divider (Desktop) */}
                  <div className="hidden md:block h-7 w-px bg-white/10 shrink-0 mx-1" />

                  {/* Location Input */}
                  <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl bg-white/[0.03] md:bg-transparent px-4 border border-white/5 md:border-none focus-within:border-purple-500/40">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-sm">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, state, or 'Remote'…"
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 font-medium outline-none focus:outline-none"
                    />
                  </div>

                  {/* Search Action Button */}
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 sm:px-7 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0 font-satoshi"
                  >
                    <Sparkles size={15} className="text-amber-300 fill-amber-300/20" />
                    <span>Search Jobs</span>
                  </button>
                </div>
              </form>

              {/* Popular Search Keywords */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-satoshi flex items-center gap-1">
                  <TrendingUp size={12} className="text-indigo-400" /> Popular:
                </span>
                {POPULAR_KEYWORDS.map((k) => (
                  <Link
                    key={k.label}
                    to={`/find-jobs?keyword=${encodeURIComponent(k.query)}`}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white transition cursor-pointer"
                  >
                    {k.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Social Proof & Trust Strip */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 w-full max-w-2xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-extrabold text-white ring-2 ring-[#05070d] shadow-sm">
                    AM
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-[10px] font-extrabold text-white ring-2 ring-[#05070d] shadow-sm">
                    RK
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-500 text-[10px] font-extrabold text-white ring-2 ring-[#05070d] shadow-sm">
                    SK
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[10px] font-extrabold text-white ring-2 ring-[#05070d] shadow-sm font-satoshi">
                    +50K
                  </span>
                </div>
                
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                    ))}
                    <span className="text-xs font-black text-white ml-1 font-satoshi">4.9 / 5.0</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Trusted by 50,000+ tech candidates
                  </p>
                </div>
              </div>

              <div className="hidden sm:block h-6 w-px bg-white/10" />

              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>100% Verified Employers</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT HERO COLUMN: PRESERVED /jobs1.png WITH 3D GLASS BADGES
             ══════════════════════════════════════════════════════════ */}
          <motion.div
            variants={imageContainerVariants}
            initial="hidden"
            animate="visible"
            className="relative lg:col-span-5 flex items-center justify-center mt-4 lg:mt-0"
          >
            {/* Ambient Radial Backlight Pedestal */}
            <div className="pointer-events-none absolute h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-cyan-500/15 blur-[140px]" />
            
            {/* Radial Pedestal Floor Glow */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-[120px] w-[340px] rounded-full bg-indigo-500/20 blur-[80px]" />

            <div className="relative w-full max-w-[460px] sm:max-w-[520px]">
              
              {/* ── 3D Floating Badge 1: AI Match Fit (Top Left) ── */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-3 sm:-left-6 top-6 sm:top-10 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#090e1c]/95 p-3 sm:p-3.5 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 shadow-md">
                  <Sparkles size={20} className="fill-amber-300/20 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-white font-satoshi">98% AI Match Score</h4>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-400">High Candidate Fit</p>
                </div>
              </motion.div>

              {/* ── 3D Floating Badge 2: Fast Turnaround (Bottom Right) ── */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute -right-2 sm:-right-5 bottom-6 sm:bottom-10 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#090e1c]/95 p-3 sm:p-3.5 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-md">
                  <Clock size={20} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-white font-satoshi">&lt; 48h Fast Turnaround</h4>
                  <p className="text-[11px] font-semibold text-indigo-300">Direct Recruiter Review</p>
                </div>
              </motion.div>

              {/* ── PRESERVED MASTER HERO ILLUSTRATION ── */}
              <div className="relative z-10">
                <img
                  src="/jobs1.png"
                  alt="AI Job Platform Career Dashboard"
                  loading="eager"
                  className="w-full object-contain drop-shadow-[0_25px_65px_rgba(99,102,241,0.28)] transition-transform duration-500 hover:scale-[1.015]"
                />
              </div>

            </div>
          </motion.div>

        </div>

        {/* ══════════════════════════════════════════════════════════
            SEAMLESSLY ANCHORED TELEMETRY STRIP (NO FLOATING BOX)
           ══════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 sm:mt-18 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {HERO_STATS.map((stat) => {
            const Icon = stat.icon;
            const displayVal = stat.id === "jobs" ? liveJobCount : stat.value;

            return (
              <Link
                key={stat.id}
                to="/find-jobs"
                className="group flex items-center gap-3.5 transition-transform hover:-translate-y-1"
              >
                <div
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-white font-satoshi tracking-tight group-hover:text-indigo-300 transition-colors">
                    {displayVal}
                  </div>
                  <div className="text-xs font-bold text-slate-300 font-satoshi truncate">
                    {stat.label}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                    {stat.subtext}
                  </p>
                </div>
              </Link>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
});

export default DreamJob;