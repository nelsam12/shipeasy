import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setLoggingOut: (loggingOut: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingOut: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    isLoggingOut: false 
  }),
}));
