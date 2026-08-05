/**
 * src/components/recruiter/layout/RecruiterNavbar.jsx
 *
 * Top Navbar for Recruiter Dashboard with Search, Notification Bell, and Profile controls.
 */

import React from "react";
import { Link } from "react-router-dom";
import { Menu, PlusCircle, Sparkles } from "lucide-react";
import NotificationBell from "../../../features/notifications/components/NotificationBell";
import ProfileMenu from "../../../Header/ProfileMenu";
import { useAppSelector } from "../../../State/Store";

export default function RecruiterNavbar({ onOpenMobileSidebar }) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#070b12]/80 px-4 sm:px-6 backdrop-blur-2xl">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-4">
        {/* Post Job Quick CTA */}
        <Link
          to="/upload-job"
          className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Job</span>
        </Link>

        {/* Role Badge */}
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-indigo-400">
          <Sparkles className="h-3 w-3" /> Recruiter
        </span>

        {/* Notification Bell Integration */}
        <NotificationBell />

        {/* Profile Menu */}
        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
}
