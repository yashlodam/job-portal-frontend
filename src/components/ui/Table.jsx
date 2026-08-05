/**
 * src/components/ui/Table.jsx & Pagination.jsx
 */
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0f19]/80 backdrop-blur-xl">
      <table className={`w-full text-left text-xs text-white/70 ${className}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-[11px] font-bold text-white/50">{children}</thead>;
}

export function TableRow({ children, className = "", onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-white/5 transition-colors hover:bg-white/[0.04] ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "" }) {
  return <th className={`px-4 py-3.5 font-bold text-white/80 ${className}`}>{children}</th>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-white/5">{children}</tbody>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-3.5 ${className}`}>{children}</td>;
}

export function Pagination({ currentPage = 0, totalPages = 1, onPageChange, totalElements }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      {totalElements !== undefined && (
        <span className="text-xs text-white/50">
          Total <span className="font-semibold text-white">{totalElements}</span> items
        </span>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-white/50 mr-2">
          Page <span className="font-semibold text-white">{currentPage + 1}</span> of <span className="font-semibold text-white">{totalPages}</span>
        </span>

        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
