import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jobsService } from '../../services/jobs.service';
import { Job, JobFilters, PaginationMeta } from '../../types';

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  filters: JobFilters;
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  filters: {
    keyword: '',
    city: '',
    category: '',
    job_type: '',
    salary_min: 0,
    exp_min: 0,
    date_posted: 'all',
    page: 1,
    limit: 10,
  },
  meta: null,
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (filters: Partial<JobFilters>, { rejectWithValue }) => {
    try {
      return await jobsService.getJobs(filters);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
    }
  },
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await jobsService.getJobById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Job not found');
    }
  },
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<JobFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload.data;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, setPage, clearFilters, clearSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
