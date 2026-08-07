/**
 * src/features/resume-analyzer/slices/analysisSlice.js
 * Redux Toolkit slice managing AI Resume Analyzer state.
 * Implements strict two-step flow & clean resume deletion thunks.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resumeAnalyzerService } from "../services/resumeAnalyzerService";

// Step 1: Upload Resume File ONLY (Does NOT analyze automatically)
export const uploadResumeOnlyThunk = createAsyncThunk(
  "analysis/uploadResumeOnlyThunk",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUploadProgress(0));
      const resumeInfo = await resumeAnalyzerService.uploadResume(file, (progress) => {
        dispatch(setUploadProgress(progress));
      });
      return resumeInfo;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to upload resume file"
      );
    }
  }
);

// Step 2: Trigger AI Analysis ONLY when user clicks the "Analyze Resume" button
export const triggerAnalysisThunk = createAsyncThunk(
  "analysis/triggerAnalysisThunk",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentResume, analysis } = getState().analysis;
      const resumeInfo = currentResume || { id: analysis?.resumeId || 1 };
      const result = await resumeAnalyzerService.analyzeResume(resumeInfo, true);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to analyze resume"
      );
    }
  }
);

export const reAnalyzeResumeThunk = triggerAnalysisThunk;

// Fetch Latest Analysis from Backend API
export const fetchLatestAnalysisThunk = createAsyncThunk(
  "analysis/fetchLatestAnalysisThunk",
  async (resumeId, { rejectWithValue }) => {
    try {
      const result = await resumeAnalyzerService.getLatestAnalysis(resumeId || 1);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch analysis"
      );
    }
  }
);

// Delete Resume & Analysis Thunk
export const deleteResumeThunk = createAsyncThunk(
  "analysis/deleteResumeThunk",
  async (_, { getState, dispatch }) => {
    try {
      const { currentResume, analysis } = getState().analysis;
      const resumeId = currentResume?.id || analysis?.resumeId || analysis?.id;
      if (resumeId) {
        await resumeAnalyzerService.deleteAnalysis(resumeId);
      }
    } catch (err) {
      console.warn("[analysisSlice] Delete analysis error:", err);
    } finally {
      dispatch(deleteResume());
    }
  }
);

const initialState = {
  status: "idle", // 'idle' | 'uploading' | 'uploaded' | 'analyzing' | 'success' | 'error'
  uploadProgress: 0,
  currentResume: null,
  analysis: null,
  activeDashboardTab: "overview",
  error: null,
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setActiveDashboardTab: (state, action) => {
      state.activeDashboardTab = action.payload;
    },
    resetAnalysisState: (state) => {
      state.status = "idle";
      state.currentResume = null;
      state.analysis = null;
      state.uploadProgress = 0;
      state.error = null;
    },
    deleteResume: (state) => {
      state.currentResume = null;
      state.analysis = null;
      state.status = "idle";
      state.uploadProgress = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Upload File Only
      .addCase(uploadResumeOnlyThunk.pending, (state) => {
        state.status = "uploading";
        state.error = null;
      })
      .addCase(uploadResumeOnlyThunk.fulfilled, (state, action) => {
        state.status = "uploaded";
        state.currentResume = action.payload;
        state.uploadProgress = 100;
      })
      .addCase(uploadResumeOnlyThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // 2. Trigger AI Analysis on Button Click
      .addCase(triggerAnalysisThunk.pending, (state) => {
        state.status = "analyzing";
        state.error = null;
      })
      .addCase(triggerAnalysisThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.analysis = action.payload;
      })
      .addCase(triggerAnalysisThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // Fetch Latest Analysis
      .addCase(fetchLatestAnalysisThunk.pending, (state) => {
        state.status = "analyzing";
        state.error = null;
      })
      .addCase(fetchLatestAnalysisThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.analysis = action.payload;
        if (!state.currentResume && action.payload) {
          state.currentResume = {
            id: action.payload.resumeId || action.payload.id,
            name: action.payload.resumeName,
            size: action.payload.fileSize || "1.8 MB",
            uploadedAt: action.payload.analyzedAt,
          };
        }
      })
      .addCase(fetchLatestAnalysisThunk.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const {
  setUploadProgress,
  setActiveDashboardTab,
  resetAnalysisState,
  deleteResume,
  clearError,
} = analysisSlice.actions;

export default analysisSlice.reducer;
