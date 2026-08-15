import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  IndianRupee,
  Building2,
  BookmarkCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../State/Store";
import {
  getAllJobs,
  searchJobs,
  filterJobs,
} from "../State/JobSlice";
import { saveJobThunk, unsaveJobThunk } from "../State/savedJobThunk";
import { useToast } from "../components/ui/ToastNotification";
import RecommendedJobsSection from "../components/recommendation/RecommendedJobsSection";

/* ================================================================
   CONSTANTS
   ================================================================ */
const JOB_TYPES = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Freelance", value: "FREELANCE" },
];
const WORK_MODES = [
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "On Site", value: "ON_SITE" },
];
const EXPERIENCE_LEVELS = [
  { label: "Entry", value: "ENTRY_LEVEL" },
  { label: "Mid", value: "MID_LEVEL" },
  { label: "Senior", value: "SENIOR_LEVEL" },
  { label: "Lead", value: "LEAD" },
];
const SALARY_RANGES = [
  { label: "₹0 – 5L", min: 0, max: 500000 },
  { label: "₹5L – 10L", min: 500000, max: 1000000 },
  { label: "₹10L – 20L", min: 1000000, max: 2000000 },
  { label: "₹20L+", min: 2000000, max: Infinity },
];
const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Newest" },
  { value: "minimumSalary,desc", label: "Salary: High to Low" },
  { value: "minimumSalary,asc", label: "Salary: Low to High" },
  { value: "jobTitle,asc", label: "Title: A-Z" },
];
const PAGE_SIZE = 10;

/* ================================================================
   HELPERS
   ================================================================ */

/** Format a salary number into compact INR notation */
const formatSalary = (n) => {
  if (!n && n !== 0) return null;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${n}`;
};

/** Convert SNAKE_CASE enum to readable Title Case */
const humanise = (str) =>
  str
    ? str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

/** Compute "posted X ago" from an ISO / LocalDateTime string */
const timeAgo = (postedAt) => {
  if (!postedAt) return "";
  const posted = new Date(postedAt);
  const diff = Date.now() - posted.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

/** First two initials of a company name */
const initials = (name) =>
  name
    ? name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("")
    : "?";

const modeColor = {
  REMOTE: "text-accent bg-accent/10 border-accent/20",
  HYBRID: "text-violet-light bg-violet/10 border-violet/20",
  ON_SITE: "text-accent-warm bg-accent-warm/10 border-accent-warm/20",
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
   COMPONENT: CheckboxItem
   ================================================================ */
function CheckboxItem({ label, checked, onChange, count }) {
  const id = `filter-${label.replace(/\s+/g, "-").toLowerCase()}`;
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
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 ${checked
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
   COMPONENT: FilterSidebarContent
   ================================================================ */
function FilterSidebarContent({ filters, onToggleFilter, onSetSalary, onClearAll }) {
  const hasActive =
    filters.types.length > 0 ||
    filters.modes.length > 0 ||
    filters.experience.length > 0 ||
    filters.salary !== null;



  return (
    <div className="space-y-1">
      {hasActive && (
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
            key={t.value}
            label={t.label}
            checked={filters.types.includes(t.value)}
            onChange={() => onToggleFilter("types", t.value)}
          />
        ))}
      </FilterSection>

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        {WORK_MODES.map((m) => (
          <CheckboxItem
            key={m.value}
            label={m.label}
            checked={filters.modes.includes(m.value)}
            onChange={() => onToggleFilter("modes", m.value)}
          />
        ))}
      </FilterSection>

      {/* Experience Level */}
      <FilterSection title="Experience Level">
        {EXPERIENCE_LEVELS.map((e) => (
          <CheckboxItem
            key={e.value}
            label={e.label}
            checked={filters.experience.includes(e.value)}
            onChange={() => onToggleFilter("experience", e.value)}
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
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${active
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
function JobCard({ job, view }) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { savedJobIds } = useAppSelector((state) => state.savedJob);
  const [logoError, setLogoError] = useState(false);

  const isSaved = savedJobIds.includes(Number(job.id));
  const isList = view === "list";

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!job.id) return;
    if (isSaved) {
      dispatch(unsaveJobThunk(Number(job.id)));
      toast.info("Job removed from saved bookmarks.");
    } else {
      dispatch(saveJobThunk(Number(job.id)));
      toast.success("Job bookmarked successfully!");
    }
  };

  const location = [job.city, job.state, job.country]
    .filter(Boolean)
    .join(", ");

  const salaryText = useMemo(() => {
    const min = formatSalary(job.minimumSalary);
    const max = formatSalary(job.maximumSalary);
    if (min && max) return `${min} – ${max}`;
    if (min) return min;
    if (max) return max;
    return null;
  }, [job.minimumSalary, job.maximumSalary]);

  const skills = Array.isArray(job.skillsRequired) ? job.skillsRequired : [];
  const visibleSkills = skills.slice(0, isList ? 4 : 3);
  const extraSkills = skills.length - visibleSkills.length;

  return (
    <motion.div variants={cardVariants} layout>
      <Link
        to={`/jobs/${job.id}`}
        className={`group relative flex rounded-[20px] border border-border bg-surface backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary hover:bg-surface-elevated/60 ${isList ? "flex-row items-center gap-5 p-5 sm:p-6" : "flex-col p-5 sm:p-6"
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
          className={`flex items-center justify-center rounded-xl border border-border bg-surface-elevated ${isList ? "h-14 w-14 shrink-0" : "mb-4 h-14 w-14 mt-1"
            }`}
        >
          {job.companyLogo && !logoError ? (
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="h-8 w-8 rounded object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-base font-bold text-primary" aria-hidden="true">
              {initials(job.companyName)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-satoshi text-lg font-bold text-heading group-hover:text-primary-light transition-colors truncate">
                {job.jobTitle}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-body">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={13} className="text-muted" />
                  {job.companyName}
                </span>
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-muted" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={handleToggleSave}
              className={`shrink-0 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                isSaved
                  ? "bg-primary/15 text-primary-light border border-primary/30"
                  : "text-muted hover:bg-surface-elevated hover:text-heading"
              }`}
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>

          {/* Meta row */}
          <div className={`flex flex-wrap items-center gap-2 ${isList ? "mt-3" : "mt-4"}`}>
            {/* Work Mode badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${modeColor[job.workingMode] ?? "text-body bg-surface-elevated border-border"
                }`}
            >
              {humanise(job.workingMode)}
            </span>

            {/* Job Type badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-light">
              <Briefcase size={11} />
              {humanise(job.jobType)}
            </span>

            {/* Experience Level */}
            {job.experienceLevel && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-body">
                <TrendingUp size={11} />
                {humanise(job.experienceLevel)}
              </span>
            )}

            {/* Vacancies */}
            {job.vacancies > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-body">
                {job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}
              </span>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className={`flex flex-wrap gap-1.5 ${isList ? "mt-3" : "mt-3"}`}>
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary/[0.08] px-2.5 py-0.5 text-xs font-medium text-primary-light/80"
                >
                  {skill}
                </span>
              ))}
              {extraSkills > 0 && (
                <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs font-medium text-muted">
                  +{extraSkills}
                </span>
              )}
            </div>
          )}

          {/* Bottom row */}
          <div
            className={`flex items-center justify-between ${isList ? "mt-3" : "mt-5 border-t border-border pt-4"
              }`}
          >
            <div className="flex items-center gap-4 text-sm">
              {salaryText && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
                  <IndianRupee size={14} className="text-accent" />
                  {salaryText}
                  <span className="text-xs font-normal text-muted">/yr</span>
                </span>
              )}
              {job.postedAt && (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Clock size={13} />
                  {timeAgo(job.postedAt)}
                </span>
              )}
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
   SKELETON CARD
   ================================================================ */
function JobCardSkeleton({ view }) {
  const isList = view === "list";
  return (
    <div
      className={`animate-pulse rounded-[20px] border border-border bg-surface ${isList ? "flex flex-row items-center gap-5 p-5 sm:p-6" : "flex flex-col p-5 sm:p-6"
        }`}
    >
      <div className={`shrink-0 rounded-xl bg-surface-elevated ${isList ? "h-14 w-14" : "mb-4 h-14 w-14"}`} />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-2/3 rounded-lg bg-surface-elevated" />
        <div className="h-4 w-1/2 rounded-lg bg-surface-elevated" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-surface-elevated" />
          <div className="h-6 w-20 rounded-full bg-surface-elevated" />
          <div className="h-6 w-14 rounded-full bg-surface-elevated" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-12 rounded-full bg-surface-elevated" />
          <div className="h-5 w-16 rounded-full bg-surface-elevated" />
          <div className="h-5 w-10 rounded-full bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */
export default function FindJobs() {
  /* ── URL params from Home / Hero search ── */
  const [searchParams] = useSearchParams();
  const urlKeyword = searchParams.get("keyword") ?? "";
  const urlCategory = searchParams.get("category") ?? "";
  const urlMode = searchParams.get("mode") ?? "";
  const urlCity = searchParams.get("city") ?? "";

  /* ── Search input state ── */
  const [searchTitle, setSearchTitle] = useState(urlKeyword);
  const [searchLocation, setSearchLocation] = useState(urlCity);

  /* ── Filter state (sent to backend) ── */
  const [filters, setFilters] = useState({
    types: [],
    modes: urlMode ? [urlMode] : [],
    experience: [],
    salary: null,
  });

  /* ── UI-only state ── */
  const [feedMode, setFeedMode] = useState("all"); // 'all' | 'recommended'
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0].value);
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(0); // 0-indexed (Spring Boot)
  const [mobileFilters, setMobileFilters] = useState(false);

  const dispatch = useAppDispatch();

  /* ── Redux state ── */
  const { jobs, pagination, loading } = useAppSelector((s) => s.job);

  const totalPages = pagination.totalPages ?? 0;
  const totalElements = pagination.totalElements ?? 0;

  /* ── Debounce ref for search inputs ── */
  const debounceRef = useRef(null);

  /* ── Central fetch function — called on any param change ── */
  const fetchJobs = useCallback(
    (overrides = {}) => {

      const params = {
        page,
        size: PAGE_SIZE,

        // Entity field name
        sort: sortBy || "createdAt,desc",

        // Search
        keyword: searchTitle.trim() || undefined,
        city: searchLocation.trim() || undefined,
        category: urlCategory || undefined,

        // Filters
        jobType:
          filters.types.length > 0
            ? filters.types[0]
            : undefined,

        workingMode:
          filters.modes.length > 0
            ? filters.modes[0]
            : undefined,

        experienceLevel:
          filters.experience.length > 0
            ? filters.experience[0]
            : undefined,

        minimumSalary:
          filters.salary?.min ?? undefined,

        maximumSalary:
          filters.salary?.max !== Infinity
            ? filters.salary?.max
            : undefined,

        ...overrides,
      };

      // Remove undefined, null and empty string values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== ""
        )
      );

      dispatch(searchJobs(cleanParams));

    },
    [
      page,
      sortBy,
      searchTitle,
      searchLocation,
      filters,
      urlCategory,
      dispatch,
    ]
  );

  /* ── Fetch on mount and whenever search params / URL params change ── */
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, filters, urlKeyword, urlCategory, urlMode, urlCity]);

  /* ── Debounced fetch for search input typing ── */
  const handleSearchInputChange = useCallback(
    (field, value) => {
      if (field === "title") setSearchTitle(value);
      if (field === "location") setSearchLocation(value);
      setPage(0);

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchJobs({ page: 0 });
      }, 500);
    },
    [fetchJobs]
  );

  /* ── Search form submit ── */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs({ page: 0 });
  };

  /* ── Filter helpers ── */
  const toggleFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
    setPage(0);
  }, []);

  const setSalary = useCallback((range) => {
    setFilters((prev) => ({ ...prev, salary: range }));
    setPage(0);
  }, []);

  const clearAll = useCallback(() => {
    setFilters({ types: [], modes: [], experience: [], salary: null });
    setSearchTitle("");
    setSearchLocation("");
    setPage(0);
  }, []);

  const removeActiveFilter = useCallback(
    (kind, value) => {
      if (kind === "salary") setSalary(null);
      else if (kind === "search") setSearchTitle("");
      else if (kind === "location") setSearchLocation("");
      else toggleFilter(kind, value);
    },
    [setSalary, toggleFilter]
  );

  /* ── Active filter pills ── */
  const activePills = useMemo(() => {
    const pills = [];
    if (searchTitle.trim())
      pills.push({ kind: "search", label: `"${searchTitle.trim()}"` });
    if (searchLocation.trim())
      pills.push({ kind: "location", label: searchLocation.trim() });
    filters.types.forEach((v) => {
      const found = JOB_TYPES.find((t) => t.value === v);
      pills.push({ kind: "types", label: found?.label ?? v, value: v });
    });
    filters.modes.forEach((v) => {
      const found = WORK_MODES.find((m) => m.value === v);
      pills.push({ kind: "modes", label: found?.label ?? v, value: v });
    });
    filters.experience.forEach((v) => {
      const found = EXPERIENCE_LEVELS.find((e) => e.value === v);
      pills.push({ kind: "experience", label: found?.label ?? v, value: v });
    });
    if (filters.salary)
      pills.push({ kind: "salary", label: filters.salary.label });
    return pills;
  }, [searchTitle, searchLocation, filters]);

  /* ── Pagination page numbers ── */
  const getPageNumbers = () => {
    const currentPage = page + 1; // convert to 1-indexed for display
    const pages = [];
    const delta = 1;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const currentPageDisplay = page + 1; // 1-indexed for UI

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
              {totalElements > 0
                ? `Discover ${totalElements.toLocaleString()} opportunities from world-class companies`
                : "Search thousands of opportunities from world-class companies"}
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
                onChange={(e) => handleSearchInputChange("title", e.target.value)}
                placeholder="Job title, keyword, or company"
                aria-label="Search by job title, keyword, or company"
                className="w-full rounded-xl border border-border bg-surface-elevated py-3.5 pl-11 pr-10 text-sm text-heading placeholder:text-muted outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-surface-elevated"
              />
              {searchTitle && (
                <button
                  type="button"
                  onClick={() => handleSearchInputChange("title", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading p-1"
                >
                  <X size={14} />
                </button>
              )}
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
                onChange={(e) => handleSearchInputChange("location", e.target.value)}
                placeholder="City, state, or remote"
                aria-label="Search by city, state, or remote"
                className="w-full rounded-xl border border-border bg-surface-elevated py-3.5 pl-11 pr-10 text-sm text-heading placeholder:text-muted outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-surface-elevated"
              />
              {searchLocation && (
                <button
                  type="button"
                  onClick={() => handleSearchInputChange("location", "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading p-1"
                >
                  <X size={14} />
                </button>
              )}
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
                {activePills.map((pill) => (
                  <motion.button
                    key={`${pill.kind}-${pill.label}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => removeActiveFilter(pill.kind, pill.value ?? pill.label)}
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

        {/* Discovery Feed Mode Toggle */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center rounded-2xl bg-surface border border-border p-1">
            <button
              onClick={() => setFeedMode("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                feedMode === "all"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted hover:text-heading"
              }`}
            >
              All Open Positions ({totalElements.toLocaleString()})
            </button>
            <button
              onClick={() => setFeedMode("recommended")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                feedMode === "recommended"
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-muted hover:text-heading"
              }`}
            >
              <Sparkles size={13} className="text-amber-300 animate-pulse" />
              <span>Recommended for You ✨</span>
            </button>
          </div>
        </div>

        {feedMode === "recommended" ? (
          <div className="py-2">
            <RecommendedJobsSection showHeading={false} />
          </div>
        ) : (
          <>
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
              {loading ? (
                "Loading…"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-heading">
                    {jobs.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-heading">
                    {totalElements.toLocaleString()}
                  </span>{" "}
                  {totalElements === 1 ? "job" : "jobs"}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                aria-label="Sort jobs by"
                className="appearance-none rounded-xl border border-border bg-surface-elevated px-4 py-2.5 pr-9 text-sm text-heading outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10 hover:border-border-hover cursor-pointer"
                style={{ colorScheme: "dark" }}
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
                className={`rounded-xl p-2 transition-all duration-200 ${view === "grid"
                  ? "bg-primary/15 text-primary-light shadow-sm"
                  : "text-muted hover:text-heading"
                  }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-xl p-2 transition-all duration-200 ${view === "list"
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
              />
            </div>
          </aside>

          {/* ===== RIGHT: Job Cards ===== */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <div
                  key="skeleton"
                  className={
                    view === "grid"
                      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-2"
                      : "flex flex-col gap-4"
                  }
                >
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <JobCardSkeleton key={i} view={view} />
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <motion.div
                  key={`${page}-${sortBy}-${view}-${filters.types.join(",")}-${filters.modes.join(",")}-${filters.experience.join(",")}-${filters.salary?.label ?? ""}-${searchTitle}-${searchLocation}`}
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
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} view={view} />
                  ))}
                </motion.div>
              ) : (
                /* Empty State */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#090d16]/90 backdrop-blur-xl px-6 py-20 text-center shadow-xl font-inter text-slate-200"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 shadow-inner">
                    <Search size={34} />
                  </div>
                  <h3 className="font-satoshi text-2xl font-black text-white tracking-tight">
                    No Matching Jobs Found
                  </h3>
                  <p className="mt-2.5 max-w-md text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                    We couldn't find any opportunities matching your active filters. Try broadening your keywords, location, or reset filters below.
                  </p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <Sparkles size={15} className="text-amber-300 fill-amber-300/20 animate-pulse" />
                    Reset Filters & Explore All Jobs
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== PAGINATION ===== */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-1.5"
              >
                {/* Previous */}
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
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
                      <span key={`dots-${i}`} className="px-2 text-sm text-muted">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p - 1)} // convert 1-indexed display → 0-indexed
                        className={`h-9 w-9 rounded-xl text-sm font-medium transition-all duration-200 ${currentPageDisplay === p
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
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  aria-label="Next page"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-body transition-all hover:border-primary/30 hover:text-heading disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-body"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Page info */}
            {!loading && totalPages > 1 && (
              <p className="mt-3 text-center text-xs text-muted">
                Page {currentPageDisplay} of {totalPages} ·{" "}
                {totalElements.toLocaleString()} total jobs
              </p>
            )}
          </div>
        </div>
        </>
        )}
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
                  <SlidersHorizontal size={18} className="text-primary-light" />
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
              />

              {/* Apply button */}
              <button
                onClick={() => setMobileFilters(false)}
                className="gradient-bg-signature mt-6 w-full rounded-xl py-3 text-sm font-bold text-white shadow-button transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]"
              >
                Show {totalElements.toLocaleString()} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
