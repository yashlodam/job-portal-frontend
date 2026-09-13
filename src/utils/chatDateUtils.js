/**
 * src/utils/chatDateUtils.js
 *
 * Professional Date & Time formatting for Chat Messages & Conversations.
 * Correctly normalizes UTC server timestamps (with or without 'Z' suffix) to the user's local timezone.
 */

/**
 * Safely parses any date representation into a valid Date instance in the local timezone.
 * Handles:
 * - ISO strings with 'Z' (e.g. "2026-09-13T16:51:01.680Z")
 * - ISO strings without 'Z' from UTC server (e.g. "2026-09-13T16:51:01.680835582") -> converted as UTC
 * - Number timestamps (epoch ms)
 * - Date instances
 */
export function parseChatDate(val) {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === "number") {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  let s = String(val).trim();
  if (!s) return null;

  // Trim sub-millisecond nanoseconds down to 3 digits (.SSS) for cross-browser WebKit/Safari/Firefox stability
  s = s.replace(/(\.\d{3})\d+/, "$1");

  // If there's no timezone suffix (no Z, no +/-HH:mm), treat as UTC since server runs in UTC
  if (!s.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(s)) {
    s += "Z";
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date(val) : d;
}

/**
 * Formats time for a message bubble.
 * Always returns the exact local time: e.g. "10:21 PM" or "9:05 AM".
 */
export function formatBubbleTime(val) {
  const d = parseChatDate(val);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

/**
 * Formats timestamp for the sidebar conversation list preview.
 * - Today: "10:21 PM"
 * - Yesterday: "Yesterday"
 * - Within last 6 days: Day name, e.g. "Fri"
 * - Older: "Sep 12" (or "Sep 12, 2025" if different year)
 */
export function formatConvListTime(val) {
  const d = parseChatDate(val);
  if (!d) return "";
  const now = new Date();

  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays >= 0 && diffDays < 6) {
    return d.toLocaleDateString([], { weekday: "short" });
  }

  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/**
 * Returns a human-friendly date divider string for grouping messages in chat stream.
 * - "Today"
 * - "Yesterday"
 * - "Sunday, September 13, 2026"
 */
export function getDateDividerLabel(val) {
  const d = parseChatDate(val);
  if (!d) return "";
  const now = new Date();

  if (d.toDateString() === now.toDateString()) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

/**
 * Returns a full tooltip string with exact date and time.
 * E.g. "September 13, 2026 at 10:21 PM"
 */
export function formatFullDateTime(val) {
  const d = parseChatDate(val);
  if (!d) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a "last seen" timestamp for participant headers.
 * - "today at 10:21 PM"
 * - "yesterday at 4:15 PM"
 * - "Sep 10 at 2:00 PM"
 */
export function formatLastSeen(val) {
  const d = parseChatDate(val);
  if (!d) return "";
  const now = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

  if (d.toDateString() === now.toDateString()) {
    return `today at ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `yesterday at ${timeStr}`;
  }

  const dateStr = d.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${dateStr} at ${timeStr}`;
}
