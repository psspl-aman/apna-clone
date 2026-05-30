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
  resumeFileName?: string;
  resumeUpdatedAt?: string;
  experience: number;
  skills: string[];
  education: string;
  city: string;
  gender: string;
  phone?: string;
  dateOfBirth?: string;
  homeTown?: string;
  currentLocation?: string;
  currentSalary?: number;
  totalExperience?: number;
  spokenEnglishLevel?: string;
  schoolMedium?: string;
  highestEducation?: string;
  preferredJobTitles?: string[];
  preferredLocations?: string[];
  employmentType?: string;
  preferredShift?: string;
  languages?: { name: string; level: string }[];
  profileCompletion?: number;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  certifications?: Certification[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  jobRoles: string[];
  industry: string;
  description: string;
  skills: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  educationLevel: string;
  batchYear: number;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expiryDate: string | null;
  credentialUrl: string;
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
  department?: string;
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
  workLocationType?: string;
  payType?: string;
  isNightShift?: boolean;
  englishLevel?: string;
  createdAt: string;
  applicantCount?: number;
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
  department: string;
  job_type: string;
  work_mode: string;
  salary_min: number;
  exp_min: number;
  exp_max?: number;
  gender: string;
  date_posted: string;
  sort_by: string;
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
