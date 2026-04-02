import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Assuming backend runs on localhost:8000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
let isRedirectingToLogin = false;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid; avoid cascading redirects from parallel requests.
      const logout = useAuthStore.getState().logout;
      logout();

      if (!isRedirectingToLogin && window.location.pathname !== '/login') {
        isRedirectingToLogin = true;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
