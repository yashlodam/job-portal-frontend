import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconWorld,
  IconBrandLinkedin,
  IconBrandGithub,
  IconUpload,
  IconFileText,
  IconChevronRight,
  IconChevronLeft,
  IconCircleCheck,
  IconSparkles,
  IconMapPin,
  IconClock,
  IconUsers,
  IconBriefcase,
  IconX,
  IconStar,
  IconBuilding,
  IconShield,
} from "@tabler/icons-react";

/* ─── Animation Variants ─── */
const fadeSlide = {
  hidden: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir < 0 ? 60 : -60, transition: { duration: 0.3 } }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─── Steps Config ─── */
const STEPS = [
  { id: 1, label: "Personal", icon: IconUser },
  { id: 2, label: "Links", icon: IconWorld },
  { id: 3, label: "Documents", icon: IconFileText },
  { id: 4, label: "Cover Letter", icon: IconStar },
];

/* ─── Shared Field Wrapper ─── */
function Field({ label, required, error, children }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-heading">
        {label}
        {required && <span className="text-primary-light ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-danger flex items-center gap-1"
          >
            <IconX size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TextInputField({ icon: Icon, placeholder, type = "text", value, onChange, error }) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-12 rounded-xl border bg-surface-elevated text-heading placeholder:text-muted text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 hover:border-border-hover ${
          Icon ? "pl-10 pr-4" : "px-4"
        } ${error ? "border-danger/60 ring-2 ring-danger/20" : "border-border"}`}
      />
    </div>
  );
}

/* ─── File Drop Zone ─── */
function FileDropZone({ label, hint, accept, file, onFile, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed p-6 transition-all duration-300 cursor-pointer group ${
        file
          ? "border-primary/40 bg-primary/5"
          : dragging
          ? "border-primary/60 bg-primary/8 scale-[1.01]"
          : "border-border hover:border-primary/30 hover:bg-surface-elevated"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />

      {file ? (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <IconFileText size={18} className="text-primary-light" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-heading truncate">{file.name}</p>
            <p className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-hover text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <IconX size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-hover group-hover:bg-primary/10 transition-colors">
            <IconUpload size={20} className="text-muted group-hover:text-primary-light transition-colors" />
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">{label}</p>
            <p className="text-xs text-muted mt-0.5">{hint}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step Indicator ─── */
function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = step.id < current;
        const active = step.id === current;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  done
                    ? "border-primary bg-primary"
                    : active
                    ? "border-primary bg-primary/15"
                    : "border-border bg-surface-elevated"
                }`}
              >
                {done ? (
                  <IconCircleCheck size={18} className="text-white" />
                ) : (
                  <Icon size={16} className={active ? "text-primary-light" : "text-muted"} />
                )}
                {active && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-primary/40"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <span
                className={`text-xs font-semibold transition-colors ${
                  active ? "text-primary-light" : done ? "text-heading" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border" style={{ minWidth: 28 }}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Success Screen ─── */
function SuccessScreen({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-8">
        <motion.div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
          animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0.4)", "0 0 0 20px rgba(99,102,241,0)", "0 0 0 0 rgba(99,102,241,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <IconCircleCheck size={48} className="text-primary-light" />
          </motion.div>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-3xl font-extrabold text-heading font-satoshi"
      >
        Application Submitted!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-3 max-w-sm text-body"
      >
        Great work, <span className="text-heading font-semibold">{name || "there"}</span>! Your application
        has been received. The team will review it and get back to you within 5–7 business days.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <a
          href="/find-jobs"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-6 py-2.5 text-sm font-semibold text-heading hover:border-primary/30 hover:bg-surface-hover transition-all"
        >
          Browse More Jobs
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl gradient-bg-signature px-6 py-2.5 text-sm font-semibold text-white shadow-button hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all"
        >
          <IconSparkles size={15} />
          Go to Dashboard
        </a>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════
   Main Component
══════════════════════════════ */
function ApplyJobComp() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", location: "",
    linkedin: "", github: "", portfolio: "", currentCompany: "",
    resume: null, coverDoc: null,
    coverLetter: "",
    yearsExp: "", availability: "immediately",
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
   console.log(form)
  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
    }
    if (step === 3) {
      if (!form.resume) e.resume = "Please upload your resume";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    if (step < STEPS.length) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      setSubmitted(true);
    }
  };

  const goBack = () => {
    setDir(-1);
    setStep((s) => s - 1);
    setErrors({});
  };

  /* ─── Job Meta (mock) ─── */
  const job = {
    title: "Software Engineer III",
    company: "Google",
    logo: "/Companies/google.svg",
    location: "Mountain View, CA",
    type: "Full Time",
    applicants: 48,
    posted: "3 days ago",
  };

  if (submitted) return <SuccessScreen name={form.fullName} />;

  return (
    <div className="w-full">
      {/* ── Job Header Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-2xl border border-border bg-surface p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-elevated p-2">
            <img src={job.logo} alt={job.company} className="h-full w-full object-contain" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">{job.company}</p>
            <h2 className="mt-0.5 text-xl sm:text-2xl font-extrabold text-heading font-satoshi leading-tight">
              {job.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <IconMapPin size={12} className="text-primary-light" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <IconBriefcase size={12} className="text-violet" /> {job.type}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <IconClock size={12} className="text-accent-warm" /> {job.posted}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <IconUsers size={12} className="text-success" /> {job.applicants} applicants
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 self-start rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Accepting Applications
          </span>
        </div>
      </motion.div>

      {/* ── Step Progress Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mb-8 flex justify-center"
      >
        <StepBar current={step} />
      </motion.div>

      {/* ── Form Card ── */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* ─── Step 1: Personal Info ─── */}
            {step === 1 && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-xl font-bold text-heading font-satoshi">Personal Information</h2>
                  <p className="text-sm text-muted mt-1">Tell us a bit about yourself.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required error={errors.fullName}>
                    <TextInputField
                      icon={IconUser}
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={set("fullName")}
                      error={errors.fullName}
                    />
                  </Field>

                  <Field label="Email Address" required error={errors.email}>
                    <TextInputField
                      icon={IconMail}
                      placeholder="john@example.com"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      error={errors.email}
                    />
                  </Field>

                  <Field label="Phone Number" required error={errors.phone}>
                    <TextInputField
                      icon={IconPhone}
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                    />
                  </Field>

                  <Field label="Current Location">
                    <TextInputField
                      icon={IconMapPin}
                      placeholder="City, Country"
                      value={form.location}
                      onChange={set("location")}
                    />
                  </Field>
                </div>

                <Field label="Years of Experience">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["0–1 years", "2–3 years", "4–6 years", "7–10 years", "10+ years"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => set("yearsExp")(opt)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          form.yearsExp === opt
                            ? "border-primary bg-primary/15 text-primary-light"
                            : "border-border bg-surface-elevated text-muted hover:border-primary/30 hover:text-heading"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Availability">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      { val: "immediately", label: "Immediately" },
                      { val: "2weeks", label: "2 Weeks Notice" },
                      { val: "1month", label: "1 Month Notice" },
                      { val: "negotiable", label: "Negotiable" },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => set("availability")(val)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          form.availability === val
                            ? "border-primary bg-primary/15 text-primary-light"
                            : "border-border bg-surface-elevated text-muted hover:border-primary/30 hover:text-heading"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* ─── Step 2: Links & Profiles ─── */}
            {step === 2 && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-xl font-bold text-heading font-satoshi">Online Profiles</h2>
                  <p className="text-sm text-muted mt-1">Share your professional presence. All fields are optional.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="LinkedIn Profile">
                    <TextInputField
                      icon={IconBrandLinkedin}
                      placeholder="linkedin.com/in/yourname"
                      value={form.linkedin}
                      onChange={set("linkedin")}
                    />
                  </Field>

                  <Field label="GitHub Profile">
                    <TextInputField
                      icon={IconBrandGithub}
                      placeholder="github.com/yourname"
                      value={form.github}
                      onChange={set("github")}
                    />
                  </Field>

                  <Field label="Portfolio / Website">
                    <TextInputField
                      icon={IconWorld}
                      placeholder="https://yourportfolio.com"
                      value={form.portfolio}
                      onChange={set("portfolio")}
                    />
                  </Field>

                  <Field label="Current Company (Optional)">
                    <TextInputField
                      icon={IconBuilding}
                      placeholder="Company name"
                      value={form.currentCompany}
                      onChange={set("currentCompany")}
                    />
                  </Field>
                </div>

                {/* Tip box */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3"
                >
                  <IconSparkles size={18} className="text-primary-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-heading">Pro tip</p>
                    <p className="text-xs text-muted mt-0.5">
                      Candidates with a filled LinkedIn and portfolio are 3× more likely to hear back. Take 2 minutes to add them!
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ─── Step 3: Documents ─── */}
            {step === 3 && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-xl font-bold text-heading font-satoshi">Upload Documents</h2>
                  <p className="text-sm text-muted mt-1">Upload your resume and optional supporting documents.</p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="text-sm font-medium text-heading mb-2 block">
                    Resume <span className="text-primary-light">*</span>
                  </label>
                  <FileDropZone
                    label="Drop your resume here or click to browse"
                    hint="PDF, DOC or DOCX — max 5 MB"
                    accept=".pdf,.doc,.docx"
                    file={form.resume}
                    onFile={set("resume")}
                    onClear={() => set("resume")(null)}
                  />
                  <AnimatePresence>
                    {errors.resume && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-1.5 text-xs text-danger flex items-center gap-1"
                      >
                        <IconX size={11} /> {errors.resume}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="text-sm font-medium text-heading mb-2 block">
                    Cover Letter Document <span className="text-muted text-xs font-normal">(Optional)</span>
                  </label>
                  <FileDropZone
                    label="Drop your cover letter or click to browse"
                    hint="PDF, DOC or DOCX — max 5 MB"
                    accept=".pdf,.doc,.docx"
                    file={form.coverDoc}
                    onFile={set("coverDoc")}
                    onClear={() => set("coverDoc")(null)}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* ─── Step 4: Cover Letter ─── */}
            {step === 4 && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-xl font-bold text-heading font-satoshi">Cover Letter</h2>
                  <p className="text-sm text-muted mt-1">
                    Write a short note about why you're excited about this role. Keep it concise and authentic.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <textarea
                    rows={9}
                    value={form.coverLetter}
                    onChange={(e) => set("coverLetter")(e.target.value)}
                    placeholder={`Hi Hiring Team,\n\nI'm excited to apply for the ${job.title} role at ${job.company}. I believe my experience in...\n\nLooking forward to connecting,\n${form.fullName || "Your Name"}`}
                    className="textarea w-full resize-none text-sm leading-relaxed"
                    style={{ minHeight: 220 }}
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-muted">Optional — but highly recommended</p>
                    <p className={`text-xs ${form.coverLetter.length > 2000 ? "text-danger" : "text-muted"}`}>
                      {form.coverLetter.length} / 2000
                    </p>
                  </div>
                </motion.div>

                {/* Review summary */}
                <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-surface-elevated p-5 space-y-3">
                  <h3 className="text-sm font-bold text-heading">Application Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "Name", val: form.fullName || "—" },
                      { label: "Email", val: form.email || "—" },
                      { label: "Phone", val: form.phone || "—" },
                      { label: "Location", val: form.location || "—" },
                      { label: "Experience", val: form.yearsExp || "—" },
                      { label: "Availability", val: form.availability },
                      { label: "Resume", val: form.resume ? form.resume.name : "Not uploaded" },
                      { label: "Portfolio", val: form.portfolio || "—" },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className="text-muted shrink-0 w-20">{label}:</span>
                        <span className="text-heading font-medium truncate">{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6"
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-5 py-2.5 text-sm font-semibold text-heading hover:border-primary/30 hover:bg-surface-hover transition-all cursor-pointer"
            >
              <IconChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.id === step ? "w-6 bg-primary" : s.id < step ? "w-3 bg-primary/50" : "w-3 bg-border"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl gradient-bg-signature px-6 py-2.5 text-sm font-semibold text-white shadow-button hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all cursor-pointer"
          >
            {step === STEPS.length ? (
              <>
                <IconSparkles size={15} /> Submit Application
              </>
            ) : (
              <>
                Continue <IconChevronRight size={16} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default ApplyJobComp;