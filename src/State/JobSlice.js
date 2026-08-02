import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config/Api";

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/jobs", jobData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to create job.",
        }
      );
    }
  }
);




export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/jobs/${jobId}`, jobData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to update job.",
        }
      );
    }
  }
);




export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/jobs/${jobId}`);

      return {
        jobId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to delete job.",
        }
      );
    }
  }
);



export const getAllJobs = createAsyncThunk(
  "jobs/getAllJobs",
  async (
    {
      page = 0,
      size = 10,
      sort = "createdAt,desc",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/jobs", {
        params: {
          page,
          size,
          sort,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch jobs.",
        }
      );
    }
  }
);



export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${jobId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch job.",
        }
      );
    }
  }
);



export const viewJob = createAsyncThunk(
  "jobs/viewJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/jobs/${jobId}/view`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to update views.",
        }
      );
    }
  }
);



export const getMyJobs = createAsyncThunk(
  "jobs/getMyJobs",
  async (
    {
      page = 0,
      size = 10,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/jobs/me", {
        params: {
          page,
          size,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch recruiter jobs.",
        }
      );
    }
  }
);



export const searchJobs = createAsyncThunk(
  "jobs/searchJobs",
  async (
    {
      keyword,
      page = 0,
      size = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/jobs/search", {
        params: {
          keyword,
          page,
          size,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Search failed.",
        }
      );
    }
  }
);


export const filterJobs = createAsyncThunk(
  "jobs/filterJobs",
  async (
    {
      filters = {},
      page = 0,
      size = 10,
      sort = "createdAt,desc",
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post(
        "/jobs/filter",
        filters,
        {
          params: {
            page,
            size,
            sort,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to filter jobs.",
        }
      );
    }
  }
);


export const getCompanyJobs = createAsyncThunk(
  "jobs/getCompanyJobs",
  async (
    {
      companyId,
      page = 0,
      size = 10,
      sort = "createdAt,desc",
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/jobs/company/${companyId}`,
        {
          params: {
            page,
            size,
            sort,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch company jobs.",
        }
      );
    }
  }
);


export const getJobsByCategory = createAsyncThunk(
  "jobs/getJobsByCategory",
  async (
    {
      category,
      page = 0,
      size = 10,
      sort = "createdAt,desc",
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/jobs/category/${category}`,
        {
          params: {
            page,
            size,
            sort,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch category jobs.",
        }
      );
    }
  }
);


export const getLatestJobs = createAsyncThunk(
  "jobs/getLatestJobs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/jobs/latest");

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch latest jobs.",
        }
      );
    }
  }
);


export const getFeaturedJobs = createAsyncThunk(
  "jobs/getFeaturedJobs",
  async (
    {
      page = 0,
      size = 10,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get(
        "/jobs/featured",
        {
          params: {
            page,
            size,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch featured jobs.",
        }
      );
    }
  }
);



export const getSimilarJobs = createAsyncThunk(
  "jobs/getSimilarJobs",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${jobId}/similar`);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch similar jobs.",
        }
      );
    }
  }
);


export const getCategories = createAsyncThunk(
  "jobs/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/jobs/categories");

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch categories.",
        }
      );
    }
  }
);


export const getWorkModes = createAsyncThunk(
  "jobs/getWorkModes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/jobs/work-modes");

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ?? {
          success: false,
          message: "Unable to fetch work modes.",
        }
      );
    }
  }
);





const initialState = {

    // ---------------- Job Lists ----------------

    jobs: [],
    latestJobs: [],
    featuredJobs: [],
    myJobs: [],
    companyJobs: [],
    categoryJobs: [],
    similarJobs: [],

    // ---------------- Job Details ----------------

    selectedJob: null,

    // ---------------- Dashboard ----------------

    categories: [],
    workModes: [],

    // ---------------- Pagination ----------------

    pagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
    },

    // ---------------- Request Status ----------------

    loading: false,
    success: false,
    error: null,
    message: ""
};

// ---------------- Helpers ----------------

const extractPagination = (data) => ({
  pageNumber: data?.pageNumber ?? data?.number ?? 0,
  pageSize: data?.pageSize ?? data?.size ?? 10,
  totalElements: data?.totalElements ?? 0,
  totalPages: data?.totalPages ?? 0,
  first: data?.first ?? true,
  last: data?.last ?? true,
});

const setPending = (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
};

const setRejected = (state, action) => {
  state.loading = false;
  state.success = false;
  state.error = action.payload?.message || "Something went wrong.";
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    clearJobMessage: (state) => {
      state.message = "";
    },
    resetJobState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ---------------- Create Job ----------------
      .addCase(createJob.pending, setPending)
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Job created successfully.";
        if (action.payload?.data) {
          state.jobs.unshift(action.payload.data);
        }
      })
      .addCase(createJob.rejected, setRejected)

      // ---------------- Update Job ----------------
      .addCase(updateJob.pending, setPending)
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Job updated successfully.";
        const updated = action.payload?.data;
        if (updated) {
          state.jobs = state.jobs.map((job) =>
            job.id === updated.id ? updated : job
          );
          state.myJobs = state.myJobs.map((job) =>
            job.id === updated.id ? updated : job
          );
          if (state.selectedJob?.id === updated.id) {
            state.selectedJob = updated;
          }
        }
      })
      .addCase(updateJob.rejected, setRejected)

      // ---------------- Delete Job ----------------
      .addCase(deleteJob.pending, setPending)
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Job deleted successfully.";
        const { jobId } = action.payload;
        state.jobs = state.jobs.filter((job) => job.id !== jobId);
        state.myJobs = state.myJobs.filter((job) => job.id !== jobId);
        if (state.selectedJob?.id === jobId) {
          state.selectedJob = null;
        }
      })
      .addCase(deleteJob.rejected, setRejected)

      // ---------------- Get All Jobs ----------------
      .addCase(getAllJobs.pending, setPending)
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(getAllJobs.rejected, setRejected)

      // ---------------- Get Job By Id ----------------
      .addCase(getJobById.pending, setPending)
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedJob = action.payload?.data ?? null;
      })
      .addCase(getJobById.rejected, setRejected)

      // ---------------- View Job ----------------
      .addCase(viewJob.fulfilled, (state, action) => {
        if (state.selectedJob && action.payload?.data) {
          state.selectedJob.views = action.payload.data.views ?? state.selectedJob.views;
        }
      })
      .addCase(viewJob.rejected, (state, action) => {
        state.error = action.payload?.message || "Unable to update views.";
      })

      // ---------------- Get My Jobs ----------------
      .addCase(getMyJobs.pending, setPending)
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myJobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(getMyJobs.rejected, setRejected)

      // ---------------- Search Jobs ----------------
      .addCase(searchJobs.pending, setPending)
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(searchJobs.rejected, setRejected)

      // ---------------- Filter Jobs ----------------
      .addCase(filterJobs.pending, setPending)
      .addCase(filterJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.jobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(filterJobs.rejected, setRejected)

      // ---------------- Get Company Jobs ----------------
      .addCase(getCompanyJobs.pending, setPending)
      .addCase(getCompanyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.companyJobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(getCompanyJobs.rejected, setRejected)

      // ---------------- Get Jobs By Category ----------------
      .addCase(getJobsByCategory.pending, setPending)
      .addCase(getJobsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categoryJobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(getJobsByCategory.rejected, setRejected)

      // ---------------- Get Latest Jobs ----------------
      .addCase(getLatestJobs.pending, setPending)
      .addCase(getLatestJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.latestJobs = action.payload?.data ?? [];
      })
      .addCase(getLatestJobs.rejected, setRejected)

      // ---------------- Get Featured Jobs ----------------
      .addCase(getFeaturedJobs.pending, setPending)
      .addCase(getFeaturedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.featuredJobs = action.payload?.data ?? [];
        state.pagination = extractPagination(action.payload);
      })
      .addCase(getFeaturedJobs.rejected, setRejected)

      // ---------------- Get Similar Jobs ----------------
      .addCase(getSimilarJobs.pending, setPending)
      .addCase(getSimilarJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.similarJobs = action.payload?.data ?? [];
      })
      .addCase(getSimilarJobs.rejected, setRejected)

      // ---------------- Get Categories ----------------
      .addCase(getCategories.pending, setPending)
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.categories = action.payload?.data ?? [];
      })
      .addCase(getCategories.rejected, setRejected)

      // ---------------- Get Work Modes ----------------
      .addCase(getWorkModes.pending, setPending)
      .addCase(getWorkModes.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.workModes = action.payload?.data ?? [];
      })
      .addCase(getWorkModes.rejected, setRejected);
  },
});

export const {
  clearJobError,
  clearJobMessage,
  resetJobState,
  clearSelectedJob,
} = jobSlice.actions;

export default jobSlice.reducer;