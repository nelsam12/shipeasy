import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import type { IReservationRepository } from '../../../core/ports/repositories/reservation.repository';
import { ReservationOrmEntity } from '../entities/reservation.orm-entity';
import { Reservation } from '../../../core/domain/entities/reservation.entity';
import { StatutReservation } from '../../../core/domain/enums/statut-reservation.enum';

/**
 * Implémentation TypeORM du repository de réservations
 * Implémente le port IReservationRepository
 */
@Injectable()
export class TypeOrmReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>,
  ) {}

  async findById(id: number): Promise<Reservation | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByClientId(clientId: number): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByVoyageId(voyageId: number): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { voyageId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByStatut(statut: StatutReservation): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { statut },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async calculerPoidsReservePourVoyage(voyageId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.poids_kg)', 'total')
      .where('reservation.voyage_id = :voyageId', { voyageId })
      .andWhere('reservation.statut IN (:...statuts)', {
        statuts: [
          StatutReservation.EN_ATTENTE,
          StatutReservation.CONFIRMEE,
          StatutReservation.EN_TRANSIT,
        ],
      })
      .getRawOne();

    return result?.total ? Number(result.total) : 0;
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const ormEntity = this.toOrm(reservation);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  async update(id: number, data: Partial<Reservation>): Promise<Reservation> {
    const reservation = await this.repository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Mise à jour des champs
    if (data.statut !== undefined) {
      reservation.statut = data.statut;
    }
    if (data.poidsKg !== undefined) {
      reservation.poidsKg = data.poidsKg;
    }
    if (data.description !== undefined) {
      reservation.description = data.description;
    }
    if (data.adresseEnlevement !== undefined) {
      reservation.adresseEnlevement = data.adresseEnlevement;
    }
    if (data.adresseLivraison !== undefined) {
      reservation.adresseLivraison = data.adresseLivraison;
    }
    if (data.nomDestinataire !== undefined) {
      reservation.nomDestinataire = data.nomDestinataire;
    }
    if (data.telephoneDestinataire !== undefined) {
      reservation.telephoneDestinataire = data.telephoneDestinataire;
    }
    if (data.montantTotal !== undefined) {
      reservation.montantTotal = data.montantTotal;
    }

    const updated = await this.repository.save(reservation);
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    const reservation = await this.repository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }
    await this.repository.remove(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  /**
   * Mappe l'entité ORM vers l'entité domaine
   */
  private toDomain(orm: ReservationOrmEntity): Reservation {
    return new Reservation(
      orm.id,
      orm.clientId,
      orm.voyageId,
      Number(orm.poidsKg),
      orm.description,
      orm.adresseEnlevement,
      orm.adresseLivraison,
      orm.nomDestinataire,
      orm.telephoneDestinataire,
      orm.statut,
      orm.montantTotal ? Number(orm.montantTotal) : undefined,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  /**
   * Mappe l'entité domaine vers l'entité ORM
   */
  private toOrm(domain: Reservation): ReservationOrmEntity {
    const orm = new ReservationOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.clientId = domain.clientId;
    orm.voyageId = domain.voyageId;
    orm.poidsKg = domain.poidsKg;
    orm.description = domain.description;
    orm.adresseEnlevement = domain.adresseEnlevement;
    orm.adresseLivraison = domain.adresseLivraison;
    orm.nomDestinataire = domain.nomDestinataire;
    orm.telephoneDestinataire = domain.telephoneDestinataire;
    orm.statut = domain.statut;
    orm.montantTotal = domain.montantTotal;

    return orm;
  }
}
