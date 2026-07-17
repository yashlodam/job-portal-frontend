import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";

/* ===========================
    Animation Variants
=========================== */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ===========================
    Stars Row
=========================== */

function StarsRow({ rating, size = 14 }) {
  return (
    <div
      className="flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? "#F59E0B" : "transparent"}
          color={i < rating ? "#F59E0B" : "#475569"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ===========================
    Testimonial Card
=========================== */

function TestimonialCard({ testimonial, highlight }) {
  const initial = testimonial.name.charAt(0).toUpperCase();

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5 }}
      aria-label={`Testimonial from ${testimonial.name}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border p-5 transition-all duration-300 sm:p-6"
      style={{
        borderColor: highlight
          ? "rgba(99,102,241,0.25)"
          : "rgba(148,163,184,0.08)",
        background: highlight
          ? "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.04))"
          : "#0D1117",
      }}
      onMouseEnter={(e) => {
        if (!highlight) {
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.20)";
          e.currentTarget.style.boxShadow   = "0 0 32px rgba(99,102,241,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!highlight) {
          e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
          e.currentTarget.style.boxShadow   = "none";
        }
      }}
    >
      {/* Hover radial glow */}
      {!highlight && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(99,102,241,0.06), transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Decorative quote mark */}
      <Quote
        size={28}
        className="absolute top-4 right-4 opacity-20"
        style={{ color: highlight ? "#818CF8" : "#94A3B8" }}
        strokeWidth={1}
        aria-hidden="true"
      />

      {/* Stars */}
      <StarsRow rating={testimonial.rating} />

      {/* Quote */}
      <blockquote className="relative mt-4 flex-1 text-sm leading-7 text-[#94A3B8] sm:text-base">
        {testimonial.quote}
      </blockquote>

      {/* Author row */}
      <footer
        className="relative mt-5 flex items-center gap-3 border-t pt-4"
        style={{ borderColor: "rgba(148,163,184,0.08)" }}
      >
        {/* Avatar */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{
            background: highlight
              ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
              : "linear-gradient(135deg, rgba(99,102,241,0.80), rgba(139,92,246,0.80))",
          }}
          aria-hidden="true"
        >
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <cite className="not-italic text-sm font-semibold text-[#F1F5F9]">
            {testimonial.name}
          </cite>
          <p className="mt-0.5 truncate text-xs text-[#708090]">
            {testimonial.role}
          </p>
        </div>

        {/* Via Velora badge */}
        <div className="ml-auto shrink-0">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{
              background: highlight ? "rgba(99,102,241,0.20)" : "#161B22",
              color: highlight ? "#818CF8" : "#708090",
            }}
          >
            via Velora
          </span>
        </div>
      </footer>
    </motion.article>
  );
}

/* ===========================
    Testimonials Section
=========================== */

function Testimonials() {
  /* Highlight the card with the highest rating; fall back to index 1 */
  const highlightIdx = (() => {
    let best = 1;
    testimonials.forEach((t, i) => {
      if (t.rating > (testimonials[best]?.rating ?? 0)) best = i;
    });
    return best;
  })();

  return (
    <section className="relative section-padding overflow-hidden">

      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "rgba(139,92,246,0.04)", filter: "blur(200px)" }}
      />

      <div className="section-container">
        {/* Section Header */}
        <SectionHeader
          badge="Success Stories"
          title={
            <>
              Loved by{" "}
              <span className="gradient-text">thousands</span>
            </>
          }
          subtitle="See how job seekers and employers are transforming their careers with Velora."
        />

        {/* Testimonial grid */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          role="list"
          aria-label="Customer testimonials"
          aria-live="polite"
        >
          {testimonials.map((t, i) => (
            <div key={t.id} role="listitem">
              <TestimonialCard
                testimonial={t}
                highlight={i === highlightIdx}
              />
            </div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <StarsRow rating={5} size={16} />
          <p className="text-sm text-[#708090]">
            <strong className="text-[#F1F5F9]">4.9/5</strong> average rating
            from{" "}
            <strong className="text-[#F1F5F9]">12,000+</strong> reviews
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
