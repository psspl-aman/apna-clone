# FRONTEND_SKILL.md — React + TypeScript + Redux Toolkit + Tailwind

> Read this before starting Phase 5, 6, 7, 8, 9, 10, 11, 13, or 14.

**Last updated: 2026-05-29 (Phase 14)**

---

## 1. Dependency Installation

```bash
cd frontend

# State management
npm install @reduxjs/toolkit react-redux

# Routing
npm install react-router-dom

# HTTP
npm install axios

# Forms & validation
npm install react-hook-form @hookform/resolvers yup

# UI utilities
npm install clsx tailwind-merge

# Icons
npm install lucide-react

# Notifications
npm install react-hot-toast

# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 2. Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#1a7d4e',   // apna green
          600: '#166534',
          DEFAULT: '#1a7d4e',
        },
        apna: {
          green: '#1a7d4e',
          teal: '#00b09b',
          purple: '#7c3aed',
          gray: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 3. Redux Store Setup

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jobsReducer from '../features/jobs/jobsSlice';
import applicationsReducer from '../features/applications/applicationsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 4. Slice Template

```typescript
// src/features/jobs/jobsSlice.ts
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

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (filters: Partial<JobFilters>, { rejectWithValue }) => {
    try {
      return await jobsService.getJobs(filters);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await jobsService.getJobById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Job not found');
    }
  }
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
        state.meta = action.payload.meta;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.selectedJob = action.payload.data;
      });
  },
});

export const { setFilter, setPage, clearFilters, clearSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
```

---

## 5. Axios API Service

```typescript
// src/services/api.ts
import axios from 'axios';
import { store } from '../app/store';
import { logout, refreshToken } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshTkn = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken: refreshTkn }
        );
        localStorage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 6. TypeScript Types

```typescript
// src/types/index.ts

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  createdAt: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  resumeUrl?: string;
  experience: number;
  skills: string[];
  education: string;
  city: string;
  gender: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  city: string;
}

export interface Job {
  id: string;
  companyId: string;
  company: Company;
  title: string;
  description: string;
  category: string;
  city: string;
  jobType: 'full_time' | 'part_time' | 'work_from_home' | 'night_shift';
  salaryMin?: number;
  salaryMax?: number;
  experienceMin: number;
  experienceMax?: number;
  gender: string;
  education?: string;
  openings: number;
  isActive: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  candidateId: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}

export interface Category {
  id: number;
  slug: string;
  label: string;
  openings?: number;
}

export interface City {
  id: number;
  slug: string;
  name: string;
}

export interface JobFilters {
  keyword: string;
  city: string;
  category: string;
  job_type: string;
  salary_min: number;
  exp_min: number;
  exp_max?: number;
  date_posted: string;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}
```

---

## 7. Protected Route Pattern (Phase 14 updated)

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();

  // CRITICAL: Wait for loadCurrentUser() to finish on reload before deciding role
  // Without this, user is null while token exists → false redirect on page reload
  if (isAuthenticated && !user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#1a7d4e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect employers to employer login, candidates to main login
    const loginPath = requiredRole === 'employer' ? '/employer/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Employer on candidate route → employer dashboard (not home)
    if (user?.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

---

## 8. Router Setup (Phase 13 updated — standalone employer routes)

```tsx
// src/App.tsx
// KEY PATTERN: Employer pages are STANDALONE (no shared Navbar/Footer)
// This allows them to have their own dark-themed layout.

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Standalone employer pages — own navbar/layout */}
        <Route path="/employer/login" element={<EmployerLoginPage />} />
        <Route path="/employer/dashboard"
          element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/employer/post-job"
          element={<ProtectedRoute requiredRole="employer"><PostJobWizard /></ProtectedRoute>} />

        {/* All other routes — shared Navbar + Footer layout */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile"
                  element={<ProtectedRoute requiredRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 9. Filter Sidebar Component Structure

```tsx
// src/components/FilterSidebar/FilterSidebar.tsx
// Uses Redux: dispatch(setFilter(...)) on every change
// NO local state for filter values — always from Redux store

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Sections to build:
// 1. Date Posted (radio: All / Last 24h / Last 3 days / Last 7 days)
// 2. Distance (radio: All / 5km / 10km / 20km / 50km)
// 3. Salary (range slider: 0 to 1.5L)
// 4. Experience (range: 0 to 10+ years)
// 5. Job Type (checkboxes: Full Time / Part Time / Work from Home / Night Shift)
// 6. Category (checkboxes, from API /categories)
```

---

## 10. URL Filter Sync Pattern

```typescript
// In JobsPage — sync filters with URL search params
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

// On mount — read URL params → set Redux filters
useEffect(() => {
  const filters = Object.fromEntries(searchParams.entries());
  dispatch(setFilter(filters));
}, []);

// On filter change — update URL
useEffect(() => {
  const params = buildSearchParams(filters); // strip empty values
  setSearchParams(params);
  dispatch(fetchJobs(filters));
}, [filters]);
```

---

## 11. Standalone Page Pattern (Phase 13)

Employer pages have their own navbar/layout and are registered as standalone routes (outside the shared `<Navbar>/<Footer>` wrapper).

```tsx
// Pattern for a page with its own header:
export const EmployerLoginPage = () => {
  const { loading, isAuthenticated, user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  // Always declare ALL hooks before any conditional returns
  const { register, handleSubmit, formState } = useForm(...);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate(user.role === 'employer' ? '/employer/dashboard' : '/', { replace: true });
    }
  }, [isAuthenticated, user, loading]);

  // Show spinner during auth re-hydration (token exists but user not yet fetched)
  if (isAuthenticated && !user && loading) {
    return <div className="spinner" />;
  }

  return (
    <div style={{ backgroundColor: '#1a0630' }}>
      {/* Own navbar */}
      <nav>...</nav>
      {/* Own content */}
      <main>...</main>
    </div>
  );
};
```

**Key rules:**
- Declare ALL hooks (useForm, useState, etc.) BEFORE any conditional `return` to avoid `react-hooks/rules-of-hooks` errors
- Check `isAuthenticated && !user && loading` to detect reload auth hydration
- Use `useEffect` for redirect-after-auth (not inline conditional return)

---

## 12. Candidate Auth Modal (Phase 14)

Instead of navigating to `/login`, open a modal overlay from the Navbar.

```tsx
// In Navbar.tsx
const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>(
  { open: false, tab: 'login' }
);

const openLogin = () => setAuthModal({ open: true, tab: 'login' });
const closeAuth = () => setAuthModal((s) => ({ ...s, open: false }));

// Render at end of Navbar (inside React fragment <>...)</>
<CandidateAuthModal isOpen={authModal.open} defaultTab={authModal.tab} onClose={closeAuth} />
```

```tsx
// CandidateAuthModal.tsx key patterns:
export const CandidateAuthModal = ({ isOpen, defaultTab = 'login', onClose }: Props) => {
  // All hooks before any early return
  const loginForm = useForm({ resolver: yupResolver(loginSchema) });
  const regForm = useForm({ ... });

  // Sync tab when modal opens
  useEffect(() => { setTab(defaultTab); }, [defaultTab, isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Modal card */}
    </div>
  );
};
```

---

## 13. Razorpay Frontend Integration (Phase 13)

```tsx
// Load Razorpay script dynamically
const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Payment flow:
const handlePay = async () => {
  // 1. Create order on backend
  const { data } = await api.post('/payments/create-order', { plan });
  const order = data.data;

  // 2. Mock mode (dev without real keys)
  if (order.mock) {
    await api.post('/payments/publish-job', { jobData, payment: { razorpay_order_id: order.id, ... } });
    toast.success('Job published!'); return;
  }

  // 3. Real Razorpay checkout
  await loadRazorpay();
  const rzp = new (window as any).Razorpay({
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: 'INR',
    order_id: order.id,
    handler: async (response: any) => {
      await api.post('/payments/publish-job', { jobData, payment: response });
      toast.success('Payment successful!');
    },
  });
  rzp.open();
};
```

Add to `.env`:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
```
