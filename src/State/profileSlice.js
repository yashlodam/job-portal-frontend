/**
 * src/State/profileSlice.js
 *
 * Redux slice for the entire Profile feature.
 *
 * State shape:
 *  loading        — true while any profile request is in-flight
 *  error          — last error message string (or null)
 *  success        — true after any mutating operation succeeds (reset by clearProfileSuccess)
 *  profile        — full profile object (GET /profile)
 *  header         — header section (name, title, location…)
 *  about          — about/bio string or object
 *  links          — social links object
 *  skills         — array of skill objects
 *  experiences    — array of experience objects
 *  educations     — array of education objects
 *  certifications — array of certification objects
 *  languages      — array of language objects
 *  profileImage   — URL of the profile avatar after upload
 *  bannerImage    — URL of the banner image after upload
 *
 * Selectors are co-located at the bottom of this file.
 */

import { createSlice } from "@reduxjs/toolkit";

// ── Thunk imports ─────────────────────────────────────────────────────────────
import {
  fetchMyProfileThunk,
  fetchProfileByEmailThunk,
  fetchUserByEmailThunk,
  uploadProfileImageThunk,
  uploadBannerImageThunk,
  updateHeaderThunk,
  updateLinksThunk,
  updateAboutThunk,
  updateSkillsThunk,
  addSkillThunk,
  deleteSkillThunk,
  addExperienceThunk,
  updateExperienceThunk,
  fetchExperiencesThunk,
  deleteExperienceThunk,
  addEducationThunk,
  fetchEducationsThunk,
  deleteEducationThunk,
  addCertificationThunk,
  updateCertificationThunk,
  fetchCertificationsThunk,
  deleteCertificationThunk,
  addLanguageThunk,
  fetchLanguagesThunk,
  deleteLanguageThunk,
} from "./profileThunk";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — shared reducer logic to avoid repetition inside extraReducers.
// ─────────────────────────────────────────────────────────────────────────────

/** Mark a request as in-flight and clear any stale error. */
const startLoading = (state) => {
  state.loading = true;
  state.error = null;
};

/** Mark a request as complete and flag success. */
const setSuccess = (state) => {
  state.loading = false;
  state.success = true;
};

/** Store the error message and stop the loader. */
const setError = (state, action) => {
  state.loading = false;
  state.error =
    action.payload?.message ||
    action.payload?.errorMessage ||
    "An unexpected error occurred.";
};

// ─────────────────────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  loading: false,
  error: null,
  success: false,

  // Core profile object returned by GET /profile
  profile: null,

  // Granular section caches (populated by dedicated section fetches)
  header: null,
  about: null,
  links: null,
  skills: [],
  experiences: [],
  educations: [],
  certifications: [],
  languages: [],

  // Image URLs returned after successful upload
  profileImage: null,
  bannerImage: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: "profile",
  initialState,

  // ── Synchronous reducers ──────────────────────────────────────────────────
  reducers: {
    /** Call this after showing a success toast so the flag resets. */
    clearProfileSuccess: (state) => {
      state.success = false;
    },
    /** Call this after showing an error toast so the error resets. */
    clearProfileError: (state) => {
      state.error = null;
    },
    /** Hard-reset the entire profile slice (e.g. on logout). */
    resetProfile: () => initialState,
  },

  // ── Async reducers ────────────────────────────────────────────────────────
  extraReducers: (builder) => {
    builder

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile — fetch own profile
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchMyProfileThunk.pending, startLoading)
      .addCase(fetchMyProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        
      })
      .addCase(fetchMyProfileThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile/{email} — public profile lookup
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchProfileByEmailThunk.pending, startLoading)
      .addCase(fetchProfileByEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        // Hydrate section caches from the full profile response
        state.header         = action.payload?.header         ?? state.header;
        state.about          = action.payload?.about          ?? state.about;
        state.links          = action.payload?.links          ?? state.links;
        state.skills         = action.payload?.skills         ?? state.skills;
        state.experiences    = action.payload?.experiences    ?? state.experiences;
        state.educations     = action.payload?.educations     ?? state.educations;
        state.certifications = action.payload?.certifications ?? state.certifications;
        state.languages      = action.payload?.languages      ?? state.languages;
        state.profileImage   = action.payload?.profileImage   ?? state.profileImage;
        state.bannerImage    = action.payload?.bannerImage    ?? state.bannerImage;
      })
      .addCase(fetchProfileByEmailThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile/user/{email} — user record linked to profile
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchUserByEmailThunk.pending, startLoading)
      .addCase(fetchUserByEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Merge user data into the profile object
        state.profile = { ...state.profile, user: action.payload };
      })
      .addCase(fetchUserByEmailThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/profile-image/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(uploadProfileImageThunk.pending, startLoading)
      .addCase(uploadProfileImageThunk.fulfilled, (state, action) => {
        setSuccess(state);
        // Backend typically returns the updated profile or the new image URL
        state.profileImage = action.payload?.profileImage ?? action.payload;
        if (state.profile) {
          state.profile.profileImage = state.profileImage;
        }
      })
      .addCase(uploadProfileImageThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/banner-image/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(uploadBannerImageThunk.pending, startLoading)
      .addCase(uploadBannerImageThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.bannerImage = action.payload?.bannerImage ?? action.payload;
        if (state.profile) {
          state.profile.bannerImage = state.bannerImage;
        }
      })
      .addCase(uploadBannerImageThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/header/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(updateHeaderThunk.pending, startLoading)
      .addCase(updateHeaderThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.header = action.payload;
        if (state.profile) state.profile.header = action.payload;
      })
      .addCase(updateHeaderThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/links/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(updateLinksThunk.pending, startLoading)
      .addCase(updateLinksThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.links = action.payload;
        if (state.profile) state.profile.links = action.payload;
      })
      .addCase(updateLinksThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/about/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(updateAboutThunk.pending, startLoading)
      .addCase(updateAboutThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.about = action.payload;
        if (state.profile) state.profile.about = action.payload;
      })
      .addCase(updateAboutThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/skills/{id} — full replacement
      // ══════════════════════════════════════════════════════════════════════
      .addCase(updateSkillsThunk.pending, startLoading)
      .addCase(updateSkillsThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.skills = action.payload;
        if (state.profile) state.profile.skills = action.payload;
      })
      .addCase(updateSkillsThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // POST /profile/skill/{id} — add single skill
      // ══════════════════════════════════════════════════════════════════════
      .addCase(addSkillThunk.pending, startLoading)
      .addCase(addSkillThunk.fulfilled, (state, action) => {
        setSuccess(state);
        // Backend returns the newly created skill or the updated full list
        if (Array.isArray(action.payload)) {
          state.skills = action.payload;
        } else {
          state.skills.push(action.payload);
        }
        if (state.profile) state.profile.skills = state.skills;
      })
      .addCase(addSkillThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // DELETE /profile/skills/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(deleteSkillThunk.pending, startLoading)
      .addCase(deleteSkillThunk.fulfilled, (state, action) => {
        setSuccess(state);
        // If backend returns the updated list, use it; otherwise clear
        if (Array.isArray(action.payload)) {
          state.skills = action.payload;
        } else {
          state.skills = [];
        }
        if (state.profile) state.profile.skills = state.skills;
      })
      .addCase(deleteSkillThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // POST /profile/experience/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(addExperienceThunk.pending, startLoading)
      .addCase(addExperienceThunk.fulfilled, (state, action) => {
        setSuccess(state);
        if (Array.isArray(action.payload)) {
          state.experiences = action.payload;
        } else {
          state.experiences.push(action.payload);
        }
        if (state.profile) state.profile.experiences = state.experiences;
      })
      .addCase(addExperienceThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/experience/{experienceId}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(updateExperienceThunk.pending, startLoading)
      .addCase(updateExperienceThunk.fulfilled, (state, action) => {
        setSuccess(state);
        const updated = action.payload;
        const idx = state.experiences.findIndex((e) => e.id === updated.id);
        if (idx !== -1) {
          state.experiences[idx] = updated;
        }
        if (state.profile) state.profile.experiences = state.experiences;
      })
      .addCase(updateExperienceThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile/experience/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchExperiencesThunk.pending, startLoading)
      .addCase(fetchExperiencesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(fetchExperiencesThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // DELETE /profile/experience/{experienceId}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(deleteExperienceThunk.pending, startLoading)
      .addCase(deleteExperienceThunk.fulfilled, (state, action) => {
        setSuccess(state);
        // action.meta.arg is the experienceId passed to the thunk
        state.experiences = state.experiences.filter(
          (e) => e.id !== action.meta.arg
        );
        if (state.profile) state.profile.experiences = state.experiences;
      })
      .addCase(deleteExperienceThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // POST /profile/education/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(addEducationThunk.pending, startLoading)
      .addCase(addEducationThunk.fulfilled, (state, action) => {
        setSuccess(state);
        if (Array.isArray(action.payload)) {
          state.educations = action.payload;
        } else {
          state.educations.push(action.payload);
        }
        if (state.profile) state.profile.educations = state.educations;
      })
      .addCase(addEducationThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile/education/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchEducationsThunk.pending, startLoading)
      .addCase(fetchEducationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.educations = action.payload;
      })
      .addCase(fetchEducationsThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // DELETE /profile/education/{educationId}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(deleteEducationThunk.pending, startLoading)
      .addCase(deleteEducationThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.educations = state.educations.filter(
          (e) => e.id !== action.meta.arg
        );
        if (state.profile) state.profile.educations = state.educations;
      })
      .addCase(deleteEducationThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // POST /profile/certification/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(addCertificationThunk.pending, startLoading)
      .addCase(addCertificationThunk.fulfilled, (state, action) => {
        setSuccess(state);
        if (Array.isArray(action.payload)) {
          state.certifications = action.payload;
        } else {
          state.certifications.push(action.payload);
        }
        if (state.profile) state.profile.certifications = state.certifications;
      })
      .addCase(addCertificationThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // PUT /profile/certification/{certificationId}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(updateCertificationThunk.pending, startLoading)
      .addCase(updateCertificationThunk.fulfilled, (state, action) => {
        setSuccess(state);
        const updated = action.payload;
        const idx = state.certifications.findIndex((c) => c.id === updated.id);
        if (idx !== -1) {
          state.certifications[idx] = updated;
        }
        if (state.profile) state.profile.certifications = state.certifications;
      })
      .addCase(updateCertificationThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile/certification/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchCertificationsThunk.pending, startLoading)
      .addCase(fetchCertificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.certifications = action.payload;
      })
      .addCase(fetchCertificationsThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // DELETE /profile/certification/{certificationId}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(deleteCertificationThunk.pending, startLoading)
      .addCase(deleteCertificationThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.certifications = state.certifications.filter(
          (c) => c.id !== action.meta.arg
        );
        if (state.profile) state.profile.certifications = state.certifications;
      })
      .addCase(deleteCertificationThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // POST /profile/languages/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(addLanguageThunk.pending, startLoading)
      .addCase(addLanguageThunk.fulfilled, (state, action) => {
        setSuccess(state);
        if (Array.isArray(action.payload)) {
          state.languages = action.payload;
        } else {
          state.languages.push(action.payload);
        }
        if (state.profile) state.profile.languages = state.languages;
      })
      .addCase(addLanguageThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // GET /profile/languages/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(fetchLanguagesThunk.pending, startLoading)
      .addCase(fetchLanguagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = action.payload;
      })
      .addCase(fetchLanguagesThunk.rejected, setError)

      // ══════════════════════════════════════════════════════════════════════
      // DELETE /profile/languages/{id}
      // ══════════════════════════════════════════════════════════════════════
      .addCase(deleteLanguageThunk.pending, startLoading)
      .addCase(deleteLanguageThunk.fulfilled, (state, action) => {
        setSuccess(state);
        state.languages = state.languages.filter(
          (l) => l.id !== action.meta.arg
        );
        if (state.profile) state.profile.languages = state.languages;
      })
      .addCase(deleteLanguageThunk.rejected, setError);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────
export const { clearProfileSuccess, clearProfileError, resetProfile } =
  profileSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// Co-locating selectors with the slice avoids import chasing across files.
// Components import what they need directly from this file.
// ─────────────────────────────────────────────────────────────────────────────

/** True while any profile request is in-flight */
export const selectProfileLoading = (state) => state.profile.loading;

/** Last error message string, or null */
export const selectProfileError = (state) => state.profile.error;

/** True immediately after any successful mutation */
export const selectProfileSuccess = (state) => state.profile.success;

/** Full profile object */
export const selectProfile = (state) => state.profile.profile;

/** Header section */
export const selectProfileHeader = (state) => state.profile.header;

/** About / bio section */
export const selectProfileAbout = (state) => state.profile.about;

/** Social / professional links */
export const selectProfileLinks = (state) => state.profile.links;

/** Array of skills */
export const selectProfileSkills = (state) => state.profile.skills;

/** Array of experience entries */
export const selectProfileExperiences = (state) => state.profile.experiences;

/** Array of education entries */
export const selectProfileEducations = (state) => state.profile.educations;

/** Array of certifications */
export const selectProfileCertifications = (state) =>
  state.profile.certifications;

/** Array of languages */
export const selectProfileLanguages = (state) => state.profile.languages;

/** Profile avatar image URL */
export const selectProfileImage = (state) => state.profile.profileImage;

/** Banner image URL */
export const selectBannerImage = (state) => state.profile.bannerImage;

export default profileSlice.reducer;
