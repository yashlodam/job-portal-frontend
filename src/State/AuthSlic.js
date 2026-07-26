import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../config/Api";


// Register
export const signup = createAsyncThunk(
    "auth/signup",
    async (signupRequest, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/users/register",
                signupRequest
            );

            console.log("User registered successfully:", response.data);

            if (response.data.jwt) {
                localStorage.setItem("jwt", response.data.jwt);
            }

            return response.data;
        } catch (error) {
            console.error("Signup failed:", error);

            return rejectWithValue(
                error.response?.data || {
                    message: "Signup failed. Please try again.",
                }
            );
        }
    }
);

export const signin = createAsyncThunk(
    "auth/signin",
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/login", loginRequest);

            console.log("Login successful:", response.data);

            // Save JWT
            if (response.data.token) {
                localStorage.setItem("jwt", response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error("Login failed:", error);

            return rejectWithValue(
                error.response?.data || {
                    message: "Login failed. Please try again.",
                }
            );
        }
    }
);


export const getUserProfile = createAsyncThunk(
    "auth/getUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/profile");
            console.log("Profie fetch Sucessfully", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch profile",
                }
            );
        }
    }
);


// Send OTP
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post(`/users/sendOtp/${email}`);

            console.log("OTP sent successfully:", response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to send OTP.",
                }
            );
        }
    }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/users/verify-otp",
                request
            );

            console.log("OTP verified:", response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "OTP verification failed.",
                }
            );
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/users/reset-password",
                request
            );

            console.log("Password reset successfully:", response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Password reset failed.",
                }
            );
        }
    }
);



const initialState = {
    profile: null,
    loading: false,
    error: null,
    success: false,
    message: null,
};

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

            // ===================== SIGNUP =====================
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message =
                    action.payload.message || "Registration successful";
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

            // ===================== SIGNIN =====================
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


            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })

            .addCase(getUserProfile.fulfilled, (state, action) => {
                console.log("✅ Fulfilled reducer executed");
                console.log(action.payload);

                state.loading = false;
                state.profile = action.payload;

                console.log("Updated state:", state);
            })

            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message ||
                    "Failed to fetch profile";
            })

            // ===================== SEND OTP =====================
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message =
                    action.payload.message || "OTP sent successfully";
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

            // ===================== VERIFY OTP =====================
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message =
                    action.payload.message || "OTP verified successfully";
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

            // ===================== RESET PASSWORD =====================
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message =
                    action.payload.message || "Password reset successful";
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

export const {
    logout,
    clearError,
    clearMessage,
    clearSuccess,
} = authSlice.actions;

export default authSlice.reducer;