import { Role } from "./role.model";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
}
