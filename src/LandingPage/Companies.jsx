import React from "react";
import MarqueeModule from "react-fast-marquee";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";

const Marquee = MarqueeModule.default ?? MarqueeModule;

/* ===========================
    Company Data
=========================== */

const COMPANIES = [
  { name: "Google",    color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Amazon",    color: "#FF9900" },
  { name: "Meta",      color: "#0866FF" },
  { name: "Netflix",   color: "#E50914" },
  { name: "Adobe",     color: "#FF0000" },
  { name: "Spotify",   color: "#1DB954" },
  { name: "Uber",      color: "#A0A0A0" },
  { name: "Apple",     color: "#A2AAAD" },
  { name: "Airbnb",    color: "#FF5A5F" },
];

/*
  react-fast-marquee's gradientColor prop expects an RGB array
  or hex string — NOT a CSS custom property.
  Using the exact background value: #06080F
*/
const GRADIENT_COLOR = "#06080F";

/* ===========================
    CompanyCard
=========================== */

function CompanyCard({ company }) {
  const logoSrc = `/Companies/${company.name.toLowerCase()}.svg`;

  return (
    <motion.div
      className="mx-2 sm:mx-3"
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <div
        className="group relative flex h-24 w-40 flex-col items-center justify-center overflow-hidden rounded-[18px] border transition-all duration-500 hover:shadow-[0_0_24px_rgba(99,102,241,0.12)] sm:h-28 sm:w-44 lg:h-32 lg:w-52"
        style={{
          borderColor: "rgba(148,163,184,0.08)",
          background: "rgba(13,17,23,0.80)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-15"
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at center, ${company.color}, transparent 70%)`,
            filter: "blur(16px)",
          }}
        />

        {/* Shine sweep — uses .shine-sweep which is paused until group:hover */}
        <div
          className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 shine-sweep group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Logo via CSS mask */}
        <motion.div
          whileHover={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.5 }}
          className="relative z-20 h-8 w-8 sm:h-10 sm:w-10"
          style={{
            backgroundColor: company.color,
            maskImage: `url(${logoSrc})`,
            WebkitMaskImage: `url(${logoSrc})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          {/* Img fallback (hidden behind mask, shown if mask not supported) */}
          <img
            src={logoSrc}
            alt={`${company.name} logo`}
            className="h-full w-full object-contain"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }}
          />
        </motion.div>

        {/* Company name */}
        <h3 className="relative z-20 mt-2.5 text-xs font-semibold text-[#F1F5F9] sm:mt-3 sm:text-sm">
          {company.name}
        </h3>

        {/* Hiring badge */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-medium text-[#10B981] sm:text-xs">
            Hiring Now
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ===========================
    Companies Section
=========================== */

export default function Companies() {
  return (
    <section
      className="relative overflow-hidden section-padding"
      aria-label="Trusted companies"
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
          style={{ background: "rgba(99,102,241,0.06)", filter: "blur(180px)" }}
        />
        <div
          className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full"
          style={{ background: "rgba(6,182,212,0.06)", filter: "blur(160px)" }}
        />
      </div>

      <div className="section-container">
        {/* Section Header */}
        <SectionHeader
          badge="Trusted Worldwide"
          title={
            <>
              Trusted by{" "}
              <span className="gradient-text">1,000+</span>{" "}
              Companies
            </>
          }
          subtitle="Top companies use our AI-powered hiring platform to discover, evaluate, and recruit talented developers worldwide."
        />

        {/* Underline accent */}
        <div
          className="mx-auto mt-5 h-[3px] w-12 rounded-full sm:w-16"
          style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
        />
      </div>

      {/* Marquee — full bleed */}
      <motion.div
        className="mt-12 sm:mt-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <Marquee
          speed={38}
          gradient
          gradientColor={GRADIENT_COLOR}
          gradientWidth={80}
          pauseOnHover
          autoFill
        >
          {COMPANIES.map((company) => (
            <CompanyCard key={company.name} company={company} />
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}