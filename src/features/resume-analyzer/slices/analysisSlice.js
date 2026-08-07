/**
 * src/features/resume-analyzer/slices/analysisSlice.js
 * Redux Toolkit slice managing AI Resume Analyzer state using strictly real API data.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resumeAnalyzerService } from "../services/resumeAnalyzerService";

// Async Thunks
export const uploadAndAnalyzeResume = createAsyncThunk(
  "analysis/uploadAndAnalyzeResume",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      // 1. Upload phase
      dispatch(setUploadProgress(0));
      const resumeInfo = await resumeAnalyzerService.uploadResume(file, (progress) => {
        dispatch(setUploadProgress(progress));
      });

      dispatch(setResumeUploaded(resumeInfo));

      // 2. Analyze phase
      const result = await resumeAnalyzerService.analyzeResume(resumeInfo);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to analyze resume"
      );
    }
  }
);

export const fetchLatestAnalysisThunk = createAsyncThunk(
  "analysis/fetchLatestAnalysisThunk",
  async (resumeId, { rejectWithValue }) => {
    try {
      const result = await resumeAnalyzerService.getLatestAnalysis(resumeId);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch analysis"
      );
    }
  }
);

export const reAnalyzeResumeThunk = createAsyncThunk(
  "analysis/reAnalyzeResumeThunk",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { currentResume, analysis } = getState().analysis;
      const resumeInfo = currentResume || { id: analysis?.resumeId };
      const result = await resumeAnalyzerService.reAnalyzeResume(resumeInfo);
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to re-analyze resume"
      );
    }
  }
);

export const generateAIRewriteThunk = createAsyncThunk(
  "analysis/generateAIRewriteThunk",
  async ({ type, promptDetails }, { rejectWithValue }) => {
    try {
      const result = await resumeAnalyzerService.generateAIRewrite(type, promptDetails);
      return { type, result };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to generate AI rewrite");
    }
  }
);

const initialState = {
  status: "idle", // Starts cleanly in 'idle' mode waiting for real resume upload
  uploadProgress: 0,
  currentResume: null,
  analysis: null,
  activeDashboardTab: "overview",
  error: null,

  // Modals
  rewriteModalOpen: false,
  activeRewriteType: "summary",
  rewriteResult: null,
  isGeneratingRewrite: false,
  downloadModalOpen: false,
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setResumeUploaded: (state, action) => {
      state.currentResume = action.payload;
      state.status = "analyzing";
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
    },
    openRewriteModal: (state, action) => {
      state.rewriteModalOpen = true;
      state.activeRewriteType = action.payload || "summary";
      state.rewriteResult = null;
    },
    closeRewriteModal: (state) => {
      state.rewriteModalOpen = false;
      state.rewriteResult = null;
    },
    openDownloadModal: (state) => {
      state.downloadModalOpen = true;
    },
    closeDownloadModal: (state) => {
      state.downloadModalOpen = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload & Analyze Thunk
      .addCase(uploadAndAnalyzeResume.pending, (state) => {
        state.status = "uploading";
        state.error = null;
      })
      .addCase(uploadAndAnalyzeResume.fulfilled, (state, action) => {
        state.status = "success";
        state.analysis = action.payload;
        state.uploadProgress = 100;
      })
      .addCase(uploadAndAnalyzeResume.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // Fetch Latest Analysis Thunk
      .addCase(fetchLatestAnalysisThunk.pending, (state) => {
        state.status = "analyzing";
        state.error = null;
      })
      .addCase(fetchLatestAnalysisThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.analysis = action.payload;
      })
      .addCase(fetchLatestAnalysisThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // Re-Analyze Thunk
      .addCase(reAnalyzeResumeThunk.pending, (state) => {
        state.status = "analyzing";
        state.error = null;
      })
      .addCase(reAnalyzeResumeThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.analysis = action.payload;
      })
      .addCase(reAnalyzeResumeThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })

      // AI Rewrite Thunk
      .addCase(generateAIRewriteThunk.pending, (state) => {
        state.isGeneratingRewrite = true;
      })
      .addCase(generateAIRewriteThunk.fulfilled, (state, action) => {
        state.isGeneratingRewrite = false;
        state.rewriteResult = action.payload.result;
      })
      .addCase(generateAIRewriteThunk.rejected, (state) => {
        state.isGeneratingRewrite = false;
      });
  },
});

export const {
  setUploadProgress,
  setResumeUploaded,
  setActiveDashboardTab,
  resetAnalysisState,
  deleteResume,
  openRewriteModal,
  closeRewriteModal,
  openDownloadModal,
  closeDownloadModal,
  clearError,
} = analysisSlice.actions;

export default analysisSlice.reducer;
