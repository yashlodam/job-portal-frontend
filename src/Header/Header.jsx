import React, { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, Indicator } from "@mantine/core";
import { Sparkles, Bell, Settings, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Navigation Links ─── */
const links = [
  { name: "Find Jobs",   url: "/find-jobs" },
  { name: "Find Talent", url: "/find-talent" },
  { name: "Post Job",  url: "/upload-job" },
  { name: "Posted Job",    url: "/posted-job" },
   {name:"Signup" , url:"/signup"}
];

/* ─── User Data ─── */
const USER = { name: "Marshal", role: "Software Engineer" };

/* ─── Framer Motion Variants ─── */
const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

const mobileLinkVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, delay: i * 0.05, ease: "easeOut" },
  }),
  exit: { opacity: 0, x: -6, transition: { duration: 0.12 } },
};

/* Shared focus-visible ring */
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080F]";

/* ─── Header Component ─── */
function Header() {
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const location     = useLocation();
  const menuRef      = useRef(null);
  const toggleBtnRef = useRef(null);

  /* Close on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  /* Escape key */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        toggleBtnRef.current?.focus();
      }
    },
    [mobileOpen]
  );

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, handleKeyDown]);

  return location.pathname !="/signup" && (
    <header
      ref={menuRef}
      role="banner"
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-white/[0.08] bg-[#06080F]/92 shadow-[0_4px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          : "border-white/[0.05] bg-[#06080F]/72 backdrop-blur-xl"
      }`}
    >
      {/* Top gradient accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)",
        }}
      />

      {/* ─── Main nav row ─── */}
      <div className="section-container grid h-16 grid-cols-[auto_1fr_auto] items-center sm:h-[68px] lg:h-[72px]">

        {/* Column 1: Logo */}
        <Link
          to="/"
          className={`group flex shrink-0 items-center gap-2 rounded-xl sm:gap-2.5 ${FOCUS_RING}`}
          aria-label="Velora — home"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex h-8 w-8 items-center justify-center rounded-xl shadow-lg group-hover:shadow-[0_0_24px_rgba(99,102,241,0.5)] sm:h-9 sm:w-9"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            <Sparkles className="text-white" size={16} strokeWidth={2.5} />
          </motion.div>
          <span
            className="text-lg font-black tracking-tight text-[#F1F5F9] sm:text-xl lg:text-2xl"
            style={{ fontFamily: "var(--font-satoshi)" }}
          >
            Velora
          </span>
        </Link>

        {/* Column 2: Desktop Navigation */}
       <nav
  role="navigation"
  aria-label="Main navigation"
  className="hidden items-center justify-center gap-12   rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1.5 backdrop-blur-xl md:flex lg:gap-15"
>
  {links.map((item) => {
    const active = location.pathname === item.url;

    return (
      <Link
        key={item.url}
        to={item.url}
        aria-current={active ? "page" : undefined}
        className={`
          group relative
          flex h-10 items-center justify-center
          whitespace-nowrap rounded-xl
          px-3.5 lg:px-4
          text-sm font-medium
          transition-colors duration-300
          ${FOCUS_RING}
          ${
            active
              ? "text-white"
              : "text-[#94A3B8] hover:text-[#F1F5F9]"
          }
        `}
      >
        {/* Active Background */}
        {active && (
          <motion.span
            layoutId="nav-active-bg"
            className="
              absolute inset-0
              rounded-xl
              border border-white/[0.07]
              bg-[#161B22]
              shadow-[0_4px_16px_rgba(0,0,0,0.25)]
            "
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
          />
        )}

        {/* Hover Background */}
        <span
          className="
            absolute inset-0
            rounded-xl
            bg-white/[0.04]
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        {/* Navigation Text */}
        <span
          className={`
            relative z-10
            transition-all duration-300
            ${
              active
                ? "font-semibold text-white"
                : "group-hover:text-white"
            }
          `}
        >
          {item.name}
        </span>

        {/* Active Gradient Indicator */}
        <span
          className={`
            absolute bottom-1 left-1/2 z-10
            h-[2px] -translate-x-1/2
            rounded-full
            bg-gradient-to-r
            from-indigo-500 via-violet-500 to-cyan-400
            transition-all duration-300
            ${
              active
                ? "w-5 opacity-100"
                : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-50"
            }
          `}
        />

        {/* Active Glow */}
        {active && (
          <span
            className="
              pointer-events-none
              absolute -bottom-2 left-1/2
              h-4 w-12
              -translate-x-1/2
              rounded-full
              bg-indigo-500/10
              blur-xl
            "
            aria-hidden="true"
          />
        )}
      </Link>
    );
  })}
</nav>

        {/* Column 3: Right section */}
        <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 lg:gap-1.5">

          {/* Avatar: md = icon only, lg = chip with name */}
          <motion.button
            whileHover={{ backgroundColor: "#161B22" }}
            whileTap={{ scale: 0.97 }}
            className={`hidden cursor-pointer items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-1.5 transition-colors duration-200 md:flex lg:pr-3 ${FOCUS_RING}`}
            aria-label="User profile menu"
            aria-haspopup="true"
          >
            <Avatar
              src="/avatar.jpg"
              radius="xl"
              size={34}
              className="ring-2 ring-white/10"
            >
              M
            </Avatar>
            <div className="hidden min-w-0 leading-tight text-left lg:block">
              <p className="max-w-[100px] truncate text-sm font-semibold text-[#F1F5F9] xl:max-w-[130px]">
                {USER.name}
              </p>
              <p className="mt-0.5 max-w-[100px] truncate text-xs text-[#708090] xl:max-w-[130px]">
                {USER.role}
              </p>
            </div>
          </motion.button>

          {/* Divider — lg only */}
          <div
            className="mx-1 hidden h-5 w-px lg:block"
            style={{ background: "rgba(148,163,184,0.10)" }}
          />

          {/* Notification bell */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Notifications (1 unread)"
            className={`relative rounded-xl p-2.5 text-[#708090] transition-colors duration-200 hover:bg-[#161B22] hover:text-[#F1F5F9] ${FOCUS_RING}`}
          >
            <Indicator color="var(--color-primary)" size={7} offset={3} processing>
              <Bell size={18} strokeWidth={1.8} />
            </Indicator>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.06, rotate: 45 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            aria-label="Settings"
            className={`hidden rounded-xl p-2.5 text-[#708090] transition-colors duration-200 hover:bg-[#161B22] hover:text-[#F1F5F9] sm:block ${FOCUS_RING}`}
          >
            <Settings size={18} strokeWidth={1.8} />
          </motion.button>

          {/* Mobile menu toggle */}
          <motion.button
            ref={toggleBtnRef}
            whileTap={{ scale: 0.9 }}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            className={`ml-0.5 rounded-xl p-2.5 text-[#708090] transition-colors duration-200 hover:bg-[#161B22] hover:text-[#F1F5F9] md:hidden ${FOCUS_RING}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ─── Mobile Navigation Panel ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            role="navigation"
            aria-label="Mobile navigation"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden border-t md:hidden"
            style={{
              borderColor: "rgba(148,163,184,0.08)",
              background: "rgba(13,17,23,0.97)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
            }}
          >
            <div
              className="section-container py-3"
              style={{
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
              }}
            >
              {links.map((item, i) => {
                const active = location.pathname === item.url;
                return (
                  <motion.div
                    key={item.url}
                    custom={i}
                    variants={mobileLinkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link
                      to={item.url}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-200 active:scale-[0.98] ${FOCUS_RING} ${
                        active
                          ? "bg-[#161B22] text-[#F1F5F9]"
                          : "text-[#94A3B8] hover:bg-[#161B22] hover:text-[#F1F5F9]"
                      }`}
                    >
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                          style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                        />
                      )}
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile user row */}
              <div
                className="mt-3 flex items-center gap-3 rounded-xl border px-4 py-2.5"
                style={{
                  borderColor: "rgba(148,163,184,0.08)",
                  background: "rgba(22,27,34,0.60)",
                }}
              >
                <Avatar src="/avatar.jpg" radius="xl" size={32}>
                  M
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#F1F5F9]">
                    {USER.name}
                  </p>
                  <p className="truncate text-xs text-[#708090]">{USER.role}</p>
                </div>
                <button
                  type="button"
                  aria-label="Settings"
                  className={`shrink-0 rounded-lg p-2 text-[#708090] transition-colors duration-200 hover:bg-[#0D1117] hover:text-[#F1F5F9] active:scale-90 ${FOCUS_RING}`}
                >
                  <Settings size={16} strokeWidth={1.8} />
                </button>
              </div>

              {/* Bottom safe-area spacer */}
              <div className="h-4" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;