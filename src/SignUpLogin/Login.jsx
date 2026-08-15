import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Checkbox } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Mail, Lock, ArrowRight, CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../State/Store";
import { getUserProfile, signin } from "../State/AuthSlic";

const fieldStyles = {
  label: { color: "#F1F5F9", fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.15)",
    color: "#FFFFFF",
    borderRadius: 12,
    "&:focus, &:focusWithin": {
      borderColor: "#6366F1 !important",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    "&::placeholder": {
      color: "#94A3B8 !important",
      opacity: "1 !important",
    },
  },
  innerInput: {
    color: "#FFFFFF",
    "&::placeholder": {
      color: "#94A3B8 !important",
      opacity: "1 !important",
    },
  },
};

function Login({ setIsLogin }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();

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

      const isAdmin =
        profile?.accountType === "ADMIN" ||
        profile?.role === "ADMIN" ||
        (Array.isArray(profile?.roles) && profile?.roles.includes("ADMIN"));

      const isEmployer =
        profile?.accountType === "EMPLOYER" ||
        profile?.role === "EMPLOYER" ||
        profile?.accountType === "RECRUITER" ||
        profile?.role === "RECRUITER";

      const origin = location.state?.from?.pathname;

      if (isAdmin) {
        navigate(origin && origin.startsWith("/admin") ? origin : "/admin/dashboard", { replace: true });
      } else if (isEmployer) {
        navigate(origin && origin.startsWith("/recruiter") ? origin : "/recruiter/dashboard", { replace: true });
      } else {
        navigate(origin && !origin.startsWith("/login") && !origin.startsWith("/signup") && !origin.startsWith("/auth") ? origin : "/", { replace: true });
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

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-bold text-indigo-400 mb-3">
          <Sparkles className="h-3 w-3" /> JobPortal AI Account Sign In
        </div>
        <h1 className="font-satoshi text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Sign in to access your jobs, applications, and AI career tools.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextInput
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          leftSection={<Mail size={16} className="text-slate-400" />}
          styles={fieldStyles}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          leftSection={<Lock size={16} className="text-slate-400" />}
          styles={fieldStyles}
          required
        />

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          radius="xl"
          size="md"
          loading={loading}
          loaderProps={{ type: "dots" }}
          disabled={loading}
          rightSection={!loading && <ArrowRight size={16} />}
          className="!bg-gradient-to-r !from-indigo-600 !to-violet-600 hover:!from-indigo-500 hover:!to-violet-500 !text-white !font-bold !shadow-lg !shadow-indigo-500/25 transition-all mt-2 cursor-pointer"
        >
          {loading ? "Signing In..." : "Sign In to JobPortal AI"}
        </Button>
      </form>

      {/* Footer Switcher */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          Create account
        </button>
      </p>
    </div>
  );
}

export default Login;