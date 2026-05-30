# Apna Clone — Job Portal

Full-stack job portal clone of [apna.co](https://apna.co) built with React 18, NestJS, PostgreSQL, JWT authentication, and Razorpay payment integration.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Redux Toolkit, Tailwind CSS, React Router v6 |
| Backend | NestJS, Sequelize ORM, PostgreSQL |
| Auth | JWT (15min access + 7-day refresh tokens stored in DB) |
| Payments | Razorpay (with dev mock mode — no keys required for testing) |
| Validation | class-validator (backend), react-hook-form + yup (frontend) |

## Project Structure

```
apna-clone/
├── backend/                   # NestJS app (port 3001)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # JWT auth (register, login, refresh, logout)
│   │   │   ├── jobs/          # Job CRUD + full filter/search
│   │   │   ├── applications/  # Apply, status updates
│   │   │   ├── companies/     # Employer company profile
│   │   │   ├── candidates/    # Candidate profile, work exp, education, certs
│   │   │   ├── categories/    # Job categories lookup
│   │   │   ├── cities/        # Cities lookup
│   │   │   └── payments/      # Razorpay order creation + job publishing
│   │   ├── common/            # Guards, decorators, filters
│   │   ├── config/            # Database, JWT config
│   │   └── main.ts
│   ├── migrations/            # 9 Sequelize migrations
│   ├── seeders/               # 40 categories, 30 cities, 50 sample jobs
│   └── .env
├── frontend/                  # React app (port 3001)
│   ├── src/
│   │   ├── app/               # Redux store
│   │   ├── features/          # authSlice, jobsSlice, applicationsSlice, candidateSlice, uiSlice
│   │   ├── pages/
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Jobs.tsx           # Job listing + filters
│   │   │   ├── JobDetail.tsx      # Job detail + apply
│   │   │   ├── CandidateDashboard.tsx  # Candidate profile management
│   │   │   ├── EmployerLogin.tsx  # Standalone employer login (apna-style)
│   │   │   ├── EmployerDashboard.tsx   # apnaHire dashboard (collapsible sidebar)
│   │   │   └── PostJobWizard.tsx  # 5-step job posting + Razorpay payment
│   │   ├── components/
│   │   │   ├── Navbar/            # Main site navbar with CandidateAuthModal
│   │   │   ├── CandidateAuthModal.tsx  # Login/Register modal (no page nav)
│   │   │   ├── ProtectedRoute.tsx # Role-aware guard with loading state
│   │   │   └── Modal/             # Generic modal component
│   │   ├── services/          # Axios API layer with JWT interceptors
│   │   └── types/             # TypeScript interfaces
│   └── .env
├── docker-compose.yml         # PostgreSQL 15 + Redis 7
├── CLAUDE.md                  # Master rules + change log
├── PROGRESS.md                # Live progress tracker
├── PHASES.md                  # Execution guide
└── SKILLS/                    # Reference skill files
    ├── BACKEND_SKILL.md
    ├── FRONTEND_SKILL.md
    ├── DATABASE_SKILL.md
    └── AUTH_SKILL.md
```

## Quick Start

### Prerequisites

- Node.js >= 18
- Docker + Docker Compose
- npm

### 1. Database

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432 and Redis on port 6379.

### 2. Backend

```bash
cd backend
npm install
# Edit .env — set DB_PASSWORD, JWT secrets, and optionally Razorpay keys
DB_PASSWORD=1234 npx sequelize-cli db:migrate
DB_PASSWORD=1234 npx sequelize-cli db:seed:all
npm run start:dev              # http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm start                      # http://localhost:3001
```

> **Note:** Ports changed — backend runs on **5000**, frontend on **3001**.

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | - | Register as candidate |
| POST | /api/auth/register-employer | - | Register as employer |
| POST | /api/auth/login | - | Login |
| POST | /api/auth/refresh | - | Refresh access token |
| POST | /api/auth/logout | JWT | Logout |
| GET | /api/auth/me | JWT | Get current user |

### Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/jobs | - | List jobs (filters + pagination) |
| GET | /api/jobs/my | JWT (employer) | Employer's jobs |
| GET | /api/jobs/:id | - | Job detail |
| POST | /api/jobs | JWT (employer) | Create job |
| PUT | /api/jobs/:id | JWT (employer) | Update job |
| DELETE | /api/jobs/:id | JWT (employer) | Delete job |

### Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/applications/:jobId | JWT (candidate) | Apply to job |
| GET | /api/applications/my | JWT (candidate) | My applications |
| GET | /api/applications/job/:jobId | JWT (employer) | Applications for a job |
| PATCH | /api/applications/:id/status | JWT (employer) | Update status |

### Companies & Candidates
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/companies/me | JWT (employer) | My company |
| PUT | /api/companies/me | JWT (employer) | Update company |
| GET | /api/candidates/profile | JWT (candidate) | Get profile |
| PUT | /api/candidates/profile | JWT (candidate) | Update profile |
| POST | /api/candidates/resume | JWT (candidate) | Upload resume |

### Lookups
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/categories | - | All categories |
| GET | /api/cities | - | All cities |

### Payments (Razorpay)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/payments/plans | - | Get plan prices |
| POST | /api/payments/create-order | JWT (employer) | Create Razorpay order |
| POST | /api/payments/publish-job | JWT (employer) | Verify payment + publish job |

## API Response Format

All endpoints return:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "meta": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
}
```

## Environment Variables

### Backend `.env`
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apna_clone
DB_USER=postgres
DB_PASSWORD=your_db_password
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
FRONTEND_URL=http://localhost:3001
RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
RAZORPAY_KEY_SECRET=REPLACE_WITH_YOUR_SECRET
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
PORT=3001
REACT_APP_RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
```

> **Razorpay Dev Mode:** If `RAZORPAY_KEY_ID` contains the placeholder value, the backend automatically uses **mock mode** — no real payment is processed and jobs are published immediately. Replace keys with real Razorpay test keys from [dashboard.razorpay.com](https://dashboard.razorpay.com) to enable the payment popup.

## Seed Data

After running migrations and seeders:
- **40 job categories** (Telecalling, Delivery, Sales, etc.)
- **30 Indian cities** (Delhi-NCR, Mumbai, Bengaluru, etc.)
- **10 employer accounts** with companies
- **50 sample jobs** across categories and cities
- Login: `employer1@example.com` / `password123`

## Guards & Authorization

- `JwtAuthGuard` — requires valid access token
- `RolesGuard` — checks user role (candidate/employer/admin)
- `@Roles('employer')` decorator — restrict endpoint to specific role
- `@CurrentUser()` decorator — extract user from JWT payload

---

## Employer Flow

| URL | Description |
|-----|-------------|
| `/employer/login` | Standalone dark-themed login (apna.co design) |
| `/employer/dashboard` | apnaHire dashboard — collapsible sidebar, jobs list, avatar dropdown |
| `/employer/post-job` | 5-step job posting wizard with Razorpay payment |

### 5-Step Job Posting Wizard
1. **Job Details** — title, job type pills, work location, salary, 18 perks
2. **Candidate Requirements** — education, English level, experience, skills, description
3. **Interviewer Info** — walk-in interview, communication preference
4. **Job Preview** — summary with edit links back to each step
5. **Publish + Payment** — Classic (₹699) / Premium (₹1399) / Super Premium (₹2799) plans

---

## Candidate Login Modal

"Candidate Login" in the Navbar opens a modal overlay (no page navigation) with:
- **Login tab** — email + password with show/hide toggle
- **Register tab** — full name, email, phone, password
- Closes on backdrop click, Escape key, or ✕ button
- Employer accounts are blocked from logging in via this modal

---

## Database Migrations

Run order:
```bash
DB_PASSWORD=<pwd> npx sequelize-cli db:migrate
```

Migrations (in order):
1. `create-users`
2. `create-candidate-profiles`
3. `create-companies`
4. `create-categories`
5. `create-cities`
6. `create-jobs`
7. `create-applications`
8. `create-refresh-tokens`
9. `add-columns-to-candidate-profiles`
10. `create-work-experiences`
11. `create-educations`
12. `create-certifications`
13. `add-advanced-job-fields` ← new in Phase 13 (perks, pay_type, Razorpay fields, etc.)
