/**
 * src/State/profileThunk.js
 *
 * All async thunks for the Profile feature.
 *
 * Rules enforced here:
 *  - Each thunk calls exactly ONE function from profileApi.js.
 *  - All errors are caught and forwarded with rejectWithValue().
 *  - No UI logic, no toast calls — that belongs in components.
 *  - Payloads are returned as-is from the API layer.
 *
 * Consumed by: src/State/profileSlice.js (extraReducers)
 *              Components (via dispatch)
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMyProfile,
  fetchProfileByEmail,
  fetchUserByEmail,
  uploadProfileImage,
  uploadBannerImage,
  updateHeader,
  updateLinks,
  updateAbout,
  updateSkills,
  addSkill,
  deleteSkill,
  addExperience,
  updateExperience,
  fetchExperiences,
  deleteExperience,
  addEducation,
  fetchEducations,
  deleteEducation,
  addCertification,
  updateCertification,
  fetchCertifications,
  deleteCertification,
  addLanguage,
  fetchLanguages,
  deleteLanguage,
} from "../api/profileApi";

// ─────────────────────────────────────────────────────────────────────────────
// Helper — extracts a human-readable message from any caught error.
// Keeps every catch block to a single line.
// ─────────────────────────────────────────────────────────────────────────────
const getErrorPayload = (error) =>
  error.response?.data || {
    message: error.userMessage || error.message || "Something went wrong.",
  };

// ─────────────────────────────────────────────────────────────────────────────
// READ OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /profile — authenticated user's own profile */
export const fetchMyProfileThunk = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMyProfile();
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/** GET /profile/{email} — public profile lookup by email */
export const fetchProfileByEmailThunk = createAsyncThunk(
  "profile/fetchProfileByEmail",
  async (email, { rejectWithValue }) => {
    try {
      return await fetchProfileByEmail(email);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/** GET /profile/user/{email} — user record linked to a profile */
export const fetchUserByEmailThunk = createAsyncThunk(
  "profile/fetchUserByEmail",
  async (email, { rejectWithValue }) => {
    try {
      return await fetchUserByEmail(email);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOADS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PUT /profile/profile-image/{id}
 * @param {{ id: number|string, file: File }} payload
 */
export const uploadProfileImageThunk = createAsyncThunk(
  "profile/uploadProfileImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      return await uploadProfileImage(id, file);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * PUT /profile/banner-image/{id}
 * @param {{ id: number|string, file: File }} payload
 */
export const uploadBannerImageThunk = createAsyncThunk(
  "profile/uploadBannerImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      return await uploadBannerImage(id, file);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SECTIONS — UPDATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PUT /profile/header/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const updateHeaderThunk = createAsyncThunk(
  "profile/updateHeader",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateHeader(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * PUT /profile/links/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const updateLinksThunk = createAsyncThunk(
  "profile/updateLinks",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateLinks(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * PUT /profile/about/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const updateAboutThunk = createAsyncThunk(
  "profile/updateAbout",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateAbout(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * PUT /profile/skills/{id} — replaces the entire skills list
 * @param {{ id: number|string, data: object }} payload
 */
export const updateSkillsThunk = createAsyncThunk(
  "profile/updateSkills",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateSkills(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS — ADD / DELETE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /profile/skill/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const addSkillThunk = createAsyncThunk(
  "profile/addSkill",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await addSkill(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * DELETE /profile/skills/{id}
 * @param {number|string} id — profile ID
 */
export const deleteSkillThunk = createAsyncThunk(
  "profile/deleteSkill",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteSkill(id);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /profile/experience/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const addExperienceThunk = createAsyncThunk(
  "profile/addExperience",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await addExperience(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * PUT /profile/experience/{experienceId}
 * @param {{ experienceId: number|string, data: object }} payload
 */
export const updateExperienceThunk = createAsyncThunk(
  "profile/updateExperience",
  async ({ experienceId, data }, { rejectWithValue }) => {
    try {
      return await updateExperience(experienceId, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * GET /profile/experience/{id}
 * @param {number|string} id — profile ID
 */
export const fetchExperiencesThunk = createAsyncThunk(
  "profile/fetchExperiences",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchExperiences(id);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * DELETE /profile/experience/{experienceId}
 * @param {number|string} experienceId
 */
export const deleteExperienceThunk = createAsyncThunk(
  "profile/deleteExperience",
  async (experienceId, { rejectWithValue }) => {
    try {
      return await deleteExperience(experienceId);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /profile/education/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const addEducationThunk = createAsyncThunk(
  "profile/addEducation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await addEducation(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * GET /profile/education/{id}
 * @param {number|string} id — profile ID
 */
export const fetchEducationsThunk = createAsyncThunk(
  "profile/fetchEducations",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEducations(id);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * DELETE /profile/education/{educationId}
 * @param {number|string} educationId
 */
export const deleteEducationThunk = createAsyncThunk(
  "profile/deleteEducation",
  async (educationId, { rejectWithValue }) => {
    try {
      return await deleteEducation(educationId);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /profile/certification/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const addCertificationThunk = createAsyncThunk(
  "profile/addCertification",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await addCertification(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * PUT /profile/certification/{certificationId}
 * @param {{ certificationId: number|string, data: object }} payload
 */
export const updateCertificationThunk = createAsyncThunk(
  "profile/updateCertification",
  async ({ certificationId, data }, { rejectWithValue }) => {
    try {
      return await updateCertification(certificationId, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * GET /profile/certification/{id}
 * @param {number|string} id — profile ID
 */
export const fetchCertificationsThunk = createAsyncThunk(
  "profile/fetchCertifications",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchCertifications(id);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * DELETE /profile/certification/{certificationId}
 * @param {number|string} certificationId
 */
export const deleteCertificationThunk = createAsyncThunk(
  "profile/deleteCertification",
  async (certificationId, { rejectWithValue }) => {
    try {
      return await deleteCertification(certificationId);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /profile/languages/{id}
 * @param {{ id: number|string, data: object }} payload
 */
export const addLanguageThunk = createAsyncThunk(
  "profile/addLanguage",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await addLanguage(id, data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * GET /profile/languages/{id}
 * @param {number|string} id — profile ID
 */
export const fetchLanguagesThunk = createAsyncThunk(
  "profile/fetchLanguages",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchLanguages(id);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/**
 * DELETE /profile/languages/{id}
 * @param {number|string} id — language entry ID
 */
export const deleteLanguageThunk = createAsyncThunk(
  "profile/deleteLanguage",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteLanguage(id);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);
