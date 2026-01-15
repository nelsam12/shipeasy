import { role } from "./role.model";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: role;
  phone: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface MeResponse {
  user: AuthUser;
}
