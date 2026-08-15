/**
 * src/components/recruiter/layout/RecruiterNavbar.jsx
 *
 * Top Navbar for Recruiter Dashboard with dynamic verification status,
 * Messages, Notification Bell, and Profile controls.
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, PlusCircle, Sparkles, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import NotificationBell from "../../../features/notifications/components/NotificationBell";
import ProfileMenu from "../../../Header/ProfileMenu";
import { useAppSelector } from "../../../State/Store";
import { getUnreadCountApi } from "../../../api/chatApi";

export default function RecruiterNavbar({ onOpenMobileSidebar }) {
  const user = useAppSelector((state) => state.auth.profile);
  const { recruiterVerification } = useAppSelector((state) => state.verification);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const verificationStatus = (
    recruiterVerification?.status ||
    recruiterVerification?.data?.status ||
    user?.verificationStatus ||
    user?.status ||
    "PENDING_VERIFICATION"
  ).toUpperCase();

  const isApproved = verificationStatus === "APPROVED" || verificationStatus === "VERIFIED";

  useEffect(() => {
    if (!user || !isApproved) return;
    const fetchUnread = () => {
      getUnreadCountApi().then(setUnreadCount).catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user, isApproved]);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#070b12]/80 px-4 sm:px-6 backdrop-blur-2xl">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-4">
        {/* Post Job Quick CTA */}
        <Link
          to={isApproved ? "/upload-job" : "/recruiter/verification"}
          className={`hidden lg:flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all ${
            isApproved
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/20 hover:scale-105"
              : "bg-white/10 hover:bg-white/15 text-slate-300"
          }`}
        >
          {isApproved ? <PlusCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-amber-400" />}
          <span>{isApproved ? "Post Job" : "Verification Required"}</span>
        </Link>

        {/* Verification / Role Badge */}
        {isApproved ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Verified Recruiter
          </span>
        ) : (
          <Link
            to="/recruiter/verification"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
          >
            <Clock className="h-3 w-3 animate-pulse" /> Pending Review
          </Link>
        )}

        {/* Messages Quick Icon Button (for approved recruiters) */}
        {isApproved && (
          <button
            type="button"
            onClick={() => navigate("/recruiter/messages")}
            title="Candidate Messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <MessageSquare size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-lg animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Notification Bell Integration */}
        <NotificationBell />

        {/* Profile Menu */}
        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
}
