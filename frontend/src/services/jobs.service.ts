import api from './api';
import { ApiResponse, Job, JobFilters, PaginationMeta } from '../types';

export const jobsService = {
  async getJobs(filters: Partial<JobFilters>) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    const res = await api.get<ApiResponse<Job[]> & { meta: PaginationMeta }>(`/jobs?${params.toString()}`);
    return res.data;
  },

  async getJobById(id: string) {
    const res = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data;
  },

  async createJob(dto: Partial<Job>) {
    const res = await api.post<ApiResponse<Job>>('/jobs', dto);
    return res.data;
  },

  async updateJob(id: string, dto: Partial<Job>) {
    const res = await api.put<ApiResponse<Job>>(`/jobs/${id}`, dto);
    return res.data;
  },

  async deleteJob(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/jobs/${id}`);
    return res.data;
  },

  async getMyJobs() {
    const res = await api.get<ApiResponse<Job[]>>('/jobs/my');
    return res.data;
  },

  async getCategories() {
    const res = await api.get<ApiResponse<any[]>>('/categories');
    return res.data;
  },

  async getCities() {
    const res = await api.get<ApiResponse<any[]>>('/cities');
    return res.data;
  },
};
