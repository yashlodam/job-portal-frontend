import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredJobs } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";

/* ===========================
    Animation Variants
=========================== */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ===========================
    Mode badge colors
=========================== */

const modeBadge = {
  Remote:    { bg: "rgba(6,182,212,0.10)",   text: "#22D3EE",  border: "rgba(6,182,212,0.20)"   },
  Hybrid:    { bg: "rgba(139,92,246,0.10)",  text: "#A78BFA",  border: "rgba(139,92,246,0.20)"  },
  "On Site": { bg: "rgba(245,158,11,0.10)",  text: "#FBBF24",  border: "rgba(245,158,11,0.20)"  },
};

/* ===========================
    JobCard Component
=========================== */

function JobCard({ job }) {
  const [saved, setSaved] = useState(false);
  const badge = modeBadge[job.mode];

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      aria-label={`${job.title} at ${job.company}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border transition-all duration-300"
      style={{
        borderColor: job.featured
          ? "rgba(99,102,241,0.20)"
          : "rgba(148,163,184,0.08)",
        background: "#0D1117",
        boxShadow: job.featured
          ? "0 0 30px rgba(99,102,241,0.06)"
          : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.30)";
        e.currentTarget.style.boxShadow   = "0 0 40px rgba(99,102,241,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = job.featured
          ? "rgba(99,102,241,0.20)"
          : "rgba(148,163,184,0.08)";
        e.currentTarget.style.boxShadow = job.featured
          ? "0 0 30px rgba(99,102,241,0.06)"
          : "none";
      }}
    >
      {/* Featured badge */}
      {job.featured && (
        <div
          className="absolute left-0 top-0 flex items-center gap-1.5 rounded-tl-[19px] rounded-br-[12px] px-3 py-1.5"
          style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
        >
          <Sparkles size={11} className="text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
            Featured
            <span className="sr-only"> listing</span>
          </span>
        </div>
      )}

      {/* Glass hover shimmer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(99,102,241,0.06), transparent 70%)",
        }}
      />

      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${job.featured ? "pt-10" : ""}`}>

        {/* ── Top row: logo + company + bookmark ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Company Logo */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border p-1.5"
              style={{
                borderColor: "rgba(148,163,184,0.08)",
                background: "#161B22",
              }}
            >
              <img
                src={job.companyLogo}
                alt={`${job.company} logo`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F1F5F9]">{job.company}</p>
              <p className="mt-0.5 text-xs text-[#708090]">{job.posted}</p>
            </div>
          </div>

          {/* Bookmark */}
          <button
            type="button"
            className="shrink-0 rounded-lg p-1.5 text-[#708090] transition-all duration-200 hover:bg-[#161B22]"
            style={{ color: saved ? "#818CF8" : undefined }}
            aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
            onClick={() => setSaved((v) => !v)}
          >
            {saved ? (
              <BookmarkCheck size={17} color="#818CF8" />
            ) : (
              <Bookmark size={17} />
            )}
          </button>
        </div>

        {/* ── Job title ── */}
        <h3 className="mt-4 text-base font-bold text-[#F1F5F9] transition-colors duration-200 group-hover:text-[#818CF8] sm:text-lg">
          {job.title}
        </h3>

        {/* ── Location ── */}
        <div className="mt-2 flex items-center gap-1.5">
          <MapPin size={13} className="shrink-0 text-[#708090]" />
          <span className="text-sm text-[#708090]">{job.location}</span>
        </div>

        {/* ── Mode badge ── */}
        {badge && (
          <div className="mt-3">
            <span
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: badge.bg,
                color: badge.text,
                borderColor: badge.border,
              }}
            >
              {job.mode}
            </span>
          </div>
        )}

        {/* ── Tags ── */}
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: "rgba(99,102,241,0.10)", color: "#818CF8" }}
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium text-[#708090]"
              style={{ background: "#161B22" }}
            >
              +{job.tags.length - 3}
            </span>
          )}
        </div>

        {/* Spacer to push bottom row down */}
        <div className="flex-1" />

        {/* ── Bottom row: salary + apply ── */}
        <div
          className="mt-5 flex items-center justify-between border-t pt-4"
          style={{ borderColor: "rgba(148,163,184,0.08)" }}
        >
          <div>
            <p className="text-sm font-bold text-[#F1F5F9]">{job.salary}</p>
            <p className="text-xs text-[#708090]">{job.type}</p>
          </div>
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] sm:px-5 sm:text-sm"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 20px rgba(99,102,241,0.25)",
            }}
            aria-label={`Apply for ${job.title} at ${job.company}`}
          >
            Apply Now
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ===========================
    FeaturedJobs Section
=========================== */

function FeaturedJobs() {
  return (
    <section className="relative section-padding overflow-hidden">

      {/* Background glows */}
      <div
        className="pointer-events-none absolute right-1/4 top-20 h-72 w-72 rounded-full"
        style={{ background: "rgba(99,102,241,0.06)", filter: "blur(150px)" }}
      />
      <div
        className="pointer-events-none absolute left-1/4 bottom-20 h-60 w-60 rounded-full"
        style={{ background: "rgba(6,182,212,0.06)", filter: "blur(120px)" }}
      />

      <div className="section-container">

        {/* Section Header */}
        <SectionHeader
          badge="Featured Opportunities"
          title={
            <>
              <span className="gradient-text">Featured</span>{" "}Jobs
            </>
          }
          subtitle="Hand-picked opportunities from top companies, updated daily."
        />

        {/* Job Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Featured job listings"
        >
          {featuredJobs.map((job) => (
            <div key={job.id} role="listitem">
              <JobCard job={job} />
            </div>
          ))}
        </motion.div>

        {/* View All Jobs CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center sm:mt-12"
        >
          <Link
            to="/find-jobs"
            className="group inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold text-[#818CF8] transition-all duration-300 hover:border-[rgba(99,102,241,0.40)] hover:bg-[rgba(99,102,241,0.15)]"
            style={{
              borderColor: "rgba(99,102,241,0.25)",
              background: "rgba(99,102,241,0.08)",
            }}
          >
            View All Jobs
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default FeaturedJobs;
