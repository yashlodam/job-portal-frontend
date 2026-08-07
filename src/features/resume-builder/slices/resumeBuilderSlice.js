/**
 * src/features/resume-builder/slices/resumeBuilderSlice.js
 * Redux Toolkit slice managing AI Resume Builder state matching Spring Boot ResumeBuilderController.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resumeBuilderService } from "../services/resumeBuilderService";
import { BLANK_RESUME_SCHEMA, RESUME_TEMPLATES } from "../constants/resumeTemplates";

export const calculateResumeCompletion = (resume) => {
  if (!resume) return 0;
  let filled = 0;
  let total = 8;

  if (resume.personalInfo?.fullName && resume.personalInfo?.email) filled += 1;
  if (resume.personalInfo?.phone && resume.personalInfo?.linkedIn) filled += 1;
  if (resume.summary && resume.summary.length > 20) filled += 1;
  if (Array.isArray(resume.experience) && resume.experience.length > 0) filled += 1;
  if (Array.isArray(resume.education) && resume.education.length > 0) filled += 1;
  if (Array.isArray(resume.projects) && resume.projects.length > 0) filled += 1;
  if (resume.skills?.technical && resume.skills.technical.length > 0) filled += 1;
  if (Array.isArray(resume.certifications) && resume.certifications.length > 0) filled += 1;

  return Math.round((filled / total) * 100);
};

// Async Thunks mapping Spring Boot ResumeBuilderController
export const fetchResumesThunk = createAsyncThunk(
  "resumeBuilder/fetchResumesThunk",
  async (_, { rejectWithValue }) => {
    try {
      const resumes = await resumeBuilderService.fetchResumes();
      return resumes;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "Failed to load resumes");
    }
  }
);

export const createResumeThunk = createAsyncThunk(
  "resumeBuilder/createResumeThunk",
  async (resumeData, { rejectWithValue }) => {
    try {
      const newResume = await resumeBuilderService.createResume(resumeData);
      return newResume;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "Failed to create resume");
    }
  }
);

export const updateResumeThunk = createAsyncThunk(
  "resumeBuilder/updateResumeThunk",
  async ({ id, resumeData }, { rejectWithValue }) => {
    try {
      const updated = await resumeBuilderService.updateResume(id, resumeData);
      return updated;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "Failed to save resume");
    }
  }
);

export const deleteResumeThunk = createAsyncThunk(
  "resumeBuilder/deleteResumeThunk",
  async (id, { rejectWithValue }) => {
    try {
      await resumeBuilderService.deleteResume(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "Failed to delete resume");
    }
  }
);

export const duplicateResumeThunk = createAsyncThunk(
  "resumeBuilder/duplicateResumeThunk",
  async (id, { rejectWithValue }) => {
    try {
      const duplicated = await resumeBuilderService.duplicateResume(id);
      return duplicated;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "Failed to duplicate resume");
    }
  }
);

export const generateAiSummaryThunk = createAsyncThunk(
  "resumeBuilder/generateAiSummaryThunk",
  async (resumeId, { rejectWithValue }) => {
    try {
      const result = await resumeBuilderService.generateAiSummary(resumeId);
      const text = result.summary || result.aiContent || result.content;
      return { targetField: "summary", aiContent: text };
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "AI summary generation failed");
    }
  }
);

export const improveContentThunk = createAsyncThunk(
  "resumeBuilder/improveContentThunk",
  async ({ resumeId, content, itemType, itemId }, { rejectWithValue }) => {
    try {
      const result = await resumeBuilderService.improveContent(resumeId, { content, itemType });
      const text = result.improvedContent || result.aiContent || result.content;
      return { targetField: itemType || "experience", itemId, originalText: content, aiContent: text };
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "AI content improvement failed");
    }
  }
);

export const suggestSkillsThunk = createAsyncThunk(
  "resumeBuilder/suggestSkillsThunk",
  async (resumeId, { rejectWithValue }) => {
    try {
      const result = await resumeBuilderService.suggestSkills(resumeId);
      return result.skills || [];
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "AI skill suggestion failed");
    }
  }
);

export const analyzeBuilderResumeThunk = createAsyncThunk(
  "resumeBuilder/analyzeBuilderResumeThunk",
  async (resumeId, { rejectWithValue }) => {
    try {
      const result = await resumeBuilderService.analyzeBuilderResume(resumeId);
      return result;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.response?.data?.message || err.message || "Resume analysis failed");
    }
  }
);

const initialState = {
  resumes: [],
  currentResume: { ...BLANK_RESUME_SCHEMA },
  templates: RESUME_TEMPLATES,
  selectedTemplate: "professional",
  activeSection: "personalInfo",
  viewMode: "dashboard", // 'dashboard' | 'editor' | 'preview'

  loading: false,
  saving: false,
  saveStatus: "saved", // 'idle' | 'saving' | 'saved' | 'error'
  aiLoading: false,
  aiSuggestion: null,
  atsAnalysis: null,
  error: null,
  isDirty: false,
};

const resumeBuilderSlice = createSlice({
  name: "resumeBuilder",
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
      if (state.currentResume) {
        state.currentResume.templateId = action.payload;
        state.isDirty = true;
      }
    },
    setCurrentResume: (state, action) => {
      state.currentResume = { ...BLANK_RESUME_SCHEMA, ...action.payload };
      state.selectedTemplate = action.payload?.templateId || "professional";
      state.isDirty = false;
    },
    updatePersonalInfo: (state, action) => {
      state.currentResume.personalInfo = {
        ...state.currentResume.personalInfo,
        ...action.payload,
      };
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateSummary: (state, action) => {
      state.currentResume.summary = action.payload;
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateExperience: (state, action) => {
      state.currentResume.experience = action.payload;
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateEducation: (state, action) => {
      state.currentResume.education = action.payload;
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateProjects: (state, action) => {
      state.currentResume.projects = action.payload;
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateSkills: (state, action) => {
      state.currentResume.skills = {
        ...state.currentResume.skills,
        ...action.payload,
      };
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateCertifications: (state, action) => {
      state.currentResume.certifications = action.payload;
      state.currentResume.completionPercentage = calculateResumeCompletion(state.currentResume);
      state.isDirty = true;
    },
    updateAchievements: (state, action) => {
      state.currentResume.achievements = action.payload;
      state.isDirty = true;
    },
    updateLanguages: (state, action) => {
      state.currentResume.languages = action.payload;
      state.isDirty = true;
    },
    updateCustomSections: (state, action) => {
      state.currentResume.customSections = action.payload;
      state.isDirty = true;
    },
    setSaveStatus: (state, action) => {
      state.saveStatus = action.payload;
    },
    clearAISuggestion: (state) => {
      state.aiSuggestion = null;
    },
    applyAISuggestion: (state) => {
      if (!state.aiSuggestion) return;
      const { targetField, itemId, aiContent } = state.aiSuggestion;

      if (targetField === "summary") {
        state.currentResume.summary = aiContent;
      } else if (targetField === "experience" && itemId) {
        state.currentResume.experience = state.currentResume.experience.map((item) =>
          item.id === itemId ? { ...item, description: aiContent } : item
        );
      } else if (targetField === "projects" && itemId) {
        state.currentResume.projects = state.currentResume.projects.map((item) =>
          item.id === itemId ? { ...item, description: aiContent } : item
        );
      }
      state.aiSuggestion = null;
      state.isDirty = true;
    },
    createNewBlankResume: (state, action) => {
      const { title, templateId } = action.payload || {};
      state.currentResume = {
        ...BLANK_RESUME_SCHEMA,
        id: Date.now(),
        title: title || "Untitled Resume",
        templateId: templateId || "professional",
        lastUpdated: new Date().toISOString(),
      };
      state.selectedTemplate = templateId || "professional";
      state.viewMode = "editor";
      state.isDirty = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Resumes
      .addCase(fetchResumesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload || [];
      })
      .addCase(fetchResumesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Resume
      .addCase(createResumeThunk.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
        state.viewMode = "editor";
      })

      // Update Resume
      .addCase(updateResumeThunk.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(updateResumeThunk.fulfilled, (state, action) => {
        state.saveStatus = "saved";
        state.isDirty = false;
        const idx = state.resumes.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) {
          state.resumes[idx] = action.payload;
        } else {
          state.resumes.unshift(action.payload);
        }
      })
      .addCase(updateResumeThunk.rejected, (state) => {
        state.saveStatus = "error";
      })

      // Duplicate Resume
      .addCase(duplicateResumeThunk.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
        state.viewMode = "editor";
      })

      // Delete Resume
      .addCase(deleteResumeThunk.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r.id !== action.payload);
        if (state.currentResume?.id === action.payload) {
          state.currentResume = state.resumes[0] || { ...BLANK_RESUME_SCHEMA };
        }
      })

      // AI Summary
      .addCase(generateAiSummaryThunk.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(generateAiSummaryThunk.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestion = {
          targetField: action.payload.targetField,
          originalContent: state.currentResume.summary,
          aiContent: action.payload.aiContent,
        };
      })
      .addCase(generateAiSummaryThunk.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload;
      })

      // AI Bullet Improvement
      .addCase(improveContentThunk.pending, (state) => {
        state.aiLoading = true;
      })
      .addCase(improveContentThunk.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiSuggestion = {
          targetField: action.payload.targetField,
          itemId: action.payload.itemId,
          originalContent: action.payload.originalText,
          aiContent: action.payload.aiContent,
        };
      })
      .addCase(improveContentThunk.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload;
      })

      // Analyze Builder Resume
      .addCase(analyzeBuilderResumeThunk.fulfilled, (state, action) => {
        state.atsAnalysis = action.payload;
        if (action.payload?.atsScore) {
          state.currentResume.atsScore = action.payload.atsScore;
        }
      });
  },
});

export const {
  setViewMode,
  setActiveSection,
  setSelectedTemplate,
  setCurrentResume,
  updatePersonalInfo,
  updateSummary,
  updateExperience,
  updateEducation,
  updateProjects,
  updateSkills,
  updateCertifications,
  updateAchievements,
  updateLanguages,
  updateCustomSections,
  setSaveStatus,
  clearAISuggestion,
  applyAISuggestion,
  createNewBlankResume,
} = resumeBuilderSlice.actions;

export default resumeBuilderSlice.reducer;
