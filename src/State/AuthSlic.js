import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";


// ─── Register ────────────────────────────────────────────────────────────────
export const signup = createAsyncThunk(
    "auth/signup",
    async (signupRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/register", signupRequest);
            console.log("User registered successfully:", response.data);

            if (response.data.jwt) {
                localStorage.setItem("jwt", response.data.jwt);
            }

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
export const signin = createAsyncThunk(
    "auth/signin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/login", loginRequest);
            console.log("Login successful:", response.data);

            const token = response.data.token || response.data.jwt;
            if (token) {
                localStorage.setItem("jwt", token);
            }

            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            return rejectWithValue(
                error.response?.data || { message: "Login failed. Please try again." }
            );
        }
    }
);

// ─── Fetch Profile ───────────────────────────────────────────────────────────
export const getUserProfile = createAsyncThunk(
    "auth/getUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/profile");
            console.log("Profile fetched successfully:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch profile" }
            );
        }
    }
);

// ─── Restore Auth on Startup ─────────────────────────────────────────────────
// Called once when the app mounts. Reads the JWT from localStorage; if
// present, validates it by hitting /profile. On success the profile lands in
// Redux and the user stays logged in. On any failure (401, network error,
// no token) the token is removed and the user is treated as logged out.
export const restoreAuthState = createAsyncThunk(
    "auth/restoreAuthState",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            // No token — nothing to restore. Not an error.
            return rejectWithValue({ noToken: true });
        }

        try {
            const response = await api.get("/profile");
            console.log("Auth restored from token:", response.data);
            return response.data;
        } catch (error) {
            console.warn("Token invalid or expired — clearing.");
            localStorage.removeItem("jwt");
            return rejectWithValue(
                error.response?.data || { message: "Session expired. Please log in again." }
            );
        }
    }
);

// ─── Send OTP ────────────────────────────────────────────────────────────────
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/sendOtp/${email}`);
            console.log("OTP sent successfully:", response.data);
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
            const response = await api.post("/users/verify-otp", request);
            console.log("OTP verified:", response.data);
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
            const response = await api.post("/users/reset-password", request);
            console.log("Password reset successfully:", response.data);
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
    // isAuthRestored: false means "we haven't checked localStorage yet".
    // The Header uses this to avoid flashing the Login button while the
    // startup profile fetch is in flight.
    isAuthRestored: false,
};

// ─── Slice ───────────────────────────────────────────────────────────────────
const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        logout: (state) => {
            localStorage.removeItem("jwt");
            state.profile = null;
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = null;
            // Mark as restored so the Header shows Login (not a spinner)
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
            // pending: keep isAuthRestored=false (spinner stays visible)
            .addCase(restoreAuthState.pending, (state) => {
                state.loading = true;
            })
            // fulfilled: profile fetched → user is logged in
            .addCase(restoreAuthState.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.isAuthRestored = true;   // ← ungate the UI
            })
            // rejected: no token OR invalid token → stay logged out
            .addCase(restoreAuthState.rejected, (state) => {
                state.loading = false;
                state.profile = null;
                state.isAuthRestored = true;   // ← ungate the UI
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
                state.message = action.payload.message || "Registration successful";
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
            .addCase(signin.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.message = "Login successful";
                // NOTE: profile is set by the subsequent getUserProfile call
                // dispatched from Login.jsx after a successful signin.
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
                // After a fresh login the auth is obviously restored
                state.isAuthRestored = true;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch profile";
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
                state.message = action.payload.message || "OTP sent successfully";
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
                state.message = action.payload.message || "OTP verified successfully";
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
                state.message = action.payload.message || "Password reset successful";
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