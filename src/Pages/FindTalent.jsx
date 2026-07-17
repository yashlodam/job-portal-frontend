import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  X,
  ChevronDown,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ===========================
    Mock Talent Data
=========================== */

const talentGradients = [
  "from-primary to-violet",
  "from-accent to-primary",
  "from-violet to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-cyan-500",
  "from-blue-500 to-indigo-500",
  "from-rose-500 to-violet",
  "from-cyan-500 to-blue-500",
  "from-primary to-accent",
  "from-violet to-primary",
  "from-emerald-500 to-primary",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-primary",
  "from-primary to-emerald-500",
];

const talents = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    rating: 4.9,
    hourlyRate: "$95",
    availability: "Full Time",
    location: "San Francisco, CA",
    experience: "Senior",
    gradient: talentGradients[0],
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Full Stack Engineer",
    skills: ["Node.js", "Python", "AWS", "React"],
    rating: 4.8,
    hourlyRate: "$110",
    availability: "Freelance",
    location: "New York, NY",
    experience: "Senior",
    gradient: talentGradients[1],
  },
  {
    id: 3,
    name: "Priya Patel",
    title: "UI/UX Designer",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    rating: 5.0,
    hourlyRate: "$85",
    availability: "Full Time",
    location: "London, UK",
    experience: "Mid",
    gradient: talentGradients[2],
  },
  {
    id: 4,
    name: "David Kim",
    title: "ML Engineer",
    skills: ["Python", "PyTorch", "TensorFlow", "LLMs"],
    rating: 4.7,
    hourlyRate: "$130",
    availability: "Part Time",
    location: "Seattle, WA",
    experience: "Lead",
    gradient: talentGradients[3],
  },
  {
    id: 5,
    name: "Amara Obi",
    title: "DevOps Architect",
    skills: ["Kubernetes", "AWS", "Terraform", "Docker"],
    rating: 4.9,
    hourlyRate: "$120",
    availability: "Freelance",
    location: "Berlin, Germany",
    experience: "Senior",
    gradient: talentGradients[4],
  },
  {
    id: 6,
    name: "Elena Vasquez",
    title: "Product Designer",
    skills: ["Figma", "Sketch", "Motion Design", "CSS"],
    rating: 4.6,
    hourlyRate: "$75",
    availability: "Full Time",
    location: "Barcelona, Spain",
    experience: "Mid",
    gradient: talentGradients[5],
  },
  {
    id: 7,
    name: "Raj Mehta",
    title: "Backend Engineer",
    skills: ["Go", "PostgreSQL", "gRPC", "Microservices"],
    rating: 4.8,
    hourlyRate: "$100",
    availability: "Full Time",
    location: "Bangalore, India",
    experience: "Senior",
    gradient: talentGradients[6],
  },
  {
    id: 8,
    name: "Sophie Laurent",
    title: "Data Scientist",
    skills: ["Python", "R", "SQL", "Machine Learning"],
    rating: 4.9,
    hourlyRate: "$115",
    availability: "Part Time",
    location: "Paris, France",
    experience: "Senior",
    gradient: talentGradients[7],
  },
  {
    id: 9,
    name: "James Wright",
    title: "Mobile Developer",
    skills: ["React Native", "Swift", "Kotlin", "Flutter"],
    rating: 4.5,
    hourlyRate: "$90",
    availability: "Freelance",
    location: "Austin, TX",
    experience: "Mid",
    gradient: talentGradients[8],
  },
  {
    id: 10,
    name: "Yuki Tanaka",
    title: "Cloud Architect",
    skills: ["AWS", "Azure", "GCP", "Serverless"],
    rating: 5.0,
    hourlyRate: "$140",
    availability: "Full Time",
    location: "Tokyo, Japan",
    experience: "Lead",
    gradient: talentGradients[9],
  },
  {
    id: 11,
    name: "Fatima Al-Rashid",
    title: "Cybersecurity Analyst",
    skills: ["Pen Testing", "SIEM", "Cloud Security", "Python"],
    rating: 4.7,
    hourlyRate: "$105",
    availability: "Full Time",
    location: "Dubai, UAE",
    experience: "Mid",
    gradient: talentGradients[10],
  },
  {
    id: 12,
    name: "Liam O'Brien",
    title: "Junior Frontend Developer",
    skills: ["JavaScript", "React", "CSS", "HTML"],
    rating: 4.3,
    hourlyRate: "$45",
    availability: "Full Time",
    location: "Dublin, Ireland",
    experience: "Entry",
    gradient: talentGradients[11],
  },
  {
    id: 13,
    name: "Ana Costa",
    title: "Technical Writer",
    skills: ["Documentation", "API Docs", "Markdown", "Content Strategy"],
    rating: 4.6,
    hourlyRate: "$60",
    availability: "Freelance",
    location: "São Paulo, Brazil",
    experience: "Mid",
    gradient: talentGradients[12],
  },
  {
    id: 14,
    name: "Chen Wei",
    title: "Blockchain Developer",
    skills: ["Solidity", "Rust", "Web3.js", "Smart Contracts"],
    rating: 4.8,
    hourlyRate: "$135",
    availability: "Part Time",
    location: "Singapore",
    experience: "Senior",
    gradient: talentGradients[13],
  },
];

const skillOptions = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "Figma",
  "AWS",
  "Go",
  "Kubernetes",
  "Machine Learning",
  "Flutter",
];
const experienceLevels = ["Entry", "Mid", "Senior", "Lead"];
const availabilityOptions = ["Full Time", "Part Time", "Freelance"];
const locationOptions = [
  "All Locations",
  "San Francisco, CA",
  "New York, NY",
  "London, UK",
  "Berlin, Germany",
  "Remote",
];

const quickFilters = [
  "React",
  "Python",
  "Designer",
  "DevOps",
  "Full Stack",
  "Remote",
  "Senior",
  "Freelance",
];

/* ===========================
    Sub-Components
=========================== */

function StarRating({ rating }) {

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={
            s <= Math.round(rating)
              ? "fill-accent-warm text-accent-warm"
              : "text-muted/30"
          }
        />
      ))}
      <span className="ml-1 text-xs font-medium text-heading">{rating}</span>
    </div>
  );
}

function AvailabilityBadge({ type }) {
  const colors = {
    "Full Time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Part Time": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Freelance: "bg-violet/10 text-violet-light border-violet/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[type] || colors["Full Time"]}`}
    >
      {type}
    </span>
  );
}

function TalentCard({ talent, index }) {
  const navigate = useNavigate();
  const initials = talent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group rounded-[20px] border border-border bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary"
    >
      {/* Top: avatar + info */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-2 ring-border bg-gradient-to-br ${talent.gradient} text-lg font-bold text-white shadow-lg`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-heading font-satoshi">
            {talent.name}
          </h3>
          <p className="truncate text-sm text-body">{talent.title}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {talent.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-light"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Rating & Rate */}
      <div className="mt-4 flex items-center justify-between">
        <StarRating rating={talent.rating} />
        <span className="text-lg font-bold text-heading font-satoshi">
          {talent.hourlyRate}
          <span className="text-xs font-normal text-muted">/hr</span>
        </span>
      </div>

      {/* Location & Availability */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} />
          <span className="truncate">{talent.location}</span>
        </div>
        <AvailabilityBadge type={talent.availability} />
      </div>

      {/* View Profile Button */}
      <button
        onClick={()=> navigate("/talent-profile")}
        type="button"
        className="mt-5 flex w-full items-center justify-center gap-2 gradient-bg-signature rounded-xl h-11 px-6 text-sm font-semibold text-white shadow-button transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        View Profile
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </motion.div>
  );
}

/* ===========================
    Main Page
=========================== */

function FindTalent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();

  const toggleFilter = (arr, setArr, value) => {
    setArr((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setSelectedExperience([]);
    setSelectedAvailability([]);
    setSelectedLocation("All Locations");
  };

  const filteredTalent = useMemo(() => {
    return talents.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q));

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((s) =>
          t.skills.some((ts) => ts.toLowerCase().includes(s.toLowerCase()))
        );

      const matchesExperience =
        selectedExperience.length === 0 ||
        selectedExperience.includes(t.experience);

      const matchesAvailability =
        selectedAvailability.length === 0 ||
        selectedAvailability.includes(t.availability);

      const matchesLocation =
        selectedLocation === "All Locations" ||
        t.location.includes(selectedLocation);

      return (
        matchesSearch &&
        matchesSkills &&
        matchesExperience &&
        matchesAvailability &&
        matchesLocation
      );
    });
  }, [
    searchQuery,
    selectedSkills,
    selectedExperience,
    selectedAvailability,
    selectedLocation,
  ]);

  const activeFilterCount =
    selectedSkills.length +
    selectedExperience.length +
    selectedAvailability.length +
    (selectedLocation !== "All Locations" ? 1 : 0);

  /* --- Sidebar Content (shared between desktop & mobile) --- */
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-heading font-satoshi">
          Skills
        </h4>
        <div className="space-y-2">
          {skillOptions.map((skill) => (
            <label
              key={skill}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-body transition-colors hover:bg-surface-elevated hover:text-heading"
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={() => toggleFilter(selectedSkills, setSelectedSkills, skill)}
                className="h-4 w-4 rounded border-border bg-surface accent-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-heading font-satoshi">
          Experience
        </h4>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <label
              key={level}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-body transition-colors hover:bg-surface-elevated hover:text-heading"
            >
              <input
                type="checkbox"
                checked={selectedExperience.includes(level)}
                onChange={() =>
                  toggleFilter(selectedExperience, setSelectedExperience, level)
                }
                className="h-4 w-4 rounded border-border bg-surface accent-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-heading font-satoshi">
          Availability
        </h4>
        <div className="space-y-2">
          {availabilityOptions.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-body transition-colors hover:bg-surface-elevated hover:text-heading"
            >
              <input
                type="checkbox"
                checked={selectedAvailability.includes(opt)}
                onChange={() =>
                  toggleFilter(
                    selectedAvailability,
                    setSelectedAvailability,
                    opt
                  )
                }
                className="h-4 w-4 rounded border-border bg-surface accent-primary"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-heading font-satoshi">
          Location
        </h4>
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full appearance-none rounded-xl border border-border bg-surface-elevated h-11 px-4 pr-10 text-sm text-heading outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            style={{ colorScheme: 'dark' }}
          >
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full rounded-xl border border-danger/30 h-11 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 focus-visible:ring-2 focus-visible:ring-danger/40"
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <section className="relative min-h-screen overflow-x-hidden" aria-label="Find talent">
      {/* ── Background Glows ── */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full" style={{ background: 'rgba(99,102,241,0.07)', filter: 'blur(180px)' }} />
      <div className="pointer-events-none absolute bottom-40 right-0 h-[400px] w-[400px] rounded-full" style={{ background: 'rgba(6,182,212,0.05)', filter: 'blur(160px)' }} />
      <div className="pointer-events-none absolute top-1/2 right-1/3 h-[350px] w-[350px] rounded-full" style={{ background: 'rgba(139,92,246,0.04)', filter: 'blur(140px)' }} />

      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <div className="relative z-10 section-container section-padding">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-2"
          >
            <span className="h-px w-6 bg-primary/40" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">
              Find Talent
            </span>
            <span className="h-px w-6 bg-primary/40" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold text-heading font-satoshi leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Discover world-class{" "}
            <span className="gradient-text">talent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-body text-base leading-8 md:text-lg"
          >
            Browse top professionals across every discipline. Find the perfect
            match for your team with powerful filters and AI-powered
            recommendations.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <div className="flex items-center rounded-xl border border-border bg-surface-elevated p-1.5 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
              <Search size={20} className="ml-3 shrink-0 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill, or role…"
                className="min-w-0 flex-1 h-11 bg-transparent px-4 text-heading placeholder:text-muted outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="mr-1 rounded-lg p-2 text-muted transition-colors hover:bg-surface-elevated hover:text-heading focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                aria-label="Search talent"
                className="gradient-bg-signature rounded-xl h-11 px-6 text-sm font-semibold text-white shadow-button transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Search
              </button>
            </div>
          </motion.div>

          {/* Quick Filter Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-muted">Popular:</span>
            {quickFilters.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-body transition-all hover:border-primary/30 hover:text-primary-light focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT — Sidebar + Grid
      ══════════════════════════════════════════ */}
      <div className="relative z-10 section-container pb-20 lg:pb-28">
        <div>
          {/* Mobile filter toggle */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="text-sm text-body">
              <span className="font-semibold text-heading">
                {filteredTalent.length}
              </span>{" "}
              professionals found
            </p>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              aria-label="Open filters"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface h-11 px-4 text-sm font-semibold text-heading transition-colors hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-6">
            {/* ── Desktop Sidebar ── */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden w-[260px] shrink-0 lg:block"
            >
              <div className="sticky top-28 rounded-[20px] border border-border bg-surface p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-base font-bold text-heading font-satoshi">
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary-light">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <FilterSidebar />
              </div>
            </motion.aside>

            {/* ── Mobile Sidebar Drawer ── */}
            <AnimatePresence>
              {mobileFiltersOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 lg:hidden"
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 250 }}
                    className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto border-r border-border bg-background p-6 lg:hidden"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-heading font-satoshi">
                        Filters
                      </h3>
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(false)}
                        aria-label="Close filters"
                        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-elevated hover:text-heading focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <FilterSidebar />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* ── Talent Grid ── */}
            <div className="min-w-0 flex-1">
              {/* Results count — desktop */}
              <div className="mb-6 hidden items-center justify-between lg:flex">
                <p className="text-sm text-body">
                  Showing{" "}
                  <span className="font-semibold text-heading">
                    {filteredTalent.length}
                  </span>{" "}
                  professionals
                </p>
              </div>

              {/* Grid */}
              <AnimatePresence mode="popLayout">
                {filteredTalent.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredTalent.map((t, i) => (
                      <TalentCard key={t.id} talent={t} index={i} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-[20px] border border-border bg-surface py-20 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Users size={28} className="text-primary-light" />
                    </div>
                    <h3 className="text-xl font-bold text-heading font-satoshi">
                      No talent found
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-body">
                      Try adjusting your filters or search query to discover
                      more professionals.
                    </p>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-5 rounded-xl border border-border bg-surface h-11 px-6 text-sm font-semibold text-heading transition-colors hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATS / CTA SECTION
      ══════════════════════════════════════════ */}
      <section
        className="relative z-10 border-t section-container section-padding"
        style={{ borderColor: 'rgba(148,163,184,0.08)', background: 'rgba(13,17,23,0.40)' }}
        aria-label="Join the platform"
      >
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-extrabold text-heading font-satoshi sm:text-3xl md:text-4xl"
          >
            Join{" "}
            <span className="gradient-text">50,000+</span> professionals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-body"
          >
            Create your talent profile today and get discovered by the world's
            leading companies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4"
          >
            {[
              { icon: Users, value: "50K+", label: "Professionals" },
              { icon: Briefcase, value: "10K+", label: "Companies Hiring" },
              { icon: Award, value: "95%", label: "Match Rate" },
              { icon: TrendingUp, value: "3x", label: "Faster Hiring" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="rounded-[20px] border border-border bg-surface p-5 sm:p-6"
              >
                <stat.icon size={22} className="mx-auto text-primary-light" />
                <p className="mt-3 text-2xl font-extrabold text-heading font-satoshi">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 inline-flex items-center gap-2 gradient-bg-signature rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-button transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Create Your Profile
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </section>
    </section>
  );
}

export default FindTalent;
