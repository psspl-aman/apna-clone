# CLAUDE.md — Apna.co Clone Project

## Project Overview
Full-stack job portal replica of apna.co built with:
- **Frontend**: React 18 + TypeScript + Redux Toolkit + Tailwind CSS
- **Backend**: NestJS + Sequelize ORM
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens)
- **Architecture**: Strict MVC on backend, feature-slice on frontend

---

## ⚠️ CRITICAL RULES — ALWAYS FOLLOW

1. **NEVER skip a phase.** Complete all steps in a phase before moving to the next.
2. **ALWAYS update `PROGRESS.md`** after completing any step or phase.
3. **ALWAYS use TypeScript** — no `any` types without `// eslint-disable` comment explaining why.
4. **ALWAYS follow MVC** on backend: Controller → Service → Repository (via Sequelize Model).
5. **ALWAYS use Redux Toolkit slices** for global state. No prop-drilling for shared state.
6. **NEVER put business logic in Controllers.** Controllers only call services.
7. **NEVER put SQL/DB calls in Services directly.** Use Sequelize models/repositories.
8. **API responses MUST follow the standard envelope**: `{ success, data, message, meta? }`.
9. **ALWAYS validate DTOs** using `class-validator` on every NestJS endpoint.
10. **Read the relevant SKILL.md** before starting any phase.

---

## Project Structure

```
apna-clone/
├── CLAUDE.md                  ← This file
├── PROGRESS.md                ← Live progress tracker (update after every step)
├── SKILLS/
│   ├── BACKEND_SKILL.md
│   ├── FRONTEND_SKILL.md
│   ├── DATABASE_SKILL.md
│   └── AUTH_SKILL.md
├── frontend/                  ← React app
│   ├── src/
│   │   ├── app/               ← Redux store setup
│   │   ├── features/          ← Feature slices (auth, jobs, applications...)
│   │   ├── pages/             ← Route-level page components
│   │   ├── components/        ← Shared UI components
│   │   ├── services/          ← Axios API service layer
│   │   ├── hooks/             ← Custom React hooks
│   │   ├── types/             ← Global TypeScript types
│   │   └── utils/             ← Helper functions
│   └── ...config files
└── backend/                   ← NestJS app
    ├── src/
    │   ├── modules/           ← Feature modules (auth, jobs, users...)
    │   │   └── [module]/
    │   │       ├── [module].controller.ts
    │   │       ├── [module].service.ts
    │   │       ├── [module].module.ts
    │   │       ├── dto/
    │   │       ├── models/    ← Sequelize models
    │   │       └── interfaces/
    │   ├── common/            ← Guards, interceptors, filters, decorators
    │   ├── config/            ← Database, JWT, app config
    │   └── main.ts
    └── ...config files
```

---

## Development Phases

| Phase | Name | Status |
|-------|------|--------|
| 0 | Project Scaffolding & Setup | ✅ Complete |
| 1 | Database Schema & Seeders | ✅ Complete |
| 2 | Backend Auth Module | ✅ Complete |
| 3 | Backend Jobs Module | ✅ Complete |
| 4 | Backend Applications & Companies | ✅ Complete |
| 5 | Frontend Foundation & Redux Setup | ✅ Complete |
| 6 | Frontend Auth Pages | ✅ Complete |
| 7 | Frontend Home Page | ✅ Complete |
| 8 | Frontend Jobs Listing & Filters | ✅ Complete |
| 9 | Frontend Job Detail & Apply | ✅ Complete |
| 10 | Frontend Candidate Dashboard | ✅ Complete |
| 11 | Frontend Employer Dashboard | ✅ Complete |
| 12 | Polish, Testing & Deployment | ✅ Complete |
| 13 | UI Overhaul — Employer Flow + Payments | ✅ Complete |
| 14 | Auth UX — Modal Login + Reload Fix | ✅ Complete |
| 15 | Job Payment Flow & Employer Dashboard Enhancement | ✅ Complete |
| 16 | UI/UX Polish — Jobs Listing, Browse, Footer, Navbar | ✅ Complete |
| 17 | Resume Tool (Career Compass) | ✅ Complete |

---

## API Response Envelope (MANDATORY)

Every API endpoint must return:
```typescript
{
  success: boolean;
  message: string;
  data: T | null;
  meta?: {          // for paginated responses
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

---

## Environment Variables

### Backend `.env`
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apna_clone
DB_USER=postgres
DB_PASSWORD=<your_password>
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
FRONTEND_URL=http://localhost:3001
RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
RAZORPAY_KEY_SECRET=REPLACE_WITH_YOUR_SECRET
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:3001/api
PORT=3001
REACT_APP_RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
```

---

## Phase 13 — UI Overhaul (Employer Flow + Payments)

### New Pages
- `pages/EmployerLogin.tsx` — standalone dark-themed employer login page (apna.co-style)
- `pages/EmployerDashboard.tsx` — full apnaHire dashboard with collapsible sidebar, avatar dropdown, jobs CRUD
- `pages/PostJobWizard.tsx` — 5-step job posting wizard (details → requirements → interview → preview → payment)

### New Backend Module
- `modules/payments/` — Razorpay integration
  - `POST /api/payments/create-order` — creates Razorpay order (or mock order in dev mode)
  - `POST /api/payments/publish-job` — verifies payment + creates job
  - Mock mode auto-activates when keys are placeholder values

### New Migration
- `20260529200000-add-advanced-job-fields` — adds 12 columns to `jobs` table:
  `work_location_type`, `pay_type`, `perks[]`, `has_joining_fee`, `is_night_shift`,
  `english_level`, `experience_type`, `is_walkin`, `contact_preference`, `plan_type`, `is_paid`, `razorpay_payment_id`

### Routing Changes
- `/employer/login` — standalone (no shared Navbar/Footer)
- `/employer/dashboard` — standalone, protected (employer only)
- `/employer/post-job` — standalone, protected → `PostJobWizard`
- Employers hitting candidate routes → redirect to `/employer/dashboard`
- Unauthenticated employer routes → redirect to `/employer/login`

---

## Phase 14 — Auth UX (Modal Login + Reload Fix)

### CandidateAuthModal
- `components/CandidateAuthModal.tsx` — modal with Login + Register tabs
- Triggered by "Candidate Login" button in Navbar (no page navigation)
- Features: password show/hide, close on backdrop/Escape, body scroll lock
- Employer accounts blocked from logging in via candidate modal

### ProtectedRoute Reload Fix
- Added loading guard: `isAuthenticated && !user && loading` → shows spinner instead of redirecting
- Prevents false redirect on page reload while `loadCurrentUser()` is pending

### EmployerLoginPage Reload Fix
- Added `useEffect` to redirect already-authenticated employers to `/employer/dashboard`
- Shows spinner during auth re-hydration instead of login form

---

## Phase 15 — Job Payment Flow & Employer Dashboard Enhancement

### Payment Model
- `modules/payments/models/payment.model.ts` — `Payment` Sequelize model tracking plan, amounts, Razorpay IDs, status, validity dates
- Migration `20260531000000-create-payments` — `payments` table

### Payment Endpoints
- `POST /api/payments/create-order` — now accepts optional `jobId`; records pending `Payment` row
- `POST /api/payments/publish-job` — verifies signature, marks payment success, updates or creates job
- `GET /api/payments/history` — returns all company payments (billing tab)

### PostJobWizard Changes
- Saves job draft (`is_paid: false, is_active: false`) when advancing from step 2 → 3
- Stores `jobId` in local state and passes to payment calls
- Accepts `location.state.initialStep`, `location.state.prefill`, `location.state.isPaid` for edit/finish-posting modes

### EmployerDashboard Changes
- Job cards: `Select Plan` badge for unpaid, `Active`/`Inactive` for paid
- `Finish posting` button on unpaid jobs → opens wizard at preview step
- Three-dot menu: Edit / Duplicate / Delete / Activate-Deactivate
- Billing tab: payment history table with filter chips (All/Success/Pending/Failed) and Retry button
- **All job fields now use camelCase** (`job.isPaid`, `job.isActive`) — required after Axios interceptor

### Global camelCase Conversion
- `services/api.ts` response interceptor: `response.data = toCamelCase(response.data)`
- `utils/caseTransform.ts` — recursive `toCamelCase` and `toSnakeCase` utilities
- ALL frontend code must use camelCase keys for API responses

---

## Phase 16 — UI/UX Polish (Jobs Listing, Browse, Footer, Navbar)

### New Page: Browse Jobs (`/jobs/browse`)
- `pages/BrowseJobs.tsx` — three sections (74 cities, 130+ companies, 52 departments)
- Live search bar filters all sections simultaneously
- Each item click dispatches Redux filter + navigates to `/jobs`
- Route registered before `/jobs/:id` to avoid dynamic-segment conflict

### Jobs Listing Page (`Jobs.tsx`)
- Pixel-perfect overhaul: apna green (#14a97c), salary in Indian locale, experience badges, work-mode/English badges
- Collapsible filter sidebar with active chip display

### Footer (`Footer.tsx`)
- Filter links now dispatch Redux `setFilter` AND navigate — works from any page
- Proper city slugs (`agra` not `Agra`) and department category slugs
- "View more" navigates to `/jobs/browse?section=city` or `department`
- Self-hides on `/jobs/browse`, `/career-compass/new`, `/career-compass/edit/*` via `useLocation`

### Navbar (`Navbar.tsx`)
- Jobs dropdown hover gap fix: `mt-2` → `pt-2` on `JobsDropdown` container
- "Resume Tool ▾" dropdown replaces simple "Resume Tool" link
  - Resumes → `/career-compass`
  - Cover Letters → `/career-compass?tab=cover-letters`
  - Click-outside close via `useRef` + `useEffect`

---

## Phase 17 — Resume Tool (Career Compass)

### New Pages
- `pages/CareerCompass.tsx` — dashboard at `/career-compass`; exports shared types and components
- `pages/ResumeBuilder.tsx` — full-screen accordion editor at `/career-compass/new` and `/career-compass/edit/:id`

### Shared Exports from `CareerCompass.tsx`
- `ResumeData`, `ResumePersonal`, `ResumeExpItem`, `ResumeEduItem`, `ResumeLanguage` — TypeScript interfaces
- `getStoredResumes()` / `saveStoredResumes()` — localStorage helpers (key: `apna_career_resumes`) with migration support
- `ResumeDocument` — renders full A4 resume (794px wide; used by both preview and builder)
- `ResumePreviewCard` — CSS `scale(0.32)` clipped thumbnail for dashboard cards

### CareerCompass Dashboard
- Resumes tab: grid of cards ("New Resume" + existing), mini preview, three-dot menu (Edit/Rename/Delete)
- Rename inline: click Rename → input replaces label, saves on blur/Enter
- Cover Letters tab: placeholder (coming soon)

### ResumeBuilder (Accordion Form + Live Preview)
- Left 480px: scrollable accordion sections
  - **Personal Info**: name, photo upload (UI only), email, mobile, city, experience level (Fresher/Experience radio), preferred title, professional summary (contenteditable rich text)
  - **Work Experience**: add/remove items; role, company, start/end month, currently-working checkbox, description
  - **Education**: add/remove items; degree, institution, field of study, start/end year
  - **Skills**: tag input (Enter or click Add), remove chips
  - **Languages**: name + level dropdown, add/remove
  - **Add Other Sections**: 7 optional card buttons (Internship, Projects, Certifications, Awards, Hobbies, Publications, Social Links)
- Right panel: `ResumeDocument` at `zoom: 0.6`; updates live as user types
- Top bar: ← back, editable resume name, Resume analysis (toast), Templates (toast), Download (print)

### "Use Profile" Prefill
- Calls `GET /candidates/profile`
- Response shape: `{ data: { profile: {...}, workExperiences: [...], educations: [...] } }`
- Reads work experiences from `d.workExperiences` (top-level) with fallback to `d.profile.workExperiences`
- Auto-generates summary from: `preferredJobTitles[0] + totalExperience + education + top-4-skills + city`
- Opens relevant sections after fill

### Routing
- `/career-compass` — inside Navbar layout (has Navbar, no Footer)
- `/career-compass/new` — inside Navbar layout (has Navbar, Footer hidden via `useLocation`)
- `/career-compass/edit/:id` — same as above
- Builder height: `h-[calc(100vh-4rem)]` (subtracts 64px navbar)

---

## Git Commit Convention
```
feat(phase-N): description
fix(module): description
chore: description
```
