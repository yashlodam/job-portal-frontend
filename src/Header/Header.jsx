import React, { useState } from "react";
import { Avatar, Indicator } from "@mantine/core";
import { IconAnchor, IconBell, IconSettings, IconMenu2, IconX } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";



const links = [
  { name: "Find Jobs", url: "/find-jobs" },
  { name: "Find Talent", url: "/find-talent" },
  { name: "Upload Job", url: "/upload-job" },
  { name: "About Us", url: "/about" },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262B36] bg-[#0B0D12]/80 text-white backdrop-blur-xl [font-family:'Inter',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-2.5 text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)]">
            <IconAnchor size={24} stroke={2.2} />
          </div>
          <h1 className="text-2xl tracking-wide text-white transition-colors duration-300 group-hover:text-[#7FA8F5] [font-family:'Pacifico',cursive]">
            iJobs
          </h1>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`group relative px-2 py-1 text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A45] ${
                  active ? "text-[#FF7A45]" : "text-[#C7CBD4] hover:text-[#FF7A45]"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF7A45] transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <div className="hidden cursor-pointer items-center gap-3 rounded-xl border border-transparent py-1.5 pl-2 pr-3 transition-colors duration-200 hover:border-[#262B36] hover:bg-[#14171F] sm:flex">
            <Avatar src="/avatar.jpg" radius="xl" size={40} className="ring-2 ring-[#262B36]">
              M
            </Avatar>
            <div className="hidden leading-tight lg:block">
              <p className="text-sm font-semibold text-white">Marshal</p>
              <p className="mt-0.5 text-xs text-[#8B93A7]">Software Engineer</p>
            </div>
          </div>

          <div className="mx-1 hidden h-6 w-px bg-[#262B36] lg:block" />

          <button
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-[#8B93A7] transition-colors duration-200 hover:bg-[#14171F] hover:text-[#FF9466] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A45]"
          >
            <Indicator color="#FF7A45" size={8} offset={4}>
              <IconBell size={21} stroke={1.8} />
            </Indicator>
          </button>

          <button
            aria-label="Settings"
            className="rounded-xl p-2.5 text-[#8B93A7] transition-all duration-300 hover:bg-[#14171F] hover:text-[#FF9466] hover:rotate-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A45]"
          >
            <IconSettings size={21} stroke={1.8} />
          </button>

          {/* Mobile menu toggle */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl p-2.5 text-[#8B93A7] transition-colors duration-200 hover:bg-[#14171F] hover:text-[#FF9466] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A45] md:hidden"
          >
            {mobileOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[#262B36] bg-[#0B0D12] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[#14171F] text-[#FF7A45]"
                        : "text-[#C7CBD4] hover:bg-[#14171F] hover:text-[#FF7A45]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;