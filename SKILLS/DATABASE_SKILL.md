# DATABASE_SKILL.md — PostgreSQL Schema, Migrations & Seeders

> Read this before starting Phase 1 or 13.

**Last updated: 2026-05-29 (Phase 13)**

---

## 1. Complete Schema

### users
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(15) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'employer', 'admin')),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### candidate_profiles
```sql
CREATE TABLE candidate_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name     VARCHAR(255),
  resume_url    TEXT,
  experience    INTEGER DEFAULT 0,
  skills        TEXT[] DEFAULT '{}',
  education     VARCHAR(100),
  city          VARCHAR(100),
  gender        VARCHAR(20),
  dob           DATE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_candidate_user ON candidate_profiles(user_id);
```

### companies
```sql
CREATE TABLE companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  logo_url      TEXT,
  description   TEXT,
  website       TEXT,
  city          VARCHAR(100),
  employee_size VARCHAR(50),
  industry      VARCHAR(100),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### categories
```sql
CREATE TABLE categories (
  id      SERIAL PRIMARY KEY,
  slug    VARCHAR(100) UNIQUE NOT NULL,
  label   VARCHAR(100) NOT NULL,
  icon    TEXT,
  is_active BOOLEAN DEFAULT TRUE
);
```

### cities
```sql
CREATE TABLE cities (
  id      SERIAL PRIMARY KEY,
  slug    VARCHAR(100) UNIQUE NOT NULL,
  name    VARCHAR(100) NOT NULL,
  state   VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);
```

### jobs
```sql
CREATE TABLE jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  category        VARCHAR(100),
  department      VARCHAR(100),
  city            VARCHAR(100),
  job_type        VARCHAR(50) CHECK (job_type IN ('full_time', 'part_time', 'work_from_home', 'night_shift')),
  salary_min      INTEGER DEFAULT 0,
  salary_max      INTEGER,
  experience_min  INTEGER DEFAULT 0,
  experience_max  INTEGER,
  education       VARCHAR(100),
  gender          VARCHAR(20) DEFAULT 'any',
  openings        INTEGER DEFAULT 1,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
```

### applications
```sql
CREATE TABLE applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id  UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  status        VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'hired')),
  applied_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)  -- prevent duplicate applications
);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_job ON applications(job_id);
```

### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT UNIQUE NOT NULL,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);
```

---

## 2. Sequelize Migration Template

```javascript
// migrations/YYYYMMDDHHMMSS-create-jobs.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'companies', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      category: { type: Sequelize.STRING(100) },
      city: { type: Sequelize.STRING(100) },
      job_type: {
        type: Sequelize.ENUM('full_time', 'part_time', 'work_from_home', 'night_shift'),
      },
      salary_min: { type: Sequelize.INTEGER, defaultValue: 0 },
      salary_max: { type: Sequelize.INTEGER },
      experience_min: { type: Sequelize.INTEGER, defaultValue: 0 },
      experience_max: { type: Sequelize.INTEGER },
      education: { type: Sequelize.STRING(100) },
      gender: { type: Sequelize.STRING(20), defaultValue: 'any' },
      openings: { type: Sequelize.INTEGER, defaultValue: 1 },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('jobs', ['city']);
    await queryInterface.addIndex('jobs', ['category']);
    await queryInterface.addIndex('jobs', ['is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('jobs');
  },
};
```

---

## 3. Cities Seeder (50 major Indian cities)

```javascript
// seeders/YYYYMMDDHHMMSS-cities.js
const cities = [
  { slug: 'delhi_ncr', name: 'Delhi-NCR', state: 'Delhi' },
  { slug: 'mumbai_bombay', name: 'Mumbai', state: 'Maharashtra' },
  { slug: 'bengaluru_bangalore', name: 'Bengaluru', state: 'Karnataka' },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { slug: 'kolkata_calcutta', name: 'Kolkata', state: 'West Bengal' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra' },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { slug: 'surat', name: 'Surat', state: 'Gujarat' },
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  { slug: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh' },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh' },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh' },
  { slug: 'patna', name: 'Patna', state: 'Bihar' },
  { slug: 'vadodara', name: 'Vadodara', state: 'Gujarat' },
  { slug: 'chandigarh', name: 'Chandigarh', state: 'Punjab' },
  { slug: 'kochi', name: 'Kochi', state: 'Kerala' },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
  { slug: 'goa', name: 'Goa', state: 'Goa' },
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { slug: 'noida', name: 'Noida', state: 'Uttar Pradesh' },
  { slug: 'gurgaon', name: 'Gurgaon', state: 'Haryana' },
  { slug: 'mysore_mysuru', name: 'Mysore', state: 'Karnataka' },
  { slug: 'rajkot', name: 'Rajkot', state: 'Gujarat' },
  { slug: 'agra', name: 'Agra', state: 'Uttar Pradesh' },
  { slug: 'nashik', name: 'Nashik', state: 'Maharashtra' },
  { slug: 'ranchi', name: 'Ranchi', state: 'Jharkhand' },
  { slug: 'dehradun', name: 'Dehradun', state: 'Uttarakhand' },
];
```

---

## 4. Categories Seeder

```javascript
const categories = [
  { slug: 'telecalling_bpo_telesales', label: 'Telecalling / BPO / Telesales' },
  { slug: 'accounts_finance', label: 'Accounts / Finance' },
  { slug: 'delivery_person', label: 'Delivery Person' },
  { slug: 'field_sales', label: 'Field Sales' },
  { slug: 'business_development', label: 'Business Development' },
  { slug: 'retail_counter_sales', label: 'Retail / Counter Sales' },
  { slug: 'logistics_warehouse_operations', label: 'Logistics / Warehouse operations' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'back_office', label: 'Back Office' },
  { slug: 'driver', label: 'Driver' },
  { slug: 'human_resource', label: 'Human Resource' },
  { slug: 'digital_online_marketing', label: 'Digital / Online Marketing' },
  { slug: 'cook_chef_baker', label: 'Cook / Chef / Baker' },
  { slug: 'technician', label: 'Technician' },
  { slug: 'admin_office_assistant', label: 'Admin / Office Assistant' },
  { slug: 'teacher_faculty_tutor', label: 'Teacher / Faculty / Tutor' },
  { slug: 'housekeeping', label: 'Housekeeping' },
  { slug: 'security_guard', label: 'Security Guard' },
  { slug: 'software_web_developer', label: 'Software / Web Developer' },
  { slug: 'graphic_designer', label: 'Graphic Designer' },
  { slug: 'content_writing', label: 'Content Writing' },
  { slug: 'it_support', label: 'IT Support' },
  { slug: 'electrician_wireman', label: 'Electrician / Wireman' },
  { slug: 'plumber', label: 'Plumber' },
  { slug: 'carpenter', label: 'Carpenter' },
  { slug: 'nurse_patient_care', label: 'Nurse / Patient Care' },
  { slug: 'doctor_dentist', label: 'Doctor / Dentist' },
  { slug: 'pharmacist', label: 'Pharmacist' },
  { slug: 'civil_engineer_architect', label: 'Civil Engineer / Architect' },
  { slug: 'mechanical_engineer', label: 'Mechanical Engineer' },
  { slug: 'electrical_engineer', label: 'Electrical Engineer' },
  { slug: 'hardware_network_engineer', label: 'Hardware & Network Engineer' },
  { slug: 'legal', label: 'Legal' },
  { slug: 'beautician_hair_stylist', label: 'Beautician / Hair Stylist' },
  { slug: 'fitness_trainer_dietician', label: 'Fitness Trainer / Dietician' },
  { slug: 'interior_designer', label: 'Interior Designer' },
  { slug: 'photography_video_editing', label: 'Photography / Video Editing' },
  { slug: 'fashion_designer', label: 'Fashion Designer' },
  { slug: 'manufacturing_production', label: 'Manufacturing / Production' },
  { slug: 'hospitality_hotel_event', label: 'Hospitality / Hotel / Event Management' },
];
```

---

## 5. Migration Order (must run in this order)

```
 1. create-users
 2. create-candidate-profiles
 3. create-companies
 4. create-categories
 5. create-cities
 6. create-jobs
 7. create-applications
 8. create-refresh-tokens
 9. add-columns-to-candidate-profiles  (Phase 10)
10. create-work-experiences             (Phase 10)
11. create-educations                   (Phase 10)
12. create-certifications               (Phase 10)
13. add-advanced-job-fields             (Phase 13 — see below)
```

**Run**: `DB_PASSWORD=<pwd> npx sequelize-cli db:migrate`

## 5a. Phase 13 — Advanced Job Fields Migration

Adds 12 columns to the `jobs` table:

```javascript
// migrations/20260529200000-add-advanced-job-fields.js
module.exports = {
  async up(queryInterface, Sequelize) {
    const cols = [
      ['work_location_type', Sequelize.STRING(50)],  // 'work_from_office'|'work_from_home'|'field_job'
      ['pay_type',           Sequelize.STRING(50)],  // 'fixed_only'|'fixed_incentive'|'incentive_only'
      ['perks',              Sequelize.ARRAY(Sequelize.TEXT)], // array of perk strings
      ['has_joining_fee',    Sequelize.BOOLEAN],
      ['is_night_shift',     Sequelize.BOOLEAN],
      ['english_level',      Sequelize.STRING(50)],  // 'no_english'|'basic_english'|'good_english'
      ['experience_type',    Sequelize.STRING(50)],  // 'any'|'experienced_only'|'fresher_only'
      ['is_walkin',          Sequelize.BOOLEAN],
      ['contact_preference', Sequelize.STRING(100)], // 'to_myself'|'to_other'|'no_contact'
      ['plan_type',          Sequelize.STRING(50)],  // 'classic'|'premium'|'super_premium'
      ['is_paid',            Sequelize.BOOLEAN],
      ['razorpay_payment_id', Sequelize.STRING(255)],
    ];
    for (const [name, type] of cols) {
      await queryInterface.addColumn('jobs', name, { type, allowNull: true });
    }
  },
  async down(queryInterface) {
    const cols = ['work_location_type','pay_type','perks','has_joining_fee',
      'is_night_shift','english_level','experience_type','is_walkin',
      'contact_preference','plan_type','is_paid','razorpay_payment_id'];
    for (const col of cols) await queryInterface.removeColumn('jobs', col);
  },
};
```

## 6. Seeder Order

```
1. seed-categories
2. seed-cities
3. seed-companies (requires users first)
4. seed-sample-users (employer accounts)
5. seed-sample-jobs
```
