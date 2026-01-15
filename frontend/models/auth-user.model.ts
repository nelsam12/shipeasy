import { Role } from "./role.model";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
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
