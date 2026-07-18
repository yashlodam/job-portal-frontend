import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowLeft,
  IconBuildingSkyscraper,
  IconMapPin,
  IconUsers,
  IconBriefcase,
  IconWorld,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandGithub,
  IconStar,
  IconStarFilled,
  IconSparkles,
  IconChevronRight,
  IconTrendingUp,
  IconClock,
  IconDiamond,
  IconHeartHandshake,
  IconRocket,
  IconShieldCheck,
  IconCoffee,
  IconSchool,
  IconPlaneTilt,
  IconMedicalCross,
  IconCircleCheck,
  IconBookmark,
  IconShare,
  IconExternalLink,
  IconCode,
  IconPalette,
  IconChartBar,
  IconDeviceMobile,
  IconCloud,
  IconDatabase,
} from "@tabler/icons-react";

/* ═══════════════════════════════════════
   MOCK COMPANY DATA
═══════════════════════════════════════ */
const COMPANY = {
  id: "google",
  name: "Google",
  tagline: "Organizing the world's information, making it universally accessible and useful.",
  description: [
    "Google LLC is an American multinational technology company that specializes in Internet-related services and products. Founded in 1998 by Larry Page and Sergey Brin while they were PhD students at Stanford University, Google has grown from a simple search engine into one of the world's most valuable and influential technology companies.",
    "Today, Google's product portfolio spans search, advertising, cloud computing, software, and hardware. Our teams work across offices around the globe to build products that are used by billions of people every day — from Search and Maps to Gmail, YouTube, and Google Cloud.",
    "At Google, we believe that technology should help people in meaningful ways. We bring the best of AI, machine learning, and human creativity to solve problems at planet-scale. Our engineers, designers, and researchers push the boundaries of what's possible — and we're always looking for brilliant people to join us.",
  ],
  logo: "/Companies/google.svg",
  coverColor: "from-[#1a1f3a] via-[#0f172a] to-[#06080F]",
  industry: "Technology",
  headquarters: "Mountain View, CA",
  founded: "1998",
  employees: "190,000+",
  revenue: "$282B+ (2023)",
  website: "google.com",
  linkedin: "#",
  twitter: "#",
  github: "#",
  rating: 4.6,
  reviews: 28400,
  openRoles: 6,
  stats: [
    { label: "Employees", value: "190K+", icon: IconUsers },
    { label: "Countries", value: "50+", icon: IconMapPin },
    { label: "Open Roles", value: "6", icon: IconBriefcase },
    { label: "Founded", value: "1998", icon: IconRocket },
  ],
  benefits: [
    { icon: IconMedicalCross, label: "Health Insurance", desc: "Premium medical, dental & vision for you and your family" },
    { icon: IconPlaneTilt, label: "Unlimited PTO", desc: "Flexible vacation policy — recharge when you need it" },
    { icon: IconSchool, label: "Learning Budget", desc: "$5,000 annual stipend for conferences & courses" },
    { icon: IconCoffee, label: "Free Meals", desc: "World-class on-campus dining, snacks & coffee 24/7" },
    { icon: IconHeartHandshake, label: "Parental Leave", desc: "24 weeks paid leave for all new parents" },
    { icon: IconShieldCheck, label: "Life Insurance", desc: "2× salary coverage with additional disability plans" },
    { icon: IconDiamond, label: "Equity Package", desc: "Competitive RSU grants with annual refresh" },
    { icon: IconChartBar, label: "401(k) Match", desc: "Up to 6% employer match with immediate vesting" },
  ],
  techStack: ["React", "TypeScript", "Go", "Python", "Kubernetes", "TensorFlow", "BigQuery", "Spanner"],
  culture: [
    { icon: IconRocket, title: "Move Fast", desc: "We ship products used by billions and iterate quickly on feedback." },
    { icon: IconHeartHandshake, title: "Collaborative", desc: "Cross-functional teams that respect diverse perspectives." },
    { icon: IconDiamond, title: "Excellence", desc: "We hire only the best and foster a culture of craft." },
    { icon: IconShieldCheck, title: "Inclusive", desc: "Equal opportunity employer committed to diversity & belonging." },
  ],
};

/* ─── Open Roles ─── */
const OPEN_ROLES = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    team: "Google Cloud",
    location: "Mountain View, CA",
    mode: "Hybrid",
    type: "Full Time",
    salary: "$180K – $250K",
    posted: "2 days ago",
    tags: ["React", "TypeScript", "GraphQL"],
    icon: IconCode,
  },
  {
    id: 2,
    title: "Product Designer",
    team: "Google Workspace",
    location: "New York, NY",
    mode: "Remote",
    type: "Full Time",
    salary: "$150K – $200K",
    posted: "1 day ago",
    tags: ["Figma", "Design Systems", "Prototyping"],
    icon: IconPalette,
  },
  {
    id: 3,
    title: "ML Engineer",
    team: "Google DeepMind",
    location: "London, UK",
    mode: "Hybrid",
    type: "Full Time",
    salary: "$200K – $300K",
    posted: "3 days ago",
    tags: ["Python", "PyTorch", "LLMs"],
    icon: IconDatabase,
  },
  {
    id: 4,
    title: "iOS Developer",
    team: "Google Maps",
    location: "Cupertino, CA",
    mode: "On Site",
    type: "Full Time",
    salary: "$175K – $240K",
    posted: "4 days ago",
    tags: ["Swift", "SwiftUI", "Core Location"],
    icon: IconDeviceMobile,
  },
  {
    id: 5,
    title: "Cloud Solutions Architect",
    team: "Google Cloud",
    location: "Seattle, WA",
    mode: "Remote",
    type: "Full Time",
    salary: "$200K – $280K",
    posted: "5 days ago",
    tags: ["GCP", "Kubernetes", "Terraform"],
    icon: IconCloud,
  },
  {
    id: 6,
    title: "UX Research Intern",
    team: "Google Search",
    location: "Mountain View, CA",
    mode: "On Site",
    type: "Internship",
    salary: "$55K – $70K",
    posted: "1 week ago",
    tags: ["User Research", "A/B Testing", "Analytics"],
    icon: IconChartBar,
  },
];

/* ─── Similar Companies ─── */
const SIMILAR_COMPANIES = [
  { name: "Meta", logo: "/Companies/meta.svg", industry: "Technology", employees: "86K+", roles: 8 },
  { name: "Microsoft", logo: "/Companies/microsoft.svg", industry: "Technology", employees: "220K+", roles: 12 },
  { name: "Amazon", logo: "/Companies/amazon.svg", industry: "E-Commerce & Cloud", employees: "1.5M+", roles: 15 },
  { name: "Apple", logo: "/Companies/apple.svg", industry: "Consumer Electronics", employees: "164K+", roles: 9 },
];

/* ═══════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const modeColor = {
  Remote: "text-accent bg-accent/10 border-accent/20",
  Hybrid: "text-violet-light bg-violet/10 border-violet/20",
  "On Site": "text-accent-warm bg-accent-warm/10 border-accent-warm/20",
};

/* ═══════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════ */

/* ── Star Rating ── */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.5;
        return filled || half ? (
          <IconStarFilled key={i} size={14} className="text-accent-warm" />
        ) : (
          <IconStar key={i} size={14} className="text-muted" />
        );
      })}
    </div>
  );
}

/* ── Tab Nav ── */
function TabNav({ active, onChange }) {
  const tabs = ["Overview", "Open Roles", "Benefits", "Culture"];
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative px-5 py-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            active === t ? "text-heading" : "text-muted hover:text-body"
          }`}
        >
          {t}
          {active === t && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Job Row Card ── */
function JobRow({ job }) {
  const Icon = job.icon;
  return (
    <motion.div variants={fadeUp}>
      <Link
        to={`/jobs/${job.id}`}
        className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary hover:bg-surface-elevated/60"
      >
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon size={20} className="text-primary-light" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-satoshi text-base font-bold text-heading group-hover:text-primary-light transition-colors">
              {job.title}
            </h3>
            <span className="rounded-full bg-surface-elevated border border-border px-2.5 py-0.5 text-xs text-muted">
              {job.team}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <IconMapPin size={12} className="text-primary-light" /> {job.location}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${modeColor[job.mode]}`}>
              {job.mode}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-light">
              <IconBriefcase size={11} /> {job.type}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <IconClock size={11} /> {job.posted}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.tags.map((t) => (
              <span key={t} className="rounded-full bg-primary/[0.08] px-2.5 py-0.5 text-xs font-medium text-primary-light/80">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Salary + CTA */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
          <span className="text-sm font-bold text-heading">{job.salary}</span>
          <span className="inline-flex items-center gap-1.5 rounded-xl gradient-bg-signature px-4 py-2 text-xs font-semibold text-white opacity-90 group-hover:opacity-100 transition-opacity">
            Apply <IconChevronRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function CompanyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");
  const [saved, setSaved] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-inter text-body">

      {/* ── Background Effects ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 mesh-gradient" />
      <div aria-hidden="true" className="pointer-events-none fixed -top-24 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[180px]" />
      <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-violet/3 blur-[240px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="relative z-10">

        {/* ══════════════════════════════
            HERO BANNER
        ══════════════════════════════ */}
        <div className={`relative bg-gradient-to-br ${COMPANY.coverColor} border-b border-border`}>
          {/* Grid overlay on banner */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />

          <div className="relative section-container pt-8 pb-0">
            {/* Back + Actions */}
            <div className="flex items-center justify-between mb-10">
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-heading backdrop-blur hover:bg-white/10 transition-all cursor-pointer"
              >
                <IconArrowLeft size={16} className="text-muted group-hover:text-primary-light transition-colors group-hover:-translate-x-0.5" />
                Back
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <button
                  onClick={() => setSaved(!saved)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer backdrop-blur ${
                    saved
                      ? "border-primary/40 bg-primary/15 text-primary-light"
                      : "border-white/10 bg-white/5 text-heading hover:bg-white/10"
                  }`}
                >
                  <IconBookmark size={15} />
                  {saved ? "Saved" : "Save"}
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-heading hover:bg-white/10 transition-all cursor-pointer backdrop-blur">
                  <IconShare size={15} />
                  Share
                </button>
              </motion.div>
            </div>

            {/* Company Identity */}
            <div className="flex flex-col sm:flex-row items-start gap-6 pb-8">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-white p-4 shadow-2xl ring-4 ring-white/10">
                  <img src={COMPANY.logo} alt={COMPANY.name} className="h-full w-full object-contain" />
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-success shadow-lg">
                  <IconCircleCheck size={16} className="text-white" />
                </span>
              </motion.div>

              {/* Text */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-satoshi">{COMPANY.name}</h1>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-warm/15 border border-accent-warm/30 px-3 py-1 text-xs font-bold text-accent-warm">
                      <IconSparkles size={12} /> Top Company
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-white/60 max-w-2xl leading-relaxed">{COMPANY.tagline}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50">
                    <span className="inline-flex items-center gap-1.5">
                      <IconBuildingSkyscraper size={14} /> {COMPANY.industry}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IconMapPin size={14} /> {COMPANY.headquarters}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IconUsers size={14} /> {COMPANY.employees} employees
                    </span>
                    <a
                      href={`https://${COMPANY.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <IconWorld size={14} /> {COMPANY.website}
                      <IconExternalLink size={11} />
                    </a>
                  </div>

                  {/* Rating + Socials */}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StarRating rating={COMPANY.rating} />
                      <span className="text-sm font-bold text-white">{COMPANY.rating}</span>
                      <span className="text-xs text-white/40">({COMPANY.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={COMPANY.linkedin} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all">
                        <IconBrandLinkedin size={15} />
                      </a>
                      <a href={COMPANY.twitter} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all">
                        <IconBrandTwitter size={15} />
                      </a>
                      <a href={COMPANY.github} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all">
                        <IconBrandGithub size={15} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 border-t border-white/10"
            >
              {COMPANY.stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center justify-center py-5 gap-1">
                  <span className="text-2xl font-extrabold text-white font-satoshi">{value}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                    <Icon size={12} /> {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════
            MAIN BODY
        ══════════════════════════════ */}
        <div className="section-container py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── Left: Tab Content ── */}
            <div className="flex-1 min-w-0">

              {/* Tab Nav */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-7"
              >
                <TabNav active={tab} onChange={setTab} />
              </motion.div>

              <AnimatePresence mode="wait">
                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === "Overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-7"
                  >
                    {/* About */}
                    <section>
                      <h2 className="heading-sm mb-4">About {COMPANY.name}</h2>
                      <div className="space-y-4">
                        {COMPANY.description.map((para, i) => (
                          <p key={i} className="text-body leading-relaxed">{para}</p>
                        ))}
                      </div>
                    </section>

                    {/* Tech Stack */}
                    <section>
                      <h3 className="text-base font-bold text-heading font-satoshi mb-3">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {COMPANY.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-xl border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary-light"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </section>

                    {/* Culture Highlights */}
                    <section>
                      <h3 className="text-base font-bold text-heading font-satoshi mb-4">Culture & Values</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {COMPANY.culture.map(({ icon: Icon, title, desc }) => (
                          <div
                            key={title}
                            className="rounded-2xl border border-border bg-surface p-5 flex items-start gap-4 hover:border-primary/20 transition-colors"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <Icon size={18} className="text-primary-light" />
                            </div>
                            <div>
                              <p className="font-semibold text-heading text-sm">{title}</p>
                              <p className="text-xs text-muted mt-1 leading-relaxed">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Featured Roles teaser */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-heading font-satoshi">Featured Roles</h3>
                        <button
                          onClick={() => setTab("Open Roles")}
                          className="text-xs font-semibold text-primary-light hover:underline"
                        >
                          See all {COMPANY.openRoles} roles →
                        </button>
                      </div>
                      <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="visible">
                        {OPEN_ROLES.slice(0, 3).map((job) => (
                          <JobRow key={job.id} job={job} />
                        ))}
                      </motion.div>
                    </section>
                  </motion.div>
                )}

                {/* ═══ OPEN ROLES TAB ═══ */}
                {tab === "Open Roles" && (
                  <motion.div
                    key="roles"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="heading-sm">Open Roles <span className="ml-2 text-lg text-muted font-normal">({OPEN_ROLES.length})</span></h2>
                    </div>
                    <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="visible">
                      {OPEN_ROLES.map((job) => (
                        <JobRow key={job.id} job={job} />
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* ═══ BENEFITS TAB ═══ */}
                {tab === "Benefits" && (
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h2 className="heading-sm mb-2">Benefits & Perks</h2>
                    <p className="text-body mb-6">Google offers world-class benefits to help you thrive at work and beyond.</p>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={stagger}
                      initial="hidden"
                      animate="visible"
                    >
                      {COMPANY.benefits.map(({ icon: Icon, label, desc }) => (
                        <motion.div
                          key={label}
                          variants={fadeUp}
                          className="group rounded-2xl border border-border bg-surface p-6 flex items-start gap-4 hover:border-primary/25 hover:shadow-glow-primary transition-all duration-300"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <Icon size={22} className="text-primary-light" />
                          </div>
                          <div>
                            <p className="font-semibold text-heading">{label}</p>
                            <p className="text-sm text-muted mt-1 leading-relaxed">{desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* ═══ CULTURE TAB ═══ */}
                {tab === "Culture" && (
                  <motion.div
                    key="culture"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="heading-sm mb-2">Life at {COMPANY.name}</h2>
                      <p className="text-body max-w-2xl">
                        At Google, our people are our biggest asset. We invest in creating an environment where every Googler can do their best work, feel safe to take risks, and build a career they love.
                      </p>
                    </div>

                    {/* Values grid */}
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      variants={stagger}
                      initial="hidden"
                      animate="visible"
                    >
                      {COMPANY.culture.map(({ icon: Icon, title, desc }) => (
                        <motion.div
                          key={title}
                          variants={fadeUp}
                          className="rounded-2xl border border-border bg-surface p-6 hover:border-primary/25 hover:shadow-glow-primary transition-all duration-300"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                            <Icon size={22} className="text-primary-light" />
                          </div>
                          <h3 className="font-bold text-heading font-satoshi">{title}</h3>
                          <p className="text-sm text-muted mt-2 leading-relaxed">{desc}</p>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Employee quote */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
                      <IconSparkles size={24} className="text-primary-light mb-4" />
                      <blockquote className="text-lg font-semibold text-heading leading-relaxed">
                        "Working at Google means working on problems that matter to billions of people. There's no better place to do the most impactful work of your career."
                      </blockquote>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                          <IconUsers size={16} className="text-primary-light" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-heading">Sarah Chen</p>
                          <p className="text-xs text-muted">Staff Software Engineer · Google Cloud</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: Sidebar ── */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-24"
            >
              {/* Apply CTA */}
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 text-center">
                <p className="text-xs font-semibold text-primary-light uppercase tracking-wider mb-1">{COMPANY.openRoles} Open Positions</p>
                <h3 className="text-lg font-extrabold text-heading font-satoshi mb-1">Ready to join?</h3>
                <p className="text-xs text-muted mb-4">Apply now and take the first step toward your dream career at {COMPANY.name}.</p>
                <button
                  onClick={() => setTab("Open Roles")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-bg-signature py-3 text-sm font-semibold text-white shadow-button hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all cursor-pointer"
                >
                  <IconSparkles size={15} /> View All Roles
                </button>
              </div>

              {/* Company Details */}
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-3.5">
                <h3 className="text-sm font-bold text-heading">Company Details</h3>
                {[
                  { label: "Industry", value: COMPANY.industry, icon: IconBuildingSkyscraper },
                  { label: "Founded", value: COMPANY.founded, icon: IconRocket },
                  { label: "Employees", value: COMPANY.employees, icon: IconUsers },
                  { label: "Revenue", value: COMPANY.revenue, icon: IconTrendingUp },
                  { label: "HQ", value: COMPANY.headquarters, icon: IconMapPin },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                      <Icon size={14} className="text-muted" />
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                      <span className="text-xs text-muted">{label}</span>
                      <span className="text-xs font-semibold text-heading text-right truncate">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rating Card */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-bold text-heading mb-3">Employee Rating</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-extrabold text-heading font-satoshi">{COMPANY.rating}</span>
                  <div>
                    <StarRating rating={COMPANY.rating} />
                    <p className="text-xs text-muted mt-1">{COMPANY.reviews.toLocaleString()} reviews</p>
                  </div>
                </div>
                {[
                  { label: "Work-Life Balance", pct: 82 },
                  { label: "Compensation", pct: 90 },
                  { label: "Culture", pct: 88 },
                  { label: "Growth", pct: 85 },
                ].map(({ label, pct }) => (
                  <div key={label} className="mb-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{label}</span>
                      <span className="font-semibold text-heading">{(pct / 20).toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-elevated overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-violet"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Similar Companies */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-bold text-heading mb-3">Similar Companies</h3>
                <div className="space-y-3">
                  {SIMILAR_COMPANIES.map(({ name, logo, industry, roles }) => (
                    <Link
                      key={name}
                      to="/company"
                      className="group flex items-center gap-3 rounded-xl p-2 -mx-2 hover:bg-surface-elevated transition-colors"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
                        <img src={logo} alt={name} className="h-full w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-heading group-hover:text-primary-light transition-colors">{name}</p>
                        <p className="text-xs text-muted truncate">{industry}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary-light shrink-0">{roles} roles</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>

          </div>
        </div>

      </div>
    </div>
  );
}
