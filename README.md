# Apna Clone — Job Portal

Full-stack job portal clone of [apna.co](https://apna.co) built with React 18, NestJS, PostgreSQL, and JWT authentication.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Redux Toolkit, Tailwind CSS, React Router v6 |
| Backend | NestJS, Sequelize ORM, PostgreSQL |
| Auth | JWT (15min access + 7-day refresh tokens stored in DB) |
| Validation | class-validator (backend), react-hook-form + yup (frontend) |

## Project Structure

```
apna-clone/
├── backend/                   # NestJS app (port 3001)
│   ├── src/
│   │   ├── modules/           # auth, jobs, applications, companies, candidates...
│   │   ├── common/            # guards, decorators, filters
│   │   ├── config/            # database, JWT config
│   │   └── main.ts
│   ├── migrations/            # Sequelize migrations (8 tables)
│   ├── seeders/               # 40 categories, 30 cities, 50 sample jobs
│   └── .env
├── frontend/                  # React app (port 3000)
│   ├── src/
│   │   ├── app/               # Redux store
│   │   ├── features/          # authSlice, jobsSlice, applicationsSlice, uiSlice
│   │   ├── pages/             # 10 route-level page components
│   │   ├── components/        # Navbar, Footer, ProtectedRoute
│   │   ├── services/          # Axios API layer with JWT interceptors
│   │   └── types/             # TypeScript interfaces
│   └── .env
├── docker-compose.yml         # PostgreSQL 15 + Redis 7
├── CLAUDE.md                  # Master rules
├── PROGRESS.md                # Live progress tracker
└── PHASES.md                  # Execution guide
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
cp .env.example .env          # or use the existing .env
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run start:dev              # http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm start                      # http://localhost:3000
```

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
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apna_clone
DB_USER=postgres
DB_PASSWORD=password
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:3001/api
```

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
