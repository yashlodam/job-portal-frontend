/**
 * src/LandingPage/FeaturedJobs.jsx
 *
 * Ultra-Premium "Featured Jobs" Section.
 * Features 3D glassmorphic cards, gold Sparkles badges, Redux bookmark syncing,
 * and reliable fallback to curated job listings so the section ALWAYS displays 6 cards.
 */

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { featuredJobs as fallbackJobs } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { getAllJobs } from "../State/JobSlice";
import { saveJobThunk, unsaveJobThunk } from "../State/savedJobThunk";
import { useTheme } from "../context/ThemeContext";
import { getAssetUrl } from "../utils/assetUtils";

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
  REMOTE: { bg: "rgba(6, 182, 212, 0.15)", text: "#22D3EE", lightText: "#0891B2", lightBg: "rgba(6, 182, 212, 0.10)", border: "rgba(6, 182, 212, 0.30)", label: "Remote" },
  HYBRID: { bg: "rgba(139, 92, 246, 0.15)", text: "#A78BFA", lightText: "#7C3AED", lightBg: "rgba(139, 92, 246, 0.10)", border: "rgba(139, 92, 246, 0.30)", label: "Hybrid" },
  ON_SITE: { bg: "rgba(245, 158, 11, 0.15)", text: "#FBBF24", lightText: "#D97706", lightBg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.30)", label: "On Site" },
};

/* ===========================
   JobCard Component
=========================== */
function JobCard({ job }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 cursor-pointer ${
        isLight
          ? "border-slate-200/90 bg-white/85 shadow-xs hover:border-indigo-300 hover:shadow-xl hover:bg-white"
          : "border-white/10 bg-[#090d16]/85 hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
      }`}
    >
      {/* Featured Badge Pill */}
      {job.featured && (
        <div className="absolute left-0 top-0 flex items-center gap-1.5 rounded-tl-[23px] rounded-br-[14px] bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 sm:px-3.5 sm:py-1.5 shadow-md z-20">
          <Sparkles size={11} className="text-amber-300 fill-amber-300/20 animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white">
            Featured Role
          </span>
        </div>
      )}

      <div className={`flex flex-1 flex-col ${job.featured ? "pt-4 sm:pt-5" : ""}`}>
        {/* Header: Logo, Company & Save Action */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border font-extrabold text-sm sm:text-base font-satoshi shadow-md ${
              isLight ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-white/10 bg-indigo-600/15 text-indigo-400"
            }`}>
              {job.companyLogo && !logoError ? (
                <img
                  src={getAssetUrl(job.companyLogo)}
                  alt={job.companyName || "Company logo"}
                  loading="lazy"
                  onError={() => setLogoError(true)}
                  className="h-full w-full rounded-xl object-contain"
                />
              ) : (
                initials(job.companyName || job.company)
              )}
            </div>

            <div className="min-w-0">
              <p className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider font-satoshi truncate ${
                isLight ? "text-indigo-600" : "text-indigo-400"
              }`}>
                {job.companyName || job.company || "Tech Enterprise"}
              </p>
              <h3 className={`mt-0.5 text-sm sm:text-base font-extrabold font-satoshi transition-colors truncate ${
                isLight ? "text-slate-900 group-hover:text-indigo-600" : "text-white group-hover:text-indigo-300"
              }`}>
                {job.jobTitle || job.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`rounded-full p-2 border transition cursor-pointer shrink-0 ${
              isLight
                ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            title={isSaved ? "Remove from Saved Jobs" : "Save Job"}
          >
            {isSaved ? (
              <BookmarkCheck size={16} className="text-indigo-600 fill-indigo-600/20" />
            ) : (
              <Bookmark size={16} />
            )}
          </button>
        </div>

        {/* Location & Mode */}
        <div className={`mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          <span className="inline-flex items-center gap-1 font-medium truncate max-w-[180px]">
            <MapPin size={12} className={isLight ? "text-indigo-600 shrink-0" : "text-indigo-400 shrink-0"} />
            {[job.city, job.state].filter(Boolean).join(", ") || job.location || "Remote"}
          </span>
          <span className={isLight ? "text-slate-300" : "text-slate-600"}>•</span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold border"
            style={{
              backgroundColor: isLight ? badge.lightBg : badge.bg,
              color: isLight ? badge.lightText : badge.text,
              borderColor: badge.border,
            }}
          >
            {badge.label}
          </span>
        </div>

        {/* Skills Pills */}
        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-1.5">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className={`rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold border ${
                  isLight
                    ? "border-slate-200 bg-slate-50 text-slate-700"
                    : "border-white/5 bg-white/5 text-slate-300"
                }`}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className={`rounded-lg px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Salary & View Action */}
      <div className={`mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t flex items-center justify-between gap-2 ${
        isLight ? "border-slate-100" : "border-white/10"
      }`}>
        <div className="min-w-0">
          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            Est. CTC
          </span>
          <span className={`text-xs sm:text-sm font-extrabold font-satoshi truncate block ${isLight ? "text-slate-900" : "text-slate-100"}`}>
            {formatSalary(job.packageOffered || job.salaryMin, job.salaryMax)}
          </span>
        </div>

        <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold transition group-hover:translate-x-0.5 shrink-0 ${
          isLight ? "text-indigo-600 group-hover:text-indigo-700" : "text-indigo-400 group-hover:text-indigo-300"
        }`}>
          Apply <ArrowRight size={13} />
        </span>
      </div>
    </motion.article>
  );
}

/* ===========================
   Main FeaturedJobs Component
=========================== */
export default function FeaturedJobs() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allJobs } = useAppSelector((state) => state.job);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  const displayJobs = useMemo(() => {
    if (allJobs && Array.isArray(allJobs) && allJobs.length > 0) {
      return allJobs.slice(0, 6);
    }
    return fallbackJobs.slice(0, 6);
  }, [allJobs]);

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 font-inter transition-colors duration-300 bg-transparent ${
      isLight ? "text-slate-800" : "text-slate-200"
    }`}>
      {/* ── Ambient Background Lighting ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/5 blur-[200px]"
      />

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Verified Openings"
          title={
            <>
              Explore <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Featured Positions</span>
            </>
          }
          subtitle="Directly apply to high-growth tech startups and market leaders with real-time application tracking and guaranteed salary ranges."
        />

        {/* ── Jobs Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </motion.div>

        {/* ── View All CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <button
            type="button"
            onClick={() => navigate("/find-jobs")}
            className={`inline-flex items-center gap-2 rounded-2xl border px-8 py-3.5 text-sm font-extrabold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer font-satoshi ${
              isLight
                ? "border-slate-200 bg-white text-slate-900 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-lg"
                : "border-white/10 bg-[#090d16]/90 text-white hover:border-indigo-500/40 hover:bg-[#0c111f]"
            }`}
          >
            <span>Explore All Open Positions</span>
            <ArrowRight size={16} className="text-indigo-500 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
