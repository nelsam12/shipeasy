import { Role } from "./role.model";

export interface CreateUserDto {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  role: Role; // Ajoutez cette ligne
  // Champs optionnels pour le profil GP
  companyName?: string;
  address?: string;
  description?: string;
}
