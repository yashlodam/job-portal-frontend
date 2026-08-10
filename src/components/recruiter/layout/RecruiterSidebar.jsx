/**
 * src/components/recruiter/layout/RecruiterSidebar.jsx
 *
 * Enterprise Recruiter Sidebar supporting:
 * - Expandable/Collapsible sidebar for desktop
 * - Mobile overlay drawer
 * - Active route highlighting
 * - Badge counts for pending applications & interviews
 */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  Building2,
  BarChart3,
  Settings,
  Bell,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  X,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { logout } from "../../../State/AuthSlic";
import { getUnreadCountApi } from "../../../api/chatApi";
import { useState, useEffect } from "react";

export const RECRUITER_NAV_ITEMS = [
  { name: "Dashboard", url: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Manage Jobs", url: "/recruiter/jobs", icon: Briefcase, badge: "Live" },
  { name: "Applications", url: "/recruiter/applications", icon: Users },
  { name: "Interviews", url: "/recruiter/interviews", icon: Calendar },
  { name: "Candidates", url: "/recruiter/candidates", icon: UserCheck },
  { name: "Messages", url: "/recruiter/messages", icon: MessageSquare, isMessages: true },
  { name: "Company", url: "/recruiter/company", icon: Building2 },
  { name: "Analytics", url: "/recruiter/analytics", icon: BarChart3 },
  { name: "Settings", url: "/recruiter/settings", icon: Settings },
];

export default function RecruiterSidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.profile);
  const [msgUnread, setMsgUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = () => getUnreadCountApi().then(setMsgUnread).catch(() => {});
    fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, [user]);

  const isLinkActive = (path) => {
    if (path === "/recruiter/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      {/* Top Header / Logo */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-white/10 px-2">
          <Link to="/recruiter/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-black text-white font-satoshi tracking-tight">
                  JobPortal <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Recruiter Studio</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Post Job Quick CTA */}
        {!collapsed && (
          <div className="mt-4 px-1">
            <Link
              to="/upload-job"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        )}

        <nav className="mt-6 space-y-1">
          {RECRUITER_NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.url);
            const Icon = item.icon;
            const badgeNum = item.isMessages ? msgUnread : 0;

            return (
              <Link
                key={item.name}
                to={item.url}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={`group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-indigo-500/15 text-white border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="relative shrink-0">
                  <Icon className={`h-4 w-4 transition-colors ${active ? "text-indigo-400" : "text-white/50 group-hover:text-white"}`} />
                  {badgeNum > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
                      {badgeNum > 9 ? "9+" : badgeNum}
                    </span>
                  )}
                </div>

                {!collapsed && <span className="truncate">{item.name}</span>}

                {!collapsed && item.badge && !item.isMessages && (
                  <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}

                {!collapsed && item.isMessages && badgeNum > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-extrabold text-rose-300 border border-rose-500/30">
                    {badgeNum}
                  </span>
                )}

                {active && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Recruiter Workspace & Logout Footer */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        {!collapsed && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow">
                {(user?.companyName || user?.name || "R").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-white font-satoshi">
                  {user?.companyName || user?.name || "Recruiter Studio"}
                </p>
                <p className="truncate text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Recruiter
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            dispatch(logout());
            navigate("/login");
          }}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 transition cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Fixed Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/10 bg-[#070b12]/95 backdrop-blur-2xl transition-all duration-300 z-40 fixed top-0 left-0 h-screen ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 h-full border-r border-white/10 bg-[#070b12] z-10"
            >
              {SidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
