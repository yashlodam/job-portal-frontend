/**
 * src/Pages/Home.jsx
 *
 * Master Landing Page Assembly - Optimal Senior UX Hierarchy.
 *
 * Flow Architecture:
 * 1. DreamJob (Hero with Command Search, Preserved Graphic & Anchored Stats)
 * 2. Companies (Global Enterprise Social Proof Marquee)
 * 3. JobCategory (Interactive Role & Work Mode Discovery)
 * 4. FeaturedJobs (Verified High-Impact Live Opportunities)
 * 5. HowItWorks (3-Step AI Matching Workflow & Live Match Simulation)
 * 6. AIToolsShowcase (AI Feature Suite - Cover Letter, Fit Score, Resumes)
 * 7. SalaryInsights (Interactive 2026 Tech Salary Benchmark Explorer)
 * 8. Testimonials (Verified Candidate Success Stories & 4.9/5 Rating)
 * 9. DualCTA (Job Seeker vs. Employer Split Conversion Engine)
 */

import React from "react";
import { useAppSelector } from "../State/Store";
import DreamJob from "../LandingPage/DreamJob";
import Companies from "../LandingPage/Companies";
import JobCategory from "../LandingPage/JobCategory";
import FeaturedJobs from "../LandingPage/FeaturedJobs";
import HowItWorks from "../LandingPage/HowItWorks";
import AIToolsShowcase from "../LandingPage/AIToolsShowcase";
import SalaryInsights from "../LandingPage/SalaryInsights";
import Testimonials from "../LandingPage/Testimonials";
import DualCTA from "../LandingPage/DualCTA";
import RecommendedJobsSection from "../components/recommendation/RecommendedJobsSection";

function Home() {
  const { profile } = useAppSelector((state) => state.auth);

  return (
    <div className="relative min-h-screen bg-[#05070d] font-inter text-slate-200 overflow-x-hidden">
      {/* ── Ambient Background Mesh Glows ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#05070d] to-[#05070d]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[700px] w-[700px] rounded-full bg-indigo-600/10 blur-[200px]" />
      <div className="pointer-events-none absolute top-1/4 -left-40 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[180px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[650px] w-[650px] rounded-full bg-cyan-600/5 blur-[200px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-0 h-[500px] w-[500px] rounded-full bg-pink-600/5 blur-[170px]" />

      {/* Subtle Dot Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #A5B4FC 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── UX-Optimized Section Flow ── */}
      <div className="relative z-10 space-y-0">
        <DreamJob />
        <Companies />

        {/* Dynamic Personalization Layer: Top Recommended Jobs for Authenticated Seekers */}
        {profile ? (
          <section className="relative py-12 border-b border-white/5 bg-gradient-to-b from-indigo-950/20 to-transparent">
            <div className="section-container">
              <RecommendedJobsSection showHeading={true} limit={4} />
            </div>
          </section>
        ) : (
          <section className="relative py-10 border-b border-white/5 bg-gradient-to-r from-indigo-950/30 via-[#080d1a] to-purple-950/30">
            <div className="section-container">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-indigo-500/20 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span>AI Career Matching Preview</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-satoshi">
                    Unlock Personalized Job Matches &amp; Fit Scores
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                    Create your candidate profile or enter your skills to get instant deterministic ATS match scores, salary benchmarks, and tailored openings.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    <span>Get Matched Now</span>
                  </a>
                  <a
                    href="/find-jobs"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
                  >
                    Browse All Roles
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <JobCategory />
        <FeaturedJobs />
        <HowItWorks />
        <AIToolsShowcase />
        <SalaryInsights />
        <Testimonials />
        <DualCTA />
      </div>
    </div>
  );
}

export default Home;