import React, { useId, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useAppSelector } from "../State/Store";
import {
  Code2,
  Briefcase,
  Megaphone,
  BarChart3,
  HeartPulse,
  Palette,
  ShieldCheck,
  GraduationCap,
  Globe,
  Laptop,
  Building2,
  Home,
  Database,
  Cpu,
  Cloud,
  Network,
  MonitorSmartphone,
  Blocks,
} from "lucide-react";

/* ===========================
   Static config
=========================== */

const ICONS = [
  Code2,
  Briefcase,
  Megaphone,
  BarChart3,
  HeartPulse,
  Palette,
  ShieldCheck,
  GraduationCap,
  Globe,
  Laptop,
  Building2,
  Home,
  Database,
  Cpu,
  Cloud,
  Network,
  MonitorSmartphone,
  Blocks,
];

const GRADIENTS = [
  { from: "#6366F1", to: "#8B5CF6" },
  { from: "#EC4899", to: "#F43F5E" },
  { from: "#22C55E", to: "#14B8A6" },
  { from: "#0EA5E9", to: "#3B82F6" },
  { from: "#F97316", to: "#EF4444" },
  { from: "#A855F7", to: "#EC4899" },
  { from: "#10B981", to: "#22C55E" },
  { from: "#EAB308", to: "#F59E0B" },
];

const TABS = [
  { key: "category", label: "By Category", param: "category" },
  { key: "mode", label: "By Work Mode", param: "mode" },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080F]";

const MotionLink = motion(Link);

/* ===========================
   Animation variants
=========================== */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ===========================
   Helpers
=========================== */

function formatItems(list) {
  return list.map((item, index) => ({
    title: item.title,
    jobs: `${item.count} ${item.count === 1 ? "Job" : "Jobs"}`,
    icon: ICONS[index % ICONS.length],
    gradient: GRADIENTS[index % GRADIENTS.length],
  }));
}


function formatWorkMode(list) {
  return list.map((item, index) => ({
    title: item.workingMode,
    jobs: `${item.jobCount} ${item.jobCount === 1 ? "Job" : "Jobs"}`,
    icon: ICONS[index % ICONS.length],
    gradient: GRADIENTS[index % GRADIENTS.length],
  }));
}

/* ===========================
   Skeleton (loading state)
=========================== */

function CardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[150px] animate-pulse rounded-2xl border border-white/[0.08] bg-[#0D1117] p-4 sm:min-h-[170px] sm:p-5 lg:p-6"
    >
      <div className="h-11 w-11 rounded-xl bg-white/[0.06] sm:h-12 sm:w-12" />
      <div className="mt-4 h-4 w-3/4 rounded bg-white/[0.06]" />
      <div className="mt-2 h-3 w-1/3 rounded bg-white/[0.05]" />
    </div>
  );
}

/* ===========================
   Empty state
=========================== */

function EmptyState({ label }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#0D1117]/60 px-6 py-16 text-center">
      <p className="text-sm font-medium text-[#F1F5F9]">
        No {label} to show right now
      </p>
      <p className="mt-1 text-xs text-[#708090]">
        Check back soon &mdash; new listings are added regularly.
      </p>
    </div>
  );
}

/* ===========================
   Card
=========================== */

function CategoryCard({ item, activeParam, variants }) {
  const Icon = item.icon;

  return (
    <MotionLink
      to={`/find-jobs?${activeParam}=${encodeURIComponent(item.title)}`}
      variants={variants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`${FOCUS_RING} group relative flex min-h-[150px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] p-4 transition-all duration-300 hover:border-[#6366F1]/30 hover:bg-[#111620] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:min-h-[170px] sm:p-5 lg:p-6`}
    >
      {/* Hover gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${item.gradient.from}12, ${item.gradient.to}05)`,
        }}
      />

      {/* Icon badge */}
      <div
        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:h-12 sm:w-12"
        style={{
          background: `linear-gradient(135deg, ${item.gradient.from}20, ${item.gradient.to}12)`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${item.gradient.from}, ${item.gradient.to})`,
          }}
        />
        <Icon
          aria-hidden="true"
          className="relative z-10 h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-white sm:h-[22px] sm:w-[22px]"
          style={{ color: item.gradient.from }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-4">
        <h3 className="text-sm font-semibold leading-snug text-[#F1F5F9] sm:text-base">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-[#708090] sm:text-sm">{item.jobs}</p>
      </div>

      {/* Arrow */}
      <div aria-hidden="true" className="relative z-10 mt-auto flex justify-end pt-4">
        <span
          className="flex h-8 w-8 translate-x-1 items-center justify-center rounded-full bg-white/[0.04] opacity-60 transition-all duration-300 group-hover:translate-x-0 group-hover:bg-[#6366F1]/15 group-hover:opacity-100"
          style={{ color: item.gradient.from }}
        >
          <ArrowRight size={15} />
        </span>
      </div>
    </MotionLink>
  );
}

/* ===========================
   Component
=========================== */

function JobCategory() {
  const [activeTab, setActiveTab] = useState("category");
  const prefersReducedMotion = useReducedMotion();
  const tabPanelId = useId();

  const categoriesState = useAppSelector((state) => state.job.categories);
  const workModesState = useAppSelector((state) => state.job.workModes);

  // Support either a plain array or a { data, status } shape without breaking either.
  const categories = Array.isArray(categoriesState)
    ? categoriesState
    : categoriesState?.data ?? [];
  const workModes = Array.isArray(workModesState)
    ? workModesState
    : workModesState?.data ?? [];
  const isLoading =
    categoriesState?.status === "loading" || workModesState?.status === "loading";

  const formattedCategories = useMemo(() => formatItems(categories), [categories]);
  const formattedWorkModes = useMemo(() => formatWorkMode(workModes), [workModes]);

  const items = activeTab === "category" ? formattedCategories : formattedWorkModes;
  const activeTabMeta = TABS.find((tab) => tab.key === activeTab) ?? TABS[0];
  const activeVariants = prefersReducedMotion ? cardVariantsReduced : cardVariants;

  const handleKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();

    const currentIndex = TABS.findIndex((tab) => tab.key === activeTab);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % TABS.length
        : (currentIndex - 1 + TABS.length) % TABS.length;

    setActiveTab(TABS[nextIndex].key);
    event.currentTarget.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6366F1]/10 blur-[120px] sm:h-80 sm:w-80"
      />

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Explore Jobs"
          title={
            <>
              Browse <span className="gradient-text">Job</span> Categories
            </>
          }
          subtitle="Explore opportunities across popular job categories and flexible work modes to find the role that fits your career goals."
        />

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex w-full justify-center sm:mt-10"
        >
          <div
            role="tablist"
            aria-label="Browse jobs"
            onKeyDown={handleKeyDown}
            className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0D1117] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  id={`${tabPanelId}-${tab.key}-tab`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tabPanelId}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.key)}
                  className={`${FOCUS_RING} relative flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "text-white" : "text-[#708090] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="job-tab-indicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] shadow-[0_4px_16px_rgba(99,102,241,0.25)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Panel */}
        <div
          id={`${tabPanelId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabPanelId}-${activeTab}-tab`}
          aria-live="polite"
          className="mt-8 sm:mt-10 lg:mt-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5 xl:gap-6"
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))
              ) : items.length === 0 ? (
                <EmptyState label={activeTabMeta.label.toLowerCase()} />
              ) : (
                items.map((item) => (
                  <CategoryCard
                    key={item.title}
                    item={item}
                    activeParam={activeTabMeta.param}
                    variants={activeVariants}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default JobCategory;