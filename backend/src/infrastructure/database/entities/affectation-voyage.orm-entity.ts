import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VoyageOrmEntity } from './voyage.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

/**
 * AffectationVoyage ORM Entity (TypeORM mapping)
 * Represents the affectation_voyages table in the database
 * Tracks the assignment history of voyages to GPs
 */
@Entity({ name: 'affectation_voyages' })
export class AffectationVoyageOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'voyage_id' })
  voyageId: number;

  @ManyToOne(() => VoyageOrmEntity)
  @JoinColumn({ name: 'voyage_id' })
  voyage: VoyageOrmEntity;

  @Column({ name: 'gp_id' })
  gpId: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'gp_id' })
  gp: UserOrmEntity;

  @Column({ name: 'affecte_par_id' })
  affecteParId: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'affecte_par_id' })
  affectePar: UserOrmEntity;

  @Column({ name: 'affecte_le', type: 'timestamp' })
  affecteLe: Date;

  @Column({ name: 'desaffecte_le', type: 'timestamp', nullable: true })
  desaffecteLe?: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
