/**
 * src/utils/assetUtils.js
 * Central resolver for static uploads (resumes, company logos, avatars).
 * Dynamically uses VITE_API_URL or defaults to http://localhost:8080.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const BACKEND_BASE_URL = RAW_API_URL.replace(/\/api\/?$/, "");

/**
 * Resolves a relative or absolute asset path to a valid URL.
 * @param {string} path - e.g. "/uploads/avatar/user.png" or "uploads/avatar/user.png" or full http url
 * @returns {string} - fully qualified asset URL
 */
export function getAssetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_BASE_URL}${cleanPath}`;
}