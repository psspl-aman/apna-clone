import api from './api';
import { ApiResponse, Application } from '../types';

export const applicationsService = {
  async apply(jobId: string) {
    const res = await api.post<ApiResponse<Application>>(`/applications/${jobId}`);
    return res.data;
  },

  async getMyApplications() {
    const res = await api.get<ApiResponse<Application[]>>('/applications/my');
    return res.data;
  },

  async getJobApplications(jobId: string) {
    const res = await api.get<ApiResponse<Application[]>>(`/applications/job/${jobId}`);
    return res.data;
  },

  async updateStatus(id: string, status: string) {
    const res = await api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status });
    return res.data;
  },
};
