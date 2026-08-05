/**
 * src/features/notifications/components/NotificationCard.jsx
 *
 * Rich notification item card supporting priority borders, unread states,
 * deep-linking, hover actions, and bulk selection.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  Archive,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import NotificationTypeIcon from "./NotificationTypeIcon";
import { useNotificationActions } from "../hooks/useNotificationActions";

dayjs.extend(relativeTime);

/**
 * Formats ISO date to relative timestamp ("2m ago", "Yesterday", "Aug 1")
 */
function formatTimestamp(dateStr) {
  if (!dateStr) return "";
  const date = dayjs(dateStr);
  const now = dayjs();

  if (now.diff(date, "hour") < 24) {
    return date.fromNow();
  }
  if (now.diff(date, "day") < 7) {
    return date.format("ddd, h:mm A");
  }
  return date.format("MMM D, YYYY");
}

export default function NotificationCard({
  notification,
  onCloseDropdown,
  selectable = false,
  isSelected = false,
  onToggleSelect,
}) {
  const navigate = useNavigate();
  const { markAsRead, archiveNotification, deleteNotification } = useNotificationActions();

  const {
    id,
    type,
    priority,
    title,
    message,
    actionUrl,
    image,
    read,
    archived,
    createdAt,
  } = notification;

  // Priority border accent
  const priorityBorderClass = {
    CRITICAL: "border-l-4 border-l-rose-500",
    HIGH: "border-l-4 border-l-amber-500",
    MEDIUM: "border-l-4 border-l-indigo-500/50",
    LOW: "border-l-4 border-l-transparent",
  }[priority] || "border-l-4 border-l-transparent";

  // Card click handler
  const handleClick = (e) => {
    // Don't trigger navigation if clicking action buttons or checkbox
    if (e.target.closest("button") || e.target.closest("input")) return;

    if (!read) {
      markAsRead(id);
    }

    if (actionUrl) {
      // Check if external or internal
      if (actionUrl.startsWith("http://") || actionUrl.startsWith("https://")) {
        window.open(actionUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(actionUrl);
      }
    }

    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      onClick={handleClick}
      className={`group relative flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${priorityBorderClass} ${
        !read
          ? "bg-indigo-500/[0.07] border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.06)] hover:bg-indigo-500/[0.12]"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
      }`}
    >
      {/* Checkbox for bulk actions */}
      {selectable && (
        <div className="flex h-9 items-center justify-center pr-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect?.(id)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/40 cursor-pointer"
          />
        </div>
      )}

      {/* Type Icon / Avatar */}
      <NotificationTypeIcon type={type} image={image} />

      {/* Main Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                !read ? "text-white font-satoshi" : "text-white/80"
              }`}
            >
              {title}
            </h4>

            {/* Critical Priority Badge */}
            {priority === "CRITICAL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/20">
                <ShieldAlert className="h-3 w-3" /> Critical
              </span>
            )}
          </div>

          <span className="shrink-0 text-[11px] font-medium text-white/40">
            {formatTimestamp(createdAt)}
          </span>
        </div>

        {/* Message preview */}
        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
          {message}
        </p>

        {/* Action Chip / Deep Link */}
        {actionUrl && (
          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            <span>View details</span>
            <ExternalLink className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Right side status / hover controls */}
      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
        {/* Unread indicator dot */}
        {!read && (
          <span
            aria-label="Unread notification"
            className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"
          />
        )}

        {/* Per-item Hover Actions */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          {!read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(id);
              }}
              title="Mark as read"
              aria-label="Mark as read"
              className="p-1.5 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}

          {!archived && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                archiveNotification(id);
              }}
              title="Archive notification"
              aria-label="Archive notification"
              className="p-1.5 text-white/60 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
            >
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(id);
            }}
            title="Delete notification"
            aria-label="Delete notification"
            className="p-1.5 text-white/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
