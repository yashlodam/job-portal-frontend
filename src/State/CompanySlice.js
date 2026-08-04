import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config/Api";


export const getAllCompanies = createAsyncThunk(
  "company/getAllCompanies",
  async (
    { page = 0, size = 10, sort = "companyName,asc" } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/companies", {
        params: { page, size, sort },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch companies",
        }
      );
    }
  }
);


export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/companies/${companyId}`);
      console.log("Company Data:", data); // Log the data to see what is returned  
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch company details",
        }
      );
    }
  }
);


export const searchCompanies = createAsyncThunk(
  "company/searchCompanies",
  async (
    {
      keyword,
      page = 0,
      size = 10,
      sort = "companyName,asc",
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/companies/search", {
        params: {
          keyword,
          page,
          size,
          sort,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Search failed",
        }
      );
    }
  }
);



export const getMyCompany = createAsyncThunk(
  "company/getMyCompany",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/companies/me");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch company",
        }
      );
    }
  }
);



export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/companies", companyData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to create company",
        }
      );
    }
  }
);


export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/companies/me", companyData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update company",
        }
      );
    }
  }
);


export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/companies/me");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete company",
        }
      );
    }
  }
);



export const uploadCompanyLogo = createAsyncThunk(
  "company/uploadCompanyLogo",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(
        "/companies/me/logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Logo upload failed",
        }
      );
    }
  }
);



export const uploadCompanyCover = createAsyncThunk(
  "company/uploadCompanyCover",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post(
        "/companies/me/cover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Cover upload failed",
        }
      );
    }
  }
);

export const getCompanyJobs = createAsyncThunk(
  "company/getCompanyJobs",
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
        `/companies/${companyId}/jobs`,
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
        error.response?.data || {
          success: false,
          message: "Failed to fetch company jobs",
        }
      );
    }
  }
);



export const getMyCompanyJobs = createAsyncThunk(
  "company/getMyCompanyJobs",
  async (
    {
      page = 0,
      size = 10,
      sort = "createdAt,desc",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.get("/companies/me/jobs", {
        params: {
          page,
          size,
          sort,
        },
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch company jobs",
        }
      );
    }
  }
);



const initialState = {
  // Company Details
  selectedCompany: null,
  myCompany: null,

  // Company Lists
  companies: [],
  searchResults: [],

  // Company Jobs
  companyJobs: [],

  // Pagination
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  },

  // Request Status
  loading: false,
  success: false,
  error: null,
  message: "",
};


const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {

        clearCompanyState(state) {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = "";
        },

        clearSelectedCompany(state) {
            state.selectedCompany = null;
        },

        clearSearchResults(state) {
            state.searchResults = [];
        },

    },

   extraReducers: (builder) => {

    // ==========================
    // Get All Companies
    // ==========================

    builder
        .addCase(getAllCompanies.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllCompanies.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.companies = action.payload.data.content;
            state.pagination = {
                pageNumber: action.payload.data.number,
                pageSize: action.payload.data.size,
                totalElements: action.payload.data.totalElements,
                totalPages: action.payload.data.totalPages,
                first: action.payload.data.first,
                last: action.payload.data.last,
            };

            state.message = action.payload.message;
        })
        .addCase(getAllCompanies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch companies";
        });



        builder
    .addCase(getCompanyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(getCompanyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.companyJobs = action.payload.data.content;

        state.pagination = {
            pageNumber: action.payload.data.number,
            pageSize: action.payload.data.size,
            totalElements: action.payload.data.totalElements,
            totalPages: action.payload.data.totalPages,
            first: action.payload.data.first,
            last: action.payload.data.last,
        };
    })
    .addCase(getCompanyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error =
            action.payload?.message || "Failed to fetch company jobs";
    });

    // ==========================
    // Get Company By Id
    // ==========================

    builder
        .addCase(getCompanyById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCompanyById.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.selectedCompany = action.payload.data;
        })
        .addCase(getCompanyById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Company not found";
        });

    // ==========================
    // My Company
    // ==========================

    builder
        .addCase(getMyCompany.pending, (state) => {
            state.loading = true;
        })
        .addCase(getMyCompany.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.myCompany = action.payload.data;
        })
        .addCase(getMyCompany.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // Create Company
    // ==========================

    builder
        .addCase(createCompany.pending, (state) => {
            state.loading = true;
        })
        .addCase(createCompany.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.myCompany = action.payload.data;
            state.selectedCompany = action.payload.data;
            state.message = action.payload.message;
        })
        .addCase(createCompany.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // Update Company
    // ==========================

    builder
        .addCase(updateCompany.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateCompany.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.myCompany = action.payload.data;
            state.selectedCompany = action.payload.data;
            state.message = action.payload.message;
        })
        .addCase(updateCompany.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // Delete Company
    // ==========================

    builder
        .addCase(deleteCompany.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteCompany.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.myCompany = null;
            state.selectedCompany = null;
            state.message = action.payload.message;
        })
        .addCase(deleteCompany.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // Upload Logo
    // ==========================

    builder
        .addCase(uploadCompanyLogo.pending, (state) => {
            state.loading = true;
        })
        .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.myCompany = action.payload.data;
            state.selectedCompany = action.payload.data;
        })
        .addCase(uploadCompanyLogo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // Upload Cover
    // ==========================

    builder
        .addCase(uploadCompanyCover.pending, (state) => {
            state.loading = true;
        })
        .addCase(uploadCompanyCover.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.myCompany = action.payload.data;
            state.selectedCompany = action.payload.data;
        })
        .addCase(uploadCompanyCover.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // Search Companies
    // ==========================

    builder
        .addCase(searchCompanies.pending, (state) => {
            state.loading = true;
        })
        .addCase(searchCompanies.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.searchResults = action.payload.data.content;
            state.pagination = {
                pageNumber: action.payload.data.number,
                pageSize: action.payload.data.size,
                totalElements: action.payload.data.totalElements,
                totalPages: action.payload.data.totalPages,
                first: action.payload.data.first,
                last: action.payload.data.last,
            };
        })
        .addCase(searchCompanies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

    // ==========================
    // My Company Jobs
    // ==========================

    builder
        .addCase(getMyCompanyJobs.pending, (state) => {
            state.loading = true;
        })
        .addCase(getMyCompanyJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.companyJobs = action.payload.data.content;

            state.pagination = {
                pageNumber: action.payload.data.number,
                pageSize: action.payload.data.size,
                totalElements: action.payload.data.totalElements,
                totalPages: action.payload.data.totalPages,
                first: action.payload.data.first,
                last: action.payload.data.last,
            };
        })
        .addCase(getMyCompanyJobs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message;
        });

}
});

export const {
    clearCompanyState,
    clearSelectedCompany,
    clearSearchResults,
} = companySlice.actions;

export default companySlice.reducer;