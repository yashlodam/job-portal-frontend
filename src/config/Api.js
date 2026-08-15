/**
 * src/config/Api.js
 *
 * Central Axios instance for the entire application.
 *
 * Responsibilities:
 *  - Set the base URL for all requests.
 *  - Send the HttpOnly auth cookie automatically (withCredentials: true).
 *  - Read the XSRF-TOKEN cookie and attach it as X-XSRF-TOKEN on every
 *    state-changing request (POST, PUT, PATCH, DELETE) — CSRF protection.
 *  - Handle HTTP errors centrally (401, 403, 500, network failures).
 *  - Auto-logout on 401 by dispatching logout() to Redux.
 *
 * SECURITY NOTE:
 *  The JWT is NO LONGER stored in localStorage or attached as a Bearer header.
 *  It lives exclusively in an HttpOnly cookie that JavaScript cannot read.
 *  The browser sends it automatically on every request to the same origin.
 *
 * Every API module (profileApi.js, etc.) imports from this file.
 * Nothing outside this file should create a separate Axios instance.
 */

import axios from "axios";
import { store } from "../State/Store";
import { logout } from "../State/AuthSlic";

// ─── Base URL ─────────────────────────────────────────────────────────────────
const API_URL = "http://localhost:8080/api";

// ─── XSRF Token Helper ────────────────────────────────────────────────────────
// Reads the JS-readable XSRF-TOKEN cookie written by Spring Security.
// This implements the Double-Submit Cookie CSRF pattern:
//   Server sets XSRF-TOKEN cookie (not HttpOnly, so JS can read it).
//   Client reads it and sends the value as X-XSRF-TOKEN header.
//   Server validates: if cookie value === header value → legitimate same-origin request.
function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // CRITICAL: sends the HttpOnly auth cookie (and XSRF-TOKEN cookie) on every
  // cross-origin request to the backend. Without this, cookies are NOT sent.
  withCredentials: true,
  // Axios built-in CSRF support: reads xsrfCookieName cookie and sends it
  // as xsrfHeaderName header automatically on state-changing requests.
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Primary job: handle FormData content-type and ensure CSRF token is attached.
// The JWT is no longer read here — the browser sends it automatically via cookie.
api.interceptors.request.use(
  (config) => {
    // When the request body is a FormData instance (image/file uploads), remove
    // the manually set Content-Type so Axios/browser can set the correct
    // multipart boundary automatically.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Ensure CSRF token is always included on state-changing requests.
    // Axios handles this via xsrfCookieName/xsrfHeaderName above, but we add
    // an explicit fallback here in case the cookie is not yet available.
    const method = (config.method || "").toLowerCase();
    const requiresCsrf = ["post", "put", "patch", "delete"].includes(method);
    if (requiresCsrf && !config.headers["X-XSRF-TOKEN"]) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Centralises HTTP error handling for all API calls across the application.
// Each thunk still receives the error via Promise.reject so it can call
// rejectWithValue() — this interceptor only adds logging / side-effects.
api.interceptors.response.use(
  // Pass successful responses straight through.
  (response) => response,

  (error) => {
    // No response at all → network/CORS/timeout failure
    if (!error.response) {
      console.error(
        "[API] Network error — no response received. Check your connection or CORS settings.",
        error.message
      );
      error.userMessage = "Network error. Please check your internet connection.";
      return Promise.reject(error);
    }

    // Extract exact backend message if returned by Spring Boot (e.g. JobPortalException)
    const backendMsg =
      typeof error.response?.data === "object"
        ? error.response?.data?.message || error.response?.data?.error
        : typeof error.response?.data === "string"
        ? error.response.data
        : null;

    if (backendMsg) {
      error.userMessage = backendMsg;
    }

    const status = error.response?.status;

    switch (status) {
      case 401:
        // Cookie expired or invalid — log out the user.
        // We no longer check localStorage.getItem("jwt") since there is no JWT
        // in localStorage. Any 401 from the API means the session is gone.
        console.warn("[API] 401 Unauthorised — session expired. Logging out.");
        store.dispatch(logout());
        break;

      case 403:
        console.warn("[API] 403 Forbidden — you do not have permission for this action.");
        if (!error.userMessage)
          error.userMessage = "You do not have permission to perform this action.";
        break;

      case 404:
        console.warn(`[API] 404 Not Found — ${error.config?.url}`);
        if (!error.userMessage)
          error.userMessage = "The requested resource was not found.";
        break;

      case 500:
      case 502:
      case 503:
        console.error(`[API] ${status} Server Error — ${error.config?.url}`);
        if (!error.userMessage)
          error.userMessage = "A server error occurred. Please try again later.";
        break;

      default:
        console.error(
          `[API] Unexpected error ${status}:`,
          error.userMessage || error.message
        );
    }

    return Promise.reject(error);
  }
);