import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * SectionBadge — consistent label pill above every section heading.
 *
 * @param {string} children    - The badge text
 * @param {string} [className] - Extra classes on the wrapper
 */
function SectionBadge({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${className}`}
      style={{
        borderColor: "rgba(99,102,241,0.22)",
        background: "rgba(99,102,241,0.09)",
      }}
    >
      <Sparkles
        size={12}
        aria-hidden="true"
        style={{ color: "#818CF8", flexShrink: 0 }}
      />
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#818CF8" }}
      >
        {children}
      </span>
    </motion.div>
  );
}

export default SectionBadge;
