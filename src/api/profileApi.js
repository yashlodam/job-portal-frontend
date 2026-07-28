/**
 * src/api/profileApi.js
 *
 * Pure API layer — Profile endpoints only.
 *
 * Rules enforced here:
 *  - Every function makes exactly ONE HTTP call and returns response.data.
 *  - No Redux imports. No dispatch. No side-effects.
 *  - FormData is constructed here for image uploads so the caller just passes a File.
 *  - Every function is async and throws on failure (the thunk catches it).
 *
 * Consumed by: src/State/profileThunk.js
 */

import { api } from "../config/Api";

// ─────────────────────────────────────────────────────────────────────────────
// READ OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user's own profile.
 * Requires JWT in localStorage (attached automatically by the interceptor).
 * Endpoint: GET /profile
 */
export const fetchMyProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

/**
 * Fetch a public profile by email address.
 * Endpoint: GET /profile/{email}
 * @param {string} email
 */
export const fetchProfileByEmail = async (email) => {
  const res = await api.get(`/profile/${email}`);
  return res.data;
};

/**
 * Fetch the user record linked to a profile by email.
 * Endpoint: GET /profile/user/{email}
 * @param {string} email
 */
export const fetchUserByEmail = async (email) => {
  const res = await api.get(`/profile/user/${email}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOADS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload / replace the profile avatar image.
 * Endpoint: PUT /profile/profile-image/{id}
 * @param {number|string} id   — profile ID
 * @param {File}          file — the selected image File object
 */
export const uploadProfileImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.put(`/profile/profile-image/${id}`, formData);
  return res.data;
};

/**
 * Upload / replace the profile banner image.
 * Endpoint: PUT /profile/banner-image/{id}
 * @param {number|string} id   — profile ID
 * @param {File}          file — the selected image File object
 */
export const uploadBannerImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.put(`/profile/banner-image/${id}`, formData);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SECTIONS — UPDATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update the header section (name, title, location, etc.).
 * Endpoint: PUT /profile/header/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — header fields payload
 */
export const updateHeader = async (id, data) => {
  const res = await api.put(`/profile/header/${id}`, data);
  return res.data;
};

/**
 * Update social / professional links.
 * Endpoint: PUT /profile/links/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — links payload (e.g. { github, linkedin, website })
 */
export const updateLinks = async (id, data) => {
  const res = await api.put(`/profile/links/${id}`, data);
  return res.data;
};

/**
 * Update the About / bio section.
 * Endpoint: PUT /profile/about/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — about payload (e.g. { bio })
 */
export const updateAbout = async (id, data) => {
  const res = await api.put(`/profile/about/${id}`, data);
  return res.data;
};

/**
 * Replace the entire skills list.
 * Endpoint: PUT /profile/skills/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — skills payload (e.g. { skills: [] })
 */
export const updateSkills = async (id, data) => {
  const res = await api.put(`/profile/skills/${id}`, data);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS — ADD / DELETE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a single skill to the profile.
 * Endpoint: POST /profile/skill/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — new skill payload (e.g. { name, level })
 */
export const addSkill = async (id, data) => {
  const res = await api.post(`/profile/skill/${id}`, data);
  return res.data;
};

/**
 * Delete a skill (or all skills) from the profile.
 * Endpoint: DELETE /profile/skills/{id}
 * @param {number|string} id — profile ID
 */
export const deleteSkill = async (id) => {
  const res = await api.delete(`/profile/skills/${id}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a new work experience entry.
 * Endpoint: POST /profile/experience/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — experience payload
 */
export const addExperience = async (id, data) => {
  const res = await api.post(`/profile/experience/${id}`, data);
  return res.data;
};

/**
 * Update an existing experience entry.
 * Endpoint: PUT /profile/experience/{experienceId}
 * @param {number|string} experienceId
 * @param {object}        data — updated experience payload
 */
export const updateExperience = async (experienceId, data) => {
  const res = await api.put(`/profile/experience/${experienceId}`, data);
  return res.data;
};

/**
 * Fetch all experience entries for a profile.
 * Endpoint: GET /profile/experience/{id}
 * @param {number|string} id — profile ID
 */
export const fetchExperiences = async (id) => {
  const res = await api.get(`/profile/experience/${id}`);
  return res.data;
};

/**
 * Delete a specific experience entry.
 * Endpoint: DELETE /profile/experience/{experienceId}
 * @param {number|string} experienceId
 */
export const deleteExperience = async (experienceId) => {
  const res = await api.delete(`/profile/experience/${experienceId}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a new education entry.
 * Endpoint: POST /profile/education/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — education payload
 */
export const addEducation = async (id, data) => {
  const res = await api.post(`/profile/education/${id}`, data);
  return res.data;
};

/**
 * Fetch all education entries for a profile.
 * Endpoint: GET /profile/education/{id}
 * @param {number|string} id — profile ID
 */
export const fetchEducations = async (id) => {
  const res = await api.get(`/profile/education/${id}`);
  return res.data;
};

/**
 * Delete a specific education entry.
 * Endpoint: DELETE /profile/education/{educationId}
 * @param {number|string} educationId
 */
export const deleteEducation = async (educationId) => {
  const res = await api.delete(`/profile/education/${educationId}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a new certification.
 * Endpoint: POST /profile/certification/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — certification payload
 */
export const addCertification = async (id, data) => {
  const res = await api.post(`/profile/certification/${id}`, data);
  return res.data;
};

/**
 * Update an existing certification.
 * Endpoint: PUT /profile/certification/{certificationId}
 * @param {number|string} certificationId
 * @param {object}        data — updated certification payload
 */
export const updateCertification = async (certificationId, data) => {
  const res = await api.put(`/profile/certification/${certificationId}`, data);
  return res.data;
};

/**
 * Fetch all certifications for a profile.
 * Endpoint: GET /profile/certification/{id}
 * @param {number|string} id — profile ID
 */
export const fetchCertifications = async (id) => {
  const res = await api.get(`/profile/certification/${id}`);
  return res.data;
};

/**
 * Delete a specific certification.
 * Endpoint: DELETE /profile/certification/{certificationId}
 * @param {number|string} certificationId
 */
export const deleteCertification = async (certificationId) => {
  const res = await api.delete(`/profile/certification/${certificationId}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a new language entry.
 * Endpoint: POST /profile/languages/{id}
 * @param {number|string} id   — profile ID
 * @param {object}        data — language payload (e.g. { language, proficiency })
 */
export const addLanguage = async (id, data) => {
  const res = await api.post(`/profile/languages/${id}`, data);
  return res.data;
};

/**
 * Fetch all languages for a profile.
 * Endpoint: GET /profile/languages/{id}
 * @param {number|string} id — profile ID
 */
export const fetchLanguages = async (id) => {
  const res = await api.get(`/profile/languages/${id}`);
  return res.data;
};

/**
 * Delete a specific language entry.
 * Endpoint: DELETE /profile/languages/{id}
 * @param {number|string} id — language ID (not profile ID)
 */
export const deleteLanguage = async (id) => {
  const res = await api.delete(`/profile/languages/${id}`);
  return res.data;
};
