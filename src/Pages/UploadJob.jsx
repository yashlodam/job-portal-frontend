import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  FileText,
  DollarSign,
  Eye,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  X,
  Plus,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Pencil,
  Building2,
  Clock,
  Tag,
  Heart,
  Shield,
  Home,
  BookOpen,
  TrendingUp,
  Laptop,
  AlertCircle,
} from "lucide-react";

/* ===========================
    Step Configuration
=========================== */

const steps = [
  { id: 1, title: "Job Details", icon: Briefcase },
  { id: 2, title: "Description", icon: FileText },
  { id: 3, title: "Compensation", icon: DollarSign },
  { id: 4, title: "Preview", icon: Eye },
];

const categoryOptions = [
  "IT & Software",
  "Marketing",
  "Sales",
  "Finance",
  "Healthcare",
  "Design",
  "Cyber Security",
  "Education",
  "Data Science",
  "Product Management",
];

const experienceOptions = ["Entry Level", "Mid Level", "Senior Level", "Lead / Principal", "Executive"];

const benefitOptions = [
  { id: "health", label: "Health Insurance", icon: Heart },
  { id: "401k", label: "401(k) Match", icon: Shield },
  { id: "remote", label: "Remote Work", icon: Home },
  { id: "pto", label: "Unlimited PTO", icon: Calendar },
  { id: "stock", label: "Stock Options", icon: TrendingUp },
  { id: "learning", label: "Learning Budget", icon: BookOpen },
];

const MIN_DESCRIPTION_LENGTH = 40;
const MIN_REQUIREMENTS_LENGTH = 20;

/* ===========================
    Shared bits
=========================== */

function ErrorMessage({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
      <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ===========================
    Input Components
=========================== */

function InputField({ label, required, id, error, ...props }) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-heading">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
        className={`w-full h-11 rounded-xl border bg-surface-elevated px-4 text-heading placeholder:text-muted outline-none transition-colors focus:ring-2 ${
          error
            ? "border-danger/60 focus:border-danger/60 focus:ring-danger/10"
            : "border-border focus:border-primary/40 focus:ring-primary/10"
        }`}
      />
      <ErrorMessage id={errorId}>{error}</ErrorMessage>
    </div>
  );
}

function SelectField({ label, required, options, id, error, ...props }) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${selectId}-error`;
  return (
    <div>
      <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-heading">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
          className={`w-full h-11 appearance-none rounded-xl border bg-surface-elevated px-4 pr-10 text-heading outline-none transition-colors focus:ring-2 ${
            error
              ? "border-danger/60 focus:border-danger/60 focus:ring-danger/10"
              : "border-border focus:border-primary/40 focus:ring-primary/10"
          }`}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronRight
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted"
          aria-hidden="true"
        />
      </div>
      <ErrorMessage id={errorId}>{error}</ErrorMessage>
    </div>
  );
}

function TextareaField({ label, required, id, error, hint, ...props }) {
  const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={textareaId} className="block text-sm font-medium text-heading">
          {label}
          {required && <span className="ml-1 text-danger">*</span>}
        </label>
        {typeof props.value === "string" && hint && (
          <span className="text-xs text-muted">{hint}</span>
        )}
      </div>
      <textarea
        id={textareaId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
        className={`w-full rounded-xl border bg-surface-elevated px-4 py-3 text-heading placeholder:text-muted outline-none transition-colors focus:ring-2 min-h-[120px] resize-y ${
          error
            ? "border-danger/60 focus:border-danger/60 focus:ring-danger/10"
            : "border-border focus:border-primary/40 focus:ring-primary/10"
        }`}
      />
      <ErrorMessage id={errorId}>{error}</ErrorMessage>
    </div>
  );
}

function RadioGroup({ label, required, options, value, onChange, icons, error }) {
  const groupId = `group-${label?.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${groupId}-error`;
  return (
    <div role="group" aria-labelledby={`${groupId}-label`} aria-describedby={error ? errorId : undefined}>
      <label id={`${groupId}-label`} className="mb-3 block text-sm font-medium text-heading">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <div className={`flex flex-wrap gap-3 rounded-xl ${error ? "ring-1 ring-danger/40 p-2 -m-2" : ""}`}>
        {options.map((opt, i) => {
          const Icon = icons?.[i];
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={value === opt}
              aria-label={`Select ${opt}`}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                value === opt
                  ? "border-primary/50 bg-primary/10 text-primary-light shadow-glow-primary"
                  : "border-border bg-surface text-body hover:border-border-hover hover:text-heading"
              }`}
            >
              {Icon && <Icon size={16} aria-hidden="true" />}
              {opt}
            </button>
          );
        })}
      </div>
      <ErrorMessage id={errorId}>{error}</ErrorMessage>
    </div>
  );
}

/* ===========================
    Step Components
=========================== */

function StepJobDetails({ form, setForm, errors, clearError }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-heading font-satoshi">
          Job Details
        </h2>
        <p className="mt-1 text-sm text-body">
          Start with the basics about the position you're hiring for.
        </p>
      </div>

      <InputField
        label="Job Title"
        required
        placeholder="e.g. Senior Frontend Developer"
        value={form.title}
        error={errors.title}
        onChange={(e) => {
          setForm({ ...form, title: e.target.value });
          clearError("title");
        }}
      />
      <InputField
        label="Company"
        required
        placeholder="e.g. Microsoft"
        value={form.company}
        error={errors.company}
        onChange={(e) => {
          setForm({ ...form, company: e.target.value });
          clearError("company");
        }}
      />

      <SelectField
        label="Category"
        required
        options={categoryOptions}
        value={form.category}
        error={errors.category}
        onChange={(e) => {
          setForm({ ...form, category: e.target.value });
          clearError("category");
        }}
      />

      <RadioGroup
        label="Work Mode"
        required
        options={["Remote", "Hybrid", "On-site"]}
        icons={[Home, Building2, Laptop]}
        value={form.workMode}
        error={errors.workMode}
        onChange={(v) => {
          setForm({ ...form, workMode: v });
          clearError("workMode");
        }}
      />

      <InputField
        label="Location"
        required
        placeholder="e.g. San Francisco, CA"
        value={form.location}
        error={errors.location}
        onChange={(e) => {
          setForm({ ...form, location: e.target.value });
          clearError("location");
        }}
      />

      <RadioGroup
        label="Job Type"
        required
        options={["Full Time", "Part Time", "Contract", "Internship"]}
        icons={[Briefcase, Clock, FileText, BookOpen]}
        value={form.jobType}
        error={errors.jobType}
        onChange={(v) => {
          setForm({ ...form, jobType: v });
          clearError("jobType");
        }}
      />
    </motion.div>
  );
}

function StepDescription({ form, setForm, errors, clearError }) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (form.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setForm({ ...form, skills: [...form.skills, trimmed] });
    setSkillInput("");
    clearError("skills");
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-heading font-satoshi">
          Description & Requirements
        </h2>
        <p className="mt-1 text-sm text-body">
          Help candidates understand what makes this role special.
        </p>
      </div>

      <TextareaField
        label="Job Description"
        required
        placeholder="Describe the role, responsibilities, and what a typical day looks like…"
        value={form.description}
        error={errors.description}
        hint={`${form.description.length} characters (min ${MIN_DESCRIPTION_LENGTH})`}
        onChange={(e) => {
          setForm({ ...form, description: e.target.value });
          clearError("description");
        }}
      />

      <TextareaField
        label="Requirements"
        required
        placeholder="List qualifications, certifications, or experience needed…"
        value={form.requirements}
        error={errors.requirements}
        hint={`${form.requirements.length} characters (min ${MIN_REQUIREMENTS_LENGTH})`}
        onChange={(e) => {
          setForm({ ...form, requirements: e.target.value });
          clearError("requirements");
        }}
      />

      {/* Skills Tag Input */}
      <div>
        <label htmlFor="input-skills" className="mb-2 block text-sm font-medium text-heading">
          Skills <span className="ml-1 text-danger">*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="input-skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Type a skill and press Enter"
            aria-invalid={!!errors.skills}
            aria-describedby={errors.skills ? "input-skills-error" : undefined}
            className={`min-w-0 flex-1 h-11 rounded-xl border bg-surface-elevated px-4 text-heading placeholder:text-muted outline-none transition-colors focus:ring-2 ${
              errors.skills
                ? "border-danger/60 focus:border-danger/60 focus:ring-danger/10"
                : "border-border focus:border-primary/40 focus:ring-primary/10"
            }`}
          />
          <button
            type="button"
            onClick={addSkill}
            aria-label="Add skill"
            className="flex shrink-0 items-center gap-1 h-11 rounded-xl border border-primary/30 bg-primary/10 px-4 text-sm font-medium text-primary-light transition-colors hover:bg-primary/20"
          >
            <Plus size={16} aria-hidden="true" />
            Add
          </button>
        </div>
        {form.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill} skill`}
                  className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <ErrorMessage id="input-skills-error">{errors.skills}</ErrorMessage>
      </div>

      <SelectField
        label="Experience Level"
        required
        options={experienceOptions}
        value={form.experienceLevel}
        error={errors.experienceLevel}
        onChange={(e) => {
          setForm({ ...form, experienceLevel: e.target.value });
          clearError("experienceLevel");
        }}
      />
    </motion.div>
  );
}

function StepCompensation({ form, setForm, errors, clearError }) {
  const toggleBenefit = (id) => {
    setForm({
      ...form,
      benefits: form.benefits.includes(id)
        ? form.benefits.filter((b) => b !== id)
        : [...form.benefits, id],
    });
    clearError("benefits");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-heading font-satoshi">
          Compensation & Benefits
        </h2>
        <p className="mt-1 text-sm text-body">
          Competitive packages attract top talent. Be transparent about what you
          offer.
        </p>
      </div>

      {/* Salary Range */}
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          label="Minimum Salary ($)"
          required
          placeholder="e.g. 120000"
          type="number"
          min="0"
          value={form.salaryMin}
          error={errors.salaryMin}
          onChange={(e) => {
            setForm({ ...form, salaryMin: e.target.value });
            clearError("salaryMin");
            clearError("salaryMax");
          }}
        />
        <InputField
          label="Maximum Salary ($)"
          required
          placeholder="e.g. 180000"
          type="number"
          min="0"
          value={form.salaryMax}
          error={errors.salaryMax}
          onChange={(e) => {
            setForm({ ...form, salaryMax: e.target.value });
            clearError("salaryMax");
          }}
        />
      </div>

      {/* Benefits */}
      <div>
        <label id="benefits-label" className="mb-3 block text-sm font-medium text-heading">
          Benefits <span className="ml-1 text-danger">*</span>
        </label>
        <div
          role="group"
          aria-labelledby="benefits-label"
          aria-describedby={errors.benefits ? "benefits-error" : undefined}
          className={`grid grid-cols-1 gap-3 rounded-xl sm:grid-cols-2 md:grid-cols-3 ${
            errors.benefits ? "ring-1 ring-danger/40 p-2 -m-2" : ""
          }`}
        >
          {benefitOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleBenefit(id)}
              aria-pressed={form.benefits.includes(id)}
              aria-label={`Toggle ${label} benefit`}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all duration-200 ${
                form.benefits.includes(id)
                  ? "border-primary/50 bg-primary/10 text-primary-light shadow-glow-primary"
                  : "border-border bg-surface text-body hover:border-border-hover hover:text-heading"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <ErrorMessage id="benefits-error">{errors.benefits}</ErrorMessage>
      </div>

      {/* Application Deadline */}
      <div>
        <label htmlFor="input-deadline" className="mb-2 block text-sm font-medium text-heading">
          Application Deadline <span className="ml-1 text-danger">*</span>
        </label>
        <div className="relative max-w-xs">
          <input
            id="input-deadline"
            type="date"
            value={form.deadline}
            min={new Date().toISOString().split("T")[0]}
            aria-invalid={!!errors.deadline}
            aria-describedby={errors.deadline ? "input-deadline-error" : undefined}
            onChange={(e) => {
              setForm({ ...form, deadline: e.target.value });
              clearError("deadline");
            }}
            className={`w-full h-11 rounded-xl border bg-surface-elevated px-4 text-heading outline-none transition-colors focus:ring-2 ${
              errors.deadline
                ? "border-danger/60 focus:border-danger/60 focus:ring-danger/10"
                : "border-border focus:border-primary/40 focus:ring-primary/10"
            }`}
          />
        </div>
        <ErrorMessage id="input-deadline-error">{errors.deadline}</ErrorMessage>
      </div>
    </motion.div>
  );
}

function StepPreview({ form, onEdit }) {
  const benefitLabels = {
    health: "Health Insurance",
    "401k": "401(k) Match",
    remote: "Remote Work",
    pto: "Unlimited PTO",
    stock: "Stock Options",
    learning: "Learning Budget",
  };

  const salaryDisplay =
    form.salaryMin && form.salaryMax
      ? `$${Number(form.salaryMin).toLocaleString()} – $${Number(form.salaryMax).toLocaleString()}`
      : form.salaryMin
        ? `From $${Number(form.salaryMin).toLocaleString()}`
        : form.salaryMax
          ? `Up to $${Number(form.salaryMax).toLocaleString()}`
          : "Not specified";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-heading font-satoshi">
            Preview & Publish
          </h2>
          <p className="mt-1 text-sm text-body">
            Review your job posting before publishing.
          </p>
        </div>
        <button
          onClick={() => onEdit(1)}
          aria-label="Edit job posting"
          className="inline-flex items-center gap-2 rounded-xl border border-border h-11 px-4 text-sm font-medium text-body transition-colors hover:border-primary/30 hover:text-heading"
        >
          <Pencil size={14} aria-hidden="true" />
          Edit
        </button>
      </div>

      {/* Preview Card */}
      <div className="rounded-[20px] border border-border bg-surface p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet text-xl font-bold text-white">
            {form.title?.[0]?.toUpperCase() || "J"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-heading font-satoshi">
              {form.title || "Untitled Position"}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-body">
              {form.category && (
                <span className="flex items-center gap-1">
                  <Tag size={14} className="text-primary-light" />
                  {form.category}
                </span>
              )}
              {form.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-primary-light" />
                  {form.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          {form.workMode && (
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light">
              {form.workMode}
            </span>
          )}
          {form.jobType && (
            <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              {form.jobType}
            </span>
          )}
          {form.experienceLevel && (
            <span className="rounded-full border border-violet/20 bg-violet/10 px-3 py-1 text-xs font-semibold text-violet-light">
              {form.experienceLevel}
            </span>
          )}
        </div>

        {/* Salary */}
        <div className="mt-5 rounded-xl border border-border bg-surface-elevated p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Salary Range
          </p>
          <p className="mt-1 text-lg font-bold text-heading font-satoshi">
            {salaryDisplay}
          </p>
        </div>

        {/* Description */}
        {form.description && (
          <div className="mt-5">
            <h4 className="text-sm font-bold text-heading">Description</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-body">
              {form.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {form.requirements && (
          <div className="mt-5">
            <h4 className="text-sm font-bold text-heading">Requirements</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-body">
              {form.requirements}
            </p>
          </div>
        )}

        {/* Skills */}
        {form.skills.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-bold text-heading">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold text-body"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {form.benefits.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-bold text-heading">Benefits</h4>
            <div className="flex flex-wrap gap-2">
              {form.benefits.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success-light"
                >
                  {benefitLabels[b] || b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deadline */}
        {form.deadline && (
          <div className="mt-5 flex items-center gap-2 text-sm text-body">
            <Calendar size={14} className="text-muted" />
            Deadline:{" "}
            <span className="font-medium text-heading">
              {new Date(form.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ===========================
    Success State
=========================== */

function SuccessState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      className="flex flex-col items-center py-16 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Confetti-like dots */}
      <div className="relative mb-8">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.6],
              x: Math.cos((i * 30 * Math.PI) / 180) * (60 + Math.random() * 40),
              y: Math.sin((i * 30 * Math.PI) / 180) * (60 + Math.random() * 40),
            }}
            transition={{
              duration: 1,
              delay: 0.2 + i * 0.05,
              ease: "easeOut",
            }}
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
            style={{
              background: ["#6366F1", "#8B5CF6", "#06B6D4", "#F59E0B", "#10B981", "#EC4899"][i % 6],
            }}
          />
        ))}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
          className="relative flex h-24 w-24 items-center justify-center rounded-full gradient-bg-signature shadow-lg"
        >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Check size={40} className="text-white" strokeWidth={3} aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-extrabold text-heading font-satoshi"
      >
        Job Published! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mx-auto mt-3 max-w-md text-body"
      >
        Your job posting is now live and visible to thousands of talented
        professionals. We'll notify you when candidates apply.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <button
          onClick={onReset}
          aria-label="Post another job"
          className="inline-flex items-center gap-2 gradient-bg-signature rounded-xl h-11 sm:h-12 px-8 text-sm font-semibold text-white shadow-button transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Post Another Job
          <Plus size={16} aria-hidden="true" />
        </button>
        <button
          aria-label="View dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-border h-11 sm:h-12 px-8 text-sm font-semibold text-heading transition-colors hover:border-primary/30 hover:bg-surface-elevated"
        >
          View Dashboard
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ===========================
    Main Page
=========================== */

const initialForm = {
  title: "",
  category: "",
  workMode: "",
  location: "",
  jobType: "",
  company:"",
  description: "",
  requirements: "",
  skills: [],
  experienceLevel: "",
  salaryMin: "",
  salaryMax: "",
  benefits: [],
  deadline: "",
};

/** Field order per step, used to focus the first invalid field after a failed validation. */
const FIELD_ORDER = {
  1: ["title", "category", "workMode", "location", "jobType"],
  2: ["description", "requirements", "skills", "experienceLevel"],
  3: ["salaryMin", "salaryMax", "benefits", "deadline"],
};

/** Maps a field key to the DOM id of the element that should receive focus. */
const FIELD_FOCUS_ID = {
  title: "input-job-title",
  category: "select-category",
  location: "input-location",
  description: "textarea-job-description",
  requirements: "textarea-requirements",
  skills: "input-skills",
  experienceLevel: "select-experience-level",
  salaryMin: "input-minimum-salary-($)",
  salaryMax: "input-maximum-salary-($)",
  deadline: "input-deadline",
};

function validateStep(step, form) {
  const errors = {};

  if (step === 1) {
    if (!form.title.trim()) errors.title = "Job title is required.";
    if(!form.company) errors.company = "Company Name is required"
    if (!form.category) errors.category = "Please select a category.";
    if (!form.workMode) errors.workMode = "Please select a work mode.";
    if (!form.location.trim()) errors.location = "Location is required.";
    if (!form.jobType) errors.jobType = "Please select a job type.";
  }

  if (step === 2) {
    if (!form.description.trim()) {
      errors.description = "Job description is required.";
    } else if (form.description.trim().length < MIN_DESCRIPTION_LENGTH) {
      errors.description = `Description should be at least ${MIN_DESCRIPTION_LENGTH} characters.`;
    }

    if (!form.requirements.trim()) {
      errors.requirements = "Requirements are required.";
    } else if (form.requirements.trim().length < MIN_REQUIREMENTS_LENGTH) {
      errors.requirements = `Requirements should be at least ${MIN_REQUIREMENTS_LENGTH} characters.`;
    }

    if (form.skills.length === 0) errors.skills = "Add at least one skill.";
    if (!form.experienceLevel) errors.experienceLevel = "Please select an experience level.";
  }

  if (step === 3) {
    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);

    if (!form.salaryMin) {
      errors.salaryMin = "Minimum salary is required.";
    } else if (min <= 0) {
      errors.salaryMin = "Enter a salary greater than 0.";
    }

    if (!form.salaryMax) {
      errors.salaryMax = "Maximum salary is required.";
    } else if (max <= 0) {
      errors.salaryMax = "Enter a salary greater than 0.";
    } else if (form.salaryMin && min > max) {
      errors.salaryMax = "Maximum salary must be greater than or equal to the minimum.";
    }

    if (form.benefits.length === 0) errors.benefits = "Select at least one benefit.";

    if (!form.deadline) {
      errors.deadline = "Application deadline is required.";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (form.deadline < today) {
        errors.deadline = "Deadline can't be in the past.";
      }
    }
  }

  return errors;
}

function UploadJob() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [published, setPublished] = useState(false);
  const stepCardRef = useRef(null);

  const clearError = useCallback((key) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const focusFirstError = (stepErrors, step) => {
    const order = FIELD_ORDER[step] || [];
    const firstKey = order.find((key) => stepErrors[key]);
    const focusId = firstKey && FIELD_FOCUS_ID[firstKey];
    if (focusId) {
      // Wait a tick so the field has re-rendered with its error state first.
      requestAnimationFrame(() => {
        document.getElementById(focusId)?.focus();
      });
    }
  };

  const goNext = () => {
    const stepErrors = validateStep(currentStep, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      focusFirstError(stepErrors, currentStep);
      return;
    }
    setErrors({});
    setCurrentStep((step) => Math.min(step + 1, 4));
  };

  const goBack = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const goToStep = (step) => {
    setErrors({});
    setCurrentStep(step);
  };

  const handlePublish = () => {
    // Defensive re-check of every step in case something upstream mutated the form.
    for (let step = 1; step <= 3; step++) {
      const stepErrors = validateStep(step, form);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setCurrentStep(step);
        focusFirstError(stepErrors, step);
        return;
      }
    }
    setPublished(true);
  };

  const handleReset = useCallback(() => {
    setForm(initialForm);
    setErrors({});
    setCurrentStep(1);
    setPublished(false);
  }, []);

  if (published) {
    return (
      <section className="relative min-h-screen overflow-x-hidden">
        {/* Glows */}
        <div className="pointer-events-none absolute -top-20 left-1/3 h-[500px] w-[500px] rounded-full" style={{ background: 'rgba(16,185,129,0.08)', filter: 'blur(180px)' }} />
        <div className="pointer-events-none absolute bottom-20 right-1/4 h-[400px] w-[400px] rounded-full" style={{ background: 'rgba(99,102,241,0.07)', filter: 'blur(160px)' }} />
        <div className="relative z-10 section-container pt-10 pb-16 sm:pt-14 sm:pb-20">
          <div className="mx-auto max-w-2xl">
            <SuccessState onReset={handleReset} />
          </div>
        </div>
      </section>
    );
  }

  const stepHasErrors = Object.keys(errors).length > 0;

  return (
    <section className="relative min-h-screen overflow-x-hidden">
      {/* ── Background Glows ── */}
      <div className="pointer-events-none absolute -top-20 right-1/4 h-[500px] w-[500px] rounded-full" style={{ background: 'rgba(99,102,241,0.07)', filter: 'blur(180px)' }} />
      <div className="pointer-events-none absolute bottom-40 left-0 h-[400px] w-[400px] rounded-full" style={{ background: 'rgba(139,92,246,0.05)', filter: 'blur(160px)' }} />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-[350px] w-[350px] rounded-full" style={{ background: 'rgba(6,182,212,0.04)', filter: 'blur(140px)' }} />

      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 section-container pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          {/* ── Header Badge ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-2">
              <span className="h-px w-6 bg-primary/40" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">
                Post a Job
              </span>
              <span className="h-px w-6 bg-primary/40" />
            </div>
            <h1 className="mt-5 text-3xl font-extrabold text-heading font-satoshi sm:text-4xl">
              Create a new <span className="gradient-text">job posting</span>
            </h1>
            <p className="mt-3 text-body">
              Reach thousands of talented professionals in minutes.
            </p>
          </motion.div>

          {/* ══════════════════════════════════════════
              STEP PROGRESS INDICATOR
          ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 mb-10"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, i) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const Icon = step.icon;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step circle */}
                    <button
                      onClick={() => isCompleted && goToStep(step.id)}
                      aria-label={`Step ${step.id}: ${step.title}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
                      aria-current={isActive ? "step" : undefined}
                      className={`group relative flex flex-col items-center ${
                        isCompleted ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div
                        className={`relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                          isCompleted
                            ? "border-primary bg-primary text-white shadow-button"
                            : isActive
                              ? "border-primary bg-primary/20 text-primary-light shadow-glow-primary"
                              : "border-border bg-surface text-muted"
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <Icon size={18} />
                        )}
                      </div>
                      <span
                        className={`mt-2 hidden text-xs font-medium sm:block ${
                          isActive
                            ? "text-primary-light"
                            : isCompleted
                              ? "text-heading"
                              : "text-muted"
                        }`}
                      >
                        {step.title}
                      </span>
                    </button>

                    {/* Connecting line */}
                    {i < steps.length - 1 && (
                      <div className="relative mx-2 h-0.5 flex-1 sm:mx-4">
                        <div className="absolute inset-0 rounded-full bg-border" />
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{
                            width: currentStep > step.id ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-violet"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════
              STEP CONTENT
          ══════════════════════════════════════════ */}
          <motion.div
            ref={stepCardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={
              stepHasErrors
                ? { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
                : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.5, delay: stepHasErrors ? 0 : 0.25 }}
            className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <StepJobDetails
                  key="step1"
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  clearError={clearError}
                />
              )}
              {currentStep === 2 && (
                <StepDescription
                  key="step2"
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  clearError={clearError}
                />
              )}
              {currentStep === 3 && (
                <StepCompensation
                  key="step3"
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  clearError={clearError}
                />
              )}
              {currentStep === 4 && (
                <StepPreview key="step4" form={form} onEdit={goToStep} />
              )}
            </AnimatePresence>
          </motion.div>

          {/* ══════════════════════════════════════════
              NAVIGATION BUTTONS
          ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 flex items-center justify-between"
          >
            {/* Left */}
            <div>
              {currentStep > 1 && (
                <button
                  onClick={goBack}
                  aria-label="Go to previous step"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface h-11 sm:h-12 px-6 text-sm font-semibold text-heading transition-colors hover:border-primary/30 hover:bg-surface-elevated"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Back
                </button>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button
                aria-label="Save draft"
                className="hidden items-center gap-2 rounded-xl border border-border bg-surface text-heading h-11 sm:h-12 px-8 text-sm font-semibold transition-colors hover:border-primary/30 hover:bg-surface-elevated sm:inline-flex"
              >
                <Save size={16} aria-hidden="true" />
                Save Draft
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={goNext}
                  aria-label="Continue to next step"
                  className="inline-flex items-center gap-2 gradient-bg-signature rounded-xl h-11 sm:h-12 px-8 text-sm font-semibold text-white shadow-button transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  aria-label="Publish job posting"
                  className="inline-flex items-center gap-2 gradient-bg-signature rounded-xl h-11 sm:h-12 px-8 text-sm font-semibold text-white shadow-button transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Publish Job
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default UploadJob;