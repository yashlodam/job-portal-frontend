import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ArrowRight,
  Bookmark,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  BookmarkCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

/* ================================================================
   MOCK DATA — 18 diverse jobs
   ================================================================ */
const JOBS = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    company: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    location: "San Francisco, CA",
    mode: "Remote",
    type: "Full Time",
    experience: "Senior",
    salary: 185000,
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    posted: "2 hours ago",
    postedDays: 0,
    featured: true,
    description:
      "Build the future of web development with our frontend infrastructure team.",
  },
  {
    id: "j2",
    title: "Machine Learning Engineer",
    company: "OpenAI",
    logo: "https://logo.clearbit.com/openai.com",
    location: "San Francisco, CA",
    mode: "Hybrid",
    type: "Full Time",
    experience: "Senior",
    salary: 250000,
    tags: ["Python", "PyTorch", "LLMs", "CUDA"],
    posted: "5 hours ago",
    postedDays: 0,
    featured: true,
    description:
      "Research and deploy state-of-the-art language models at massive scale.",
  },
  {
    id: "j3",
    title: "Product Designer",
    company: "Figma",
    logo: "https://logo.clearbit.com/figma.com",
    location: "New York, NY",
    mode: "Hybrid",
    type: "Full Time",
    experience: "Mid",
    salary: 145000,
    tags: ["UI/UX", "Figma", "Prototyping", "Design Systems"],
    posted: "1 day ago",
    postedDays: 1,
    featured: false,
    description:
      "Design tools that millions of designers use every day to bring ideas to life.",
  },
  {
    id: "j4",
    title: "Backend Developer",
    company: "Stripe",
    logo: "https://logo.clearbit.com/stripe.com",
    location: "Seattle, WA",
    mode: "Remote",
    type: "Full Time",
    experience: "Mid",
    salary: 170000,
    tags: ["Ruby", "Go", "PostgreSQL", "APIs"],
    posted: "1 day ago",
    postedDays: 1,
    featured: false,
    description:
      "Build reliable, scalable payment infrastructure that powers the internet economy.",
  },
  {
    id: "j5",
    title: "DevOps Engineer",
    company: "Datadog",
    logo: "https://logo.clearbit.com/datadoghq.com",
    location: "Boston, MA",
    mode: "On Site",
    type: "Full Time",
    experience: "Senior",
    salary: 165000,
    tags: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    posted: "2 days ago",
    postedDays: 2,
    featured: false,
    description:
      "Scale monitoring infrastructure serving millions of data points per second.",
  },
  {
    id: "j6",
    title: "iOS Developer",
    company: "Spotify",
    logo: "https://logo.clearbit.com/spotify.com",
    location: "Stockholm, Sweden",
    mode: "Hybrid",
    type: "Full Time",
    experience: "Mid",
    salary: 130000,
    tags: ["Swift", "SwiftUI", "iOS", "Objective-C"],
    posted: "2 days ago",
    postedDays: 2,
    featured: false,
    description:
      "Craft beautiful mobile experiences for 500M+ music lovers worldwide.",
  },
  {
    id: "j7",
    title: "Data Analyst Intern",
    company: "Airbnb",
    logo: "https://logo.clearbit.com/airbnb.com",
    location: "San Francisco, CA",
    mode: "On Site",
    type: "Internship",
    experience: "Entry",
    salary: 45000,
    tags: ["SQL", "Python", "Tableau", "Statistics"],
    posted: "3 days ago",
    postedDays: 3,
    featured: false,
    description:
      "Analyze travel and booking patterns to help hosts and guests connect.",
  },
  {
    id: "j8",
    title: "Freelance UI Designer",
    company: "Toptal",
    logo: "https://logo.clearbit.com/toptal.com",
    location: "Anywhere",
    mode: "Remote",
    type: "Freelance",
    experience: "Mid",
    salary: 95000,
    tags: ["Figma", "UI Design", "Branding", "Mobile"],
    posted: "3 days ago",
    postedDays: 3,
    featured: false,
    description:
      "Work with world-class clients on premium design projects across industries.",
  },
  {
    id: "j9",
    title: "Full Stack Developer",
    company: "Notion",
    logo: "https://logo.clearbit.com/notion.so",
    location: "New York, NY",
    mode: "Hybrid",
    type: "Full Time",
    experience: "Senior",
    salary: 195000,
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    posted: "4 days ago",
    postedDays: 4,
    featured: true,
    description:
      "Help build the everything-app that redefines how teams collaborate and create.",
  },
  {
    id: "j10",
    title: "Cybersecurity Analyst",
    company: "CrowdStrike",
    logo: "https://logo.clearbit.com/crowdstrike.com",
    location: "Austin, TX",
    mode: "Remote",
    type: "Full Time",
    experience: "Mid",
    salary: 140000,
    tags: ["SIEM", "Threat Intel", "Incident Response", "Cloud Security"],
    posted: "4 days ago",
    postedDays: 4,
    featured: false,
    description:
      "Protect organizations from the most advanced cyber threats on the planet.",
  },
  {
    id: "j11",
    title: "Part-Time Content Writer",
    company: "HubSpot",
    logo: "https://logo.clearbit.com/hubspot.com",
    location: "Remote",
    mode: "Remote",
    type: "Part Time",
    experience: "Entry",
    salary: 35000,
    tags: ["SEO", "Copywriting", "Marketing", "CMS"],
    posted: "5 days ago",
    postedDays: 5,
    featured: false,
    description:
      "Create compelling marketing content that educates and inspires millions.",
  },
  {
    id: "j12",
    title: "Blockchain Developer",
    company: "Coinbase",
    logo: "https://logo.clearbit.com/coinbase.com",
    location: "San Francisco, CA",
    mode: "Remote",
    type: "Contract",
    experience: "Senior",
    salary: 200000,
    tags: ["Solidity", "Ethereum", "Web3", "Smart Contracts"],
    posted: "5 days ago",
    postedDays: 5,
    featured: false,
    description:
      "Build the decentralized financial infrastructure for the open internet.",
  },
  {
    id: "j13",
    title: "QA Engineer",
    company: "Slack",
    logo: "https://logo.clearbit.com/slack.com",
    location: "Denver, CO",
    mode: "On Site",
    type: "Full Time",
    experience: "Mid",
    salary: 120000,
    tags: ["Selenium", "Cypress", "Jest", "Automation"],
    posted: "6 days ago",
    postedDays: 6,
    featured: false,
    description:
      "Ensure the quality and reliability of the communication platform millions depend on.",
  },
  {
    id: "j14",
    title: "Cloud Solutions Architect",
    company: "AWS",
    logo: "https://logo.clearbit.com/amazon.com",
    location: "Arlington, VA",
    mode: "Hybrid",
    type: "Full Time",
    experience: "Lead",
    salary: 220000,
    tags: ["AWS", "Serverless", "Microservices", "IaC"],
    posted: "1 week ago",
    postedDays: 7,
    featured: false,
    description:
      "Design and architect cloud-native solutions for the world's largest enterprises.",
  },
  {
    id: "j15",
    title: "React Native Developer",
    company: "Discord",
    logo: "https://logo.clearbit.com/discord.com",
    location: "San Francisco, CA",
    mode: "Remote",
    type: "Full Time",
    experience: "Mid",
    salary: 155000,
    tags: ["React Native", "TypeScript", "Mobile", "Redux"],
    posted: "1 week ago",
    postedDays: 7,
    featured: false,
    description:
      "Build the mobile experience for the world's largest gaming community platform.",
  },
  {
    id: "j16",
    title: "Junior Software Engineer",
    company: "Shopify",
    logo: "https://logo.clearbit.com/shopify.com",
    location: "Toronto, Canada",
    mode: "Remote",
    type: "Full Time",
    experience: "Entry",
    salary: 85000,
    tags: ["Ruby on Rails", "React", "GraphQL", "MySQL"],
    posted: "1 week ago",
    postedDays: 7,
    featured: false,
    description:
      "Help millions of entrepreneurs build their businesses with commerce tools.",
  },
  {
    id: "j17",
    title: "Engineering Manager",
    company: "Linear",
    logo: "https://logo.clearbit.com/linear.app",
    location: "San Francisco, CA",
    mode: "Remote",
    type: "Full Time",
    experience: "Lead",
    salary: 240000,
    tags: ["Leadership", "Agile", "TypeScript", "System Design"],
    posted: "2 weeks ago",
    postedDays: 14,
    featured: true,
    description:
      "Lead a world-class engineering team building the best project management tool.",
  },
  {
    id: "j18",
    title: "UX Research Intern",
    company: "Google",
    logo: "https://logo.clearbit.com/google.com",
    location: "Mountain View, CA",
    mode: "On Site",
    type: "Internship",
    experience: "Entry",
    salary: 55000,
    tags: ["User Research", "Surveys", "A/B Testing", "Analytics"],
    posted: "2 weeks ago",
    postedDays: 14,
    featured: false,
    description:
      "Conduct research that shapes the experience of billions of users worldwide.",
  },
];

/* ================================================================
   FILTER OPTIONS
   ================================================================ */
const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship", "Freelance"];
const WORK_MODES = ["Remote", "Hybrid", "On Site"];
const EXPERIENCE_LEVELS = ["Entry", "Mid", "Senior", "Lead"];
const SALARY_RANGES = [
  { label: "$0 – 50K", min: 0, max: 50000 },
  { label: "$50K – 100K", min: 50000, max: 100000 },
  { label: "$100K – 150K", min: 100000, max: 150000 },
  { label: "$150K+", min: 150000, max: Infinity },
];
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "salary-desc", label: "Salary: High to Low" },
  { value: "salary-asc", label: "Salary: Low to High" },
];
const ITEMS_PER_PAGE = 6;

/* ================================================================
   HELPERS
   ================================================================ */
const formatSalary = (n) =>
  n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;

const modeColor = {
  Remote: "text-accent bg-accent/10 border-accent/20",
  Hybrid: "text-violet-light bg-violet/10 border-violet/20",
  "On Site": "text-accent-warm bg-accent-warm/10 border-accent-warm/20",
};

/* ================================================================
   FRAMER VARIANTS
   ================================================================ */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.2 } },
};

const sidebarVariants = {
  hidden: { x: "-100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { x: "-100%", opacity: 0, transition: { duration: 0.25 } },
};

/* ================================================================
   COMPONENT: FilterSection
   ================================================================ */
function FilterSection({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-heading/80 font-satoshi">
        {title}
      </h4>
      {children}
    </div>
  );
}

/* ================================================================
   COMPONENT: Checkbox
   ================================================================ */
function CheckboxItem({ label, checked, onChange, count }) {
  const id = `filter-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label
      htmlFor={id}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-surface-elevated"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 ${
          checked
            ? "border-primary bg-primary shadow-button"
            : "border-border-hover bg-transparent group-hover:border-muted"
        }`}
        aria-hidden="true"
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-3 w-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </span>
      <span className="flex-1 text-sm text-body group-hover:text-heading transition-colors">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-muted tabular-nums">{count}</span>
      )}
    </label>
  );
}

/* ================================================================
   COMPONENT: FilterSidebar (shared between desktop & mobile)
   ================================================================ */
function FilterSidebarContent({
  filters,
  onToggleFilter,
  onSetSalary,
  onClearAll,
  jobCounts,
}) {
  return (
    <div className="space-y-1">
      {/* Clear all */}
      {(filters.types.length > 0 ||
        filters.modes.length > 0 ||
        filters.experience.length > 0 ||
        filters.salary !== null) && (
        <button
          onClick={onClearAll}
          className="mb-4 flex items-center gap-2 text-xs font-semibold text-primary-light hover:text-primary transition-colors"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}

      {/* Job Type */}
      <FilterSection title="Job Type">
        {JOB_TYPES.map((t) => (
          <CheckboxItem
            key={t}
            label={t}
            checked={filters.types.includes(t)}
            onChange={() => onToggleFilter("types", t)}
            count={jobCounts.types[t] || 0}
          />
        ))}
      </FilterSection>

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        {WORK_MODES.map((m) => (
          <CheckboxItem
            key={m}
            label={m}
            checked={filters.modes.includes(m)}
            onChange={() => onToggleFilter("modes", m)}
            count={jobCounts.modes[m] || 0}
          />
        ))}
      </FilterSection>

      {/* Experience Level */}
      <FilterSection title="Experience Level">
        {EXPERIENCE_LEVELS.map((e) => (
          <CheckboxItem
            key={e}
            label={e}
            checked={filters.experience.includes(e)}
            onChange={() => onToggleFilter("experience", e)}
            count={jobCounts.experience[e] || 0}
          />
        ))}
      </FilterSection>

      {/* Salary Range */}
      <FilterSection title="Salary Range">
        <div className="grid grid-cols-2 gap-2">
          {SALARY_RANGES.map((r) => {
            const active =
              filters.salary?.min === r.min && filters.salary?.max === r.max;
            return (
              <button
                key={r.label}
                onClick={() => onSetSalary(active ? null : r)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "border-primary/40 bg-primary/15 text-primary-light shadow-button"
                    : "border-border bg-surface-elevated/50 text-body hover:border-primary/20 hover:text-heading"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
}

/* ================================================================
   COMPONENT: JobCard
   ================================================================ */
function JobCard({ job, view, index }) {
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isList = view === "list";

  return (
    <motion.div variants={cardVariants} layout>
      <Link
        to={`/jobs/${job.id}`}
        className={`group relative flex rounded-[20px] border border-border bg-surface backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary hover:bg-surface-elevated/60 ${
          isList ? "flex-row items-center gap-5 p-5 sm:p-6" : "flex-col p-5 sm:p-6"
        } ${job.featured ? "border-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.06)]" : ""}`}
      >
        {/* Featured badge */}
        {job.featured && (
          <div className="absolute -top-px left-6 flex items-center gap-1.5 rounded-b-md bg-gradient-to-r from-primary to-violet px-3 py-1">
            <Sparkles size={11} className="text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Featured
            </span>
          </div>
        )}

        {/* Company Logo */}
        <div
          className={`flex items-center justify-center rounded-xl border border-border bg-surface-elevated ${
            isList ? "h-14 w-14 shrink-0" : "mb-4 h-14 w-14 mt-1"
          }`}
        >
          {logoError ? (
            <span className="text-lg font-bold text-primary" aria-hidden="true">
              {job.company[0]}
            </span>
          ) : (
            <img
              src={job.logo}
              alt={job.company}
              className="h-8 w-8 rounded object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 ${isList ? "" : ""}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-satoshi text-lg font-bold text-heading group-hover:text-primary-light transition-colors truncate">
                {job.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-body">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={13} className="text-muted" />
                  {job.company}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-muted" />
                  {job.location}
                </span>
              </div>
            </div>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSaved(!saved);
              }}
              className={`shrink-0 rounded-xl p-2 transition-all duration-200 ${
                saved
                  ? "bg-primary/15 text-primary-light"
                  : "text-muted hover:bg-surface-elevated hover:text-heading"
              }`}
              aria-label={saved ? "Unsave job" : "Save job"}
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>

          {/* Description (list only) */}
          {isList && (
            <p className="mt-2 text-sm text-muted line-clamp-1 max-w-xl">
              {job.description}
            </p>
          )}

          {/* Meta row */}
          <div
            className={`flex flex-wrap items-center gap-2 ${
              isList ? "mt-3" : "mt-4"
            }`}
          >
            {/* Mode badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                modeColor[job.mode] || "text-body bg-surface-elevated border-border"
              }`}
            >
              {job.mode}
            </span>
            {/* Type badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-light">
              <Briefcase size={11} />
              {job.type}
            </span>
            {/* Experience */}
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-body">
              <TrendingUp size={11} />
              {job.experience}
            </span>
          </div>

          {/* Tags */}
          <div
            className={`flex flex-wrap gap-1.5 ${isList ? "mt-3" : "mt-3"}`}
          >
            {job.tags.slice(0, isList ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/[0.08] px-2.5 py-0.5 text-xs font-medium text-primary-light/80"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > (isList ? 4 : 3) && (
              <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-muted">
                +{job.tags.length - (isList ? 4 : 3)}
              </span>
            )}
          </div>

          {/* Bottom row */}
          <div
            className={`flex items-center justify-between ${
              isList ? "mt-3" : "mt-5 border-t border-border pt-4"
            }`}
          >
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
                <DollarSign size={14} className="text-accent" />
                {formatSalary(job.salary)}
                <span className="text-xs font-normal text-muted">/yr</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted">
                <Clock size={13} />
                {job.posted}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-light opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
              Apply
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */
export default function FindJobs() {
  /* ---------- state ---------- */
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filters, setFilters] = useState({
    types: [],
    modes: [],
    experience: [],
    salary: null,
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  /* ---------- filter helpers ---------- */
  const toggleFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
    setPage(1);
  }, []);

  const setSalary = useCallback((range) => {
    setFilters((prev) => ({ ...prev, salary: range }));
    setPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ types: [], modes: [], experience: [], salary: null });
    setSearchTitle("");
    setSearchLocation("");
    setPage(1);
  }, []);

  const removeActiveFilter = useCallback(
    (kind, value) => {
      if (kind === "salary") {
        setSalary(null);
      } else if (kind === "search") {
        setSearchTitle("");
      } else if (kind === "location") {
        setSearchLocation("");
      } else {
        toggleFilter(kind, value);
      }
    },
    [setSalary, toggleFilter]
  );

  /* ---------- derive filtered / sorted jobs ---------- */
  const filteredJobs = useMemo(() => {
    let result = [...JOBS];

    // Search
    const q = searchTitle.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const loc = searchLocation.toLowerCase().trim();
    if (loc) {
      result = result.filter((j) => j.location.toLowerCase().includes(loc));
    }

    // Filters
    if (filters.types.length)
      result = result.filter((j) => filters.types.includes(j.type));
    if (filters.modes.length)
      result = result.filter((j) => filters.modes.includes(j.mode));
    if (filters.experience.length)
      result = result.filter((j) => filters.experience.includes(j.experience));
    if (filters.salary)
      result = result.filter(
        (j) => j.salary >= filters.salary.min && j.salary <= filters.salary.max
      );

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => a.postedDays - b.postedDays);
        break;
      case "salary-desc":
        result.sort((a, b) => b.salary - a.salary);
        break;
      case "salary-asc":
        result.sort((a, b) => a.salary - b.salary);
        break;
      default:
        // relevance — featured first, then newest
        result.sort(
          (a, b) =>
            (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
            a.postedDays - b.postedDays
        );
    }

    return result;
  }, [searchTitle, searchLocation, filters, sortBy]);

  /* ---------- compute filter counts (based on current search only, not other filters) ---------- */
  const jobCounts = useMemo(() => {
    // We compute counts based on the base search so users see how many total
    let base = [...JOBS];
    const q = searchTitle.toLowerCase().trim();
    if (q)
      base = base.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    const loc = searchLocation.toLowerCase().trim();
    if (loc) base = base.filter((j) => j.location.toLowerCase().includes(loc));

    const counts = { types: {}, modes: {}, experience: {} };
    base.forEach((j) => {
      counts.types[j.type] = (counts.types[j.type] || 0) + 1;
      counts.modes[j.mode] = (counts.modes[j.mode] || 0) + 1;
      counts.experience[j.experience] =
        (counts.experience[j.experience] || 0) + 1;
    });
    return counts;
  }, [searchTitle, searchLocation]);

  /* ---------- pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page when it exceeds total
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  /* ---------- active filter pills ---------- */
  const activePills = useMemo(() => {
    const pills = [];
    if (searchTitle.trim())
      pills.push({ kind: "search", label: `"${searchTitle.trim()}"` });
    if (searchLocation.trim())
      pills.push({ kind: "location", label: searchLocation.trim() });
    filters.types.forEach((v) => pills.push({ kind: "types", label: v, value: v }));
    filters.modes.forEach((v) => pills.push({ kind: "modes", label: v, value: v }));
    filters.experience.forEach((v) =>
      pills.push({ kind: "experience", label: v, value: v })
    );
    if (filters.salary)
      pills.push({ kind: "salary", label: filters.salary.label });
    return pills;
  }, [searchTitle, searchLocation, filters]);

  /* ---------- page numbers to display ---------- */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  /* ---------- search submit ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* ========== DECORATIVE GLOWS ========== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[180px]" />
        <div className="absolute top-60 right-[10%] h-[400px] w-[400px] rounded-full bg-violet/[0.05] blur-[160px]" />
        <div className="absolute bottom-40 left-[10%] h-[350px] w-[350px] rounded-full bg-accent/[0.04] blur-[140px]" />
      </div>

      {/* ========== SEARCH STRIP ========== */}
      <section className="relative border-b border-border bg-surface/50 backdrop-blur-md">
        <div className="section-container py-8 sm:py-10">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center"
          >
            <h1 className="font-satoshi text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading leading-tight">
              Find Your <span className="gradient-text">Dream Job</span>
            </h1>
            <p className="mt-3 text-body text-base md:text-lg">
              Discover {JOBS.length.toLocaleString()}+ opportunities from
              world-class companies
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row"
          >
            {/* Title input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                  setPage(1);
                }}
                placeholder="Job title, keyword, or company"
                aria-label="Search by job title, keyword, or company"
                className="w-full rounded-xl border border-border bg-surface-elevated py-3.5 pl-11 pr-4 text-sm text-heading placeholder:text-muted outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-surface-elevated"
              />
            </div>

            {/* Location input */}
            <div className="relative sm:w-64">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => {
                  setSearchLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="City, state, or remote"
                aria-label="Search by city, state, or remote"
                className="w-full rounded-xl border border-border bg-surface-elevated py-3.5 pl-11 pr-4 text-sm text-heading placeholder:text-muted outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-surface-elevated"
              />
            </div>

            {/* Search button */}
            <button
              type="submit"
              aria-label="Search jobs"
              className="gradient-bg-signature flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-button transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search size={16} />
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative section-container py-6 sm:py-8">
        {/* Active Filters Row */}
        <AnimatePresence>
          {activePills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  Active:
                </span>
                {activePills.map((pill, i) => (
                  <motion.button
                    key={`${pill.kind}-${pill.label}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() =>
                      removeActiveFilter(pill.kind, pill.value || pill.label)
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light transition-all hover:border-primary/40 hover:bg-primary/20"
                  >
                    {pill.label}
                    <X size={12} />
                  </motion.button>
                ))}
                <button
                  onClick={clearAll}
                  className="ml-2 text-xs font-medium text-muted hover:text-heading transition-colors"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilters(true)}
              aria-label="Open filters"
              className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-body transition-all hover:border-primary/30 hover:text-heading"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activePills.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {activePills.length}
                </span>
              )}
            </button>

            <p className="text-sm text-body">
              Showing{" "}
              <span className="font-semibold text-heading">
                {filteredJobs.length}
              </span>{" "}
              {filteredJobs.length === 1 ? "job" : "jobs"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort jobs by"
                className="appearance-none rounded-xl border border-border bg-surface-elevated px-4 py-2.5 pr-9 text-sm text-heading outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 hover:border-border-hover cursor-pointer" style={{ colorScheme: 'dark' }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronRight
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted"
              />
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-border bg-surface-elevated p-1">
              <button
                onClick={() => setView("grid")}
                className={`rounded-xl p-2 transition-all duration-200 ${
                  view === "grid"
                    ? "bg-primary/15 text-primary-light shadow-sm"
                    : "text-muted hover:text-heading"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-xl p-2 transition-all duration-200 ${
                  view === "list"
                    ? "bg-primary/15 text-primary-light shadow-sm"
                    : "text-muted hover:text-heading"
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* ===== LEFT: Desktop Filter Sidebar ===== */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-[96px] rounded-[20px] border border-border bg-surface backdrop-blur-lg p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary-light" />
                <h3 className="font-satoshi text-base font-bold text-heading">
                  Filters
                </h3>
              </div>
              <FilterSidebarContent
                filters={filters}
                onToggleFilter={toggleFilter}
                onSetSalary={setSalary}
                onClearAll={clearAll}
                jobCounts={jobCounts}
              />
            </div>
          </aside>

          {/* ===== RIGHT: Job Cards ===== */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {paginatedJobs.length > 0 ? (
                <motion.div
                  key={`${page}-${sortBy}-${view}-${filters.types.join(',')}-${filters.modes.join(',')}-${filters.experience.join(',')}-${filters.salary?.label ?? ''}-${searchTitle}-${searchLocation}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className={
                    view === "grid"
                      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-2"
                      : "flex flex-col gap-4"
                  }
                >
                  {paginatedJobs.map((job, i) => (
                    <JobCard key={job.id} job={job} view={view} index={i} />
                  ))}
                </motion.div>
              ) : (
                /* Empty State */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center rounded-[20px] border border-border bg-surface px-6 py-20 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Search size={32} className="text-primary-light" />
                  </div>
                  <h3 className="font-satoshi text-xl font-bold text-heading">
                    No jobs found
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    We couldn't find any jobs matching your current filters. Try
                    adjusting your search or removing some filters.
                  </p>
                  <button
                    onClick={clearAll}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/15 px-6 py-2.5 text-sm font-semibold text-primary-light transition-all hover:bg-primary/25"
                  >
                    <X size={14} />
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-1.5"
              >
                {/* Previous */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-body transition-all hover:border-primary/30 hover:text-heading disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-body"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`dots-${i}`}
                        className="px-2 text-sm text-muted"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                          page === p
                            ? "gradient-bg-signature text-white shadow-button"
                            : "border border-border bg-surface-elevated text-body hover:border-primary/30 hover:text-heading"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-body transition-all hover:border-primary/30 hover:text-heading disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-body"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Page info */}
            {totalPages > 1 && (
              <p className="mt-3 text-center text-xs text-muted">
                Page {page} of {totalPages} · Showing{" "}
                {(page - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(page * ITEMS_PER_PAGE, filteredJobs.length)} of{" "}
                {filteredJobs.length} jobs
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========== MOBILE FILTER OVERLAY ========== */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Panel */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] overflow-y-auto border-r border-border bg-surface/95 backdrop-blur-xl p-6 lg:hidden"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={18}
                    className="text-primary-light"
                  />
                  <h3 className="font-satoshi text-lg font-bold text-heading">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilters(false)}
                  aria-label="Close filters"
                  className="rounded-xl p-2 text-muted transition-colors hover:bg-surface-elevated hover:text-heading"
                >
                  <X size={20} />
                </button>
              </div>

              <FilterSidebarContent
                filters={filters}
                onToggleFilter={toggleFilter}
                onSetSalary={setSalary}
                onClearAll={clearAll}
                jobCounts={jobCounts}
              />

              {/* Apply button */}
              <button
                onClick={() => setMobileFilters(false)}
                className="gradient-bg-signature mt-6 w-full rounded-xl py-3 text-sm font-bold text-white shadow-button transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]"
              >
                Show {filteredJobs.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
