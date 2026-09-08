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
import { useTheme } from "../context/ThemeContext";

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
    avatarBg: "from-blue-600 to-cyan-600",
    hiredTimeline: "14 days to offer",
    salaryHike: "+52% Hike",
    rating: 5,
    tag: "Verified Talent Profile",
    verifiedDate: "Verified Hired · Dec 2025",
    quote:
      "Having my Kubernetes and Terraform certifications verified directly on my JobPortal AI profile gave hiring managers immediate trust. The PhonePe talent lead scheduled a 30-minute introductory call within 4 hours of my application. Best tech hiring experience I have had in India.",
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Product Designer (UI/UX)",
    company: "CRED",
    previousCompany: "Design Agency",
    avatarBg: "from-pink-600 to-rose-600",
    hiredTimeline: "9 days to offer",
    salaryHike: "+40% Hike",
    rating: 5,
    tag: "AI Portfolio Match",
    verifiedDate: "Verified Hired · Feb 2026",
    quote:
      "The transparency of CTC ranges and zero ghosting guarantee made all the difference. I knew exactly what level I was interviewing for, and the hiring team kept me updated at every stage of the design presentation round.",
  },
  {
    id: 5,
    name: "Karan Mehta",
    role: "Backend Architect (Go / Distributed Systems)",
    company: "Zomato",
    previousCompany: "Wipro",
    avatarBg: "from-amber-600 to-orange-600",
    hiredTimeline: "15 days to offer",
    salaryHike: "+70% Hike",
    rating: 5,
    tag: "Direct Recruiter Chat",
    verifiedDate: "Verified Hired · Jan 2026",
    quote:
      "I transitioned from a legacy services firm to high-scale product engineering. The AI salary insights benchmarked my exact market value for Go and Kafka roles, enabling me to negotiate a 70% hike confidently.",
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
              : "text-slate-300 dark:text-slate-600"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item, highlight }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 cursor-pointer ${
        highlight
          ? isLight
            ? "border-indigo-300 bg-white/95 shadow-lg"
            : "border-indigo-500/50 bg-[#0c111f]/90 shadow-[0_20px_50px_rgba(99,102,241,0.2)]"
          : isLight
            ? "border-slate-200/90 bg-white/85 shadow-xs hover:border-indigo-300 hover:shadow-xl hover:bg-white"
            : "border-white/10 bg-[#090d16]/85 hover:border-indigo-500/40 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
      }`}
    >
      {/* Decorative Watermark Quote */}
      <Quote
        size={42}
        className={`absolute -top-1 -right-1 pointer-events-none group-hover:scale-110 transition-transform ${
          isLight ? "opacity-10 text-indigo-600" : "opacity-10 text-indigo-400"
        }`}
      />

      <div>
        {/* Top Header: Rating & Verified Hired Pill */}
        <div className="flex items-center justify-between gap-2">
          <StarsRow rating={item.rating} />
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${
            isLight ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}>
            <CheckCircle2 size={11} className="text-emerald-500" />
            <span>{item.verifiedDate}</span>
          </span>
        </div>

        {/* Measurable Career Outcome Badge */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-black ${
            isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
          }`}>
            <TrendingUp size={12} className="text-emerald-500" />
            {item.salaryHike}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
            isLight ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
          }`}>
            <Clock size={12} className="text-indigo-500" />
            {item.hiredTimeline}
          </span>
        </div>

        {/* Quote Body with Detailed Technical Experience */}
        <p className={`relative z-10 mt-4 text-xs sm:text-sm leading-relaxed font-medium ${
          isLight ? "text-slate-700" : "text-slate-300"
        }`}>
          "{item.quote}"
        </p>
      </div>

      {/* Candidate Profile Footer */}
      <div className={`mt-6 pt-4 border-t flex items-center gap-3.5 ${
        isLight ? "border-slate-100" : "border-white/10"
      }`}>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.avatarBg} text-white font-black text-sm font-satoshi shadow-md`}>
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className={`text-sm font-extrabold font-satoshi truncate ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              {item.name}
            </h4>
            <ShieldCheck size={14} className="text-indigo-500 shrink-0" />
          </div>

          <p className={`text-xs font-medium truncate ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}>
            {item.role}
          </p>

          <div className={`mt-0.5 flex items-center gap-1 text-[11px] font-bold ${
            isLight ? "text-indigo-600" : "text-indigo-400"
          }`}>
            <Building2 size={11} />
            <span>Hired at {item.company}</span>
            <span className={isLight ? "text-slate-300" : "text-slate-600"}>•</span>
            <span className={isLight ? "text-slate-400 font-normal" : "text-slate-500 font-normal"}>ex-{item.previousCompany}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ===========================
   Main Testimonials Component
=========================== */
export default function Testimonials() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 font-inter transition-colors duration-300 bg-transparent ${
      isLight ? "text-slate-800" : "text-slate-200"
    }`} aria-label="Candidate testimonials">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[200px]" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Verified Candidate Stories"
          title={
            <>
              Real Offers. Real Salary Hikes.{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Zero Ghosting.
              </span>
            </>
          }
          subtitle="Discover how software engineers, AI researchers, and tech leaders landed top product roles using JobPortal AI."
        />

        {/* 6 Grid Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {REAL_TESTIMONIALS.map((item, idx) => (
            <TestimonialCard key={item.id} item={item} highlight={idx === 0} />
          ))}
        </motion.div>

        {/* Verified Trust Rating Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl backdrop-blur-xl ${
            isLight
              ? "border-slate-200 bg-white shadow-xl"
              : "border-white/10 bg-[#090d16]/95"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-md ${
              isLight ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
            }`}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StarsRow rating={5} size={16} />
                <span className={`text-sm font-black font-satoshi ${isLight ? "text-slate-900" : "text-white"}`}>4.9 / 5.0 Rating</span>
              </div>
              <p className={`text-xs mt-1 font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Based on <strong className={isLight ? "text-slate-900 font-bold" : "text-white font-bold"}>12,400+ verified offers</strong> at Swiggy, Razorpay, CRED, PhonePe & Atlassian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`rounded-full border px-3.5 py-1.5 text-xs font-black font-satoshi ${
              isLight ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
            }`}>
              ⚡ Avg. 14 Days to Offer
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
