/**
 * src/features/notifications/components/NotificationBell.jsx
 *
 * Navbar Bell component with live unread badge, wiggle animation on unread,
 * and smart polling integration.
 */

import React from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { toggleDropdown } from "../slices/notificationSlice";
import { useUnreadCount } from "../hooks/useUnreadCount";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.notification.dropdownOpen);

  // Hook handles smart polling (every 30s) and visibility sync
  const { count, hasUnread } = useUnreadCount(30000);

  const displayCount = count > 99 ? "99+" : count;

  return (
    <div className="relative inline-block">
      {/* CSS Wiggle Keyframes style */}
      <style>{`
        @keyframes bell-wiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(4deg); }
        }
        .animate-bell-wiggle {
          animation: bell-wiggle 1.8s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>

      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => dispatch(toggleDropdown())}
        aria-label={`Notifications, ${count} unread`}
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20"
        }`}
      >
        <Bell
          className={`h-5 w-5 transition-transform ${
            hasUnread && !isOpen ? "animate-bell-wiggle text-indigo-400" : ""
          }`}
        />

        {/* Unread Badge */}
        {hasUnread && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={count}
            className="absolute -top-1 -right-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 px-1 text-[10px] font-extrabold text-white shadow-[0_0_10px_rgba(244,63,94,0.6)] ring-2 ring-[#06080f]"
          >
            {displayCount}
          </motion.span>
        )}
      </button>

      {/* Floating Dropdown Panel */}
      <NotificationDropdown />
    </div>
  );
}
