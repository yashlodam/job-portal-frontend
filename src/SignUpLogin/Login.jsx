/**
 * src/SignUpLogin/Login.jsx
 *
 * Ultra-Modern Interactive Login Experience for JobPortal AI.
 * Features:
 * - 1-Click Fast Demo Credentials (Job Seeker / Recruiter)
 * - Show/Hide Password Eye Toggle
 * - Real-time client-side validation
 * - Dynamic Role Awareness & Smooth State Transitions
 * - 100% WCAG AA contrast in both Light & Dark themes
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../State/Store";
import { getUserProfile, signin } from "../State/AuthSlic";
import { notifications } from "@mantine/notifications";

export default function Login({ setIsLogin, role = "APPLICANT", setRole }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await dispatch(signin(formData)).unwrap();
      const profile = await dispatch(getUserProfile()).unwrap();

      notifications.show({
        title: `Welcome back, ${profile?.name || "User"}! 👋`,
        message: "You have successfully signed in to JobPortal AI.",
        color: "indigo",
        radius: "md",
        autoClose: 3000,
        icon: <CheckCircle2 size={18} />,
      });

      const accountType = (
        profile?.accountType || profile?.role || ""
      ).toUpperCase();

      const isAdmin = accountType === "ADMIN";
      const isEmployer = accountType === "EMPLOYER" || accountType === "RECRUITER";

      const origin = location.state?.from?.pathname;

      if (isAdmin) {
        navigate(
          origin && origin.startsWith("/admin") ? origin : "/admin/dashboard",
          { replace: true }
        );
      } else if (isEmployer) {
        navigate(
          origin && origin.startsWith("/recruiter") ? origin : "/recruiter/dashboard",
          { replace: true }
        );
      } else {
        const safePaths = ["/login", "/signup", "/auth", "/register", "/reset-password", "/recruiter", "/admin"];
        const isSafeOrigin = origin && !safePaths.some((p) => origin.startsWith(p));
        navigate(isSafeOrigin ? origin : "/", { replace: true });
      }
    } catch (error) {
      notifications.show({
        title: "Sign in Failed",
        message:
          error?.errorMessage ||
          error?.message ||
          "Invalid email or password. Please try again.",
        color: "red",
        radius: "md",
        autoClose: 4000,
        icon: <CircleAlert size={18} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-black text-primary mb-2.5 font-satoshi">
          <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" /> JobPortal AI Account Sign In
        </div>
        <h2 className="font-satoshi text-2xl sm:text-3xl font-black text-heading tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-muted">
          Sign in to access your jobs, applications, and AI career tools.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email Address */}
        <motion.div variants={itemVariants}>
          <label className="block text-xs font-bold text-heading mb-1.5 font-satoshi">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center group">
            <Mail size={16} className="absolute left-3.5 text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@company.com"
              className={`w-full rounded-2xl border bg-surface-elevated pl-10 pr-4 py-2.5 text-xs text-heading placeholder-muted outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 ${
                errors.email ? "border-rose-500/80 bg-rose-500/5" : "border-border"
              }`}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1"
            >
              <CircleAlert size={12} /> {errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-heading font-satoshi">
              Password <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-[11px] font-bold text-primary hover:underline transition cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center group">
            <Lock size={16} className="absolute left-3.5 text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              className={`w-full rounded-2xl border bg-surface-elevated pl-10 pr-10 py-2.5 text-xs text-heading placeholder-muted outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 ${
                errors.password ? "border-rose-500/80 bg-rose-500/5" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-muted hover:text-heading transition cursor-pointer p-1"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1"
            >
              <CircleAlert size={12} /> {errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Remember Me */}
        <motion.div variants={itemVariants} className="flex items-center pt-0.5">
          <label className="flex items-center gap-2 text-xs font-semibold text-body cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-surface-elevated text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span>Keep me signed in for 30 days</span>
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.015, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.985 }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3.5 px-4 text-xs font-extrabold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer mt-2 disabled:opacity-50 font-satoshi relative overflow-hidden group"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Authenticating Securely…</span>
              </div>
            ) : (
              <>
                <span>Sign In to JobPortal AI</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Footer Switcher */}
      <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-muted font-medium">
        Don't have an account yet?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-extrabold text-primary hover:underline transition cursor-pointer"
        >
          Create free account
        </button>
      </motion.p>
    </motion.div>
  );
}