/**
 * src/api/jobMatchApi.js
 *
 * REST API client matching Spring Boot AI Job Match Score Integration:
 * Base URL: http://localhost:8080/api/recruiter
 * Global Header: Authorization: Bearer <jwt>
 */

import { api } from "../config/Api";

/**
 * 1. Fetch Candidates for a Job with Match Scores (Optimized, No N+1)
 * GET /api/recruiter/jobs/{jobId}/candidates-with-match
 * @param {number|string} jobId
 * @param {object} params - { page = 0, size = 10, sort = "ma.matchPercentage,desc" }
 */
export const getCandidatesWithMatchApi = async (jobId, { page = 0, size = 10, sort = "ma.matchPercentage,desc" } = {}) => {
  const response = await api.get(`/recruiter/jobs/${jobId}/candidates-with-match`, {
    params: { page, size, sort },
  });
  return response.data;
};

/**
 * 2. Get Full Match Analysis Breakdown
 * GET /api/recruiter/applications/{applicationId}/match
 * @param {number|string} applicationId
 */
export const getMatchAnalysisApi = async (applicationId) => {
  const response = await api.get(`/recruiter/applications/${applicationId}/match`);
  return response.data;
};

/**
 * 3. Recalculate Match Score
 * POST /api/recruiter/applications/{applicationId}/match/recalculate
 * @param {number|string} applicationId
 */
export const recalculateMatchScoreApi = async (applicationId) => {
  const response = await api.post(`/recruiter/applications/${applicationId}/match/recalculate`);
  return response.data;
};
