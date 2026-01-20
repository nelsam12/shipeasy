import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TripStatus } from '../../../core/domain/enums/trip-status.enum';
import { UserOrmEntity } from './user.orm-entity';

/**
 * Trip ORM Entity (TypeORM mapping)
 * Represents the trips table in the database
 */
@Entity({ name: 'trips' })
export class TripOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'gp_id' })
  gpId: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'gp_id' })
  gp: UserOrmEntity;

  // Departure Location
  @Column({ name: 'departure_city' })
  departureCity: string;

  @Column({ name: 'departure_country' })
  departureCountry: string;

  @Column({ name: 'departure_flag' })
  departureFlag: string;

  // Arrival Location
  @Column({ name: 'arrival_city' })
  arrivalCity: string;

  @Column({ name: 'arrival_country' })
  arrivalCountry: string;

  @Column({ name: 'arrival_flag' })
  arrivalFlag: string;

  @Column({ name: 'departure_date', type: 'timestamp' })
  departureDate: Date;

  @Column({ name: 'available_kilos', type: 'decimal', precision: 10, scale: 2 })
  availableKilos: number;

  @Column({
    name: 'price_per_kg',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pricePerKg?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.ACTIVE,
  })
  status: TripStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
