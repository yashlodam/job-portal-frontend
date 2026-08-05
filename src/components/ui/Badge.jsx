/**
 * src/components/ui/Badge.jsx & StatusChip.jsx
 * Enterprise badge and status indicator components.
 */
import React from "react";

export function Badge({ children, variant = "default", size = "sm", className = "", icon: Icon }) {
  const variants = {
    default: "bg-white/10 text-white/80 border-white/15",
    primary: "bg-primary/15 text-primary-light border-primary/30",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
}

export function StatusChip({ status }) {
  const statusMap = {
    ACTIVE: { label: "Active", variant: "success", dot: "bg-emerald-400" },
    FEATURED: { label: "Featured", variant: "primary", dot: "bg-indigo-400" },
    DRAFT: { label: "Draft", variant: "warning", dot: "bg-amber-400" },
    CLOSED: { label: "Closed", variant: "danger", dot: "bg-rose-400" },
    APPLIED: { label: "Applied", variant: "default", dot: "bg-slate-400" },
    SHORTLISTED: { label: "Shortlisted", variant: "primary", dot: "bg-indigo-400" },
    INTERVIEW: { label: "Interview", variant: "purple", dot: "bg-purple-400" },
    OFFER: { label: "Offer Sent", variant: "cyan", dot: "bg-cyan-400" },
    HIRED: { label: "Hired", variant: "success", dot: "bg-emerald-400" },
    REJECTED: { label: "Rejected", variant: "danger", dot: "bg-rose-400" },
  };

  const config = statusMap[status?.toUpperCase()] || {
    label: status || "Unknown",
    variant: "default",
    dot: "bg-slate-400",
  };

  return (
    <Badge variant={config.variant} size="xs">
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
