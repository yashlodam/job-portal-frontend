/**
 * src/components/ui/Modal.jsx & Drawer.jsx
 * Master 3D Glassmorphic Modal & Drawer system.
 */
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${sizes[size]} max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/15 dark:bg-[#090d16]/95 dark:text-slate-200 backdrop-blur-2xl p-6 sm:p-7 z-10 overflow-hidden font-inter`}
          >
            {title && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-satoshi tracking-tight">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Drawer({ isOpen, onClose, title, children, position = "right" }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const slideVariants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          <motion.div
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative ml-auto h-full w-full max-w-xl flex flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/15 dark:bg-[#090d16]/95 dark:text-slate-200 backdrop-blur-2xl p-6 sm:p-7 z-10 overflow-hidden font-inter`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-satoshi tracking-tight">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
