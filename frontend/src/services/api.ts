import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshTkn = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken: refreshTkn },
        );
        localStorage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
