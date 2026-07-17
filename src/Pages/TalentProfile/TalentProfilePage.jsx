import { Divider } from "@mantine/core";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import { profile } from "../../Data/Data";
import RecommendTalent from "./RecommendTalent";

function TalentProfilePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-['Poppins']">

      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full"
        style={{
          background: "rgba(99,102,241,0.07)",
          filter: "blur(180px)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-0 h-[400px] w-[400px] rounded-full"
        style={{
          background: "rgba(6,182,212,0.05)",
          filter: "blur(160px)",
        }}
      />

      {/* Dot Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10">

        {/* Top Navigation */}
        <div className="section-container py-5">
          <Link
            to="/find-talent"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              font-semibold
              text-body
              transition-all
              duration-300
              hover:bg-white/[0.05]
              hover:text-heading
            "
          >
            <IconArrowNarrowLeft
              stroke={1.8}
              size={20}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Talent
          </Link>
        </div>

        <Divider color="rgba(148,163,184,0.08)" />

        {/* Talent Profile */}
        <div className="section-container py-8 sm:py-10 lg:py-12">
  <div className="flex items-start gap-8">
    
    {/* Left - Main Profile */}
    <Profile {...profile} />

    {/* Right - Recommended Talent */}
    <div className="min-w-0 flex-1">
      <RecommendTalent />
    </div>

  </div>
</div>

      </div>
    </main>
  );
}

export default TalentProfilePage;