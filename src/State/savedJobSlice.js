/**
 * src/State/savedJobSlice.js
 *
 * Redux slice for Saved Jobs feature.
 */

import { createSlice } from "@reduxjs/toolkit";
import {
  saveJobThunk,
  unsaveJobThunk,
  fetchMySavedJobsThunk,
  checkIsJobSavedThunk,
} from "./savedJobThunk";

const initialState = {
  savedJobs: [],
  savedJobIds: [], // Array of saved job IDs for quick lookup
  isCurrentJobSaved: false,
  loading: false,
  error: null,
  success: false,
};

const savedJobSlice = createSlice({
  name: "savedJob",
  initialState,
  reducers: {
    clearSavedJobError: (state) => {
      state.error = null;
    },
    clearSavedJobSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch My Saved Jobs ──
      .addCase(fetchMySavedJobsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySavedJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const pageData = action.payload;
        const list = Array.isArray(pageData?.content)
          ? pageData.content
          : Array.isArray(pageData)
          ? pageData
          : pageData?.data || [];
        state.savedJobs = list;
        state.savedJobIds = list.map((item) => item.jobId || item.job?.id || item.id).filter(Boolean);
      })
      .addCase(fetchMySavedJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Save Job ──
      .addCase(saveJobThunk.fulfilled, (state, action) => {
        state.success = true;
        const newSaved = action.payload;
        if (newSaved) {
          state.savedJobs.unshift(newSaved);
          const jobId = newSaved.jobId || newSaved.job?.id || newSaved.id;
          if (jobId && !state.savedJobIds.includes(jobId)) {
            state.savedJobIds.push(jobId);
          }
        }
        state.isCurrentJobSaved = true;
      })

      // ── Unsave Job ──
      .addCase(unsaveJobThunk.fulfilled, (state, action) => {
        const jobId = action.payload;
        state.savedJobs = state.savedJobs.filter(
          (item) => (item.jobId || item.job?.id || item.id) !== jobId
        );
        state.savedJobIds = state.savedJobIds.filter((id) => id !== jobId);
        state.isCurrentJobSaved = false;
      })

      // ── Check Is Job Saved ──
      .addCase(checkIsJobSavedThunk.fulfilled, (state, action) => {
        const { isSaved } = action.payload;
        state.isCurrentJobSaved = isSaved;
      });
  },
});

export const { clearSavedJobError, clearSavedJobSuccess } = savedJobSlice.actions;
export default savedJobSlice.reducer;
