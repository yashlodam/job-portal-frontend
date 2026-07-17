import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories, workModes } from "../Data/Data";
import SectionHeader from "../components/SectionHeader";

/* ===========================
   Animation Variants
=========================== */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

/* ===========================
   Tabs
=========================== */

const TABS = [
  {
    key: "category",
    label: "By Category",
    param: "category",
  },
  {
    key: "mode",
    label: "By Work Mode",
    param: "mode",
  },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080F]";

const MotionLink = motion(Link);

/* ===========================
   Component
=========================== */

function JobCategory() {
  const [activeTab, setActiveTab] = useState("category");

  const items =
    activeTab === "category" ? categories : workModes;

  const activeParam =
    TABS.find((tab) => tab.key === activeTab)?.param || "category";

  const handleKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") {
      return;
    }

    e.preventDefault();

    const currentIndex = TABS.findIndex(
      (tab) => tab.key === activeTab
    );

    const nextIndex =
      e.key === "ArrowRight"
        ? (currentIndex + 1) % TABS.length
        : (currentIndex - 1 + TABS.length) % TABS.length;

    setActiveTab(TABS[nextIndex].key);

    const tabs =
      e.currentTarget.querySelectorAll('[role="tab"]');

    tabs[nextIndex]?.focus();
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">

      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20
          h-64
          w-64
          -translate-x-1/2
          rounded-full
          bg-[#6366F1]/10
          blur-[120px]
          sm:h-80
          sm:w-80
        "
      />

      {/* Main Container */}
      <div className="section-container relative z-10">

        {/* Section Heading */}
        <SectionHeader
          badge="Explore Jobs"
          title={
            <>
              Browse{" "}
              <span className="gradient-text">
                Job
              </span>{" "}
              Categories
            </>
          }
          subtitle="Explore opportunities across popular job categories and flexible work modes to find the role that fits your career goals."
        />

        {/* ===========================
            Tab Switcher
        =========================== */}
       

        <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.2,
      }}
      className="mt-8 flex w-full justify-center sm:mt-10"
    >
          <div
            role="tablist"
            aria-label="Browse jobs"
            onKeyDown={handleKeyDown}
            className="
      flex
      gap-3
      w-full
      max-w-[360px]
      items-center
      rounded-2xl
      border
      border-white/[0.08]
      bg-[#0D1117]
      p-1.5
      shadow-[0_8px_30px_rgba(0,0,0,0.2)]
    "
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
            relative
            flex
            h-10
            flex-1
            items-center
            justify-center
            whitespace-nowrap
            rounded-xl
            px-4
            text-sm
            font-semibold
            transition-colors
            duration-300
            ${isActive
                      ? "text-white"
                      : "text-[#708090] hover:text-white"
                    }
          `}
                >
                  {isActive && (
                    <motion.span
                      layoutId="job-tab-indicator"
                      className="
                absolute
                inset-0
                rounded-xl
                bg-gradient-to-r
                from-[#6366F1]
                to-[#8B5CF6]
                shadow-[0_4px_16px_rgba(99,102,241,0.25)]
              "
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative z-10">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ===========================
            Category Cards
        =========================== */}

        <div
      id="job-category-tabpanel"
      role="tabpanel"
      aria-label={`Jobs by ${activeTab}`}
      className="mt-8 sm:mt-10 lg:mt-12"
    >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                grid
                grid-cols-1
               gap-4
             sm:grid-cols-2
             sm:gap-5
             lg:grid-cols-4
              lg:gap-5
               xl:gap-6
  "
            >
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <MotionLink
                    key={item.title}
                    to={`/find-jobs?${activeParam}=${encodeURIComponent(
                      item.title
                    )}`}
                    variants={cardVariants}
                    whileHover={{
                      y: -4,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className={`
                      ${FOCUS_RING}
                      group
                      relative
                      flex
                      min-h-[150px]
                      flex-col
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-[#0D1117]
                      p-4
                      transition-all
                      duration-300
                      hover:border-[#6366F1]/30
                      hover:bg-[#111620]
                      hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
                      sm:min-h-[170px]
                      sm:p-5
                      lg:p-6
                    `}
                  >

                    {/* Hover Gradient */}
                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-0
                        transition-opacity
                        duration-500
                        group-hover:opacity-100
                      "
                      style={{
                        background: `linear-gradient(
                          135deg,
                          ${item.gradient.from}12,
                          ${item.gradient.to}05
                        )`,
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="
                        relative
                        z-10
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        sm:h-12
                        sm:w-12
                      "
                      style={{
                        background: `linear-gradient(
                          135deg,
                          ${item.gradient.from}20,
                          ${item.gradient.to}12
                        )`,
                      }}
                    >
                      <div
                        aria-hidden="true"
                        className="
                          absolute
                          inset-0
                          opacity-0
                          transition-opacity
                          duration-300
                          group-hover:opacity-100
                        "
                        style={{
                          background: `linear-gradient(
                            135deg,
                            ${item.gradient.from},
                            ${item.gradient.to}
                          )`,
                        }}
                      />

                      <Icon
                        aria-hidden="true"
                        className="
                          relative
                          z-10
                          h-5
                          w-5
                          transition-all
                          duration-300
                          group-hover:scale-110
                          group-hover:text-white
                          sm:h-[22px]
                          sm:w-[22px]
                        "
                        style={{
                          color: item.gradient.from,
                        }}
                      />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 mt-4">

                      <h3
                        className="
                          text-sm
                          font-semibold
                          leading-snug
                          text-[#F1F5F9]
                          sm:text-base
                        "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#708090]
                          sm:text-sm
                        "
                      >
                        {item.jobs}
                      </p>

                    </div>

                    {/* Arrow */}
                    <div
                      aria-hidden="true"
                      className="
                        relative
                        z-10
                        mt-auto
                        flex
                        justify-end
                        pt-4
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          translate-x-1
                          items-center
                          justify-center
                          rounded-full
                          bg-white/[0.04]
                          opacity-60
                          transition-all
                          duration-300
                          group-hover:translate-x-0
                          group-hover:bg-[#6366F1]/15
                          group-hover:opacity-100
                        "
                        style={{
                          color: item.gradient.from,
                        }}
                      >
                        <ArrowRight size={15} />
                      </span>
                    </div>

                  </MotionLink>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

export default JobCategory;