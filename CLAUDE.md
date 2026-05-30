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

## Git Commit Convention
```
feat(phase-N): description
fix(module): description
chore: description
```
