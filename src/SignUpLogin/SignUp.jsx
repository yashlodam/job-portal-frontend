import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Checkbox } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { User, Mail, Lock, ArrowRight, CheckCircle2, CircleAlert, Sparkles, Building2, UserCheck } from "lucide-react";
import { useAppDispatch } from "../State/Store";
import { signup } from "../State/AuthSlic";

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

function SignUp({ setIsLogin }) {
  const dispatch = useAppDispatch();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "APPLICANT",
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

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!accepted) {
      newErrors.terms = "You must agree to Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword: _, ...payload } = formData;
      await dispatch(signup(payload)).unwrap();

      const isEmployer = formData.accountType === "EMPLOYER" || formData.accountType === "RECRUITER";

      notifications.show({
        title: "Account created successfully.",
        message: isEmployer
          ? "Please verify your email address. Your recruiter account will be ready for verification review."
          : "Please verify your email address. You can now sign in with your credentials.",
        color: "indigo",
        radius: "md",
        autoClose: 4000,
        icon: <CheckCircle2 size={18} />,
      });

      setTimeout(() => {
        setIsLogin(true);
      }, 1400);
    } catch (error) {
      notifications.show({
        title: "Registration Failed",
        message: error?.response?.data?.errorMessage || error?.message || "Unable to create account. Please try again.",
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
          <Sparkles className="h-3 w-3" /> Create Your JobPortal AI Account
        </div>
        <h1 className="font-satoshi text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Join JobPortal AI Today
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Discover opportunities or hire top talent using AI matching.
        </p>
      </div>

      {/* Account Type Selector Cards */}
      <div className="mt-5 space-y-1.5">
        <label className="block text-xs font-semibold text-slate-200">I am joining as a:</label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleChange("accountType", "APPLICANT")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs font-bold transition-all cursor-pointer border ${
              formData.accountType === "APPLICANT"
                ? "border-indigo-500/60 bg-gradient-to-r from-indigo-600/30 to-violet-600/30 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            <UserCheck className={`h-4 w-4 shrink-0 ${formData.accountType === "APPLICANT" ? "text-indigo-400" : ""}`} />
            <span className="truncate">Job Seeker</span>
          </button>

          <button
            type="button"
            onClick={() => handleChange("accountType", "EMPLOYER")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs font-bold transition-all cursor-pointer border ${
              formData.accountType === "EMPLOYER"
                ? "border-indigo-500/60 bg-gradient-to-r from-indigo-600/30 to-violet-600/30 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            <Building2 className={`h-4 w-4 shrink-0 ${formData.accountType === "EMPLOYER" ? "text-indigo-400" : ""}`} />
            <span className="truncate">Employer</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="mt-5 space-y-3.5">
        <TextInput
          label="Full name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g. Alex Rivera"
          leftSection={<User size={16} className="text-slate-400" />}
          size="md"
          styles={fieldStyles}
          error={errors.name}
        />

        <TextInput
          label="Email address"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="name@company.com"
          leftSection={<Mail size={16} className="text-slate-400" />}
          size="md"
          styles={fieldStyles}
          error={errors.email}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Min 6 characters"
            leftSection={<Lock size={16} className="text-slate-400" />}
            size="md"
            styles={fieldStyles}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Re-enter password"
            leftSection={<Lock size={16} className="text-slate-400" />}
            size="md"
            styles={fieldStyles}
            error={errors.confirmPassword}
          />
        </div>

        <div className="pt-1">
          <Checkbox
            radius="sm"
            color="indigo"
            checked={accepted}
            onChange={(e) => setAccepted(e.currentTarget.checked)}
            label={
              <span className="text-xs text-slate-400">
                I agree to the <span className="text-indigo-400 font-semibold">Terms of Service</span> and{" "}
                <span className="text-indigo-400 font-semibold">Privacy Policy</span>
              </span>
            }
          />
          {errors.terms && <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.terms}</p>}
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
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Footer Switcher */}
      <p className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default SignUp;