import { ActionIcon, Divider, Loader, Modal, Notification } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBriefcase,
  IconCamera,
  IconCertificate,
  IconCheck,
  IconCode,
  IconDeviceFloppy,
  IconExternalLink,
  IconGlobe,
  IconLanguage,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconBrandGithub,
  IconBrandLinkedin,
  IconSchool,
  IconTrash,
  IconX,
  IconUser,
  IconStar,
} from "@tabler/icons-react";

import { MonthPickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import dayjs from "dayjs";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


import { store, useAppDispatch, useAppSelector } from "../State/Store";

// ── Thunks ────────────────────────────────────────────────────────────────────
import {
  fetchMyProfileThunk,
  uploadProfileImageThunk,
  uploadBannerImageThunk,
  updateHeaderThunk,
  updateLinksThunk,
  updateAboutThunk,
  addSkillThunk,
  deleteSkillThunk,
  addExperienceThunk,
  updateExperienceThunk,
  deleteExperienceThunk,
  addEducationThunk,
  deleteEducationThunk,
  addCertificationThunk,
  updateCertificationThunk,
  deleteCertificationThunk,
  addLanguageThunk,
  deleteLanguageThunk,
  fetchProfileByEmailThunk,
} from "../State/profileThunk";

// ── Selectors ─────────────────────────────────────────────────────────────────
import {
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  selectProfileSuccess,
  clearProfileSuccess,
  clearProfileError,
} from "../State/profileSlice";

/* ============================================================
   Helpers
   ============================================================ */

/** Stable ID generator for optimistic new list items */
let _counter = Date.now();
const uid = () => `id_${(_counter++).toString(36)}`;

/** Revoke a blob URL safely */
const revokeBlob = (url) => {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
};

/* ============================================================
   Design tokens (inline-shared constants)
   ============================================================ */

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200";

const textareaCls = `${inputCls} resize-none leading-6`;
const labelCls =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";
const sectionHeadingCls =
  "font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl";

/* ============================================================
   Small reusable primitives (defined OUTSIDE Profile so they
   are stable references and won't re-mount on every render)
   ============================================================ */

function Field({ label, htmlFor, children, required }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="mt-3 text-sm italic text-muted/70">{text}</p>;
}

/** Confirm delete modal */
function ConfirmModal({ opened, onClose, onConfirm, title, message }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      size="sm"
      overlayProps={{ blur: 4 }}
    >
      <p className="text-sm text-body">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary btn-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="btn btn-sm rounded-xl bg-danger/90 text-white hover:bg-danger"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

/* ============================================================
   Section wrapper
   ============================================================ */

function Section({ children }) {
  return (
    <>
      <section className="relative rounded-2xl border border-white/[0.06] bg-surface/50 p-5 sm:p-6 backdrop-blur-sm">
        {children}
      </section>
    </>
  );
}

/* ============================================================
   EditButton / AddButton / DeleteButton
   ============================================================ */

function EditButton({ editing, onToggle, label, loading }) {
  return (
    <ActionIcon
      variant="light"
      radius="xl"
      size="lg"
      aria-label={editing ? `Save ${label}` : `Edit ${label}`}
      className="!bg-white/5 hover:!bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shrink-0"
      onClick={onToggle}
      loading={loading}
    >
      {editing ? (
        <IconDeviceFloppy size={20} className="text-cyan-300" />
      ) : (
        <IconPencil size={20} className="text-slate-400" />
      )}
    </ActionIcon>
  );
}

function AddButton({ onClick, label }) {
  return (
    <ActionIcon
      variant="light"
      radius="xl"
      size="lg"
      aria-label={label}
      className="!bg-white/5 hover:!bg-primary/15 border border-white/10 hover:border-primary/40 transition-all duration-300"
      onClick={onClick}
    >
      <IconPlus size={20} className="text-slate-400" />
    </ActionIcon>
  );
}

function DeleteButton({ onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="shrink-0 rounded-lg p-1 text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200"
    >
      <IconTrash size={16} />
    </button>
  );
}

/* ============================================================
   Availability / Level constants
   ============================================================ */

const AVAILABILITY_OPTIONS = [
  {
    value: "Open to Work",
    color: "bg-success/15 border-success/30 text-success-light",
  },
  {
    value: "Open to Opportunities",
    color: "bg-primary/15 border-primary/30 text-primary-light",
  },
  {
    value: "Not Looking",
    color: "bg-white/5 border-white/10 text-muted",
  },
];

const EXPERIENCE_LEVELS = [
  "Fresher",
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead / Principal",
  "Executive",
];

const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Freelance",
  "Contract",
  "Remote",
];

/* ============================================================
   Profile skeleton — shown while the first fetch is in-flight
   ============================================================ */

function ProfileSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16 animate-pulse">
      {/* Banner + Avatar */}
      <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-surface">
        <div className="h-52 sm:h-60 bg-white/[0.04]" />
        <div className="px-5 sm:px-7 pb-6 -mt-14">
          <div className="h-28 w-28 rounded-2xl bg-white/[0.08]" />
          <div className="mt-4 space-y-2">
            <div className="h-7 w-48 rounded-xl bg-white/[0.06]" />
            <div className="h-4 w-36 rounded-xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.03]"
        />
      ))}
    </div>
  );
}

/* ============================================================
   Main Profile Component
   ============================================================ */

function Profile() {
  const dispatch = useAppDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────
  const auth = useAppSelector((store)=> store.auth.profile);
  const reduxProfile = useAppSelector(selectProfile);
  const isLoading = useAppSelector(selectProfileLoading);
  const reduxError = useAppSelector(selectProfileError);
  const reduxSuccess = useAppSelector(selectProfileSuccess);

  // ── Local UI state — mirrors the backend data while editing ──────────────
  // Initialised from Redux; reset whenever Redux profile changes (e.g. after save).
  const [data, setData] = useState(null);

  // Section edit mode flags
  const [editHeader, setEditHeader] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [editExp, setEditExp] = useState(false);
  const [editEdu, setEditEdu] = useState(false);
  const [editCert, setEditCert] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  const [editMisc, setEditMisc] = useState(false);

  // Per-section saving spinners (separate from the global loading flag)
  const [savingSection, setSavingSection] = useState("");

  // Skill / Language input drafts
  const [skillDraft, setSkillDraft] = useState("");
  const [langDraft, setLangDraft] = useState("");

  // Confirm-delete modal
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm }

  // Image refs & blob tracking
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const prevBannerRef = useRef(null);
  const prevAvatarRef = useRef(null);

  // ── Fetch profile on mount ───────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProfileByEmailThunk(auth.email));
  }, [dispatch]);

  // ── Hydrate local state when Redux profile arrives/changes ───────────────
  useEffect(() => {
    console.log("reduxProfile:", reduxProfile);
    if (!reduxProfile) return;

    setData({
      id: reduxProfile.id,
      name: reduxProfile.name ?? "",
      role: reduxProfile.role ?? "",
      company: reduxProfile.company ?? "",
      location: reduxProfile.location ?? "",
      about: reduxProfile.about ?? reduxProfile.about?.about ?? "",
      availability: reduxProfile.availability ?? "Open to Work",
      experienceLevel: reduxProfile.experienceLevel ?? "Mid Level",
      profileImage: reduxProfile.profileImage ?? null,
      bannerImage: reduxProfile.bannerImage ?? null,

      // Normalise arrays — add _id for stable React keys during editing
      skills: Array.isArray(reduxProfile.skills) ? reduxProfile.skills : [],

      experience: (reduxProfile.experiences ?? reduxProfile.experience ?? []).map((e) => ({
        ...e,
        _id: e.id ? `id_${e.id}` : uid(),
      })),

      education: (reduxProfile.educations ?? reduxProfile.education ?? []).map((e) => ({
        ...e,
        _id: e.id ? `id_${e.id}` : uid(),
      })),

      certifications: (reduxProfile.certifications ?? []).map((c) => ({
        ...c,
        _id: c.id ? `id_${c.id}` : uid(),
      })),

      languages: Array.isArray(reduxProfile.languages) ? reduxProfile.languages : [],

      socialLinks: {
  linkedin:
    reduxProfile.linkedinUrl ??
    reduxProfile.links?.linkedinUrl ??
    "",

  github:
    reduxProfile.githubUrl ??
    reduxProfile.links?.githubUrl ??
    "",

  portfolio:
    reduxProfile.portfolioUrl ??
    reduxProfile.links?.portfolioUrl ??
    "",
},
    });

    // Sync image refs
    prevBannerRef.current = reduxProfile.bannerImage ?? null;
    prevAvatarRef.current = reduxProfile.profileImage ?? null;
  }, [reduxProfile]);

  // ── Toast on Redux success ────────────────────────────────────────────────
  useEffect(() => {
    if (!reduxSuccess) return;
    notifications.show({
      title: "Saved successfully",
      message: "Your profile has been updated.",
      color: "teal",
      autoClose: 2500,
    });
    dispatch(clearProfileSuccess());
  }, [reduxSuccess, dispatch]);

  // ── Toast on Redux error ──────────────────────────────────────────────────
  useEffect(() => {
    if (!reduxError) return;
    notifications.show({
      title: "Something went wrong",
      message: reduxError,
      color: "red",
      autoClose: 4000,
    });
    dispatch(clearProfileError());
  }, [reduxError, dispatch]);

  // ── Cleanup blob URLs on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      revokeBlob(prevBannerRef.current);
      revokeBlob(prevAvatarRef.current);
    };
  }, []);

  /* ── Generic local updaters ── */

  const updateField = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateListItem = useCallback((listKey, id, field, value) => {
    setData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) =>
        item._id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  /* ── Section save helpers ── */

  /**
   * Wraps a thunk dispatch with:
   * - section saving spinner
   * - auto-close the edit panel on success
   */
  const saveSection = useCallback(
    async (sectionKey, thunk, closeFn) => {
      setSavingSection(sectionKey);
      try {
        await dispatch(thunk).unwrap();
        closeFn(false);
      } catch {
        // Error already handled by the Redux error effect above
      } finally {
        setSavingSection("");
      }
    },
    [dispatch]
  );

  /* ── Image handling ── */

  const handleBannerSelect = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || !data?.id) return;

      // Optimistic preview
      revokeBlob(prevBannerRef.current);
      const url = URL.createObjectURL(file);
      prevBannerRef.current = url;
      setData((prev) => ({ ...prev, bannerImage: url }));
      e.target.value = "";

      // Upload to backend
      dispatch(uploadBannerImageThunk({ id: data.id, file }));
    },
    [data?.id, dispatch]
  );

  const handleAvatarSelect = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      console.log("handleAvatarSelect called");
      console.log("file:", file);
      console.log("data:", data);
      console.log("data.id:", data?.id);

      if (!file || !data?.id) return;

      // Optimistic preview
      revokeBlob(prevAvatarRef.current);
      const url = URL.createObjectURL(file);
      prevAvatarRef.current = url;
      setData((prev) => ({ ...prev, profileImage: url }));
      e.target.value = "";

      // Upload to backend
      console.log("image uploading ", data.id);
      dispatch(uploadProfileImageThunk({ id: data.id, file }));
    },
    [data?.id, dispatch]
  );

  /* ── Header save ── */

  const handleSaveHeader = useCallback(() => {
    if (!data?.id) return;
    saveSection(
      "header",
      updateHeaderThunk({
        id: data.id,
        data: {
          name: data.name,
          jobTitle: data.role,
          company: data.company,
          location: data.location,
          availability: data.availability,
          experienceLevel: data.experienceLevel,
        },
      }),
      setEditHeader
    );
  }, [data, saveSection]);

  /* ── About save ── */

  const handleSaveAbout = useCallback(() => {
    if (!data?.id) return;
    saveSection(
      "about",
      updateAboutThunk({ id: data.id, data: { about: data.about } }),
      setEditAbout
    );
  }, [data, saveSection]);

  /* ── Links save ── */

  const handleSaveLinks = useCallback(() => {
    if (!data?.id) return;
    saveSection(
      "links",
      updateLinksThunk({
        id: data.id,
        data: {
          linkedinUrl: data.socialLinks.linkedin,
          githubUrl: data.socialLinks.github,
          portfolioUrl: data.socialLinks.portfolio,
        },
      }),
      setEditSocial
    );
  }, [data, saveSection]);

  /* ── Skills ── */

  const addSkillLocal = useCallback(() => {
    const value = skillDraft.trim();
    if (!value) return;
    if (data.skills.some((s) => (typeof s === "string" ? s : s.skill) === value)) {
      setSkillDraft("");
      return;
    }
    setData((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillDraft("");

    // Immediately POST to backend
    if (data?.id) {
      dispatch(addSkillThunk({
  id: data.id,
  data: {
    skill: value
  }
}));
    }
  }, [skillDraft, data, dispatch]);

 const removeSkillLocal = useCallback(
  (skill) => {
    const skillName = typeof skill === "object" ? skill.skill : skill;

    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => {
        const current = typeof s === "object" ? s.skill : s;
        return current !== skillName;
      }),
    }));

    dispatch(
      deleteSkillThunk({
        profileId: data.id,
        skill: skillName,
      })
    );
  },
  [data, dispatch]
);

  const handleSaveSkills = useCallback(() => {
    setEditSkills(false);
  }, []);

  /* ── Languages ── */

  const addLanguageLocal = useCallback(() => {
    const value = langDraft.trim();
    if (!value || data.languages.includes(value)) {
      setLangDraft("");
      return;
    }
    setData((prev) => ({ ...prev, languages: [...prev.languages, value] }));
    setLangDraft("");

    if (data?.id) {
      dispatch(addLanguageThunk({ id: data.id, data: { language: value } }));
    }
  }, [langDraft, data, dispatch]);

  const removeLanguageLocal = useCallback(
    (lang) => {
      // We need the language's backend id to delete it.
      // If the backend returns objects with ids, use those; otherwise adapt.
      const langObj = typeof lang === "object" ? lang : null;
      const langId = langObj?.id ?? lang;

      setData((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) =>
          typeof l === "object" ? l.id !== langId : l !== lang
        ),
      }));

      if (data?.id) {
        dispatch(deleteLanguageThunk(langId));
      }
    },
    [data?.id, dispatch]
  );

  /* ── Experience ── */

  const addExperienceLocal = useCallback(() => {
    const newItem = {
      _id: uid(),
      role: "", company: "", startDate: "", endDate: "",
      type: "", location: "", description: "", logo: "",
      isNew: true, // flag so we know to POST vs PUT on save
    };
    setData((prev) => ({ ...prev, experience: [...prev.experience, newItem] }));
    setEditExp(true);
  }, []);

  const handleSaveExperience = useCallback(() => {
    if (!data?.id) return;

    data.experience.forEach((item) => {
      const payload = {
        title: item.title,
        company: item.company,
        startDate: item.startDate,
        endDate: item.endDate,
        type: item.type,
        location: item.location,
        description: item.description,
      };

      if (item.isNew || !item.id) {
        // New entry — POST
        dispatch(addExperienceThunk({ id: data.id, data: payload }));
      } else {
        // Existing entry — PUT
        dispatch(updateExperienceThunk({ experienceId: item.id, data: payload }));
      }
    });

    setEditExp(false);
  }, [data, dispatch]);

  const confirmRemoveExperience = useCallback(
    (localId, role, backendId) => {
      setConfirm({
        title: "Remove Experience",
        message: `Are you sure you want to remove "${role || "this role"}"?`,
        onConfirm: () => {
          setData((prev) => ({
            ...prev,
            experience: prev.experience.filter((e) => e._id !== localId),
          }));
          if (backendId) {
            dispatch(deleteExperienceThunk(backendId));
          }
        },
      });
    },
    [dispatch]
  );

  /* ── Education ── */

  const addEducationLocal = useCallback(() => {
    const newItem = {
      _id: uid(),
      degree: "", college: "", university: "",
      startYear: "", endYear: "", location: "",
      isNew: true,
    };
    setData((prev) => ({ ...prev, education: [...prev.education, newItem] }));
    setEditEdu(true);
  }, []);

  const handleSaveEducation = useCallback(() => {
    if (!data?.id) return;

    data.education.forEach((item) => {
      const payload = {
        degree: item.degree,
        college: item.college,
        university: item.university,
        startYear: item.startYear,
        endYear: item.endYear,
        location: item.location,
      };

      if (item.isNew || !item.id) {
        dispatch(addEducationThunk({ id: data.id, data: payload }));
      }
      // Note: Backend has no PUT /education; only POST + DELETE
    });

    setEditEdu(false);
  }, [data, dispatch]);

  const confirmRemoveEducation = useCallback(
    (localId, degree, backendId) => {
      setConfirm({
        title: "Remove Education",
        message: `Are you sure you want to remove "${degree || "this entry"}"?`,
        onConfirm: () => {
          setData((prev) => ({
            ...prev,
            education: prev.education.filter((e) => e._id !== localId),
          }));
          if (backendId) {
            dispatch(deleteEducationThunk(backendId));
          }
        },
      });
    },
    [dispatch]
  );

  /* ── Certifications ── */

  const addCertificationLocal = useCallback(() => {
    const newItem = {
      _id: uid(),
      title: "", issuer: "", issuedDate: "",
      credentialId: "", credentialUrl: "",
      isNew: true,
    };
    setData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newItem],
    }));
    setEditCert(true);
  }, []);

  const handleSaveCertifications = useCallback(() => {
    if (!data?.id) return;

    data.certifications.forEach((cert) => {
      const payload = {
        title: cert.title,
        issuer: cert.issuer,
        issuedDate: cert.issuedDate,
        credentialId: cert.credentialId,
        credentialUrl: cert.credentialUrl,
      };

      if (cert.isNew || !cert.id) {
        dispatch(addCertificationThunk({ id: data.id, data: payload }));
      } else {
        dispatch(
          updateCertificationThunk({ certificationId: cert.id, data: payload })
        );
      }
    });

    setEditCert(false);
  }, [data, dispatch]);

  const confirmRemoveCertification = useCallback(
    (localId, title, backendId) => {
      setConfirm({
        title: "Remove Certification",
        message: `Are you sure you want to remove "${title || "this certification"}"?`,
        onConfirm: () => {
          setData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter(
              (c) => c._id !== localId
            ),
          }));
          if (backendId) {
            dispatch(deleteCertificationThunk(backendId));
          }
        },
      });
    },
    [dispatch]
  );

  /* ── Social link helper ── */

  const updateSocialLink = useCallback((key, value) => {
    setData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  }, []);

  /* ── Availability badge colour ── */
  const availBadge =
    AVAILABILITY_OPTIONS.find((o) => o.value === data?.availability) ??
    AVAILABILITY_OPTIONS[0];

  /* ======================================================
     LOADING SKELETON
     ====================================================== */

  if (isLoading && !data) return <ProfileSkeleton />;

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted">
          Profile not found. Please try again.
        </p>
      </div>
    );
  }

  /* ======================================================
     RENDER
     ====================================================== */

     
  return (

    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16">

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        opened={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
        title={confirm?.title}
        message={confirm?.message}
      />

      {/* ════════════════════════════════════════════════
          HEADER — Banner + Avatar + Identity
          ════════════════════════════════════════════════ */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-surface">

        {/* Banner */}
        <div className="group relative h-52 sm:h-60 w-full bg-gradient-to-br from-primary/20 via-violet/10 to-accent/15">
        
          {data.bannerImage && (
            
            <img
            
                    src={
                      data.bannerImage
                        ? data.bannerImage.startsWith("blob:")
                          ? data.bannerImage
                          : `http://localhost:8080/uploads/banner/${data.bannerImage}`
                        : ""
                    }
                    alt={data.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent pointer-events-none" />

          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            aria-label="Change banner image"
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
          >
            <IconCamera size={14} />
            Change banner
          </button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerSelect}
          />
        </div>

        {/* Avatar + Name row */}
        <div className="px-5 sm:px-7 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">

            {/* Avatar */}
            <div className="group relative w-fit">
              <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border-[4px] border-surface bg-surface-elevated shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center">
                {data.profileImage ? (
                  <img
                    src={
                      data.profileImage
                        ? data.profileImage.startsWith("blob:")
                          ? data.profileImage
                          : `http://localhost:8080/uploads/profile/${data.profileImage}`
                        : ""
                    }
                    alt={data.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <IconUser size={40} className="text-muted/50" />
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 text-white text-xs font-medium gap-1"
              >
                <IconCamera size={18} />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            {/* Availability badge + Edit button */}
            <div className="flex items-center gap-2 sm:mb-1">
              {!editHeader && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${availBadge.color}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  {data.availability}
                </span>
              )}
              <EditButton
                editing={editHeader}
                loading={savingSection === "header"}
                onToggle={editHeader ? handleSaveHeader : () => setEditHeader(true)}
                label="header"
              />
            </div>
          </div>

          {/* Identity info */}
          <div className="mt-4">
            {editHeader ? (
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Full Name" required>
                    <input
                      className={inputCls}
                      value={data.name}
                      placeholder="e.g. Yash Lodam"
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      className={inputCls}
                      value={data.location}
                      placeholder="e.g. Pune, India"
                      onChange={(e) => updateField("location", e.target.value)}
                    />
                  </Field>
                  <Field label="Current Role">
                    <input
                      className={inputCls}
                      value={data.role}
                      placeholder="e.g. Software Developer"
                      onChange={(e) => updateField("role", e.target.value)}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      className={inputCls}
                      value={data.company}
                      placeholder="e.g. Google"
                      onChange={(e) => updateField("company", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Availability">
                    <select
                      className={inputCls}
                      value={data.availability}
                      onChange={(e) =>
                        updateField("availability", e.target.value)
                      }
                    >
                      {AVAILABILITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="text-black">
                          {o.value}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Experience Level">
                    <select
                      className={inputCls}
                      value={data.experienceLevel}
                      onChange={(e) =>
                        updateField("experienceLevel", e.target.value)
                      }
                    >
                      {EXPERIENCE_LEVELS.map((l) => (
                        <option className="text-black" key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-satoshi text-2xl sm:text-3xl font-bold tracking-tight text-heading">
                  {data.name || (
                    <span className="text-muted font-normal italic">
                      Add your name
                    </span>
                  )}
                </h1>

                {(data.role || data.company) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-body">
                    <IconBriefcase size={15} className="shrink-0 text-muted" />
                    {data.role && (
                      <span className="font-medium">{data.role}</span>
                    )}
                    {data.role && data.company && (
                      <span className="text-muted">at</span>
                    )}
                    {data.company && (
                      <span className="font-semibold text-primary-light">
                        {data.company}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
                  {data.location && (
                    <span className="flex items-center gap-1">
                      <IconMapPin size={14} />
                      {data.location}
                    </span>
                  )}
                  {data.experienceLevel && (
                    <span className="flex items-center gap-1">
                      <IconStar size={14} />
                      {data.experienceLevel}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          SOCIAL LINKS
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>Links</h2>
          <EditButton
            editing={editSocial}
            loading={savingSection === "links"}
            onToggle={editSocial ? handleSaveLinks : () => setEditSocial(true)}
            label="links"
          />
        </div>

        {editSocial ? (
          <div className="space-y-3 max-w-lg">
            <Field label="LinkedIn">
              <div className="relative">
                <IconBrandLinkedin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  className={`${inputCls} pl-9`}
                  value={data.socialLinks.linkedin ?? ""}
                  placeholder="https://linkedin.com/in/username"
                  onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                />
              </div>
            </Field>
            <Field label="GitHub">
              <div className="relative">
                <IconBrandGithub
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  className={`${inputCls} pl-9`}
                  value={data.socialLinks.github ?? ""}
                  placeholder="https://github.com/username"
                  onChange={(e) => updateSocialLink("github", e.target.value)}
                />
              </div>
            </Field>
            <Field label="Portfolio / Website">
              <div className="relative">
                <IconGlobe
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  className={`${inputCls} pl-9`}
                  value={data.socialLinks.portfolio ?? ""}
                  placeholder="https://yourwebsite.com"
                  onChange={(e) =>
                    updateSocialLink("portfolio", e.target.value)
                  }
                />
              </div>
            </Field>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {data.socialLinks.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-body hover:border-primary/30 hover:text-primary-light hover:bg-primary/5 transition-all duration-200"
              >
                <IconBrandLinkedin size={16} className="text-[#0A66C2]" />
                LinkedIn
                <IconExternalLink size={13} className="text-muted" />
              </a>
            )}
            {data.socialLinks.github && (
              <a
                href={data.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-body hover:border-white/20 hover:text-heading hover:bg-white/5 transition-all duration-200"
              >
                <IconBrandGithub size={16} />
                GitHub
                <IconExternalLink size={13} className="text-muted" />
              </a>
            )}
            {data.socialLinks.portfolio && (
              <a
                href={data.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-body hover:border-accent/30 hover:text-accent-light hover:bg-accent/5 transition-all duration-200"
              >
                <IconGlobe size={16} className="text-accent" />
                Portfolio
                <IconExternalLink size={13} className="text-muted" />
              </a>
            )}
            {!data.socialLinks.linkedin &&
              !data.socialLinks.github &&
              !data.socialLinks.portfolio && (
                <EmptyState text="No links added yet. Click the pencil to add your profiles." />
              )}
          </div>
        )}
      </Section>

      {/* ════════════════════════════════════════════════
          ABOUT
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>About</h2>
          <EditButton
            editing={editAbout}
            loading={savingSection === "about"}
            onToggle={editAbout ? handleSaveAbout : () => setEditAbout(true)}
            label="about"
          />
        </div>
        {editAbout ? (
          <Field label="Bio">
            <textarea
              className={textareaCls}
              rows={5}
              value={data.about}
              placeholder="Tell people about your experience, what you're looking for, and what makes you unique."
              onChange={(e) => updateField("about", e.target.value)}
            />
          </Field>
        ) : data.about ? (
          <p className="text-sm leading-7 text-body sm:text-[15px] whitespace-pre-line">
            {data.about}
          </p>
        ) : (
          <EmptyState text="You haven't added a bio yet. Click the pencil to introduce yourself." />
        )}
      </Section>

      {/* ════════════════════════════════════════════════
          SKILLS
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>Skills</h2>
          <EditButton
            editing={editSkills}
            onToggle={
              editSkills
                ? handleSaveSkills
                : () => setEditSkills(true)
            }
            label="skills"
          />
        </div>

        {data.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => {
              console.log(data.skills);
              const label = typeof skill === "object" ? skill.name : skill;
              const key = typeof skill === "object" ? skill.id : skill;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary-light transition-all duration-300 hover:border-primary/40 hover:bg-primary/15"
                >
                  {label}
                  {editSkills && (
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      onClick={() => removeSkillLocal(skill)}
                      className="ml-0.5 rounded text-primary-light/60 hover:text-danger transition-colors"
                    >
                      <IconX size={13} />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        ) : (
          !editSkills && (
            <EmptyState text="No skills added yet. Click the pencil to add what you're good at." />
          )
        )}

        {editSkills && (
          <div className="mt-4 max-w-sm">
            <Field label="Add a skill">
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="e.g. Figma, React, SQL"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillLocal();
                    }
                  }}
                />
                <ActionIcon
                  variant="light"
                  radius="xl"
                  size="lg"
                  aria-label="Add skill"
                  className="!bg-primary/10 hover:!bg-primary/20 border border-primary/20 shrink-0"
                  onClick={addSkillLocal}
                >
                  <IconPlus size={18} className="text-primary-light" />
                </ActionIcon>
              </div>
            </Field>
          </div>
        )}
      </Section>

      {/* ════════════════════════════════════════════════
          EXPERIENCE
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>Experience</h2>
          <div className="flex items-center gap-2">
            <AddButton onClick={addExperienceLocal} label="Add experience" />
            <EditButton
              editing={editExp}
              loading={savingSection === "experience"}
              onToggle={
                editExp
                  ? handleSaveExperience
                  : () => setEditExp(true)
              }
              label="experience"
            />
          </div>
        </div>

        {data.experience.length === 0 && (
          <EmptyState text="No experience added yet. Click the + to add your first role." />
        )}

        <div className="space-y-6">
          {data.experience.map((item) => (
            <div key={item._id} className="flex gap-4">
              {/* Logo */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.company}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <IconBriefcase size={20} className="text-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {editExp ? (
                  <div className="space-y-3 rounded-xl border border-white/[0.06] bg-surface-elevated/40 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                        Edit Entry
                      </p>
                      <DeleteButton
                        onClick={() =>
                          confirmRemoveExperience(item._id, item.role, item.id)
                        }
                        label="Remove experience"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Role">
                        <input
                          className={inputCls}
                          value={item.title}
                          placeholder="e.g. Software Engineer"
                          onChange={(e) =>
                            updateListItem("experience", item._id, "title", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Company">
                        <input
                          className={inputCls}
                          value={item.company}
                          placeholder="e.g. Google"
                          onChange={(e) =>
                            updateListItem("experience", item._id, "company", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Start Date">
                        <MonthPickerInput
                          value={item.startDate ? new Date(item.startDate) : null}
                          valueFormat="MMM YYYY"
                          placeholder="Select month"
                          clearable
                          onChange={(value) =>
                            updateListItem("experience", item._id, "startDate", value || "")
                          }
                        />
                      </Field>
                      <Field label="End Date">
                        <MonthPickerInput
                          value={item.endDate ? new Date(item.endDate) : null}
                          valueFormat="MMM YYYY"
                          placeholder="Present"
                          clearable
                          onChange={(value) =>
                            updateListItem("experience", item._id, "endDate", value || "")
                          }
                        />
                      </Field>
                      <Field label="Type">
                        <select
                          className={inputCls}
                          value={item.type}
                          onChange={(e) =>
                            updateListItem("experience", item._id, "type", e.target.value)
                          }
                        >
                          <option value="" className="text-black">
                            Select type
                          </option>
                          {JOB_TYPES.map((t) => (
                            <option key={t} value={t} className="text-black">
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Location">
                        <input
                          className={inputCls}
                          value={item.location}
                          placeholder="e.g. Remote"
                          onChange={(e) =>
                            updateListItem("experience", item._id, "location", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      <textarea
                        className={textareaCls}
                        rows={3}
                        value={item.description}
                        placeholder="What did you work on? What did you ship or improve?"
                        onChange={(e) =>
                          updateListItem("experience", item._id, "description", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg leading-snug">
                          {item.title || "Untitled role"}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-primary-light">
                          {item.company}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-muted bg-surface-elevated border border-white/[0.06] rounded-lg px-2.5 py-1">
                        {item.startDate
                          ? dayjs(item.startDate).format("MMM YYYY")
                          : "Start"}{" "}
                        —{" "}
                        {item.endDate
                          ? dayjs(item.endDate).format("MMM YYYY")
                          : "Present"}
                      </span>
                    </div>
                    {(item.type || item.location) && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                        {item.type && (
                          <span className="rounded-full border border-white/10 px-2 py-0.5">
                            {item.type}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <IconMapPin size={12} />
                            {item.location}
                          </span>
                        )}
                      </div>
                    )}
                    {item.description && (
                      <p className="mt-2.5 text-sm leading-6 text-body">
                        {item.description}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════
          EDUCATION
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>Education</h2>
          <div className="flex items-center gap-2">
            <AddButton onClick={addEducationLocal} label="Add education" />
            <EditButton
              editing={editEdu}
              loading={savingSection === "education"}
              onToggle={
                editEdu
                  ? handleSaveEducation
                  : () => setEditEdu(true)
              }
              label="education"
            />
          </div>
        </div>

        {data.education.length === 0 && (
          <EmptyState text="No education added yet. Click the + to add your first degree." />
        )}

        <div className="space-y-6">
          {data.education.map((item) => (
            <div key={item._id} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary-light">
                <IconSchool size={22} stroke={1.6} />
              </div>

              <div className="min-w-0 flex-1">
                {editEdu ? (
                  <div className="space-y-3 rounded-xl border border-white/[0.06] bg-surface-elevated/40 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                        Edit Entry
                      </p>
                      <DeleteButton
                        onClick={() =>
                          confirmRemoveEducation(item._id, item.degree, item.id)
                        }
                        label="Remove education"
                      />
                    </div>
                    <Field label="Degree / Program">
                      <input
                        className={inputCls}
                        value={item.degree}
                        placeholder="e.g. B.E. Computer Engineering"
                        onChange={(e) =>
                          updateListItem("education", item._id, "degree", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="College / Institution">
                      <input
                        className={inputCls}
                        value={item.college}
                        placeholder="e.g. GNSC Engineering"
                        onChange={(e) =>
                          updateListItem("education", item._id, "college", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="University / Board">
                      <input
                        className={inputCls}
                        value={item.university ?? ""}
                        placeholder="e.g. Savitribai Phule Pune University"
                        onChange={(e) =>
                          updateListItem("education", item._id, "university", e.target.value)
                        }
                      />
                    </Field>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <Field label="Start Year">
                        <input
                          className={inputCls}
                          value={item.startYear}
                          placeholder="2019"
                          maxLength={4}
                          onChange={(e) =>
                            updateListItem("education", item._id, "startYear", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="End Year">
                        <input
                          className={inputCls}
                          value={item.endYear}
                          placeholder="2023"
                          maxLength={4}
                          onChange={(e) =>
                            updateListItem("education", item._id, "endYear", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={inputCls}
                          value={item.location}
                          placeholder="e.g. Pune"
                          onChange={(e) =>
                            updateListItem("education", item._id, "location", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg leading-snug">
                          {item.degree || "Untitled degree"}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-primary-light">
                          {item.college}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-muted bg-surface-elevated border border-white/[0.06] rounded-lg px-2.5 py-1">
                        {item.startYear} — {item.endYear}
                      </span>
                    </div>
                    {item.university && (
                      <p className="mt-1 text-sm text-body">{item.university}</p>
                    )}
                    {item.location && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted">
                        <IconMapPin size={12} />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════
          CERTIFICATIONS
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>Certifications</h2>
          <div className="flex items-center gap-2">
            <AddButton onClick={addCertificationLocal} label="Add certification" />
            <EditButton
              editing={editCert}
              loading={savingSection === "certification"}
              onToggle={
                editCert
                  ? handleSaveCertifications
                  : () => setEditCert(true)
              }
              label="certifications"
            />
          </div>
        </div>

        {data.certifications.length === 0 && (
          <EmptyState text="No certifications added yet. Click the + to add one." />
        )}

        <div className="space-y-5">
          {data.certifications.map((cert) => (
            <div key={cert._id} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent-warm/20 bg-accent-warm/10 text-accent-warm-light">
                <IconCertificate size={22} stroke={1.6} />
              </div>

              <div className="min-w-0 flex-1">
                {editCert ? (
                  <div className="space-y-3 rounded-xl border border-white/[0.06] bg-surface-elevated/40 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                        Edit Entry
                      </p>
                      <DeleteButton
                        onClick={() =>
                          confirmRemoveCertification(cert._id, cert.title, cert.id)
                        }
                        label="Remove certification"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Certificate Title">
                        <input
                          className={inputCls}
                          value={cert.title}
                          placeholder="e.g. AWS Solutions Architect"
                          onChange={(e) =>
                            updateListItem("certifications", cert._id, "title", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Issuer">
                        <input
                          className={inputCls}
                          value={cert.issuer}
                          placeholder="e.g. Amazon Web Services"
                          onChange={(e) =>
                            updateListItem("certifications", cert._id, "issuer", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Issued Date">
                        <input
                          className={inputCls}
                          value={cert.issuedDate}
                          placeholder="e.g. Jan 2025"
                          onChange={(e) =>
                            updateListItem("certifications", cert._id, "issuedDate", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Credential ID">
                        <input
                          className={inputCls}
                          value={cert.credentialId}
                          placeholder="e.g. AWS-SAA-2025"
                          onChange={(e) =>
                            updateListItem("certifications", cert._id, "credentialId", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Credential URL">
                      <input
                        className={inputCls}
                        value={cert.credentialUrl}
                        placeholder="https://..."
                        onChange={(e) =>
                          updateListItem("certifications", cert._id, "credentialUrl", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg leading-snug">
                          {cert.title || "Untitled certificate"}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-accent-warm-light">
                          {cert.issuer}
                        </p>
                      </div>
                      {cert.issuedDate && (
                        <span className="shrink-0 text-xs font-medium text-muted bg-surface-elevated border border-white/[0.06] rounded-lg px-2.5 py-1">
                          Issued {cert.issuedDate}
                        </span>
                      )}
                    </div>
                    {cert.credentialId && (
                      <p className="mt-1.5 text-xs text-muted font-mono">
                        ID: {cert.credentialId}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light hover:text-primary transition-colors"
                      >
                        Show credential
                        <IconExternalLink size={14} stroke={1.8} />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════
          LANGUAGES
          ════════════════════════════════════════════════ */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <h2 className={sectionHeadingCls}>Languages</h2>
          <EditButton
            editing={editMisc}
            onToggle={() => setEditMisc((v) => !v)}
            label="languages"
          />
        </div>

        {data.languages.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang) => {
              const label = typeof lang === "object" ? lang.language ?? lang.name : lang;
              const key = typeof lang === "object" ? lang.id : lang;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm font-medium text-body transition-all duration-200 hover:border-white/20"
                >
                  <IconLanguage size={14} className="text-muted" />
                  {label}
                  {editMisc && (
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      onClick={() => removeLanguageLocal(lang)}
                      className="ml-0.5 rounded text-muted hover:text-danger transition-colors"
                    >
                      <IconX size={13} />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        ) : (
          !editMisc && (
            <EmptyState text="No languages added. Click the pencil to add the languages you speak." />
          )
        )}

        {editMisc && (
          <div className="mt-4 max-w-sm">
            <Field label="Add a language">
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="e.g. English, Hindi"
                  value={langDraft}
                  onChange={(e) => setLangDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLanguageLocal();
                    }
                  }}
                />
                <ActionIcon
                  variant="light"
                  radius="xl"
                  size="lg"
                  aria-label="Add language"
                  className="!bg-white/5 hover:!bg-white/10 border border-white/10 shrink-0"
                  onClick={addLanguageLocal}
                >
                  <IconPlus size={18} className="text-slate-400" />
                </ActionIcon>
              </div>
            </Field>
          </div>
        )}
      </Section>

    </div>
  );
}

export default Profile;