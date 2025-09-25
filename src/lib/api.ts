import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Chat API Base URL
export const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL || 'http://localhost:9000';

// Axios instance for main API
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Axios instance for chat API
export const chatApiClient = axios.create({
  baseURL: CHAT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      localStorage.removeItem('authToken');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Common API functions using Axios
export const api = {
  // GET request
  async get<T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<T>(endpoint, config);
      return { 
        data: response.data, 
        success: true,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },

  // POST request
  async post<T = unknown>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<T>(endpoint, body, config);
      return { 
        data: response.data, 
        success: true,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },

  // PUT request
  async put<T = unknown>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<T>(endpoint, body, config);
      return { 
        data: response.data, 
        success: true,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },

  // PATCH request
  async patch<T = unknown>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<T>(endpoint, body, config);
      return { 
        data: response.data, 
        success: true,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },

  // DELETE request
  async delete<T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<T>(endpoint, config);
      return { 
        data: response.data, 
        success: true,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },

  // Upload file
  async upload<T = unknown>(endpoint: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<T>(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });

      return { 
        data: response.data, 
        success: true,
        message: 'Upload successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },
};

// Chat API functions
export const chatApi = {
  async get<T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await chatApiClient.get<T>(endpoint, config);
      return {
        success: true,
        data: response.data,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },

  async post<T = unknown>(endpoint: string, body: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await chatApiClient.post<T>(endpoint, body, config);
      return {
        success: true,
        data: response.data,
        message: 'Request successful'
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.response?.status || 0,
        axiosError.message || 'Unknown error',
        axiosError.response?.data
      );
    }
  },
};

// Utility functions for common operations
export const apiUtils = {
  // Set auth token
  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // Get auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

// Example usage:
/*
// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const updatedUser = await api.put('/users/1', { name: 'John Updated' });

// DELETE request
const deletedUser = await api.delete('/users/1');

// Upload file
const uploadedFile = await api.upload('/upload', file);

// Chat API
const chatResponse = await chatApi.post('/chat', { user_id: '123', thread_id: '456', message: 'Hello' });
const chatHistory = await chatApi.get('/chat-history/123/456');

// With error handling
// Example usage:
// try {
//   const data = await api.get('/users');
//   console.log(data);
// } catch (error) {
//   if (error instanceof ApiError) {
//     console.error(`API Error ${error.status}: ${error.message}`);
//   }
// }
*/
