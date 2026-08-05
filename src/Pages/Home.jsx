/**
 * src/Pages/Home.jsx
 *
 * Master Landing Page Assembly.
 * Seamless dark ambient mesh background, dot grid textures,
 * and unified section flow.
 */

import React from "react";
import DreamJob from "../LandingPage/DreamJob";
import Companies from "../LandingPage/Companies";
import JobCategory from "../LandingPage/JobCategory";
import FeaturedJobs from "../LandingPage/FeaturedJobs";
import AIToolsShowcase from "../LandingPage/AIToolsShowcase";
import Testimonials from "../LandingPage/Testimonials";
import CallToAction from "../LandingPage/CallToAction";

function Home() {
  return (
    <div className="relative min-h-screen bg-[#05070d] font-inter text-slate-200 overflow-x-hidden">
      {/* ── Ambient Background Mesh Glow ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#05070d] to-[#05070d]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[700px] w-[700px] rounded-full bg-indigo-600/10 blur-[200px]" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[180px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-pink-600/5 blur-[160px]" />

      {/* Subtle Dot Grid Backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #A5B4FC 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Section Flow ── */}
      <div className="relative z-10 space-y-0">
        <DreamJob />
        <JobCategory />
        <AIToolsShowcase />
        <FeaturedJobs />
        <Companies />
        <Testimonials />
        <CallToAction />
      </div>
    </div>
  );
}

export default Home;