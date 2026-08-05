/**
 * src/LandingPage/Testimonials.jsx
 *
 * Ultra-Premium "Loved by Thousands" Testimonials Showcase.
 * Features 3D glassmorphic cards, gold Star rating indicators,
 * verified hired badges, and Satoshi typography.
 */

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, Sparkles, Award } from "lucide-react";
import { testimonials } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";

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

function StarsRow({ rating = 5, size = 15 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-slate-600"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, highlight }) {
  const initial = testimonial.name.charAt(0).toUpperCase();

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 cursor-pointer ${
        highlight
          ? "border-indigo-500/50 bg-[#0c111f] shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
          : "border-white/10 bg-[#090d16]/90 hover:border-indigo-500/40 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
      }`}
    >
      {/* Decorative Watermark Quote */}
      <Quote
        size={42}
        className="absolute -top-1 -right-1 opacity-10 text-indigo-400 pointer-events-none group-hover:scale-110 transition-transform"
      />

      <div>
        {/* Rating & Verified Badge */}
        <div className="flex items-center justify-between">
          <StarsRow rating={testimonial.rating} />
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
            <CheckCircle2 size={11} className="text-emerald-400" /> Hired
          </span>
        </div>

        {/* Quote Body */}
        <blockquote className="relative z-10 mt-5 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium italic">
          "{testimonial.quote}"
        </blockquote>
      </div>

      {/* Author Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-extrabold text-white shadow-md font-satoshi">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-white font-satoshi truncate group-hover:text-indigo-300 transition-colors">
            {testimonial.name}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
            {testimonial.role}
          </p>
        </div>

        <span className="shrink-0 rounded-lg bg-white/5 border border-white/5 px-2 py-1 text-[10px] font-extrabold text-indigo-400">
          AI Match
        </span>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#05070d] py-20 sm:py-24 font-inter text-slate-200" aria-label="Customer Testimonials">
      {/* Background Mesh Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[180px]" />
      </div>

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge="Candidate Success Stories"
          title={
            <>
              Loved by <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Thousands</span> of Tech Professionals
            </>
          }
          subtitle="Discover how developers, designers, and managers landed their dream roles faster using our AI job search platform."
        />

        {/* Testimonials Bento Grid */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {testimonials.map((t, idx) => (
            <TestimonialCard key={t.id || idx} testimonial={t} highlight={idx === 1} />
          ))}
        </motion.div>

        {/* Trust Rating Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-6 py-4 max-w-xl mx-auto text-center shadow-lg"
        >
          <StarsRow rating={5} size={18} />
          <p className="text-xs sm:text-sm font-semibold text-slate-300">
            <strong className="text-white font-extrabold">4.9 / 5.0 Rating</strong> from over <strong className="text-indigo-300 font-extrabold">12,000+ Verified Hires</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
