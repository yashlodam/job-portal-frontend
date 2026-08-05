/**
 * src/State/savedJobThunk.js
 *
 * Redux async thunks for Saved Jobs operations.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  saveJobApi,
  unsaveJobApi,
  getMySavedJobsApi,
  isJobSavedApi,
} from "../api/savedJobApi";

const getErrorPayload = (error) =>
  error.response?.data?.message ||
  error.response?.data?.errorMessage ||
  error.message ||
  "Saved job operation failed.";

/** POST /api/saved-jobs/{jobId} */
export const saveJobThunk = createAsyncThunk(
  "savedJob/saveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await saveJobApi(jobId);
      return response.data ?? response;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/** DELETE /api/saved-jobs/{jobId} */
export const unsaveJobThunk = createAsyncThunk(
  "savedJob/unsaveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      await unsaveJobApi(jobId);
      return jobId;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/** GET /api/saved-jobs/me */
export const fetchMySavedJobsThunk = createAsyncThunk(
  "savedJob/fetchMySavedJobs",
  async ({ page = 0, size = 10, sort = "createdAt,desc" } = {}, { rejectWithValue }) => {
    try {
      const response = await getMySavedJobsApi({ page, size, sort });
      return response.data ?? response;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/** GET /api/saved-jobs/{jobId}/check */
export const checkIsJobSavedThunk = createAsyncThunk(
  "savedJob/checkIsJobSaved",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await isJobSavedApi(jobId);
      const isSaved = response.data ?? response;
      return { jobId, isSaved: Boolean(isSaved) };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);
