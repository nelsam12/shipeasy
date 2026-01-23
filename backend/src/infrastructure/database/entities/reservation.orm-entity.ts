import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StatutReservation } from '../../../core/domain/enums/statut-reservation.enum';
import { UserOrmEntity } from './user.orm-entity';
import { VoyageOrmEntity } from './voyage.orm-entity';

/**
 * Reservation ORM Entity (TypeORM mapping)
 * Représente la table des réservations dans la base de données
 */
@Entity({ name: 'reservations' })
export class ReservationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'client_id' })
  client: UserOrmEntity;

  @Column({ name: 'voyage_id' })
  voyageId: number;

  @ManyToOne(() => VoyageOrmEntity)
  @JoinColumn({ name: 'voyage_id' })
  voyage: VoyageOrmEntity;

  @Column({ name: 'poids_kg', type: 'decimal', precision: 10, scale: 2 })
  poidsKg: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'adresse_enlevement', type: 'text', nullable: true })
  adresseEnlevement?: string;

  @Column({ name: 'adresse_livraison', type: 'text', nullable: true })
  adresseLivraison?: string;

  @Column({ name: 'nom_destinataire' })
  nomDestinataire: string;

  @Column({ name: 'telephone_destinataire' })
  telephoneDestinataire: string;

  @Column({
    type: 'enum',
    enum: StatutReservation,
    default: StatutReservation.EN_ATTENTE,
  })
  statut: StatutReservation;

  @Column({
    name: 'montant_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  montantTotal?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
