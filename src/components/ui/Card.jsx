/**
 * src/components/ui/Card.jsx
 * Enterprise glassmorphism card component.
 */
import React from "react";

export function Card({ children, className = "", hover = true, glow = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-white/10 bg-[#0b0f19]/80 backdrop-blur-xl p-5 shadow-xl transition-all duration-300 ${
        hover ? "hover:border-primary/30 hover:bg-[#111726]/90 hover:shadow-2xl" : ""
      } ${glow ? "shadow-[0_0_30px_rgba(99,102,241,0.15)] border-primary/30" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`flex items-center justify-between pb-4 border-b border-white/5 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-base font-bold text-white font-satoshi ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-xs text-white/50 mt-0.5 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`pt-4 mt-4 border-t border-white/5 flex items-center justify-between ${className}`}>{children}</div>;
}
