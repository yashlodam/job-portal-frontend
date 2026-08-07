/**
 * src/features/resume-builder/api/resumeBuilderApi.js
 * Centralized REST API client matching Spring Boot ResumeBuilderController (/api/resume-builder).
 */

import { api } from "../../../config/Api";

// ── CRUD Endpoints ─────────────────────────────────────────────────────────────
export const createResumeApi = (requestData) => api.post("/resume-builder", requestData);

export const getUserResumesApi = () => api.get("/resume-builder");

export const getResumeByIdApi = (resumeId) => api.get(`/resume-builder/${resumeId}`);

export const updateResumeApi = (resumeId, requestData) => api.put(`/resume-builder/${resumeId}`, requestData);

export const deleteResumeApi = (resumeId) => api.delete(`/resume-builder/${resumeId}`);

export const duplicateResumeApi = (resumeId) => api.post(`/resume-builder/${resumeId}/duplicate`);

export const reorderSectionApi = (resumeId, requestData) => api.put(`/resume-builder/${resumeId}/reorder`, requestData);

// ── Spring AI Feature Endpoints ───────────────────────────────────────────
export const generateAiSummaryApi = (resumeId) => api.post(`/resume-builder/${resumeId}/ai/summary`);

export const improveContentApi = (resumeId, requestData) => api.post(`/resume-builder/${resumeId}/ai/improve`, requestData);

export const suggestSkillsApi = (resumeId) => api.post(`/resume-builder/${resumeId}/ai/skills`);

// ── AI Resume Analyzer Integration ─────────────────────────────────────────
export const analyzeBuilderResumeApi = (resumeId) => api.post(`/resume-builder/${resumeId}/analyze`);
