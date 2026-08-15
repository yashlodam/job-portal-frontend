/**
 * src/api/adminApi.js
 *
 * Centralized API endpoints for platform administration:
 * Users, Applicants, Companies, Jobs, and System Analytics.
 */

import { api } from "../config/Api";

// ─── Admin Users API ─────────────────────────────────────────────────────────

/**
 * Fetch paginated users list.
 * GET /admin/users (fallback to /users)
 */
export const getAdminUsersApi = async ({ role, page = 0, size = 50, search = "" } = {}) => {
  try {
    const params = { page, size };
    if (role && role !== "ALL") params.role = role;
    if (search && search.trim()) params.search = search.trim();

    const response = await api.get("/admin/users", { params });
    return response.data?.data ?? response.data;
  } catch (err) {
    if (err.response?.status === 404 || err.response?.status === 400) {
      try {
        const fallback = await api.get("/users", { params: { page, size, search } });
        return fallback.data?.data ?? fallback.data;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Fetch specific user details by ID.
 * GET /admin/users/{id}
 */
export const getAdminUserByIdApi = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    const fallback = await api.get(`/users/${id}`);
    return fallback.data?.data ?? fallback.data;
  }
};

/**
 * Delete a user / applicant / recruiter account from the platform.
 * DELETE /admin/users/{id} (with fallback to /users/{id} or /talent/{id})
 */
export const deleteUserApi = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data?.data ?? response.data;
  } catch (err) {
    try {
      const fallback = await api.delete(`/users/${id}`);
      return fallback.data?.data ?? fallback.data;
    } catch (e) {
      try {
        const talentFallback = await api.delete(`/talent/${id}`);
        return talentFallback.data?.data ?? talentFallback.data;
      } catch (err3) {
        const profileFallback = await api.delete(`/profiles/${id}`);
        return profileFallback.data?.data ?? profileFallback.data;
      }
    }
  }
};

/**
 * Toggle or update user account status (e.g. ACTIVE, SUSPENDED).
 * PATCH /admin/users/{id}/status
 */
export const updateUserStatusApi = async (id, status) => {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data?.data ?? response.data;
};

// ─── Admin Platform Overview Stats API ────────────────────────────────────────

/**
 * Fetch real system aggregate statistics.
 * GET /admin/stats
 */
export const getAdminStatsApi = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data?.data ?? response.data;
  } catch (err) {
    return null;
  }
};
