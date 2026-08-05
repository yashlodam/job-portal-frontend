/**
 * src/config/Api.js
 *
 * Central Axios instance for the entire application.
 *
 * Responsibilities:
 *  - Set the base URL for all requests.
 *  - Attach the JWT Bearer token to every outgoing request automatically.
 *  - Handle HTTP errors centrally (401, 403, 500, network failures).
 *  - Auto-logout on 401 by dispatching logout() to Redux.
 *
 * Every API module (profileApi.js, etc.) imports from this file.
 * Nothing outside this file should create a separate axios instance.
 */

import axios from "axios";
import { store } from "../State/Store";
import { logout } from "../State/AuthSlic";

// ─── Base URL ─────────────────────────────────────────────────────────────────
const API_URL = "http://localhost:8080/api";

// ─── Axios Instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Reads the JWT from localStorage and attaches it as a Bearer token to every
// outgoing request. Content-Type is overridden to multipart/form-data
// automatically by the browser when FormData is passed as the body — we must
// NOT set it manually in that case, so we only set it for non-FormData bodies.
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    // When the request body is a FormData instance (image uploads), remove the
    // manually set Content-Type so Axios/browser can set the correct multipart
    // boundary automatically.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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
      // Normalise so every thunk can destructure error.response?.data uniformly
      error.userMessage = "Network error. Please check your internet connection.";
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 401:
        // Token expired or missing — auto-logout only if we had a token
        if (localStorage.getItem("jwt")) {
          console.warn("[API] 401 Unauthorised — token expired. Logging out.");
          store.dispatch(logout());
        }
        break;

      case 403:
        console.warn("[API] 403 Forbidden — you do not have permission for this action.");
        error.userMessage = "You do not have permission to perform this action.";
        break;

      case 404:
        console.warn(`[API] 404 Not Found — ${error.config?.url}`);
        error.userMessage = "The requested resource was not found.";
        break;

      case 500:
      case 502:
      case 503:
        console.error(`[API] ${status} Server Error — ${error.config?.url}`);
        error.userMessage = "A server error occurred. Please try again later.";
        break;

      default:
        console.error(
          `[API] Unexpected error ${status}:`,
          typeof error.response?.data === "object"
            ? (error.response?.data?.message || JSON.stringify(error.response.data))
            : String(error.response?.data || error.message)
        );
    }

    return Promise.reject(error);
  }
);