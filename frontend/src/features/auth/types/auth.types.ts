export enum Role {
  ADMIN = "Admin",
  CLIENT = "Client",
  GP = "GP",
  GESTIONNAIRE = "GESTIONNAIRE",
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  role: Role;
  // Optional fields for GP
  companyName?: string;
  address?: string;
  description?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
