/**
 * src/api/verificationApi.js
 *
 * Centralized API service for Recruiter Verification and Admin Approval System.
 * Reuses the central Axios instance from src/config/Api.js.
 */

import { api } from "../config/Api";

// ─── Recruiter Verification Endpoints ──────────────────────────────────────────

/**
 * Fetch the current recruiter's verification status and submission details.
 * GET /api/recruiter/verification-status
 */
export const getRecruiterVerificationStatusApi = async () => {
  const response = await api.get("/recruiter/verification-status");
  return response.data?.data ?? response.data;
};

/**
 * Submit or update recruiter/company verification details.
 * POST /api/recruiter/verification
 * @param {Object} data - { fullName, designation, companyName, companyWebsite, workEmail, companyLocation, companyDescription, linkedinProfile }
 */
export const submitRecruiterVerificationApi = async (data) => {
  const response = await api.post("/recruiter/verification", data);
  return response.data?.data ?? response.data;
};

// ─── Admin Verification & Review Endpoints ────────────────────────────────────

/**
 * Fetch paginated list of recruiters for admin review.
 * GET /api/admin/recruiters
 * @param {Object} params - { status, page, size, search }
 */
export const getAdminRecruitersApi = async ({ status, page = 0, size = 10, search = "" } = {}) => {
  const params = { page, size };
  if (status && status !== "ALL") params.status = status;
  if (search && search.trim()) params.search = search.trim();

  const response = await api.get("/admin/recruiters", { params });
  return response.data?.data ?? response.data;
};

/**
 * Fetch detailed verification profile for a specific recruiter.
 * GET /api/admin/recruiters/{id}
 */
export const getAdminRecruiterDetailsApi = async (id) => {
  const response = await api.get(`/admin/recruiters/${id}`);
  return response.data?.data ?? response.data;
};

/**
 * Approve a recruiter account.
 * PATCH /api/admin/recruiters/{id}/approve
 */
export const approveRecruiterApi = async (id) => {
  const response = await api.patch(`/admin/recruiters/${id}/approve`);
  return response.data?.data ?? response.data;
};

/**
 * Reject a recruiter account with a required explanation reason.
 * PATCH /api/admin/recruiters/{id}/reject
 * @param {string|number} id
 * @param {string} reason
 */
export const rejectRecruiterApi = async (id, reason) => {
  const response = await api.patch(`/admin/recruiters/${id}/reject`, { reason });
  return response.data?.data ?? response.data;
};

/**
 * Suspend a recruiter account with a reason.
 * PATCH /api/admin/recruiters/{id}/suspend
 * @param {string|number} id
 * @param {string} reason
 */
export const suspendRecruiterApi = async (id, reason) => {
  const response = await api.patch(`/admin/recruiters/${id}/suspend`, { reason });
  return response.data?.data ?? response.data;
};
