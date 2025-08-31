import { api, apiUtils, ApiError } from './api';
import { LoginFormData, RegisterFormData } from './auth-schemas';

// Types based on the API response
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest extends LoginFormData {}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest extends RegisterFormData {}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Authentication API functions
export const authApi = {
  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Mock implementation for Day 6
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          const mockResponse: LoginResponse = {
            token: 'mock-jwt-token',
            user: {
              id: 1,
              email: credentials.email,
              name: 'Test User',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          };
          
          // Store token and user
          apiUtils.setAuthToken(mockResponse.token);
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
          
          resolve(mockResponse);
        } else {
          reject(new Error('Email hoặc mật khẩu không đúng'));
        }
      }, 700); // 700ms delay
    });
  },

  // Register new user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    // Mock implementation for Day 6
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate email already exists check
        if (userData.email === 'existing@example.com') {
          reject(new Error('Email đã tồn tại'));
        } else {
          const mockResponse: RegisterResponse = {
            success: true,
            message: 'Đăng ký thành công! Vui lòng đăng nhập.'
          };
          resolve(mockResponse);
        }
      }, 600); // 600ms delay
    });
  },

  // Logout
  logout(): void {
    apiUtils.removeAuthToken();
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Fetch current user from API
  async me(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      
      if (response.data) {
        // Update stored user info
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Get current user failed: ${error.message}`);
        // If unauthorized, logout
        if (error.status === 401) {
          this.logout();
        }
      }
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = apiUtils.getAuthToken();
    const user = localStorage.getItem('user');
    
    return !!(token && user);
  },

  // Mock functions for Day 6 (not implemented)
  async refreshToken(): Promise<LoginResponse> {
    throw new Error('Not implemented in Day 6');
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    throw new Error('Not implemented in Day 6');
  },

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    throw new Error('Not implemented in Day 6');
  },
};
