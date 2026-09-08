/**
 * src/Pages/Home.jsx
 *
 * Master Landing Page Assembly - Optimal Senior UX Hierarchy with Interactive Background Animation.
 *
 * Flow Architecture:
 * 1. HomeAnimatedBackground (GPU-Accelerated 60 FPS Canvas Constellation, Interactive Mouse Physics & Floating Nebula Orbs)
 * 2. DreamJob (Hero with Command Search, Preserved Graphic & Anchored Stats)
 * 3. Companies (Global Enterprise Social Proof Marquee with Glassmorphism)
 * 4. JobCategory (Interactive Role & Work Mode Discovery)
 * 5. FeaturedJobs (Verified High-Impact Live Opportunities)
 * 6. HowItWorks (3-Step AI Matching Workflow & Live Match Simulation)
 * 7. AIToolsShowcase (AI Feature Suite - Cover Letter, Fit Score, Resumes)
 * 8. SalaryInsights (Interactive 2026 Tech Salary Benchmark Explorer)
 * 9. Testimonials (Verified Candidate Success Stories & 4.9/5 Rating)
 * 10. DualCTA (Job Seeker vs. Employer Split Conversion Engine)
 */

import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../State/Store";
import { useTheme } from "../context/ThemeContext";
import HomeAnimatedBackground from "../components/home/HomeAnimatedBackground";
import DreamJob from "../LandingPage/DreamJob";
import Companies from "../LandingPage/Companies";
import JobCategory from "../LandingPage/JobCategory";
import FeaturedJobs from "../LandingPage/FeaturedJobs";
import HowItWorks from "../LandingPage/HowItWorks";
import AIToolsShowcase from "../LandingPage/AIToolsShowcase";
import SalaryInsights from "../LandingPage/SalaryInsights";
import DualCTA from "../LandingPage/DualCTA";
import RecommendedJobsSection from "../components/recommendation/RecommendedJobsSection";

function Home() {
  const { profile } = useAppSelector((state) => state.auth);
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`relative min-h-screen font-inter transition-colors duration-500 overflow-x-hidden ${
      isLight ? "bg-[#F8FAFC] text-slate-800" : "bg-[#05070d] text-slate-200"
    }`}>
      {/* ── Interactive GPU-Accelerated Background Engine ── */}
      <HomeAnimatedBackground />

      {/* ── UX-Optimized Section Flow with Layered Stacking ── */}
      <div className="relative z-10 space-y-0">
        <DreamJob />
        <Companies />

        {/* Dynamic Personalization Layer: Top Recommended Jobs for Authenticated Seekers */}
        {profile ? (
          <section className={`relative py-12 border-b transition-colors ${
            isLight ? "border-slate-200/80 bg-gradient-to-b from-indigo-50/40 via-white/20 to-transparent backdrop-blur-xs" : "border-white/5 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent"
          }`}>
            <div className="section-container">
              <RecommendedJobsSection showHeading={true} limit={4} />
            </div>
          </section>
        ) : (
          <section className={`relative py-10 border-b transition-colors ${
            isLight ? "border-slate-200/80 bg-gradient-to-r from-indigo-50/40 via-white/30 to-purple-50/40 backdrop-blur-xs" : "border-white/5 bg-gradient-to-r from-indigo-950/25 via-transparent to-purple-950/25"
          }`}>
            <div className="section-container">
              <div className={`flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all ${
                isLight ? "border-indigo-200/80 bg-white/85 shadow-indigo-100/50 hover:border-indigo-300" : "border-indigo-500/20 bg-[#090d16]/80 hover:border-indigo-500/40"
              }`}>
                <div className="space-y-2 text-center md:text-left">
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                    isLight ? "bg-indigo-50 border border-indigo-200 text-indigo-700" : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span>AI Career Matching Preview</span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-black font-satoshi ${isLight ? "text-slate-900" : "text-white"}`}>
                    Unlock Personalized Job Matches &amp; Fit Scores
                  </h3>
                  <p className={`text-xs sm:text-sm max-w-xl leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    Create your candidate profile or enter your skills to get instant deterministic ATS match scores, salary benchmarks, and tailored openings.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    <span>Get Matched Now</span>
                  </Link>
                  <Link
                    to="/find-jobs"
                    className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition ${
                      isLight ? "border-slate-200 bg-white/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Browse All Roles
                  </Link>
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
        <DualCTA />
      </div>
    </div>
  );
}

export default Home;