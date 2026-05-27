import api from './api';
import { CandidateProfile, WorkExperience, Education, Certification, ApiResponse } from '../types';
import { toSnakeCase, toCamelCase } from '../utils/caseTransform';

interface ProfileResponse {
  profile: CandidateProfile;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  profileCompletion: number;
}

const mapProfile = (res: any): ProfileResponse => {
  const data = res.data;
  const camelData = toCamelCase(data);
  return {
    profile: camelData.profile,
    workExperiences: camelData.workExperiences || [],
    educations: camelData.educations || [],
    certifications: camelData.certifications || [],
    profileCompletion: camelData.profileCompletion || 0,
  };
};

export const candidatesService = {
  getProfile: async () => {
    const res = await api.get('/candidates/profile');
    return mapProfile(res.data);
  },

  updateProfile: async (data: Partial<CandidateProfile>) => {
    const res = await api.patch('/candidates/profile', toSnakeCase(data));
    return mapProfile(res.data);
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.post('/candidates/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProfile(res.data);
  },

  addWorkExperience: async (data: Partial<WorkExperience>) => {
    const res = await api.post<ApiResponse<any>>('/candidates/work-experience', toSnakeCase(data));
    return toCamelCase(res.data.data);
  },

  updateWorkExperience: async (id: string, data: Partial<WorkExperience>) => {
    const res = await api.patch<ApiResponse<any>>(`/candidates/work-experience/${id}`, toSnakeCase(data));
    return toCamelCase(res.data.data);
  },

  deleteWorkExperience: async (id: string) => {
    await api.delete(`/candidates/work-experience/${id}`);
  },

  addEducation: async (data: Partial<Education>) => {
    const res = await api.post<ApiResponse<any>>('/candidates/education', toSnakeCase(data));
    return toCamelCase(res.data.data);
  },

  updateEducation: async (id: string, data: Partial<Education>) => {
    const res = await api.patch<ApiResponse<any>>(`/candidates/education/${id}`, toSnakeCase(data));
    return toCamelCase(res.data.data);
  },

  deleteEducation: async (id: string) => {
    await api.delete(`/candidates/education/${id}`);
  },

  addCertification: async (data: Partial<Certification>) => {
    const res = await api.post<ApiResponse<any>>('/candidates/certifications', toSnakeCase(data));
    return toCamelCase(res.data.data);
  },

  updateCertification: async (id: string, data: Partial<Certification>) => {
    const res = await api.patch<ApiResponse<any>>(`/candidates/certifications/${id}`, toSnakeCase(data));
    return toCamelCase(res.data.data);
  },

  deleteCertification: async (id: string) => {
    await api.delete(`/candidates/certifications/${id}`);
  },
};
