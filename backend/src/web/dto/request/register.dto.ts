// backend/src/auth/dto/register.dto.ts

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../user/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+221771234567' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ enum: Role, default: Role.CLIENT })
  @IsEnum(Role, { message: 'Rôle invalide' })
  role: Role;

  // --- Champs spécifiques au GP ---

  @ApiProperty({ example: 'Transport Express', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ example: 'Rue 10, Dakar', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Service de fret Dakar-Paris...', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
