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

export type LoginRequest = LoginFormData

export interface LoginResponse {
  token: string;
  user: User;
}

export type RegisterRequest = RegisterFormData

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Authentication API functions
export const authApi = {
  // Login with email and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Mock implementation with localStorage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          const mockResponse: LoginResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              email: credentials.email,
              name: 'Test User',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          };
          
          // Store token and user data
          apiUtils.setAuthToken(mockResponse.token);
          localStorage.setItem('auth_token', mockResponse.token);
          localStorage.setItem('user_data', JSON.stringify(mockResponse.user));
          localStorage.setItem('token_expires', (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
          
          // Dispatch auth state change event
          window.dispatchEvent(new CustomEvent('authStateChanged', { 
            detail: { isAuthenticated: true, user: mockResponse.user } 
          }));
          
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_expires');
    
    // Dispatch auth state change event
    window.dispatchEvent(new CustomEvent('authStateChanged', { 
      detail: { isAuthenticated: false, user: null } 
    }));
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  },

  // Fetch current user from API
  async me(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      
      if (response.data) {
        // No localStorage usage in Day 6
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
    const token = localStorage.getItem('auth_token');
    const expires = localStorage.getItem('token_expires');
    
    if (!token || !expires) {
      return false;
    }
    
    // Check if token is expired
    const now = Date.now();
    const expiresAt = parseInt(expires, 10);
    
    if (now >= expiresAt) {
      // Token expired, clear auth data
      this.logout();
      return false;
    }
    
    return true;
  },

  // Mock functions for Day 6 (not implemented)
  async refreshToken(): Promise<LoginResponse> {
    throw new Error('Not implemented in Day 6');
  },

  async forgotPassword(): Promise<{ success: boolean; message: string }> {
    throw new Error('Not implemented in Day 6');
  },

  async resetPassword(): Promise<{ success: boolean; message: string }> {
    throw new Error('Not implemented in Day 6');
  },
};
