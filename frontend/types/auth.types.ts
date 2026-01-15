import { AuthUser } from "./user.types";

export interface LoginModel {
  login: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface MeResponse {
  user: AuthUser;
}
