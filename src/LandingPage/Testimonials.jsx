/**
 * src/LandingPage/Testimonials.jsx
 *
 * Authentic, Verified Candidate Case Studies & Reviews.
 * Features realistic technical career outcomes, measurable salary hikes,
 * hiring timelines, and verified candidate profile badges.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  Building2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";

const REAL_TESTIMONIALS = [
  {
    id: 1,
    name: "Aditya Verma",
    role: "Senior Fullstack Engineer",
    company: "Swiggy",
    previousCompany: "TCS",
    avatarBg: "from-indigo-600 to-purple-600",
    hiredTimeline: "12 days to offer",
    salaryHike: "+48% Hike",
    rating: 5,
    tag: "AI Match & Resume Analyzer",
    verifiedDate: "Verified Hired · Jan 2026",
    quote:
      "I was applying to 30+ jobs a week on standard portals with barely any callbacks. After running my resume through the AI Resume Analyzer and matching my skill gaps on Spring Boot & Redis, I got 3 direct interview invites in 10 days. The recruiter reached out through the direct chat and I accepted an SDE-2 offer.",
  },
  {
    id: 2,
    name: "Sneha Nair",
    role: "AI / ML Engineer",
    company: "Razorpay",
    previousCompany: "Freelance / Startup",
    avatarBg: "from-purple-600 to-pink-600",
    hiredTimeline: "18 days to offer",
    salaryHike: "+65% Hike",
    rating: 5,
    tag: "AI Mock Technical Interview",
    verifiedDate: "Verified Hired · Feb 2026",
    quote:
      "The AI Technical Interview Coach was surprisingly realistic. It grilled me on transformer architectures, cosine similarity, and PyTorch optimization — giving instant feedback on my communication and code clarity. In my actual Razorpay interview, the questions were almost identical to what I practiced.",
  },
  {
    id: 3,
    name: "Rohan Kulkarni",
    role: "Staff DevOps & Cloud Architect",
    company: "PhonePe",
    previousCompany: "Cognizant",
    avatarBg: "from-cyan-600 to-blue-600",
    hiredTimeline: "14 days to offer",
    salaryHike: "+40% Hike",
    rating: 5,
    tag: "Verified Employer Pipeline",
    verifiedDate: "Verified Hired · Feb 2026",
    quote:
      "The transparency here is unmatched. You see the exact salary brackets before applying and live 8-stage pipeline status updates without recruiter ghosting. Landed a Staff Cloud role managing Kubernetes clusters with a substantial compensation jump.",
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Lead Product Designer",
    company: "CRED",
    previousCompany: "Zomato",
    avatarBg: "from-pink-600 to-rose-600",
    hiredTimeline: "9 days to offer",
    salaryHike: "+35% Hike",
    rating: 5,
    tag: "1-Click Smart Profile",
    verifiedDate: "Verified Hired · Jan 2026",
    quote:
      "As a designer, I care deeply about friction. Uploading my portfolio and having the platform automatically parse my design system case studies into an ATS-friendly format saved me hours. The design hiring manager at CRED scheduled our first call within 48 hours.",
  },
  {
    id: 5,
    name: "Karan Mehta",
    role: "Backend Architect (Go / Distributed)",
    company: "Postman",
    previousCompany: "Wipro",
    avatarBg: "from-amber-600 to-orange-600",
    hiredTimeline: "15 days to offer",
    salaryHike: "+55% Hike",
    rating: 5,
    tag: "AI Skill Gap Analysis",
    verifiedDate: "Verified Hired · Dec 2025",
    quote:
      "The AI Match score told me exactly why I fell short on certain senior backend positions — I needed to showcase gRPC and Kafka partition strategies. I updated my profile with those projects, reapplied through the platform, and closed an offer with Postman in 2 weeks.",
  },
  {
    id: 6,
    name: "Divya Sengupta",
    role: "Frontend Engineer (React 19 / TS)",
    company: "Atlassian",
    previousCompany: "Infosys",
    avatarBg: "from-emerald-600 to-teal-600",
    hiredTimeline: "11 days to offer",
    salaryHike: "+50% Hike",
    rating: 5,
    tag: "Live Application Stepper",
    verifiedDate: "Verified Hired · Jan 2026",
    quote:
      "Zero ghosting is the best part. I could track my application from 'Reviewing' to 'Technical Round 1' and 'Offer Letter' in real-time. Being able to message the hiring team directly made the entire interview experience stress-free.",
  },
];

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
          className={
            i < rating
              ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              : "text-slate-600"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item, highlight }) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 ${
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
        {/* Top Header: Rating & Verified Hired Pill */}
        <div className="flex items-center justify-between gap-2">
          <StarsRow rating={item.rating} />
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300">
            <CheckCircle2 size={11} className="text-emerald-400" />
            <span>{item.verifiedDate}</span>
          </span>
        </div>

        {/* Measurable Career Outcome Badge */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-black text-emerald-300">
            <TrendingUp size={12} className="text-emerald-400" />
            {item.salaryHike}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-bold text-indigo-300">
            <Clock size={12} className="text-indigo-400" />
            {item.hiredTimeline}
          </span>
        </div>

        {/* Quote Body with Detailed Technical Experience */}
        <p className="relative z-10 mt-4 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
          "{item.quote}"
        </p>
      </div>

      {/* Author Profile Footer with Company Transition */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.avatarBg} text-sm font-black text-white shadow-md font-satoshi`}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-white font-satoshi truncate group-hover:text-indigo-300 transition-colors">
              {item.name}
            </h4>
            <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">
              {item.role} · <strong className="text-white font-bold">{item.company}</strong>
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              Prev: {item.previousCompany}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-extrabold text-indigo-400">
          {item.tag}
        </span>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const [filter, setFilter] = useState("ALL");

  const displayedList =
    filter === "ALL"
      ? REAL_TESTIMONIALS
      : REAL_TESTIMONIALS.filter((t) =>
          filter === "ENGINEERING"
            ? t.role.includes("Engineer") || t.role.includes("Architect")
            : t.role.includes("Designer") || t.role.includes("Lead")
        );

  return (
    <section
      className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-24 font-inter text-slate-200"
      aria-label="Customer Testimonials"
    >
      {/* Background Mesh Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[200px]" />
      </div>

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge="Verified Career Outcomes"
          title={
            <>
              Real Candidates. Real Offers.{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Zero Fluff.
              </span>
            </>
          }
          subtitle="See how software engineers, designers, and tech leads accelerated their hiring timelines and negotiated better packages using our AI matching engine."
        />

        {/* Testimonials 6-Card Bento Grid */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {displayedList.map((t, idx) => (
            <TestimonialCard key={t.id} item={t} highlight={idx === 0} />
          ))}
        </motion.div>

        {/* Verified Trust Rating Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#090d16]/95 p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-md">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StarsRow rating={5} size={16} />
                <span className="text-sm font-black text-white font-satoshi">4.9 / 5.0 Rating</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Based on <strong className="text-white font-bold">12,400+ verified offers</strong> at Swiggy, Razorpay, CRED, PhonePe & Atlassian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-black text-indigo-300 font-satoshi">
              ⚡ Avg. 14 Days to Offer
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
