import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API utilities
export const apiUtils = {
  // Get auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Set auth token
  setAuthToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Remove auth token
  removeAuthToken: (): void => {
    localStorage.removeItem('token');
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const tokenExpires = localStorage.getItem('tokenExpires');
    if (!tokenExpires) return true;
    
    const expiresAt = parseInt(tokenExpires);
    const now = Date.now();
    return now >= expiresAt;
  },
};

// Custom error class
export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Export axios instance and utilities
export { api, axios };
export default api;
