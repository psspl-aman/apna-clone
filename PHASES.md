# PHASES.md — Detailed Phase Execution Guide for Claude Code

> This file tells Claude Code exactly what to do in each phase, in what order, and how to verify completion.
> After completing each step, update PROGRESS.md.

---

## BEFORE STARTING ANY PHASE

1. Read `CLAUDE.md` for global rules
2. Read the relevant SKILL.md file(s) for the phase
3. Check `PROGRESS.md` — confirm prior phase is ✅ Complete
4. Update the phase step to 🔄 In Progress in PROGRESS.md

---

## ═══════════════════════════════════════
## PHASE 0 — Project Scaffolding & Setup
## ═══════════════════════════════════════

**Skill files to read**: BACKEND_SKILL.md, FRONTEND_SKILL.md

### Execution:

```bash
# 1. Create root
mkdir apna-clone && cd apna-clone

# 2. Scaffold NestJS
npm i -g @nestjs/cli
nest new backend --package-manager npm
cd backend

# 3. Install backend deps (from BACKEND_SKILL.md section 1)
npm install @nestjs/sequelize sequelize sequelize-typescript pg pg-hstore
npm install @nestjs/config @nestjs/jwt @nestjs/passport
npm install passport passport-jwt passport-local
npm install bcrypt class-validator class-transformer
npm install multer @nestjs/platform-express
npm install sequelize-cli
npm install -D @types/passport-jwt @types/passport-local @types/bcrypt @types/multer

# 4. Scaffold React
cd ..
npx create-react-app frontend --template typescript
cd frontend

# 5. Install frontend deps
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install react-hook-form @hookform/resolvers yup
npm install clsx tailwind-merge lucide-react react-hot-toast
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 6. Return to root
cd ..
```

### Files to create:
- `docker-compose.yml` (from BACKEND_SKILL.md section 10)
- `backend/.env` (from CLAUDE.md environment section)
- `frontend/.env` (from CLAUDE.md environment section)
- `backend/src/config/database.config.ts` (from BACKEND_SKILL.md section 6)
- `backend/sequelize.config.js` (from BACKEND_SKILL.md section 9)
- `frontend/tailwind.config.js` (from FRONTEND_SKILL.md section 2)
- `frontend/src/index.css` (with Tailwind directives)

### Verification:
```bash
docker-compose up -d
cd backend && npm run start:dev   # should say "Nest application running on port 3001"
cd frontend && npm start           # should open React app on port 3000
```

### Phase 0 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════════
## PHASE 1 — Database Schema & Seeders
## ════════════════════════════════════════════

**Skill files to read**: DATABASE_SKILL.md

### Execution order:

1. Create Sequelize CLI config at `backend/sequelize.config.js`
2. Create `backend/src/config/sequelize.config.ts` for NestJS module
3. Create migrations in order (see DATABASE_SKILL.md section 5):
   - `npx sequelize-cli migration:create --name create-users`
   - `npx sequelize-cli migration:create --name create-candidate-profiles`
   - `npx sequelize-cli migration:create --name create-companies`
   - `npx sequelize-cli migration:create --name create-categories`
   - `npx sequelize-cli migration:create --name create-cities`
   - `npx sequelize-cli migration:create --name create-jobs`
   - `npx sequelize-cli migration:create --name create-applications`
   - `npx sequelize-cli migration:create --name create-refresh-tokens`
4. Fill in each migration from DATABASE_SKILL.md section 1
5. Run: `npx sequelize-cli db:migrate`
6. Create seeders:
   - `npx sequelize-cli seed:create --name seed-categories`
   - `npx sequelize-cli seed:create --name seed-cities`
   - `npx sequelize-cli seed:create --name seed-sample-data`
7. Fill in seeders from DATABASE_SKILL.md sections 3 and 4
8. Run: `npx sequelize-cli db:seed:all`

### Verification:
```sql
-- Connect to postgres and verify:
SELECT COUNT(*) FROM categories;   -- should be ~40
SELECT COUNT(*) FROM cities;       -- should be ~30
SELECT COUNT(*) FROM jobs;         -- should be ~50 (sample data)
```

### Phase 1 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 2 — Backend Auth Module
## ════════════════════════════════════════

**Skill files to read**: BACKEND_SKILL.md, AUTH_SKILL.md

### Create these files:

```
backend/src/modules/auth/
├── auth.controller.ts       ← endpoints only, calls service
├── auth.service.ts          ← all auth logic (see AUTH_SKILL.md section 4)
├── auth.module.ts
├── dto/
│   ├── register.dto.ts      ← from AUTH_SKILL.md section 5
│   ├── register-employer.dto.ts
│   └── login.dto.ts
└── strategies/
    └── jwt.strategy.ts      ← from AUTH_SKILL.md section 3

backend/src/common/
├── guards/
│   ├── jwt-auth.guard.ts    ← from BACKEND_SKILL.md section 8
│   └── roles.guard.ts
├── decorators/
│   └── current-user.decorator.ts  ← from AUTH_SKILL.md section 6
└── filters/
    └── http-exception.filter.ts   ← from BACKEND_SKILL.md section 5

backend/src/modules/users/models/
└── user.model.ts

backend/src/modules/auth/models/
└── refresh-token.model.ts
```

### Endpoints to implement:
```typescript
POST /api/auth/register          → AuthService.register()
POST /api/auth/register-employer → AuthService.registerEmployer()
POST /api/auth/login             → AuthService.login()
POST /api/auth/refresh           → AuthService.refresh()
POST /api/auth/logout            → AuthService.logout() [JWT protected]
GET  /api/auth/me                → return current user [JWT protected]
```

### Update `main.ts`:
```typescript
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
app.setGlobalPrefix('api');
app.enableCors({ origin: process.env.FRONTEND_URL });
```

### Verification (test with Thunder Client / Postman):
- Register candidate → get tokens
- Login with same credentials → get tokens
- Call `/api/auth/me` with token → get user
- Call `/api/auth/refresh` → get new access token
- Call `/api/auth/logout` → token removed from DB

### Phase 2 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 3 — Backend Jobs Module
## ════════════════════════════════════════

**Skill files to read**: BACKEND_SKILL.md

### Create these files:

```
backend/src/modules/jobs/
├── jobs.controller.ts
├── jobs.service.ts
├── jobs.module.ts
├── dto/
│   ├── create-job.dto.ts
│   ├── update-job.dto.ts
│   └── job-filter.dto.ts     ← from BACKEND_SKILL.md section 4
└── models/
    └── job.model.ts          ← from BACKEND_SKILL.md section 3

backend/src/modules/categories/
├── categories.controller.ts
├── categories.service.ts
├── categories.module.ts
└── models/category.model.ts

backend/src/modules/cities/
├── cities.controller.ts
├── cities.service.ts
├── cities.module.ts
└── models/city.model.ts
```

### Job filter logic in JobsService.findAll():
```typescript
const where: any = { is_active: true };

// Keyword search
if (filters.keyword) {
  where[Op.or] = [
    { title: { [Op.iLike]: `%${filters.keyword}%` } },
    { description: { [Op.iLike]: `%${filters.keyword}%` } },
  ];
}

if (filters.city) where.city = filters.city;
if (filters.category) where.category = filters.category;
if (filters.job_type) where.job_type = filters.job_type;

// Salary filter
if (filters.salary_min) {
  where.salary_max = { [Op.gte]: filters.salary_min };
}

// Experience filter
if (filters.exp_min !== undefined) {
  where.experience_max = { [Op.gte]: filters.exp_min };
}

// Date posted filter
if (filters.date_posted && filters.date_posted !== 'all') {
  const days = { '24h': 1, '3d': 3, '7d': 7 }[filters.date_posted];
  where.created_at = {
    [Op.gte]: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
  };
}
```

### Endpoints:
```typescript
GET    /api/jobs              → all jobs with filters (public)
GET    /api/jobs/:id          → single job (public)
POST   /api/jobs              → create job (employer only)
PUT    /api/jobs/:id          → update job (employer, owns job)
DELETE /api/jobs/:id          → delete job (employer, owns job)
GET    /api/jobs/my           → employer's jobs (employer only)
GET    /api/categories        → all categories (public)
GET    /api/cities            → all cities (public)
```

### Phase 3 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════════════
## PHASE 4 — Applications, Companies, Candidates
## ════════════════════════════════════════════════

**Skill files to read**: BACKEND_SKILL.md

### Files to create:

```
backend/src/modules/applications/
├── applications.controller.ts
├── applications.service.ts
├── applications.module.ts
├── dto/update-application-status.dto.ts
└── models/application.model.ts

backend/src/modules/companies/
├── companies.controller.ts
├── companies.service.ts
├── companies.module.ts
├── dto/update-company.dto.ts
└── models/company.model.ts

backend/src/modules/candidates/
├── candidates.controller.ts
├── candidates.service.ts
├── candidates.module.ts
├── dto/update-profile.dto.ts
└── models/candidate-profile.model.ts
```

### Key business rules:
- Application: check `UNIQUE(job_id, candidate_id)` — return 409 if already applied
- Application status update: only employer who owns the job can update
- Company profile: auto-created on employer register; one-to-one with user
- Resume upload: use Multer, save to `uploads/resumes/` folder

### Phase 4 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 5 — Frontend Foundation
## ════════════════════════════════════════

**Skill files to read**: FRONTEND_SKILL.md

### Files to create (from FRONTEND_SKILL.md):

```
frontend/src/
├── app/
│   ├── store.ts           ← section 3
│   └── hooks.ts           ← section 3
├── features/
│   ├── auth/authSlice.ts          ← section 7 of AUTH_SKILL.md
│   ├── jobs/jobsSlice.ts          ← section 4
│   ├── applications/applicationsSlice.ts
│   └── ui/uiSlice.ts
├── services/
│   ├── api.ts             ← section 5
│   ├── auth.service.ts
│   ├── jobs.service.ts
│   └── applications.service.ts
├── types/index.ts         ← section 6
├── components/
│   ├── ProtectedRoute.tsx ← section 7
│   ├── Navbar/Navbar.tsx
│   └── Footer/Footer.tsx
└── App.tsx                ← section 8
```

### Navbar states:
- **Logged out**: "Employer Login" button (outline) + "Candidate Login" button (green filled)
- **Logged in as candidate**: Avatar with dropdown (View Profile / Logout)
- **Logged in as employer**: "Post a Job" button + Avatar dropdown
- **Jobs dropdown**: mega-menu with 3 columns (see screenshot 2)

### On app startup (in App.tsx or index.tsx):
```typescript
// Auto-login if token exists
store.dispatch(loadCurrentUser());
```

### Phase 5 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 6 — Frontend Auth Pages
## ════════════════════════════════════════

**Pages to build**:

### Login Page (`/login`)
- Two tabs: "Candidate" | "Employer"
- Email + Password fields
- Forgot password link (placeholder)
- "Don't have an account? Register" link
- On submit → dispatch `loginUser` thunk
- On success → redirect to `/` or previous route

### Register Page (`/register`)
- Two tabs: "Candidate" | "Employer"
- Candidate: Full Name, Email, Phone, Password
- Employer: Company Name, Email, Phone, Password
- Form validation with yup schema
- On submit → dispatch `registerUser` thunk

### Color scheme matching apna.co:
- Primary CTA button: `bg-[#1a7d4e]` (dark green)
- "New" badge: `bg-orange-500`
- Links: `text-[#1a7d4e]`

### Phase 6 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 7 — Frontend Home Page
## ════════════════════════════════════════

**Layout** (match screenshots exactly):

```
<HomePage>
  <HeroSection>
    - Left: badge "INDIA'S #1 JOB PLATFORM" (green text)
    - H1: "Your job search ends here"
    - Subtitle: "Discover 50 lakh+ career opportunities"
    - <SearchBar> (keyword | experience dropdown | city | Search button)
  </HeroSection>

  <SupportSection>
    - "Proud to Support" + 3 ministry logos
  </SupportSection>

  <TrustedCompaniesSection>
    - Horizontal scrolling marquee of company logos
  </TrustedCompaniesSection>

  <TrendingSection>
    - TRENDING AT #1, #2, #3... cards
  </TrendingSection>

  <PopularJobsSection>
    - Grid of category cards with openings count (from /api/categories)
  </PopularJobsSection>

  <TestimonialsSection>
    - Review cards carousel
  </TestimonialsSection>

  <JobsByCitySection>
    - Grid of city links (from /api/cities)
  </JobsByCitySection>

  <JobsByDepartmentSection>
    - 2-column list of department links
  </JobsByDepartmentSection>
</HomePage>
```

### SearchBar behavior:
- Keyword input: text field with search icon
- Experience dropdown: Fresher / 1yr / 2yr / 3yr / 5yr+ / 10yr+
- City input: text field with location icon (type-ahead optional)
- "Search jobs" button → navigate to `/jobs?keyword=&city=&exp=`

### Background:
- Hero section: soft lavender/pink gradient (matches screenshot 3)
- Below hero: white background

### Phase 7 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 8 — Jobs Listing Page & Filters
## ════════════════════════════════════════

**Layout** (3-column, matches screenshot 2):
```
<JobsPage>
  <main className="max-w-7xl mx-auto grid grid-cols-[280px_1fr_300px] gap-4">
    <FilterSidebar />          ← left column
    <JobListingsArea />        ← center column
    <RightSidebar />           ← right column (profile card, track apps, download app)
  </main>
</JobsPage>
```

### FilterSidebar sections (all from Redux, dispatch setFilter on change):
1. **Date Posted** — radio buttons (All / Last 24 hours / Last 3 days / Last 7 days)
2. **Distance** — radio buttons (All / Within 5km / 10km / 20km / 50km)
3. **Salary** — range slider (₹0 to ₹1.5 Lakhs)
4. **Experience** — dual-range or min/max number inputs
5. **Job Type** — checkboxes (Full Time / Part Time / Work From Home / Night Shift)
6. **Category** — checkboxes (loaded from /api/categories)

### JobCard component:
```tsx
<JobCard job={job}>
  - Company logo (left)
  - Job title (bold, clickable → /jobs/:id)
  - Company name
  - 📍 City
  - 💰 Salary (or "Not Disclosed")
  - Tags: [Work from Office] [Full Time] [Min. X years]
  - > chevron (right)
</JobCard>
```

### Center area header:
```
"Showing 288 jobs based on your profile"
"Jobs near [City] Region"
[New Jobs button]
```

### URL sync (from FRONTEND_SKILL.md section 10):
- All filter changes update URL query params
- Page load reads URL params and sets Redux state

### Phase 8 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 9 — Job Detail & Apply
## ════════════════════════════════════════

**Route**: `/jobs/:id`

```tsx
<JobDetailPage>
  <JobHeader>
    - Company logo + name
    - Job title (H1)
    - Location, Job Type, Experience, Salary badges
    - Apply button (green) OR "Already Applied" (disabled)
    - Share button
  </JobHeader>

  <JobBody className="grid grid-cols-[1fr_300px]">
    <JobDescription>
      - Full job description
      - Requirements
      - Benefits
    </JobDescription>

    <ApplySidebar>
      - Apply button (sticky)
      - Company info card
      - Report job link
    </ApplySidebar>
  </JobBody>

  <SimilarJobs />
</JobDetailPage>
```

### Apply flow:
1. Candidate clicks Apply
2. If not logged in → show login modal (redirect after login)
3. If logged in → confirm modal "Apply for [Job Title] at [Company]?"
4. Confirm → dispatch `applyToJob` thunk → `POST /api/applications/:jobId`
5. On success → show toast "Application submitted!" + change button to "Applied"

### Phase 9 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════════
## PHASE 10 — Candidate Dashboard
## ════════════════════════════════════════════

**Route**: `/dashboard` (ProtectedRoute, role: candidate)

```tsx
<CandidateDashboard>
  <Sidebar>
    - My Profile
    - My Applications
    - Resume
    - Settings
  </Sidebar>

  <Content>
    {activeTab === 'profile' && <ProfileForm />}
    {activeTab === 'applications' && <ApplicationsList />}
    {activeTab === 'resume' && <ResumeUpload />}
  </Content>
</CandidateDashboard>
```

### ApplicationsList:
- Table/card list of all applied jobs
- Status badge: Applied (gray) / Shortlisted (blue) / Rejected (red) / Hired (green)

### Phase 10 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════════
## PHASE 11 — Employer Dashboard
## ════════════════════════════════════════════

**Route**: `/employer/dashboard` (ProtectedRoute, role: employer)

```tsx
<EmployerDashboard>
  <Sidebar>
    - My Jobs
    - Post a Job
    - Company Profile
    - Settings
  </Sidebar>

  <Content>
    {activeTab === 'jobs' && <MyJobsList />}
    {activeTab === 'post' && <PostJobForm />}
    {activeTab === 'company' && <CompanyProfile />}
  </Content>
</EmployerDashboard>
```

### PostJobForm (multi-step):
- Step 1: Job basics (title, category, city, type)
- Step 2: Requirements (experience, education, gender, salary)
- Step 3: Description (full text description)
- Step 4: Review & Publish

### Phase 11 done → update PROGRESS.md, mark ✅

---

## ════════════════════════════════════════
## PHASE 12 — Polish & Deployment
## ════════════════════════════════════════

### Checklist:
- [ ] Add Skeleton loaders for JobCard (while fetching)
- [ ] Add toast notifications on all async actions
- [ ] Make Navbar mobile responsive (hamburger menu)
- [ ] Make Jobs page responsive (collapse sidebar to drawer on mobile)
- [ ] Add empty states (no jobs found, no applications yet)
- [ ] Add 404 page
- [ ] Add error boundaries
- [ ] Write README.md with full setup instructions
- [ ] Final end-to-end test: register → browse → apply → employer sees application → update status

### Phase 12 done → PROJECT COMPLETE ✅
