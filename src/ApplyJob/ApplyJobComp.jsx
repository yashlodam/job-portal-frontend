import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@mantine/notifications";
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
  IconAlertTriangle,
  IconArrowRight,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { applyToJobThunk } from "../State/applicationThunk";
import { getJobById } from "../State/JobSlice";
import { fetchMyProfileThunk, fetchProfileByEmailThunk } from "../State/profileThunk";
import { fetchMyResumesThunk } from "../State/resumeThunk";

/* ─── Helpers ─── */
function humanise(str) {
  if (!str) return "";
  return String(str)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatINR(val) {
  if (!val) return "";
  if (typeof val === "number") return `₹${val.toLocaleString("en-IN")}`;
  return val;
}

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
            <p className="text-sm font-semibold text-heading truncate">{file.name || file.resumeName || "Attached Resume"}</p>
            <p className="text-xs text-muted">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Resume Document"}</p>
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

/* ─── Profile Incomplete Warning Banner ─── */
function ProfileIncompleteWarning({ missingItems, onProceedAnyway, onGoToProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 backdrop-blur-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
          <IconAlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white font-satoshi">Complete Your Profile First</h3>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
            Employers evaluate candidate applications with complete profiles first. Complete your profile details to maximize your callback rate:
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {missingItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-amber-100">
                <span className={item.present ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {item.present ? "✓" : "✗"}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <IconUser size={14} /> Go to Profile to Update ↗
            </button>
            <button
              onClick={onProceedAnyway}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition cursor-pointer underline"
            >
              Fill Details Manually →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Success Screen ─── */
function SuccessScreen({ name, jobTitle, companyName }) {
  const navigate = useNavigate();

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
        Application Submitted Successfully!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-3 max-w-md text-body"
      >
        Congratulations, <span className="text-heading font-semibold">{name || "Applicant"}</span>! Your application for{" "}
        <span className="text-indigo-400 font-semibold">{jobTitle || "this position"}</span> at{" "}
        <span className="text-heading font-semibold">{companyName || "the company"}</span> has been sent to the recruiter.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <button
          onClick={() => navigate("/find-jobs")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-6 py-2.5 text-sm font-semibold text-heading hover:border-primary/30 hover:bg-surface-hover transition-all cursor-pointer"
        >
          Browse More Jobs
        </button>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl gradient-bg-signature px-6 py-2.5 text-sm font-semibold text-white shadow-button hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all cursor-pointer"
        >
          <IconSparkles size={15} />
          Go to Home
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════
   Main Component
══════════════════════════════ */
function ApplyJobComp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Redux Selectors
  const authUser = useAppSelector((state) => state.auth.profile);
  const userProfile = useAppSelector((state) => state.profile.profile);
  const { resumes, defaultResume } = useAppSelector((state) => state.resume);
  const { selectedJob } = useAppSelector((state) => state.job);
  const { applyLoading } = useAppSelector((state) => state.application);

  useEffect(() => {
    dispatch(fetchMyResumesThunk());
  }, [dispatch]);

  // Determine active job
  const jobIdFromQuery = searchParams.get("jobId");
  const passedJob = location.state?.job || selectedJob;
  const activeJobId = passedJob?.id || jobIdFromQuery || 1;

  useEffect(() => {
    if (!passedJob && activeJobId) {
      dispatch(getJobById(activeJobId));
    }
  }, [dispatch, passedJob, activeJobId]);

  useEffect(() => {
    if (authUser?.email && !userProfile) {
      dispatch(fetchProfileByEmailThunk(authUser.email));
    }
  }, [dispatch, authUser, userProfile]);

  const activeJob = passedJob || selectedJob || {
    id: activeJobId,
    jobTitle: "Senior React Engineer",
    companyName: "TechNova Solutions",
    companyLogo: null,
    city: "Pune",
    state: "Maharashtra",
    workingMode: "HYBRID",
    jobType: "FULL_TIME",
    minimumSalary: 1200000,
    maximumSalary: 1800000,
  };

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showProfileWarning, setShowProfileWarning] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    currentCompany: "",
    resume: null,
    coverDoc: null,
    coverLetter: "",
    yearsExp: "4–6 years",
    availability: "immediately",
    selectedResumeId: null,
    useProfileResume: true,
  });

  // Auto-fill candidate profile and pre-select default resume from Redux
  useEffect(() => {
    const fullName = authUser?.name || userProfile?.name || userProfile?.fullName || "";
    const email = authUser?.email || userProfile?.email || "";
    const phone = authUser?.phone || userProfile?.phone || userProfile?.phoneNumber || "";
    const locationVal = [userProfile?.city, userProfile?.state, userProfile?.country].filter(Boolean).join(", ") || userProfile?.location || "";
    const linkedinVal = userProfile?.linkedinUrl || userProfile?.linkedin || "";
    const githubVal = userProfile?.githubUrl || userProfile?.github || "";
    const websiteVal = userProfile?.website || userProfile?.portfolioUrl || "";

    const activeResume = defaultResume || resumes[0] || userProfile?.resume;
    const hasName = Boolean(fullName);
    const hasEmail = Boolean(email);
    const hasPhone = Boolean(phone);
    const hasResume = Boolean(activeResume?.id || activeResume?.resumeUrl || userProfile?.resumeUrl);

    if (!hasName || !hasEmail || !hasPhone || !hasResume) {
      setShowProfileWarning(true);
    }

    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || fullName,
      email: prev.email || email,
      phone: prev.phone || phone,
      location: prev.location || locationVal,
      linkedin: prev.linkedin || linkedinVal,
      github: prev.github || githubVal,
      portfolio: prev.portfolio || websiteVal,
      resume: prev.resume || activeResume || null,
      selectedResumeId: prev.selectedResumeId || activeResume?.id || null,
    }));
  }, [authUser, userProfile, defaultResume, resumes]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
    }
    if (step === 3) {
      if (!form.resume && !form.useProfileResume) e.resume = "Please attach or upload a resume";
    }
    if (step === 4) {
      if (form.coverLetter.length > 2000) e.coverLetter = "Cover letter must not exceed 2000 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitApplication = async () => {
    if (!validate()) return;

    try {
      const applicationData = {
        coverLetter: form.coverLetter ? form.coverLetter.substring(0, 2000) : "",
        resumeId: form.selectedResumeId || null,
      };

      await dispatch(applyToJobThunk({ jobId: activeJob.id, applicationData })).unwrap();
      setSubmitted(true);
    } catch (err) {
      notifications.show({
        title: "Submission Error",
        message: err || "Failed to submit application. Please try again.",
        color: "red",
      });
    }
  };

  const goNext = () => {
    if (!validate()) return;
    if (step < STEPS.length) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      handleSubmitApplication();
    }
  };

  const goBack = () => {
    setDir(-1);
    setStep((s) => s - 1);
    setErrors({});
  };

  if (submitted) {
    return (
      <SuccessScreen
        name={form.fullName}
        jobTitle={activeJob.jobTitle || activeJob.title}
        companyName={activeJob.companyName || activeJob.company}
      />
    );
  }

  const missingItems = [
    { label: "Full Name", present: Boolean(form.fullName) },
    { label: "Email Address", present: Boolean(form.email) },
    { label: "Phone Number", present: Boolean(form.phone) },
    { label: "Saved Resume", present: Boolean(userProfile?.resume?.resumeUrl || userProfile?.resumeUrl) },
  ];

  const logoSrc = activeJob?.companyLogo
    ? activeJob.companyLogo.startsWith("http")
      ? activeJob.companyLogo
      : `http://localhost:8080/uploads/company/${activeJob.companyLogo}`
    : null;

  return (
    <div className="w-full">
      {/* Profile Warning */}
      {showProfileWarning && (
        <ProfileIncompleteWarning
          missingItems={missingItems}
          onProceedAnyway={() => setShowProfileWarning(false)}
          onGoToProfile={() => navigate("/profiles")}
        />
      )}

      {/* ── Dynamic Job Header Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-xl font-satoshi">
            {logoSrc ? (
              <img src={logoSrc} alt={activeJob.companyName} className="h-full w-full object-contain rounded-2xl" />
            ) : (
              (activeJob.companyName || activeJob.company || "V").charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-light font-satoshi">
              {activeJob.companyName || activeJob.company}
            </p>
            <h2 className="mt-0.5 text-xl sm:text-2xl font-black text-heading font-satoshi leading-tight">
              {activeJob.jobTitle || activeJob.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1 text-xs text-muted font-medium">
                <IconMapPin size={13} className="text-primary-light" />
                {[activeJob.city, activeJob.state].filter(Boolean).join(", ") || activeJob.location || "Remote"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted font-medium">
                <IconBriefcase size={13} className="text-violet" />
                {humanise(activeJob.jobType || activeJob.type || "FULL_TIME")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-indigo-300 font-bold">
                {formatINR(activeJob.minimumSalary)} - {formatINR(activeJob.maximumSalary)}
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 overflow-hidden shadow-2xl">
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
                  <p className="text-sm text-muted mt-1">Review or update your contact details for this application.</p>
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
                  <p className="text-sm text-muted mt-1">Share your professional portfolio & profiles.</p>
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
              </motion.div>
            )}

            {/* ─── Step 3: Documents & Resume ─── */}
            {step === 3 && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-xl font-bold text-heading font-satoshi">Upload Documents</h2>
                  <p className="text-sm text-muted mt-1">Attach your resume or use your default profile resume.</p>
                </motion.div>

                {/* Default Resume Toggle option if profile has resume */}
                {userProfile?.resume && (
                  <motion.div variants={fadeUp} className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                        <IconFileText size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Default Profile Resume Attached</p>
                        <p className="text-[11px] text-indigo-200/70">{userProfile.resume.resumeName || "Resume.pdf"}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <IconCheck size={12} /> Active
                    </span>
                  </motion.div>
                )}

                <motion.div variants={fadeUp}>
                  <label className="text-sm font-medium text-heading mb-2 block">
                    Upload Custom Resume <span className="text-muted text-xs font-normal">(Optional if default attached)</span>
                  </label>
                  <FileDropZone
                    label="Drop custom resume here or click to browse"
                    hint="PDF, DOC or DOCX — max 5 MB"
                    accept=".pdf,.doc,.docx"
                    file={form.resume}
                    onFile={(f) => {
                      setForm((prev) => ({ ...prev, resume: f, useProfileResume: false }));
                    }}
                    onClear={() => set("resume")(null)}
                  />
                  {errors.resume && (
                    <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.resume}</p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* ─── Step 4: Cover Letter (Max 2000 Chars) ─── */}
            {step === 4 && (
              <motion.div variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <h2 className="text-xl font-bold text-heading font-satoshi">Cover Letter</h2>
                  <p className="text-sm text-muted mt-1">
                    Add an optional cover letter for the hiring manager (max 2000 characters).
                  </p>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <textarea
                    rows={8}
                    maxLength={2000}
                    value={form.coverLetter}
                    onChange={(e) => set("coverLetter")(e.target.value)}
                    placeholder={`Hi Hiring Team,\n\nI'm excited to apply for the ${activeJob.jobTitle || activeJob.title} position at ${activeJob.companyName || activeJob.company}...`}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none"
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-muted">Optional cover letter note</p>
                    <p className={`text-xs font-semibold ${form.coverLetter.length > 2000 ? "text-rose-400" : "text-muted"}`}>
                      {form.coverLetter.length} / 2000
                    </p>
                  </div>
                </motion.div>

                {/* Review summary */}
                <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-surface-elevated p-5 space-y-3">
                  <h3 className="text-sm font-bold text-heading font-satoshi">Application Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "Position", val: activeJob.jobTitle || activeJob.title },
                      { label: "Company", val: activeJob.companyName || activeJob.company },
                      { label: "Applicant", val: form.fullName || "—" },
                      { label: "Email", val: form.email || "—" },
                      { label: "Phone", val: form.phone || "—" },
                      { label: "Resume", val: form.resume?.name || userProfile?.resume?.resumeName || "Profile Default Resume" },
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

        {/* ── Navigation Buttons ── */}
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
            disabled={applyLoading}
            className="inline-flex items-center gap-2 rounded-xl gradient-bg-signature px-6 py-2.5 text-sm font-semibold text-white shadow-button hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] transition-all cursor-pointer disabled:opacity-50"
          >
            {applyLoading ? (
              <>
                <IconLoader2 size={16} className="animate-spin" /> Submitting...
              </>
            ) : step === STEPS.length ? (
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