/**
 * src/api/verificationApi.js
 *
 * Centralized API service for Recruiter Verification and Admin Approval System.
 * Reuses the central Axios instance from src/config/Api.js.
 */

import { api } from "../config/Api";

// ─── Recruiter Self-Service Endpoints ──────────────────────────────────────────

/**
 * Fetch the current recruiter's verification status and submission details.
 * GET /api/recruiter/verification-status (fallback to /api/recruiter/verification)
 */
export const getRecruiterVerificationStatusApi = async () => {
  try {
    const response = await api.get("/recruiter/verification-status");
    return response.data?.data ?? response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fallback = await api.get("/recruiter/verification");
      return fallback.data?.data ?? fallback.data;
    }
    throw err;
  }
};

/**
 * Submit or update recruiter/company verification details.
 * POST /api/recruiter/verification/submit (fallback to /api/recruiter/verification)
 * @param {Object} data - { designation, note, companyName, companyWebsite, workEmail, companyLocation, companyDescription, linkedinProfile }
 */
export const submitRecruiterVerificationApi = async (data) => {
  try {
    const response = await api.post("/recruiter/verification/submit", data);
    return response.data?.data ?? response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fallback = await api.post("/recruiter/verification", data);
      return fallback.data?.data ?? fallback.data;
    }
    throw err;
  }
};

// ─── Admin Management Endpoints ───────────────────────────────────────────────

/**
 * Fetch paginated list of recruiters for admin review.
 * GET /api/admin/recruiters?status=...&page=0&size=10&sort=createdAt,desc
 * @param {Object} params - { status, page, size, search, sort }
 */
export const getAdminRecruitersApi = async ({
  status,
  page = 0,
  size = 10,
  search = "",
  sort = "createdAt,desc",
} = {}) => {
  const params = { page, size, sort };
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
 * @param {string|number} id
 * @param {string} [reason]
 */
export const approveRecruiterApi = async (id, reason = "Verified") => {
  const response = await api.patch(`/admin/recruiters/${id}/approve`, { reason });
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
 * Suspend a recruiter account with a required explanation reason.
 * PATCH /api/admin/recruiters/{id}/suspend
 * @param {string|number} id
 * @param {string} reason
 */
export const suspendRecruiterApi = async (id, reason) => {
  const response = await api.patch(`/admin/recruiters/${id}/suspend`, { reason });
  return response.data?.data ?? response.data;
};
