/**
 * src/components/ui/ToastNotification.jsx
 * Enterprise dark-themed glassmorphic Toast notification system.
 * Renders Success, Error, Warning, and Info toasts with smooth slide animations.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const formatMessage = (msg) => {
    if (!msg || typeof msg !== "string") return "An unexpected event occurred.";
    if (msg.toLowerCase().includes("gemini") || msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("unavailable")) {
      return "AI service is currently busy or under maintenance. Please try again in a few moments.";
    }
    if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate")) {
      return "AI daily quota limit reached. Please try again shortly.";
    }
    return msg;
  };

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const cleanMsg = formatMessage(message);
    setToasts((prev) => [...prev, { id, message: cleanMsg, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    warning: (msg, duration) => addToast(msg, "warning", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none font-satoshi px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start justify-between gap-3 text-xs sm:text-sm font-bold ${
                t.type === "success"
                  ? "bg-[#090d16]/95 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : t.type === "error"
                  ? "bg-[#090d16]/95 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                  : t.type === "warning"
                  ? "bg-[#090d16]/95 border-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-[#090d16]/95 border-indigo-500/30 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {t.type === "success" && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
                {t.type === "error" && <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
                {t.type === "warning" && <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />}
                {t.type === "info" && <Info size={18} className="text-indigo-400 shrink-0 mt-0.5" />}
                <div className="space-y-0.5">
                  <p className="leading-snug">{t.message}</p>
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside ToastProvider
    return {
      success: (msg) => console.log("[Toast Success]", msg),
      error: (msg) => console.error("[Toast Error]", msg),
      warning: (msg) => console.warn("[Toast Warning]", msg),
      info: (msg) => console.info("[Toast Info]", msg),
    };
  }
  return context;
};
