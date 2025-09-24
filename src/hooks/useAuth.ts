import { useState, useEffect } from 'react';
import { authApi, type User } from '../lib/auth-api';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Initial auth check
    const checkAuth = () => {
      const isAuth = authApi.isAuthenticated();
      const user = authApi.getCurrentUser();
      
      setAuthState({
        isAuthenticated: isAuth,
        user: isAuth ? user : null,
        loading: false,
      });
    };

    checkAuth();

    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      const { isAuthenticated, user } = event.detail;
      setAuthState({
        isAuthenticated,
        user,
        loading: false,
      });
    };

    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, []);

  return authState;
};




