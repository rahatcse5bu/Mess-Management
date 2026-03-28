import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Replace with your actual Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (window.location.origin.includes('vercel.app')
    ? 'https://your-backend-url.onrender.com'  // Replace this with your actual backend URL
    : 'http://localhost:3000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
