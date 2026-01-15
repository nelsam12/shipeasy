import { z } from 'zod';
import { Role } from '../types/auth.types';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  fullName: z.string().min(2, 'Nom trop court'),
  phone: z.string().min(8, 'Téléphone invalide'),
  role: z.nativeEnum(Role),
  // Optional fields for GP
  companyName: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
}).refine(
  (data) => {
    if (data.role === Role.GP) {
      return !!data.companyName && !!data.address;
    }
    return true;
  },
  {
    message: 'Les informations entreprise sont obligatoires pour un GP',
    path: ['companyName'],
  }
);

export type RegisterInput = z.infer<typeof registerSchema>;
