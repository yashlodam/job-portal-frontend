import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import { aiTools } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";

/* ===========================
    Animation Variants
=========================== */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ===========================
    AI Tool Card
=========================== */

function AIToolCard({ tool }) {
  const IconComponent = tool.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-500 sm:p-8"
      style={{
        borderColor: "rgba(148,163,184,0.08)",
        background: "#0D1117",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${tool.gradient.from}35`;
        e.currentTarget.style.boxShadow   = `0 0 40px ${tool.gradient.from}14`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
        e.currentTarget.style.boxShadow   = "none";
      }}
    >
      {/* Animated gradient orb — top right */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background: `radial-gradient(circle, ${tool.gradient.from}35, transparent 70%)`,
          filter: "blur(40px)",
          opacity: 0.25,
        }}
        aria-hidden="true"
      />

      {/* Gradient tint on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${tool.gradient.from}07, transparent 55%)`,
        }}
        aria-hidden="true"
      />

      {/* Tag badge */}
      <span
        className="relative inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
        style={{
          backgroundColor: `${tool.gradient.from}18`,
          color: tool.gradient.from,
        }}
      >
        {tool.tag}
      </span>

      {/* Icon */}
      <div
        className="relative mt-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${tool.gradient.from}, ${tool.gradient.to})`,
          boxShadow: `0 8px 24px ${tool.gradient.from}30`,
        }}
      >
        <IconComponent size={24} className="text-white" />
      </div>

      {/* Title */}
      <h3
        className="relative mt-5 text-lg font-bold text-[#F1F5F9] sm:text-xl"
        style={{ fontFamily: "var(--font-satoshi)" }}
      >
        {tool.title}
      </h3>

      {/* Description */}
      <p className="relative mt-3 text-sm leading-7 text-[#94A3B8] sm:text-base">
        {tool.description}
      </p>

      {/* Stats */}
      <div className="relative mt-5 flex items-center gap-2 text-sm font-medium text-[#708090]">
        <BarChart3 size={14} aria-hidden="true" />
        <span>{tool.stats}</span>
      </div>

      {/* Learn more link */}
      <motion.button
        type="button"
        aria-label={`Learn more about ${tool.title}`}
        className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:underline"
        style={{ color: tool.gradient.from }}
        whileHover="hover"
      >
        Learn more
        <motion.span
          variants={{ hover: { x: 4 } }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight size={14} />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

/* ===========================
    AIToolsShowcase Section
=========================== */

function AIToolsShowcase() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background glows */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full"
        style={{ background: "rgba(139,92,246,0.06)", filter: "blur(200px)" }}
      />
      <div
        className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full"
        style={{ background: "rgba(99,102,241,0.04)", filter: "blur(180px)" }}
      />

      <div className="section-container">
        {/* Section Header */}
        <SectionHeader
          badge="AI-Powered Tools"
          title={
            <>
              Supercharge your{" "}
              <span className="gradient-text">career</span>
            </>
          }
          subtitle="Leverage cutting-edge AI tools designed to give you an unfair advantage in your job search."
        />

        {/* Bento Grid — 2 columns, each card equal weight */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {aiTools.map((tool) => (
            <AIToolCard key={tool.id} tool={tool} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AIToolsShowcase;
