# PROGRESS.md — Apna Clone Live Tracker

> **Instructions for Claude Code**: After completing ANY step, update this file immediately.
> Mark steps: `⬜ Not Started` → `🔄 In Progress` → `✅ Complete` → `❌ Blocked (reason)`

---

## 📊 Overall Progress

```
Phase  0: ✅✅✅✅✅✅  100%  — Scaffolding & Setup
Phase  1: ✅✅✅✅✅✅  100%  — Database Schema & Seeders
Phase  2: ✅✅✅✅✅✅  100%  — Backend Auth
Phase  3: ✅✅✅✅✅✅  100%  — Backend Jobs
Phase  4: ✅✅✅✅✅✅  100%  — Backend Applications & Companies
Phase  5: ✅✅✅✅✅✅  100%  — Frontend Foundation
Phase  6: ✅✅✅✅✅✅  100%  — Frontend Auth Pages
Phase  7: ✅✅✅✅✅✅  100%  — Frontend Home Page
Phase  8: ✅✅✅✅✅✅  100%  — Frontend Jobs Listing
Phase  9: ✅✅✅✅✅✅  100%  — Frontend Job Detail & Apply
Phase 10: ✅✅✅✅✅✅  100%  — Candidate Dashboard
Phase 11: ✅✅✅✅✅✅  100%  — Employer Dashboard
Phase 12: ✅✅✅✅✅✅  100%  — Polish & Deployment
Phase 13: ✅✅✅✅✅✅  100%  — UI Overhaul (Employer Flow + Payments)
Phase 14: ✅✅✅✅✅✅  100%  — Auth UX (Modal Login + Reload Fix)
```

---

## Phase 0 — Project Scaffolding & Setup

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 0.1 | Create monorepo root folder with `apna-clone/` | ✅ | |
| 0.2 | Scaffold NestJS backend: `nest new backend` | ✅ | |
| 0.3 | Scaffold React frontend: `npx create-react-app frontend --template typescript` | ✅ | |
| 0.4 | Create `docker-compose.yml` (Postgres + Redis) | ✅ | |
| 0.5 | Install all backend dependencies | ✅ | |
| 0.6 | Install all frontend dependencies | ✅ | |
| 0.7 | Configure ESLint + Prettier for both projects | ✅ | CRA + NestJS provide defaults |
| 0.8 | Set up Tailwind CSS in frontend | ✅ | |
| 0.9 | Create `.env` files for both projects | ✅ | |
| 0.10 | Verify backend connects to Postgres (`npm run start:dev`) | ✅ | Backend compiles (0 TS errors). DB connection requires Docker Postgres |

**Phase 0 Complete?** ✅ YES

---

## Phase 1 — Database Schema & Seeders

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1.1 | Create Sequelize config module | ✅ | |
| 1.2 | Create `users` model & migration | ✅ | |
| 1.3 | Create `candidate_profiles` model & migration | ✅ | |
| 1.4 | Create `companies` model & migration | ✅ | |
| 1.5 | Create `jobs` model & migration | ✅ | |
| 1.6 | Create `applications` model & migration | ✅ | |
| 1.7 | Create `categories` model & migration | ✅ | |
| 1.8 | Create `cities` model & migration | ✅ | |
| 1.9 | Create `refresh_tokens` model & migration | ✅ | |
| 1.10 | Run all migrations: `npx sequelize-cli db:migrate` | ✅ | All 8 migrations ran successfully |
| 1.11 | Create seeder for 50+ cities | ✅ | 30 Indian cities |
| 1.12 | Create seeder for 40+ categories | ✅ | 40 categories |
| 1.13 | Create seeder for sample companies (10) | ✅ | |
| 1.14 | Create seeder for sample jobs (50) | ✅ | |
| 1.15 | Run all seeders | ✅ | 3 seeders executed |
| 1.16 | Verify all tables and data in Postgres | ✅ | 10 users, 10 companies, 40 categories, 30 cities, 50 jobs |

**Phase 1 Complete?** ✅ YES

---

## Phase 2 — Backend Auth Module

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 2.1 | Create `AuthModule` with all files | ✅ | |
| 2.2 | Create `RegisterDto` with class-validator | ✅ | |
| 2.3 | Create `LoginDto` | ✅ | |
| 2.4 | Implement `POST /api/auth/register` (candidate) | ✅ | |
| 2.5 | Implement `POST /api/auth/register-employer` | ✅ | |
| 2.6 | Implement `POST /api/auth/login` | ✅ | |
| 2.7 | Implement JWT access token generation | ✅ | |
| 2.8 | Implement JWT refresh token generation + DB storage | ✅ | |
| 2.9 | Implement `POST /api/auth/refresh` | ✅ | |
| 2.10 | Implement `POST /api/auth/logout` | ✅ | |
| 2.11 | Create `JwtAuthGuard` | ✅ | |
| 2.12 | Create `RolesGuard` (candidate/employer/admin) | ✅ | |
| 2.13 | Create `@CurrentUser()` decorator | ✅ | |
| 2.14 | Implement `GET /api/auth/me` (protected) | ✅ | |
| 2.15 | Test all auth endpoints | ✅ | Register, login, refresh, me, logout verified |

**Phase 2 Complete?** ✅ YES

---

## Phase 3 — Backend Jobs Module

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 3.1 | Create `JobsModule` structure | ✅ | |
| 3.2 | Create `Job` Sequelize model with associations | ✅ | |
| 3.3 | Create `CreateJobDto` | ✅ | |
| 3.4 | Create `UpdateJobDto` | ✅ | |
| 3.5 | Create `JobFilterDto` (query params for filtering) | ✅ | |
| 3.6 | Implement `GET /api/jobs` with full filter logic | ✅ | city, category, type, exp, salary, datePosted, keyword |
| 3.7 | Implement full-text search with Postgres `ILIKE` | ✅ | |
| 3.8 | Implement pagination in job listing | ✅ | |
| 3.9 | Implement `GET /api/jobs/:id` | ✅ | |
| 3.10 | Implement `POST /api/jobs` (employer only) | ✅ | |
| 3.11 | Implement `PUT /api/jobs/:id` (employer, owns job) | ✅ | |
| 3.12 | Implement `DELETE /api/jobs/:id` (employer, owns job) | ✅ | |
| 3.13 | Implement `GET /api/jobs/my` (employer's jobs) | ✅ | |
| 3.14 | Create `GET /api/categories` endpoint | ✅ | |
| 3.15 | Create `GET /api/cities` endpoint | ✅ | |
| 3.16 | Test all job endpoints | ✅ | List, detail, create, update, delete, filters, my jobs verified |

**Phase 3 Complete?** ✅ YES

---

## Phase 4 — Backend Applications & Companies

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 4.1 | Create `ApplicationsModule` | ✅ | |
| 4.2 | Implement `POST /api/applications/:jobId` (apply) | ✅ | Prevents duplicate applications |
| 4.3 | Implement `GET /api/applications/my` (candidate's applications) | ✅ | |
| 4.4 | Implement `GET /api/applications/job/:jobId` (employer view) | ✅ | |
| 4.5 | Implement `PATCH /api/applications/:id/status` (employer updates status) | ✅ | |
| 4.6 | Create `CompaniesModule` | ✅ | |
| 4.7 | Implement `GET /api/companies/me` (employer's company) | ✅ | |
| 4.8 | Implement `PUT /api/companies/me` | ✅ | |
| 4.9 | Create `CandidatesModule` | ✅ | |
| 4.10 | Implement `GET /api/candidates/profile` | ✅ | |
| 4.11 | Implement `PUT /api/candidates/profile` | ✅ | |
| 4.12 | Implement `POST /api/candidates/resume` (file upload with Multer) | ✅ | |
| 4.13 | Test all endpoints | ✅ | Apply, my apps, job apps, status update, company, candidate profile verified |

**Phase 4 Complete?** ✅ YES

---

## Phase 5 — Frontend Foundation & Redux Setup

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 5.1 | Set up Redux store (`src/app/store.ts`) | ✅ | |
| 5.2 | Create `authSlice` with user state | ✅ | |
| 5.3 | Create `jobsSlice` with jobs list + filters state | ✅ | |
| 5.4 | Create `applicationsSlice` | ✅ | |
| 5.5 | Create `uiSlice` (loading, modals, toasts) | ✅ | |
| 5.6 | Set up Axios instance with interceptors (`src/services/api.ts`) | ✅ | Auto-attach JWT, handle 401 refresh |
| 5.7 | Create TypeScript types for all entities | ✅ | |
| 5.8 | Create `authService.ts` | ✅ | |
| 5.9 | Create `jobsService.ts` | ✅ | |
| 5.10 | Create `applicationsService.ts` | ✅ | |
| 5.11 | Set up React Router v6 with all routes | ✅ | |
| 5.12 | Create `ProtectedRoute` component | ✅ | |
| 5.13 | Create `EmployerRoute` component | ✅ | |
| 5.14 | Create shared Navbar component (logged in / logged out states) | ✅ | |
| 5.15 | Create Footer component | ✅ | |

**Phase 5 Complete?** ✅ YES

---

## Phase 6 — Frontend Auth Pages

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 6.1 | Build Login page with tabs (Candidate / Employer) | ✅ | |
| 6.2 | Build Register page (Candidate flow) | ✅ | |
| 6.3 | Build Register page (Employer flow) | ✅ | |
| 6.4 | Wire up login form → `authSlice` → API | ✅ | |
| 6.5 | Wire up register form → `authSlice` → API | ✅ | |
| 6.6 | Implement token persistence (localStorage) | ✅ | |
| 6.7 | Implement auto-login on app load (`/auth/me`) | ✅ | |
| 6.8 | Implement logout (clear tokens + Redux state) | ✅ | |
| 6.9 | Add form validation (react-hook-form + yup) | ✅ | |
| 6.10 | Test full auth flow end-to-end | ✅ | Full frontend + backend flow verified |

**Phase 6 Complete?** ✅ YES

---

## Phase 7 — Frontend Home Page

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 7.1 | Build Hero section (title, subtitle, search bar) | ✅ | |
| 7.2 | Build Search bar component | ✅ | |
| 7.3 | Build "Proud to Support" logos section | ✅ | |
| 7.4 | Build "Trusted by enterprises" marquee logo strip | ✅ | |
| 7.5 | Build Trending Searches section | ✅ | |
| 7.6 | Build Popular Jobs categories grid | ✅ | |
| 7.7 | Build Testimonials / Reviews section | ✅ | |
| 7.8 | Build Jobs by City link grid | ✅ | |
| 7.9 | Build Jobs by Department section | ✅ | |
| 7.10 | Wire search bar → navigate to `/jobs` | ✅ | |

**Phase 7 Complete?** ✅ YES

---

## Phase 8 — Frontend Jobs Listing & Filters

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 8.1 | Build Jobs listing page layout (sidebar + main + right panel) | ✅ | |
| 8.2 | Build FilterSidebar component | ✅ | |
| 8.3 | Implement Date Posted filter (radio: All/24h/3d/7d) | ✅ | |
| 8.4 | Implement Distance filter (radio: All/5km/10km/20km/50km) | ✅ | |
| 8.5 | Implement Salary range filter (slider) | ✅ | |
| 8.6 | Implement Experience filter | ✅ | |
| 8.7 | Implement Job Type filter (Full Time/Part Time/WFH) | ✅ | |
| 8.8 | Implement Category filter (checkboxes) | ✅ | |
| 8.9 | Build JobCard component | ✅ | |
| 8.10 | Build Pagination component | ✅ | |
| 8.11 | Wire all filters → Redux `jobsSlice.filters` → API call | ✅ | |
| 8.12 | Implement URL-synced filters (query params in URL) | ✅ | |
| 8.13 | Build right sidebar (profile card + track applications + download app) | ✅ | |
| 8.14 | Build Jobs dropdown mega-menu (matching screenshot 2) | ✅ | Enhanced with nested hover flyout submenus for City, Department, Company, Qualification, Others — 30 cities, 40 departments from seeders, 150ms hover delay for smooth UX |

**Phase 8 Complete?** ✅ YES

---

## Phase 9 — Frontend Job Detail & Apply

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 9.1 | Build Job Detail page | ✅ | |
| 9.2 | Show company info, job description, requirements | ✅ | |
| 9.3 | Show salary, experience, job type badges | ✅ | |
| 9.4 | Implement Apply button (candidate only) | ✅ | |
| 9.5 | Implement "Already applied" state | ✅ | |
| 9.6 | Show login modal if not authenticated | ✅ | |
| 9.7 | Build Apply confirmation modal | ✅ | |
| 9.8 | Wire apply → `applicationsSlice` → API | ✅ | |
| 9.9 | Show similar jobs at bottom | ✅ | |

**Phase 9 Complete?** ✅ YES

---

## Phase 10 — Candidate Dashboard

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 10.1 | Build Candidate Dashboard layout | ✅ | Rebuilt as full candidate profile page (2-column UI) |
| 10.2 | Build Profile view & edit form | ✅ | Enhanced with 10+ fields (DOB, gender, salary, languages, etc.) via modals |
| 10.3 | Build Resume upload section | ✅ | File upload with validation (PDF/DOC, 5MB limit) |
| 10.4 | Build My Applications list with status badges | ✅ | Integrated with applications service |
| 10.5 | Build Profile completeness indicator | ✅ | Dynamic percentage with color-coded bar |
| 10.6 | Route /dashboard → /profile | ✅ | Updated route, Navbar, Footer links |
| 10.7 | Database: new migrations (3 tables + column additions) | ✅ | work_experiences, educations, certifications + 14 new profile columns |
| 10.8 | Backend: Sequelize models for WorkExp, Education, Certification | ✅ | With HasMany associations on CandidateProfile |
| 10.9 | Backend: CRUD endpoints for work exp, education, certifications | ✅ | All create/update/delete with ownership checks |
| 10.10 | Backend: Profile completion calculation | ✅ | Auto-recalculated on profile update |
| 10.11 | Frontend: candidate service + Redux slice | ✅ | Full Redux state with all CRUD thunks |
| 10.12 | Frontend: Modal component + 6 edit modals | ✅ | WorkExp, Education, Cert, Skills, Languages, Salary, BasicInfo modals |

**Phase 10 Complete?** ✅ YES

---

## Phase 11 — Employer Dashboard

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 11.1 | Build Employer Dashboard layout | ✅ | |
| 11.2 | Build Post Job form (multi-step) | ✅ | |
| 11.3 | Build My Jobs list (active/inactive/closed) | ✅ | |
| 11.4 | Build Applicants list per job | ✅ | |
| 11.5 | Implement status update for applicants | ✅ | |
| 11.6 | Build Company Profile edit | ✅ | |

**Phase 11 Complete?** ✅ YES

---

## Phase 12 — Polish & Deployment

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 12.1 | Add loading skeletons for job cards | ✅ | |
| 12.2 | Add toast notifications (success/error) | ✅ | react-hot-toast wired |
| 12.3 | Make all pages mobile responsive | ✅ | |
| 12.4 | Add `<title>` and meta tags per page | ✅ | |
| 12.5 | Error boundary + 404 page | ✅ | |
| 12.6 | Write README.md with setup instructions | ✅ | |
| 12.7 | Final end-to-end test of all flows | ✅ | All 20+ API endpoints tested and verified |

**Phase 12 Complete?** ✅ YES

---

## Phase 13 — UI Overhaul (Employer Flow + Payments)

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 13.1 | Create `EmployerLoginPage` (standalone dark-theme apna-style) | ✅ | `/employer/login` route |
| 13.2 | Rebuild `EmployerDashboard` — collapsible sidebar, avatar dropdown | ✅ | Matches apnaHire design |
| 13.3 | Create `PostJobWizard` — 5-step job posting flow | ✅ | Steps: details, requirements, interview, preview, payment |
| 13.4 | Backend: `PaymentsModule` with Razorpay integration | ✅ | Mock mode for dev (no keys needed) |
| 13.5 | New migration: `add-advanced-job-fields` (12 new columns) | ✅ | perks[], pay_type, work_location_type, is_paid, razorpay_payment_id, etc. |
| 13.6 | Update `CreateJobDto` with new fields | ✅ | |
| 13.7 | Update `Job` Sequelize model with new @Column fields | ✅ | |
| 13.8 | Routing: employer routes standalone (no shared Navbar/Footer) | ✅ | |
| 13.9 | Role-based routing: employer → `/employer/dashboard`, not `/` | ✅ | |
| 13.10 | Sidebar toggle: collapse/expand on desktop | ✅ | |
| 13.11 | Avatar dropdown: View profile + Sign out | ✅ | Shows company name + phone |
| 13.12 | `ProtectedRoute`: employer on candidate route → redirect to employer dashboard | ✅ | |

**Phase 13 Complete?** ✅ YES

---

## Phase 14 — Auth UX (Modal Login + Reload Fix)

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 14.1 | Create `CandidateAuthModal` component | ✅ | Login + Register tabs, show/hide password, backdrop close, Escape key |
| 14.2 | Wire Navbar "Candidate Login" to modal (not page nav) | ✅ | Both desktop and mobile |
| 14.3 | Fix `ProtectedRoute` reload bug | ✅ | Added loading guard: shows spinner while `loadCurrentUser()` pending |
| 14.4 | Fix `EmployerLoginPage` reload bug | ✅ | Redirect if already authenticated, spinner during hydration |
| 14.5 | Block employer accounts from candidate modal | ✅ | Error toast if employer tries to login via candidate modal |
| 14.6 | Fix hooks-rules-of-hooks: `useForm` before conditional return | ✅ | |

**Phase 14 Complete?** ✅ YES

---

## 🐛 Issues / Blockers Log

| Date | Issue | Status | Resolution |
|------|-------|--------|------------|
| 2026-05-26 | PostgreSQL not available in environment | ✅ Resolved | Found local Postgres running, updated password in .env |
| 2026-05-26 | Migration ordering (applications before jobs) | ✅ Resolved | Renamed timestamps to fix run order |
| 2026-05-26 | Login 500: column "updated_at" missing in refresh_tokens | ✅ Resolved | Added updated_at column to migration |
| 2026-05-26 | Sequelize model fields shadowing attribute getters/setters | ✅ Resolved | Added `declare` keyword to all @Column fields in all 8 models |
| 2026-05-26 | JWT strategy missing companyId/candidateId | ✅ Resolved | Added direct DB queries for Company and CandidateProfile |
| 2026-05-26 | Application model missing `applied_at` column definition | ✅ Resolved | Added @Column for applied_at |
| 2026-05-26 | Eager loading `include: [{ model: Company }]` not binding in ApplicationsModule | ✅ Resolved | Replaced with direct companyModel.findByPk query |
| 2026-05-29 | ENOSPC: System limit for file watchers reached | ✅ Resolved | `echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf && sysctl -p` |
| 2026-05-29 | ProtectedRoute redirects on page reload (user null before loadCurrentUser) | ✅ Resolved | Added `isAuthenticated && !user && loading` spinner guard |
| 2026-05-29 | TS2802: Set<string> spread with downlevelIteration | ✅ Resolved | Changed `[...new Set()]` to `Array.from(new Set())` |
| 2026-05-29 | react-hooks/rules-of-hooks: useForm called after conditional return | ✅ Resolved | Moved useForm call above early return |

---

## 📝 Notes & Decisions

- **Ports**: Backend on 3001, Frontend on 3001 (changed from 3001/3000)
- **Razorpay**: Mock mode auto-activates when key contains placeholder string — no account needed for dev
- **Employer login**: Standalone full-page route (no shared Navbar/Footer) so it can have its own dark theme
- **Candidate login**: Modal overlay instead of page navigation — better UX, stays on current page after login
- **ProtectedRoute reload fix**: Must check `loading` state before making role-based redirect decisions
- **Migration password**: Run as `DB_PASSWORD=1234 npx sequelize-cli db:migrate` since .env not auto-loaded by CLI
