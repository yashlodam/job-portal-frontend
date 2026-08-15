import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";

// ─── Register ────────────────────────────────────────────────────────────────
export const signup = createAsyncThunk(
    "auth/signup",
    async (signupRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/register", signupRequest);
            return response.data;
        } catch (error) {
            console.error("Signup failed:", error);
            return rejectWithValue(
                error.response?.data || { message: "Signup failed. Please try again." }
            );
        }
    }
);

// ─── Sign In ─────────────────────────────────────────────────────────────────
// On success, the backend sets the HttpOnly access_token cookie automatically.
// The JWT is never exposed to JavaScript.
export const signin = createAsyncThunk(
    "auth/signin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/login", loginRequest);
            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            return rejectWithValue(
                error.response?.data || { message: "Login failed. Please try again." }
            );
        }
    }
);

// ─── Fetch Current User ───────────────────────────────────────────────────────
// GET /api/auth/me (or /api/users/me) — cookie-authenticated
export const getUserProfile = createAsyncThunk(
    "auth/getUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/me");
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch user" }
            );
        }
    }
);

// ─── Restore Auth on Startup ─────────────────────────────────────────────────
// Called once when the app mounts. Hits /api/auth/me with credentials.
// If valid HttpOnly cookie is present, browser sends it automatically.
// On success, sets the profile in Redux. On 401/error, user remains logged out.
export const restoreAuthState = createAsyncThunk(
    "auth/restoreAuthState",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/auth/me");
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Not authenticated" }
            );
        }
    }
);

// ─── Logout ──────────────────────────────────────────────────────────────────
// Sends POST /api/auth/logout to clear the HttpOnly cookie on the server.
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/logout");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Logout failed" }
            );
        }
    }
);

// ─── Send OTP ────────────────────────────────────────────────────────────────
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post(`/auth/send-otp/${email}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to send OTP." }
            );
        }
    }
);

// ─── Verify OTP ──────────────────────────────────────────────────────────────
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/verify-otp", request);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "OTP verification failed." }
            );
        }
    }
);

// ─── Reset Password ──────────────────────────────────────────────────────────
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/reset-password", request);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Password reset failed." }
            );
        }
    }
);

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState = {
    profile: null,
    loading: false,
    error: null,
    success: false,
    message: null,
    // isAuthRestored: false means "startup profile fetch is in flight".
    isAuthRestored: false,
};

// ─── Slice ───────────────────────────────────────────────────────────────────
const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        logout: (state) => {
            // Fire API call to clear HttpOnly cookie on backend
            api.post("/auth/logout").catch(() => {});
            state.profile = null;
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = null;
            state.isAuthRestored = true;
        },

        clearError: (state) => {
            state.error = null;
        },

        clearMessage: (state) => {
            state.message = null;
        },

        clearSuccess: (state) => {
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

            // ═══════════════════ RESTORE AUTH (startup) ══════════════════════
            .addCase(restoreAuthState.pending, (state) => {
                state.loading = true;
            })
            .addCase(restoreAuthState.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.isAuthRestored = true;
            })
            .addCase(restoreAuthState.rejected, (state) => {
                state.loading = false;
                state.profile = null;
                state.isAuthRestored = true;
            })

            // ═══════════════════════ SIGNUP ══════════════════════════════════
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Registration successful";
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload?.errorMessage ||
                    action.payload?.message ||
                    action.payload ||
                    "Registration failed";
            })

            // ═══════════════════════ SIGNIN ══════════════════════════════════
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = "Login successful";
                // If login returned safe user payload in data, populate profile immediately
                if (action.payload?.data?.email) {
                    state.profile = action.payload.data;
                }
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload?.errorMessage ||
                    action.payload?.message ||
                    action.payload ||
                    "Login failed";
            })

            // ═══════════════════ GET USER PROFILE ════════════════════════════
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.isAuthRestored = true;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch user";
            })

            // ═══════════════════════ LOGOUT ══════════════════════════════════
            .addCase(logoutUser.fulfilled, (state) => {
                state.profile = null;
                state.loading = false;
                state.error = null;
                state.success = false;
                state.message = null;
                state.isAuthRestored = true;
            })

            // ═══════════════════════ SEND OTP ════════════════════════════════
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "OTP sent successfully";
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload?.errorMessage ||
                    action.payload?.message ||
                    action.payload ||
                    "Failed to send OTP";
            })

            // ══════════════════════ VERIFY OTP ═══════════════════════════════
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "OTP verified successfully";
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload?.errorMessage ||
                    action.payload?.message ||
                    action.payload ||
                    "OTP verification failed";
            })

            // ══════════════════════ RESET PASSWORD ═══════════════════════════
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Password reset successful";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload?.errorMessage ||
                    action.payload?.message ||
                    action.payload ||
                    "Password reset failed";
            });
    },
});

export const { logout, clearError, clearMessage, clearSuccess } = authSlice.actions;

export default authSlice.reducer;