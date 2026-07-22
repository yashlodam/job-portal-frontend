import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Avatar, Button, Indicator } from "@mantine/core";
import { Sparkles, Bell, Settings, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProfileMenu from "./ProfileMenu";
import { useSelector } from "react-redux";

/* ────────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { name: "Find Jobs", url: "/find-jobs" },
  { name: "Find Talent", url: "/find-talent" },
  { name: "Post Job", url: "/upload-job" },
  { name: "Posted Job", url: "/posted-job" },
  { name: "Job History", url: "/auth" },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080F]";

const BRAND_GRADIENT = "linear-gradient(135deg, #6366F1, #8B5CF6)";

/* ────────────────────────────────────────────────────────────
   Framer Motion variants
   ──────────────────────────────────────────────────────────── */
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
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, delay: i * 0.05, ease: "easeOut" },
  }),
  exit: { opacity: 0, x: -6, transition: { duration: 0.12 } },
};

/* ────────────────────────────────────────────────────────────
   Small, reusable icon-button used for both the desktop and
   mobile rows. Pulling this out removes the duplicated markup
   that existed between the two "Settings" buttons.
   ──────────────────────────────────────────────────────────── */
const IconButton = memo(function IconButton({
  icon: Icon,
  label,
  onClick,
  hoverRotate = 0,
  className = "",
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06, rotate: hoverRotate }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
      aria-label={label}
      onClick={onClick}
      className={`rounded-xl p-2.5 text-[#708090] transition-colors duration-200 hover:bg-[#161B22] hover:text-[#F1F5F9] ${FOCUS_RING} ${className}`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </motion.button>
  );
});

/* ────────────────────────────────────────────────────────────
   Header
   ──────────────────────────────────────────────────────────── */
function Header() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const toggleBtnRef = useRef(null);

  /* Close menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Scroll detection for the header's translucent/blur state */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // set initial state on mount instead of assuming top-of-page
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close on outside click — scoped to the mobile nav panel + toggle
     button only, not the whole header, so clicking a desktop link
     or the logo doesn't get misread as "inside the menu". */
  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (e) => {
      const clickedInsideNav = mobileNavRef.current?.contains(e.target);
      const clickedToggle = toggleBtnRef.current?.contains(e.target);
      if (!clickedInsideNav && !clickedToggle) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  /* Escape key closes the menu and returns focus to the toggle button */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        toggleBtnRef.current?.focus();
      }
    },
    [mobileOpen]
  );

  /* Lock body scroll while the mobile menu is open, restoring
     whatever value was there before (rather than assuming ""). */
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, handleKeyDown]);

  const handleBellClick = useCallback(() => {
    navigate("/notifications");
  }, [navigate]);

  const handleSettingsClick = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const displayName = user?.name ?? "Guest";
  const displayRole = user?.role ?? "Sign in to see your role";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header
      ref={headerRef}
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
            style={{ background: BRAND_GRADIENT }}
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
          className="hidden  items-center justify-center gap-8 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1.5 backdrop-blur-xl md:flex lg:gap-12"
        >
          {NAV_LINKS.map((item) => {
            const active = location.pathname === item.url;

            return (
              <Link
                key={item.url}
                to={item.url}
                aria-current={active ? "page" : undefined}
                className={`
                  group relative flex h-10 items-center justify-center
                  whitespace-nowrap rounded-xl px-3.5 text-sm font-medium
                  transition-colors duration-300 lg:px-4
                  ${FOCUS_RING}
                  ${active ? "text-white" : "text-[#94A3B8] hover:text-[#F1F5F9]"}
                `}
              >
                {/* Active background */}
                {active && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-xl border border-white/[0.07] bg-[#161B22] shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Hover background */}
                <span className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Label */}
                <span
                  className={`relative z-10 transition-all duration-300 ${
                    active ? "font-semibold text-white" : "group-hover:text-white"
                  }`}
                >
                  {item.name}
                </span>

                {/* Active gradient indicator */}
                <span
                  className={`absolute bottom-1 left-1/2 z-10 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-300 ${
                    active
                      ? "w-5 opacity-100"
                      : "w-0 opacity-0 group-hover:w-3 group-hover:opacity-50"
                  }`}
                />

                {/* Active glow */}
                {active && (
                  <span
                    className="pointer-events-none absolute -bottom-2 left-1/2 h-4 w-12 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-xl"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Column 3: Right section */}
        <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 lg:gap-1.5">
          {/* Avatar / login — md = icon only, lg = chip with name */}
          <div
            className={`hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/10 md:flex`}
          >
            {user ? (
              <ProfileMenu />
            ) : (
              <Link to="/auth" className={`rounded-xl ${FOCUS_RING}`}>
                <Button
                  radius="xl"
                  size="md"
                  variant="filled"
                  className="transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02]"
                  styles={{
                    root: {
                      height: 42,
                      paddingInline: 26,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background:
                        "linear-gradient(135deg,#6366F1 0%,#7C3AED 55%,#8B5CF6 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      boxShadow:
                        "0 10px 28px rgba(99,102,241,.35), inset 0 1px 0 rgba(255,255,255,.12)",
                      transition: "box-shadow .3s cubic-bezier(.4,0,.2,1)",
                    },
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Divider — lg only */}
          <div
            className="mx-1 hidden h-5 w-px lg:block"
            style={{ background: "rgba(148,163,184,0.10)" }}
          />

          {/* Notification bell */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Notifications (1 unread)"
            onClick={handleBellClick}
            className={`relative rounded-xl p-2.5 text-[#708090] transition-colors duration-200 hover:bg-[#161B22] hover:text-[#F1F5F9] ${FOCUS_RING}`}
          >
            <Indicator color="var(--color-primary)" size={7} offset={3} processing>
              <Bell size={18} strokeWidth={1.8} />
            </Indicator>
          </motion.button>

          {/* Settings (desktop) */}
          <IconButton
            icon={Settings}
            label="Settings"
            onClick={handleSettingsClick}
            hoverRotate={45}
            className="hidden sm:block"
          />

          {/* Mobile menu toggle */}
          <motion.button
            ref={toggleBtnRef}
            type="button"
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
            ref={mobileNavRef}
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
              {NAV_LINKS.map((item, i) => {
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
                          style={{ background: BRAND_GRADIENT }}
                        />
                      )}
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile user row — now reflects real auth state instead of a hardcoded user */}
              <Link
                to={user ? "/profile" : "/auth"}
                className={`mt-3 flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors duration-200 hover:bg-[#161B22] ${FOCUS_RING}`}
                style={{
                  borderColor: "rgba(148,163,184,0.08)",
                  background: "rgba(22,27,34,0.60)",
                }}
              >
                <Avatar src={user?.avatarUrl} radius="xl" size={32}>
                  {initials}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#F1F5F9]">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-[#708090]">{displayRole}</p>
                </div>
                <button
                  type="button"
                  aria-label="Settings"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSettingsClick();
                  }}
                  className={`shrink-0 rounded-lg p-2 text-[#708090] transition-colors duration-200 hover:bg-[#0D1117] hover:text-[#F1F5F9] active:scale-90 ${FOCUS_RING}`}
                >
                  <Settings size={16} strokeWidth={1.8} />
                </button>
              </Link>

              {/* Bottom safe-area spacer */}
              <div className="h-4" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default memo(Header);