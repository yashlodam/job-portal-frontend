import React from "react";
import DreamJob from "../LandingPage/DreamJob";
import Companies from "../LandingPage/Companies";
import JobCategory from "../LandingPage/JobCategory";
import FeaturedJobs from "../LandingPage/FeaturedJobs";
import AIToolsShowcase from "../LandingPage/AIToolsShowcase";
import Testimonials from "../LandingPage/Testimonials";
import CallToAction from "../LandingPage/CallToAction";

/* ──────────────────────────────────────────────
   Home — Landing page assembly
   Header & Footer are rendered by Layout.jsx
   ────────────────────────────────────────────── */

function Home() {
  return (
    <div className="relative">
      {/* Mesh gradient background layer — absolute so it stays within Home only */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient" />

      {/* Ambient glow orbs — absolute (not fixed) so they don't bleed into other pages */}
      <div className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-[600px] w-[600px] rounded-full bg-violet/4 blur-[200px]" />

      {/* Subtle dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Page content — no extra container or padding so each section manages its own */}
      <div className="relative z-10">
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