import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* ===========================
    Floating Spark Dots — no undefined props
=========================== */

const SPARKS = [
  { style: { top: "12%",  left: "8%"  }, delay: 0,   slow: false },
  { style: { top: "20%",  right: "10%"},  delay: 1,   slow: true  },
  { style: { bottom: "20%", left: "12%" }, delay: 0.5, slow: false },
  { style: { bottom: "15%", right: "8%" }, delay: 1.5, slow: true  },
  { style: { top: "50%",  left: "4%"  }, delay: 2,   slow: false },
  { style: { top: "60%",  right: "5%" }, delay: 0.8, slow: true  },
];

/* ===========================
    CallToAction Section
=========================== */

function CallToAction() {
  return (
    <section className="relative overflow-hidden section-padding">
      {/* Outer background glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "rgba(99,102,241,0.08)", filter: "blur(200px)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full"
        style={{ background: "rgba(6,182,212,0.08)", filter: "blur(150px)" }}
        aria-hidden="true"
      />

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Premium gradient card */}
          <div
            className="relative overflow-hidden rounded-[28px] border p-8 text-center sm:p-12 lg:p-20"
            style={{
              borderColor: "rgba(99,102,241,0.20)",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04), rgba(6,182,212,0.05))",
            }}
          >
            {/* Inner ambient glow — top */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full"
              style={{ background: "rgba(99,102,241,0.20)", filter: "blur(80px)" }}
              aria-hidden="true"
            />
            {/* Inner ambient glow — bottom right */}
            <div
              className="pointer-events-none absolute -bottom-16 right-1/4 h-48 w-48 rounded-full"
              style={{ background: "rgba(6,182,212,0.15)", filter: "blur(60px)" }}
              aria-hidden="true"
            />

            {/* Subtle dot grid inside card */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.04]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Top gradient line */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(99,102,241,0.50), transparent)",
              }}
              aria-hidden="true"
            />

            {/* Floating sparkle dots */}
            {SPARKS.map(({ style, delay, slow }, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`absolute h-1.5 w-1.5 rounded-full ${
                  slow ? "animate-float-slow" : "animate-float"
                }`}
                style={{
                  ...style,
                  background: "rgba(99,102,241,0.40)",
                  animationDelay: `${delay}s`,
                }}
              />
            ))}

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.30)",
                }}
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>

              {/* Headline */}
              <h2
                className="mt-7 text-3xl font-extrabold leading-tight tracking-tight text-[#F1F5F9] sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-satoshi)" }}
              >
                Ready to find your{" "}
                <br className="hidden sm:block" />
                <span className="gradient-text">next opportunity?</span>
              </h2>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[#94A3B8] sm:text-lg sm:leading-8">
                Join 50,000+ professionals who have already accelerated their
                careers with AI-powered tools.
              </p>

              {/* Button row */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                {/* Primary CTA */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/find-jobs"
                    className="flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-semibold text-white transition-shadow duration-300 sm:w-auto sm:inline-flex sm:px-8 sm:py-4"
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 32px rgba(99,102,241,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(99,102,241,0.25)";
                    }}
                  >
                    Get Started Free
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>

                {/* Secondary CTA */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/about"
                    className="flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-base font-semibold text-[#F1F5F9] transition-all duration-300 sm:w-auto sm:inline-flex sm:px-8 sm:py-4"
                    style={{
                      borderColor: "rgba(148,163,184,0.12)",
                      background: "rgba(13,17,23,0.80)",
                      backdropFilter: "blur(12px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(99,102,241,0.30)";
                      e.currentTarget.style.background =
                        "#161B22";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(148,163,184,0.12)";
                      e.currentTarget.style.background =
                        "rgba(13,17,23,0.80)";
                    }}
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>

              {/* Social proof */}
              <p className="mt-6 text-xs text-[#708090]">
                No credit card required · Free forever · Cancel anytime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CallToAction;
