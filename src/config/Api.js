import axios from "axios";
import { store } from "../State/Store";
import { logout } from "../State/AuthSlic";

const API_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach the JWT from localStorage to every outgoing request automatically.
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// Intercept 401 Unauthorized responses (token expired / invalid).
// Clear the stored token and Redux auth state so the user is automatically
// logged out and the Header switches back to the Login button.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only act if we actually had a token (avoids loops on the login page)
      const hadToken = Boolean(localStorage.getItem("jwt"));
      if (hadToken) {
        console.warn("401 received — session expired. Logging out.");
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);