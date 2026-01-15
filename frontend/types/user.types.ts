import { Role } from "./role.types";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
}

export interface CreateUserDto {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  role: Role;
  // Optional fields for GP profile
  companyName?: string;
  address?: string;
  description?: string;
}
