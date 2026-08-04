import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredJobs } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { getAllJobs } from "../State/JobSlice";

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
  REMOTE: {
    bg: "rgba(6,182,212,0.10)",
    text: "#22D3EE",
    border: "rgba(6,182,212,0.20)",
  },
  HYBRID: {
    bg: "rgba(139,92,246,0.10)",
    text: "#A78BFA",
    border: "rgba(139,92,246,0.20)",
  },
  ON_SITE: {
    bg: "rgba(245,158,11,0.10)",
    text: "#FBBF24",
    border: "rgba(245,158,11,0.20)",
  },
};

/* ===========================
    JobCard Component
=========================== */
function JobCard({ job }) {
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const badge = modeBadge[job.workingMode];

  const initials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not disclosed";

    return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
  };

  const formatPosted = (date) => {
    if (!date) return "";

    const diff =
      Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";

    return `${diff} days ago`;
  };

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      aria-label={`${job.jobTitle} at ${job.companyName}`}
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
    >
      {job.featured && (
        <div
          className="absolute left-0 top-0 flex items-center gap-1.5 rounded-tl-[19px] rounded-br-[12px] px-3 py-1.5"
          style={{
            background:
              "linear-gradient(135deg,#6366F1,#8B5CF6)",
          }}
        >
          <Sparkles size={11} className="text-white" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
            Featured
          </span>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(99,102,241,0.06), transparent 70%)",
        }}
      />

      <div
        className={`flex flex-1 flex-col p-5 sm:p-6 ${
          job.featured ? "pt-10" : ""
        }`}
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-3">

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border p-1.5"
              style={{
                borderColor: "rgba(148,163,184,0.08)",
                background: "#161B22",
              }}
            >
              {job.companyLogo && !logoError ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  loading="lazy"
                  onError={() => setLogoError(true)}
                  className="h-full w-full rounded object-contain"
                />
              ) : (
                <span className="text-sm font-bold text-[#818CF8]">
                  {initials(job.companyName)}
                </span>
              )}
            </div>

            <div>

              <p className="text-sm font-semibold text-[#F1F5F9]">
                {job.companyName}
              </p>

              <p className="mt-0.5 text-xs text-[#708090]">
                {formatPosted(job.postedAt)}
              </p>

            </div>

          </div>

          <button
            onClick={() => setSaved(!saved)}
            className="rounded-lg p-1.5 hover:bg-[#161B22]"
          >
            {saved ? (
              <BookmarkCheck size={18} color="#818CF8" />
            ) : (
              <Bookmark size={18} color="#708090" />
            )}
          </button>

        </div>

        {/* Job Title */}

        <h3 className="mt-4 text-lg font-bold text-white group-hover:text-[#818CF8]">
          {job.jobTitle}
        </h3>

        {/* Location */}

        <div className="mt-2 flex items-center gap-2">

          <MapPin size={14} className="text-[#708090]" />

          <span className="text-sm text-[#708090]">
            {job.city}, {job.state}, {job.country}
          </span>

        </div>

        {/* Working Mode */}

        {badge && (
          <div className="mt-3">

            <span
              className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                background: badge.bg,
                color: badge.text,
                borderColor: badge.border,
              }}
            >
              {job.workingMode.replace("_", " ")}
            </span>

          </div>
        )}
        {/* Skills */}

        <div className="mt-4 flex flex-wrap gap-2">
          {(job.skillsRequired ?? []).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: "rgba(99,102,241,0.10)",
                color: "#818CF8",
              }}
            >
              {skill}
            </span>
          ))}

          {(job.skillsRequired ?? []).length > 3 && (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: "#161B22",
                color: "#708090",
              }}
            >
              +{job.skillsRequired.length - 3}
            </span>
          )}
        </div>

        {/* Experience & Job Type */}

        <div className="mt-4 flex items-center gap-2 text-xs text-[#94A3B8]">

          <span className="rounded-full bg-[#161B22] px-3 py-1">
            {job.experienceLevel?.replaceAll("_", " ")}
          </span>

          <span className="rounded-full bg-[#161B22] px-3 py-1">
            {job.jobType?.replaceAll("_", " ")}
          </span>

          {job.easyApply && (
            <span
              className="rounded-full px-3 py-1 font-medium"
              style={{
                background: "rgba(16,185,129,.12)",
                color: "#34D399",
              }}
            >
              Easy Apply
            </span>
          )}

        </div>

        <div className="flex-1" />

        {/* Salary + Apply */}

        <div
          className="mt-6 flex items-center justify-between border-t pt-4"
          style={{
            borderColor: "rgba(148,163,184,.08)",
          }}
        >

          <div>

            <h4 className="text-lg font-bold text-white">
              {formatSalary(
                job.minimumSalary,
                job.maximumSalary
              )}
            </h4>

            <p className="mt-1 text-xs text-[#708090]">
              {job.currency} • {job.vacancies} Openings
            </p>

          </div>

          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg,#6366F1,#8B5CF6)",
              boxShadow:
                "0 0 20px rgba(99,102,241,.25)",
            }}
          >
            Apply Now

            <ArrowRight size={15} />

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

  const dispatch = useAppDispatch();

const { jobs, loading } = useAppSelector((state) => state.job);

useEffect(() => {
    dispatch(getAllJobs());
}, [dispatch]);


const featuredJobsList = jobs
    .filter((job) => job.featured)
    .slice(0, 6);

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
          {featuredJobsList.map((job) => (
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
