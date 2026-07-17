import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Lightbulb,
  Shield,
  Award,
  Users,
  Zap,
  Heart,
  Target,
  ArrowRight,
  Briefcase,
  UserCheck,
  TrendingUp,
  Globe,
  Rocket,
} from "lucide-react";

/* ===========================
    Animated Counter
=========================== */

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime = null;
    const numericEnd = parseInt(end.toString().replace(/\D/g, ""), 10);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * numericEnd));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ===========================
    Page Data
=========================== */

const stats = [
  { icon: Briefcase, value: 50, suffix: "K+", label: "Jobs Posted" },
  { icon: Globe,     value: 10, suffix: "K+", label: "Companies"  },
  { icon: Users,     value: 100,suffix: "K+", label: "Job Seekers"},
  { icon: TrendingUp,value: 95, suffix: "%",  label: "Success Rate"},
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI to transform how people find careers and how companies find talent.",
    from: "#6366F1",
    to: "#8B5CF6",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Every interaction on our platform is secure, transparent, and built on a foundation of mutual respect.",
    from: "#06B6D4",
    to: "#22D3EE",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We set the highest standards for ourselves and empower our users to achieve theirs.",
    from: "#8B5CF6",
    to: "#EC4899",
  },
  {
    icon: Heart,
    title: "Inclusion",
    description:
      "Diversity isn't a checkbox — it's woven into every algorithm, every feature, every decision we make.",
    from: "#F43F5E",
    to: "#F97316",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Time-to-hire matters. Our platform accelerates every step from discovery to offer letter.",
    from: "#F59E0B",
    to: "#FBBF24",
  },
  {
    icon: Target,
    title: "Impact",
    description:
      "Every placement changes a life. We measure success by the careers we help launch.",
    from: "#10B981",
    to: "#14B8A6",
  },
];

const team = [
  { name: "Alex Rivera",    role: "CEO & Co-founder",    initials: "AR", from: "#6366F1", to: "#8B5CF6", bio: "Former VP of Product at LinkedIn."       },
  { name: "Priya Patel",    role: "CTO",                 initials: "PP", from: "#06B6D4", to: "#6366F1", bio: "Ex-Google, ML infrastructure lead."       },
  { name: "Marcus Chen",    role: "Head of Design",      initials: "MC", from: "#8B5CF6", to: "#EC4899", bio: "Previously at Stripe and Figma."          },
  { name: "Sofia Nakamura", role: "VP of Engineering",   initials: "SN", from: "#10B981", to: "#06B6D4", bio: "Scaled systems at Netflix."               },
  { name: "David Okafor",   role: "Head of AI",          initials: "DO", from: "#F59E0B", to: "#F97316", bio: "Former research scientist at OpenAI."     },
  { name: "Emma Larsson",   role: "VP of People",        initials: "EL", from: "#F43F5E", to: "#8B5CF6", bio: "Built culture at Spotify."                },
];

/* ===========================
    Animation Variants
=========================== */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

/* ===========================
    Reusable PageBadge
=========================== */

function PageBadge({ children, icon: Icon, color = "primary" }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
      style={{
        borderColor: "rgba(99,102,241,0.20)",
        background: "rgba(99,102,241,0.10)",
      }}
    >
      {Icon && <Icon size={14} className="text-[#818CF8]" />}
      <span className="text-xs font-semibold uppercase tracking-wider text-[#818CF8]">
        {children}
      </span>
    </div>
  );
}

/* ===========================
    Main Page
=========================== */

function About() {
  return (
    <main className="relative overflow-x-hidden" aria-label="About Velora">
      {/* Global ambient glows — absolute, not fixed, so they don't bleed into other pages */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full"
          style={{ background: "rgba(99,102,241,0.07)", filter: "blur(180px)" }} />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full"
          style={{ background: "rgba(6,182,212,0.05)", filter: "blur(160px)" }} />
        <div className="absolute bottom-1/4 left-0 h-[350px] w-[350px] rounded-full"
          style={{ background: "rgba(139,92,246,0.04)", filter: "blur(140px)" }} />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ══════════ HERO ══════════ */}
      <section className="section-container section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <PageBadge>About Velora</PageBadge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]"
            style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)", letterSpacing: "-0.025em" }}
          >
            Building the future of{" "}
            <span className="gradient-text">career intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 md:text-lg"
            style={{ color: "var(--color-body)" }}
          >
            We're on a mission to eliminate the friction between exceptional
            talent and extraordinary opportunities. Powered by AI, designed
            for humans.
          </motion.p>
        </div>
      </section>

      {/* ══════════ STATS ROW ══════════ */}
      <section className="section-container pb-20 lg:pb-28" aria-label="Platform statistics">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group rounded-[20px] border p-5 text-center transition-all duration-300 sm:p-6"
              style={{
                borderColor: "rgba(148,163,184,0.08)",
                background: "#0D1117",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                e.currentTarget.style.boxShadow   = "0 0 32px rgba(99,102,241,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              <stat.icon
                size={24}
                className="mx-auto transition-transform duration-300 group-hover:scale-110"
                style={{ color: "#818CF8" }}
              />
              <p
                className="mt-4 text-2xl font-extrabold sm:text-3xl"
                style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
              >
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
                />
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════ MISSION SECTION ══════════ */}
      <section
        className="border-t"
        style={{ borderColor: "rgba(148,163,184,0.08)", background: "rgba(13,17,23,0.40)" }}
      >
        <div className="section-container section-padding">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                style={{
                  borderColor: "rgba(6,182,212,0.20)",
                  background: "rgba(6,182,212,0.10)",
                }}
              >
                <Rocket size={14} className="text-[#22D3EE]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#22D3EE]">
                  Our Mission
                </span>
              </div>

              <h2
                className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
              >
                Connecting talent with{" "}
                <span className="gradient-text">opportunity</span>, at scale
              </h2>

              <p className="mt-6 leading-relaxed" style={{ color: "var(--color-body)" }}>
                We believe everyone deserves a career that aligns with their
                skills, passions, and values. Velora uses advanced AI to
                understand not just what you've done, but where you're headed.
              </p>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--color-body)" }}>
                For companies, we go beyond keyword matching. Our intelligent
                algorithms evaluate cultural fit, growth potential, and skill
                trajectories to surface candidates who will thrive — not just
                survive.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.40), transparent)" }}
                />
                <Sparkles size={18} style={{ color: "#818CF8" }} />
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(270deg, rgba(6,182,212,0.40), transparent)" }}
                />
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div
                className="aspect-[4/3] overflow-hidden rounded-[20px] border"
                style={{
                  borderColor: "rgba(148,163,184,0.08)",
                  background: "#0D1117",
                }}
              >
                <div className="relative flex h-full items-center justify-center">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.05), rgba(6,182,212,0.10))",
                    }}
                  />
                  {/* Floating rings */}
                  <div
                    aria-hidden="true"
                    className="absolute h-48 w-48 rounded-full border animate-float"
                    style={{ borderColor: "rgba(99,102,241,0.20)" }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute h-64 w-64 rounded-full border animate-float-slow"
                    style={{ borderColor: "rgba(139,92,246,0.12)" }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute h-32 w-32 rounded-full border animate-float"
                    style={{ borderColor: "rgba(6,182,212,0.15)", animationDelay: "1s" }}
                  />
                  <div
                    className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      boxShadow: "0 0 40px rgba(99,102,241,0.30)",
                    }}
                  >
                    <Sparkles size={32} className="text-white" />
                  </div>
                </div>
              </div>
              {/* Glow behind */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -z-10 rounded-[28px]"
                style={{ background: "rgba(99,102,241,0.04)", filter: "blur(24px)" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ VALUES GRID ══════════ */}
      <section className="section-container section-padding" aria-label="Our values">
        <div className="text-center">
          <div className="flex justify-center">
            <PageBadge>Our Values</PageBadge>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
          >
            What drives <span className="gradient-text">everything</span> we do
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="group rounded-[20px] border p-5 transition-all duration-300 sm:p-6"
              style={{ borderColor: "rgba(148,163,184,0.08)", background: "#0D1117" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${value.from}35`;
                e.currentTarget.style.boxShadow   = `0 0 32px ${value.from}14`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${value.from}, ${value.to})`,
                  boxShadow: `0 4px 16px ${value.from}30`,
                }}
              >
                <value.icon size={22} className="text-white" />
              </div>
              <h3
                className="mt-5 text-lg font-bold"
                style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
              >
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-body)" }}>
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════ TEAM SECTION ══════════ */}
      <section
        className="border-t"
        style={{ borderColor: "rgba(148,163,184,0.08)", background: "rgba(13,17,23,0.40)" }}
        aria-label="Our team"
      >
        <div className="section-container section-padding">
          <div className="text-center">
            <div className="flex justify-center">
              <PageBadge>Our Team</PageBadge>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-3xl font-extrabold sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
            >
              Meet the <span className="gradient-text">people</span> behind Velora
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl text-base leading-7"
              style={{ color: "var(--color-body)" }}
            >
              A diverse team of builders, dreamers, and problem-solvers united
              by a shared passion for transforming careers.
            </motion.p>
          </div>

          {/* Team Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {team.map((member) => (
              <motion.article
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group rounded-[20px] border p-5 text-center transition-all duration-300 sm:p-6"
                style={{ borderColor: "rgba(148,163,184,0.08)", background: "#0D1117" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  e.currentTarget.style.boxShadow   = "0 0 32px rgba(99,102,241,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(148,163,184,0.08)";
                  e.currentTarget.style.boxShadow   = "none";
                }}
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${member.from}, ${member.to})`,
                    boxShadow: `0 4px 20px ${member.from}35`,
                  }}
                >
                  {member.initials}
                </div>
                <h3
                  className="mt-5 text-lg font-bold"
                  style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
                >
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium" style={{ color: "#818CF8" }}>
                  {member.role}
                </p>
                <p className="mt-2 text-xs" style={{ color: "var(--color-muted)" }}>
                  {member.bio}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section className="section-container section-padding" aria-label="Join Velora team">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <div
            className="relative overflow-hidden rounded-[28px] border p-8 text-center sm:p-12"
            style={{
              borderColor: "rgba(99,102,241,0.20)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.04))",
            }}
          >
            {/* Inner glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full"
              style={{ background: "rgba(99,102,241,0.15)", filter: "blur(80px)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 right-1/4 h-32 w-32 rounded-full"
              style={{ background: "rgba(6,182,212,0.10)", filter: "blur(60px)" }}
            />

            <div className="relative z-10">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.30)",
                }}
              >
                <UserCheck size={26} className="text-white" />
              </div>

              <h2
                className="mt-6 text-2xl font-extrabold sm:text-3xl md:text-4xl"
                style={{ fontFamily: "var(--font-satoshi)", color: "var(--color-heading)" }}
              >
                Join the Velora{" "}
                <span className="gradient-text">team</span>
              </h2>

              <p className="mx-auto mt-4 max-w-lg" style={{ color: "var(--color-body)" }}>
                We're always looking for talented individuals who are passionate
                about building the future of work. See our open roles.
              </p>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                }}
              >
                View Open Positions
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default About;