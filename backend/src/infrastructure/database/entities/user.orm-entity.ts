import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../../core/domain/enums/role.enum';

/**
 * User ORM Entity (TypeORM mapping)
 * Represents the database table structure
 */
@Entity({ name: 'users' })
export class UserOrmEntity {
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

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  isApproved: boolean;
}
