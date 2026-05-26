import api from './api';
import { ApiResponse, User } from '../types';

export const authService = {
  async login(dto: { email: string; password: string }) {
    const res = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', dto);
    return res.data;
  },

  async register(dto: { email: string; password: string; fullName: string; phone?: string }) {
    const res = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/register', dto);
    return res.data;
  },

  async registerEmployer(dto: { email: string; password: string; companyName: string; city?: string }) {
    const res = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/register-employer', dto);
    return res.data;
  },

  async refresh(refreshToken: string) {
    const res = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
    return res.data;
  },

  async logout(refreshToken: string) {
    const res = await api.post<ApiResponse<null>>('/auth/logout', { refreshToken });
    return res.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
