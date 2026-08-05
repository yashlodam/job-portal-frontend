/**
 * src/components/ui/Card.jsx
 * Master 3D Glassmorphism Card system for the entire application.
 */
import React from "react";

export function Card({ children, className = "", hover = true, glow = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-white/10 bg-[#090d16]/90 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 ${
        hover ? "hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)] hover:scale-[1.01]" : ""
      } ${glow ? "shadow-[0_0_35px_rgba(99,102,241,0.2)] border-indigo-500/40" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`flex items-center justify-between pb-4 border-b border-white/10 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-black text-white font-satoshi ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-xs text-slate-400 mt-1 font-medium ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`pt-4 mt-4 border-t border-white/10 flex items-center justify-between ${className}`}>{children}</div>;
}
