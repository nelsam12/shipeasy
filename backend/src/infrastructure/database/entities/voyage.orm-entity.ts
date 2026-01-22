import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StatutVoyage } from '../../../core/domain/enums/statut-voyage.enum';
import { UserOrmEntity } from './user.orm-entity';

/**
 * Voyage ORM Entity (TypeORM mapping)
 * Represents the voyages table in the database
 */
@Entity({ name: 'voyages' })
export class VoyageOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'gp_createur_id' })
  gpCreateurId: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'gp_createur_id' })
  gpCreateur: UserOrmEntity;

  @Column({ name: 'gp_courant_id', nullable: true })
  gpCourantId?: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'gp_courant_id' })
  gpCourant?: UserOrmEntity;

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
    enum: StatutVoyage,
    default: StatutVoyage.BROUILLON,
  })
  statut: StatutVoyage;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
