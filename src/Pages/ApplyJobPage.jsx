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
    <div className="relative min-h-screen overflow-hidden bg-background font-inter text-body">

      {/* ── Background Effects ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 mesh-gradient" />
      <div aria-hidden="true" className="pointer-events-none fixed -top-24 right-0 h-[520px] w-[520px] rounded-full bg-primary/6 blur-[160px]" />
      <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-violet/4 blur-[220px]" />
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Page Content ── */}
      <div className="relative z-10 section-container py-10 sm:py-14 pb-24">

        {/* ── Back Button ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-heading hover:border-primary/30 hover:bg-surface-elevated transition-all duration-200 cursor-pointer mb-8"
          >
            <IconArrowLeft
              size={16}
              className="text-muted group-hover:text-primary-light transition-all duration-200 group-hover:-translate-x-0.5"
            />
            Back to Job
          </button>
        </motion.div>

        {/* ── Page Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-light animate-pulse" />
            <span className="text-xs font-semibold text-primary-light tracking-wide uppercase">Step-by-step Application</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-heading font-satoshi leading-tight">
            Apply for this{" "}
            <span className="gradient-text">Position</span>
          </h1>
          <p className="mt-2 text-body max-w-xl">
            Complete the form below to submit your application. Our team reviews every application personally.
          </p>
        </motion.div>

        {/* ── Two-column layout on large screens ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Main Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="flex-1 min-w-0"
          >
            <ApplyJobComp />
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="w-full lg:w-72 shrink-0 space-y-4"
          >
            {/* Trust badges */}
            <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
              <h3 className="text-sm font-bold text-heading">Why apply here?</h3>
              {trustBadges.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon size={15} className="text-primary-light" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-heading">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-bold text-heading mb-3">Tips for a strong application</h3>
              <ul className="space-y-2.5">
                {[
                  "Tailor your resume for this specific role",
                  "Highlight measurable achievements",
                  "Keep your cover letter to 2-3 paragraphs",
                  "Double-check your contact details",
                  "Add links to real work samples",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <IconCircleCheck size={13} className="text-success mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div className="rounded-2xl border border-border bg-surface p-5 text-center">
              <p className="text-xs text-muted">Having trouble applying?</p>
              <a
                href="mailto:support@jobportal.com"
                className="mt-1 text-xs font-semibold text-primary-light hover:underline"
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