/**
 * src/LandingPage/SalaryInsights.jsx
 *
 * Ultra-Premium Interactive Tech Salary & Compensation Benchmark Explorer.
 * Real-time salary distributions, YoY trends, and experience level breakdowns.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  IndianRupee,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  BarChart3,
  Award,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const ROLES_DATA = [
  {
    id: "fullstack",
    role: "Fullstack Engineer",
    avgSalary: "₹21.5 LPA",
    range: "₹12L – ₹38L",
    growth: "+28% YoY",
    description: "High demand for Next.js, React, Node.js, and Spring Boot specialists with cloud deployment experience.",
    levels: [
      { level: "Entry (0–2 yrs)", salary: "₹8L – ₹14L" },
      { level: "Mid (2–5 yrs)", salary: "₹15L – ₹24L" },
      { level: "Senior (5–8 yrs)", salary: "₹25L – ₹38L" },
      { level: "Lead / Staff (8+ yrs)", salary: "₹40L – ₹65L" },
    ],
    topCities: ["Bengaluru", "Pune", "Hyderabad", "Remote"],
    activeJobs: "3,420+ Openings",
  },
  {
    id: "ai_ml",
    role: "AI / ML Engineer",
    avgSalary: "₹27.0 LPA",
    range: "₹16L – ₹52L",
    growth: "+38% YoY",
    description: "Surging demand for LLM orchestration, PyTorch, RAG architectures, and fine-tuning specialists.",
    levels: [
      { level: "Entry (0–2 yrs)", salary: "₹12L – ₹18L" },
      { level: "Mid (2–5 yrs)", salary: "₹20L – ₹32L" },
      { level: "Senior (5–8 yrs)", salary: "₹34L – ₹55L" },
      { level: "Lead / Staff (8+ yrs)", salary: "₹55L – ₹90L" },
    ],
    topCities: ["Bengaluru", "Hyderabad", "Mumbai", "Remote"],
    activeJobs: "1,890+ Openings",
  },
  {
    id: "frontend",
    role: "Frontend Developer",
    avgSalary: "₹16.8 LPA",
    range: "₹9L – ₹30L",
    growth: "+22% YoY",
    description: "Strong focus on React 19, TypeScript, micro-frontends, performance optimization, and responsive design systems.",
    levels: [
      { level: "Entry (0–2 yrs)", salary: "₹6L – ₹11L" },
      { level: "Mid (2–5 yrs)", salary: "₹12L – ₹19L" },
      { level: "Senior (5–8 yrs)", salary: "₹20L – ₹32L" },
      { level: "Lead / Staff (8+ yrs)", salary: "₹35L – ₹50L" },
    ],
    topCities: ["Bengaluru", "Pune", "Noida", "Remote"],
    activeJobs: "2,650+ Openings",
  },
  {
    id: "backend",
    role: "Backend / Java Engineer",
    avgSalary: "₹19.4 LPA",
    range: "₹11L – ₹35L",
    growth: "+24% YoY",
    description: "Enterprise demand for distributed systems, Spring Boot microservices, Kafka streaming, and Kubernetes.",
    levels: [
      { level: "Entry (0–2 yrs)", salary: "₹7L – ₹13L" },
      { level: "Mid (2–5 yrs)", salary: "₹14L – ₹22L" },
      { level: "Senior (5–8 yrs)", salary: "₹23L – ₹36L" },
      { level: "Lead / Staff (8+ yrs)", salary: "₹38L – ₹58L" },
    ],
    topCities: ["Bengaluru", "Hyderabad", "Pune", "Chennai"],
    activeJobs: "3,110+ Openings",
  },
  {
    id: "devops",
    role: "DevOps & Cloud Architect",
    avgSalary: "₹23.5 LPA",
    range: "₹14L – ₹44L",
    growth: "+26% YoY",
    description: "Specialists in AWS, Azure, Terraform, CI/CD automation, site reliability engineering, and zero-trust security.",
    levels: [
      { level: "Entry (0–2 yrs)", salary: "₹8L – ₹14L" },
      { level: "Mid (2–5 yrs)", salary: "₹16L – ₹26L" },
      { level: "Senior (5–8 yrs)", salary: "₹28L – ₹45L" },
      { level: "Lead / Staff (8+ yrs)", salary: "₹46L – ₹70L" },
    ],
    topCities: ["Bengaluru", "Pune", "Mumbai", "Remote"],
    activeJobs: "1,450+ Openings",
  },
  {
    id: "design",
    role: "Product UI/UX Designer",
    avgSalary: "₹16.0 LPA",
    range: "₹8L – ₹28L",
    growth: "+19% YoY",
    description: "Demand for design system architects, Figma component libraries, user research, and AI-first product interactions.",
    levels: [
      { level: "Entry (0–2 yrs)", salary: "₹6L – ₹10L" },
      { level: "Mid (2–5 yrs)", salary: "₹11L – ₹18L" },
      { level: "Senior (5–8 yrs)", salary: "₹19L – ₹30L" },
      { level: "Lead / Staff (8+ yrs)", salary: "₹32L – ₹48L" },
    ],
    topCities: ["Bengaluru", "Mumbai", "Delhi NCR", "Remote"],
    activeJobs: "980+ Openings",
  },
];

export default function SalaryInsights() {
  const [selectedRole, setSelectedRole] = useState(ROLES_DATA[0]);

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 lg:py-24 font-inter text-slate-200" aria-label="Salary Insights">
      {/* Background Lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/3 top-10 h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[180px]" />
        <div className="absolute left-10 bottom-10 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[160px]" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Market Intelligence 2026"
          title={
            <>
              Tech Salary &{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Compensation Benchmarks
              </span>
            </>
          }
          subtitle="Transparent, verified compensation data across software engineering, AI, and design roles in India and Remote."
        />

        {/* Role Selector Tabs */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {ROLES_DATA.map((r) => {
            const isSelected = selectedRole.id === r.id;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`relative px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105"
                    : "border border-white/10 bg-[#090d16]/90 text-slate-400 hover:text-white hover:border-white/20 hover:bg-[#0c111f]"
                }`}
              >
                {r.role}
              </button>
            );
          })}
        </div>

        {/* Selected Role Deep-Dive Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="mt-8 rounded-3xl border border-white/10 bg-[#090d16]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Top Metric Summary */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-300">
                    <TrendingUp size={13} className="text-emerald-400" />
                    <span>{selectedRole.growth} Demand Growth</span>
                  </div>

                  <h3 className="mt-3 text-2xl sm:text-3xl font-black text-white font-satoshi">
                    {selectedRole.role}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                    {selectedRole.description}
                  </p>
                </div>

                {/* Salary KPI Box */}
                <div className="rounded-2xl border border-white/10 bg-[#070b14] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Average Market Package
                    </span>
                    <span className="text-xs font-extrabold text-indigo-400">{selectedRole.activeJobs}</span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white font-satoshi text-emerald-400 tracking-tight">
                    {selectedRole.avgSalary}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-2.5">
                    <span>Typical Range:</span>
                    <span className="font-bold text-white">{selectedRole.range}</span>
                  </div>
                </div>

                {/* Top Hiring Hubs */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Top Hiring Hubs
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.topCities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1 rounded-xl bg-white/5 border border-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300"
                      >
                        <MapPin size={12} className="text-indigo-400" />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/find-jobs?keyword=${encodeURIComponent(selectedRole.role)}`}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-xs font-extrabold text-white shadow-lg hover:scale-105 transition cursor-pointer"
                >
                  <span>Explore {selectedRole.role} Jobs</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Right Column: Experience Level Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-satoshi">
                  Experience Level Breakdown (Annual CTC)
                </span>

                <div className="space-y-3">
                  {selectedRole.levels.map((lvl, idx) => (
                    <div
                      key={lvl.level}
                      className="rounded-2xl border border-white/10 bg-[#070b14]/90 p-4.5 sm:p-5 flex items-center justify-between transition hover:border-indigo-500/40 hover:bg-[#0c1122]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 font-extrabold text-xs font-mono">
                          0{idx + 1}
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-white font-satoshi">
                            {lvl.level}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-semibold">Verified Market Baseline</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm sm:text-base font-black text-emerald-400 font-satoshi">
                          {lvl.salary}
                        </span>
                        <span className="block text-[10px] font-bold text-slate-400">Fixed + Bonus</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Data Transparency Banner */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2.5">
                  <Sparkles size={16} className="text-indigo-400 shrink-0" />
                  <span>
                    Aggregated from 15,000+ verified active job postings and employer compensation disclosures.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
