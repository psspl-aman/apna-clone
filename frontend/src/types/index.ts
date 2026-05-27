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
  gender: string;
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

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface RegisterEmployerDto {
  email: string;
  password: string;
  companyName: string;
  city?: string;
}
