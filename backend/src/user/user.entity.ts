// backend/src/user/entities/user.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  // --- Nouveaux champs pour le GP ---

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  isApproved: boolean; // Pour la validation par l'admin plus tard
}
