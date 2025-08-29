import { api, apiUtils, ApiError } from './api';

// Types based on the API response
export interface User {
  id: number;
  email: string;
  username: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  photo: string | null;
  role: {
    id: number;
    name: string;
    __entity: string;
  };
  status: {
    id: number;
    name: string;
    __entity: string;
  };
  __entity: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  refreshToken: string;
  token: string;
  tokenExpires: number;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Authentication API functions
export const authApi = {
  // Login with username and password
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data) {
        // Store tokens
        apiUtils.setAuthToken(response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('tokenExpires', response.data.tokenExpires.toString());
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch custom event for auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged', { 
          detail: { isAuthenticated: true, user: response.data.user } 
        }));
      }
      
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Login failed: ${error.message}`);
      }
      throw error;
    }
  },

  // Register new user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Registration failed: ${error.message}`);
      }
      throw error;
    }
  },

  // Logout
  logout(): void {
    apiUtils.removeAuthToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpires');
    localStorage.removeItem('user');
    
    // Dispatch custom event for auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { 
      detail: { isAuthenticated: false, user: null } 
    }));
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
    const tokenExpires = localStorage.getItem('tokenExpires');
    
    if (!token || !tokenExpires) {
      return false;
    }

    // Check if token is expired
    const expiresAt = parseInt(tokenExpires);
    const now = Date.now();
    
    if (now >= expiresAt) {
      // Token expired, clear it
      this.logout();
      return false;
    }

    return true;
  },

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<LoginResponse>('/auth/refresh', { refreshToken });
      
      if (response.data) {
        // Update tokens
        apiUtils.setAuthToken(response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('tokenExpires', response.data.tokenExpires.toString());
        
        // Update user info
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data!;
    } catch (error) {
      // If refresh fails, logout
      this.logout();
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Forgot password failed: ${error.message}`);
      }
      throw error;
    }
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', { 
        token, 
        password 
      });
      return response.data!;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Reset password failed: ${error.message}`);
      }
      throw error;
    }
  },
};
