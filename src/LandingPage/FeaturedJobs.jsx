/**
 * src/LandingPage/FeaturedJobs.jsx
 *
 * Ultra-Premium "Featured Jobs" Section.
 * Features 3D glassmorphic cards, gold Sparkles badges, Redux bookmark syncing,
 * and reliable fallback to curated job listings so the section ALWAYS displays 6 cards.
 */

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Bookmark, BookmarkCheck, Sparkles, Briefcase, Clock, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { featuredJobs as fallbackJobs } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { getAllJobs } from "../State/JobSlice";
import { saveJobThunk, unsaveJobThunk } from "../State/savedJobThunk";

/* ===========================
   Animation Variants
=========================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ===========================
   Working Mode Badges
=========================== */
const modeBadge = {
  REMOTE: { bg: "rgba(6, 182, 212, 0.15)", text: "#22D3EE", border: "rgba(6, 182, 212, 0.30)", label: "Remote" },
  HYBRID: { bg: "rgba(139, 92, 246, 0.15)", text: "#A78BFA", border: "rgba(139, 92, 246, 0.30)", label: "Hybrid" },
  ON_SITE: { bg: "rgba(245, 158, 11, 0.15)", text: "#FBBF24", border: "rgba(245, 158, 11, 0.30)", label: "On Site" },
};

/* ===========================
   JobCard Component
=========================== */
function JobCard({ job }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);

  const { savedJobIds } = useAppSelector((state) => state.savedJob);
  const isSaved = savedJobIds.includes(Number(job.id));

  const badge = modeBadge[job.workingMode] || modeBadge.REMOTE;

  const initials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JB";

  const formatSalary = (min, max) => {
    if (!min && !max) return "₹12,00,000 - ₹18,00,000";
    if (typeof min === "number" && typeof max === "number") {
      return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
    }
    return `${min} - ${max}`;
  };

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!job.id) return;
    if (isSaved) {
      dispatch(unsaveJobThunk(job.id));
    } else {
      dispatch(saveJobThunk(job.id));
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#090d16]/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)] cursor-pointer"
    >
      {/* Featured Badge Pill */}
      {job.featured && (
        <div className="absolute left-0 top-0 flex items-center gap-1.5 rounded-tl-[23px] rounded-br-[14px] bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-1.5 shadow-md z-20">
          <Sparkles size={12} className="text-amber-300 fill-amber-300/20 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
            Featured Role
          </span>
        </div>
      )}

      {/* Glow Wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
        style={{
          background: "radial-gradient(400px circle at top left, rgba(99,102,241,0.12), transparent 70%)",
        }}
      />

      <div className={`flex flex-1 flex-col ${job.featured ? "pt-5" : ""}`}>
        {/* Header: Logo, Company & Save Action */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-indigo-600/15 text-indigo-400 font-extrabold text-base font-satoshi shadow-md">
              {job.companyLogo && !logoError ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  loading="lazy"
                  onError={() => setLogoError(true)}
                  className="h-full w-full rounded-xl object-contain"
                />
              ) : (
                initials(job.companyName || job.company)
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 font-satoshi truncate">
                {job.companyName || job.company || "Tech Enterprise"}
              </p>
              <h3 className="mt-0.5 text-base font-extrabold text-white font-satoshi group-hover:text-indigo-300 transition-colors truncate">
                {job.jobTitle || job.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleBookmark}
            className="rounded-full p-2 border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            title={isSaved ? "Remove from Saved Jobs" : "Save Job"}
          >
            {isSaved ? (
              <BookmarkCheck size={18} className="text-indigo-400 fill-indigo-400/20" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>

        {/* Location & Mode */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-medium">
            <MapPin size={13} className="text-indigo-400 shrink-0" />
            {[job.city, job.state].filter(Boolean).join(", ") || job.location || "Remote"}
          </span>

          <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold"
            style={{
              backgroundColor: badge.bg,
              color: badge.text,
              borderColor: badge.border,
            }}
          >
            {badge.label}
          </span>
        </div>

        {/* Skills Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {(job.skillsRequired || ["React", "TypeScript", "Node.js"]).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 border border-white/5"
            >
              {typeof skill === "object" ? skill.name || skill.skillName : skill}
            </span>
          ))}
        </div>

        <div className="flex-1 min-h-[16px]" />

        {/* Salary & Apply Button */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <h4 className="text-sm font-black text-emerald-400 font-satoshi">
              {formatSalary(job.minimumSalary, job.maximumSalary)}
            </h4>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Full Time • High Priority
            </p>
          </div>

          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Apply <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ===========================
   FeaturedJobs Section
========================== */
export default function FeaturedJobs() {
  const dispatch = useAppDispatch();
  const { jobs } = useAppSelector((state) => state.job);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  // Ensure 6 cards are always displayed
  const displayList = useMemo(() => {
    if (Array.isArray(jobs) && jobs.length > 0) {
      const featuredOnly = jobs.filter((j) => j.featured);
      if (featuredOnly.length > 0) {
        return featuredOnly.slice(0, 6);
      }
      return jobs.slice(0, 6);
    }
    return fallbackJobs.slice(0, 6);
  }, [jobs]);

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-24 font-inter text-slate-200">
      {/* Background Mesh Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-20 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[180px]" />
        <div className="absolute left-1/4 bottom-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[160px]" />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge="Featured Opportunities"
          title={
            <>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Featured</span> Job Openings
            </>
          }
          subtitle="Explore high-impact positions from verified engineering and technology teams."
        />

        {/* Job Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayList.map((job, idx) => (
            <JobCard key={job.id || idx} job={job} />
          ))}
        </motion.div>

        {/* View All Jobs CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            to="/find-jobs"
            className="group inline-flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-8 py-3.5 text-xs font-extrabold text-indigo-300 hover:bg-indigo-500/20 hover:text-white hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm"
          >
            Explore All 1,000+ Jobs
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
