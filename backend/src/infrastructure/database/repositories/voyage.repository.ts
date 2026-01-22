import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IVoyageRepository } from '../../../core/ports/repositories/voyage.repository';
import { VoyageOrmEntity } from '../entities/voyage.orm-entity';
import { Location } from '../../../core/domain/value-objects/location.vo';
import { StatutVoyage } from '../../../core/domain/enums/statut-voyage.enum';
import { Voyage } from '../../../core/domain/entities/voyage.entity';

/**
 * TypeORM Voyage Repository Implementation
 * Implements the IVoyageRepository port
 */
@Injectable()
export class TypeOrmVoyageRepository implements IVoyageRepository {
  constructor(
    @InjectRepository(VoyageOrmEntity)
    private readonly repository: Repository<VoyageOrmEntity>,
  ) {}

  async findById(id: number): Promise<Voyage | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByGpCreateurId(gpId: number): Promise<Voyage[]> {
    const entities = await this.repository.find({
      where: { gpCreateurId: gpId },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByGpCourantId(gpId: number): Promise<Voyage[]> {
    const entities = await this.repository.find({
      where: { gpCourantId: gpId },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findAllPublie(): Promise<Voyage[]> {
    const entities = await this.repository.find({
      where: { statut: StatutVoyage.PUBLIE },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findAllAffecte(): Promise<Voyage[]> {
    const entities = await this.repository.find({
      where: { statut: StatutVoyage.AFFECTE },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async searchVoyages(
    departureCity?: string,
    arrivalCity?: string,
  ): Promise<Voyage[]> {
    const query = this.repository.createQueryBuilder('voyage');

    if (departureCity) {
      query.andWhere(
        'LOWER(voyage.departure_city) LIKE LOWER(:departureCity)',
        {
          departureCity: `%${departureCity}%`,
        },
      );
    }

    if (arrivalCity) {
      query.andWhere('LOWER(voyage.arrival_city) LIKE LOWER(:arrivalCity)', {
        arrivalCity: `%${arrivalCity}%`,
      });
    }

    const entities = await query.getMany();
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(voyage: Voyage): Promise<Voyage> {
    const ormEntity = this.toOrm(voyage);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const voyage = await this.repository.findOne({ where: { id } });
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }
    await this.repository.remove(voyage);
  }

  async findAll(): Promise<Voyage[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(id: number, data: Partial<Voyage>): Promise<Voyage> {
    const voyage = await this.repository.findOne({ where: { id } });
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    // Update fields
    if (data.availableKilos !== undefined) {
      voyage.availableKilos = data.availableKilos;
    }
    if (data.pricePerKg !== undefined) {
      voyage.pricePerKg = data.pricePerKg;
    }
    if (data.description !== undefined) {
      voyage.description = data.description;
    }
    if (data.statut !== undefined) {
      voyage.statut = data.statut;
    }
    if (data.gpCourantId !== undefined) {
      voyage.gpCourantId = data.gpCourantId;
    }

    const updated = await this.repository.save(voyage);
    return this.toDomain(updated);
  }

  async changeStatut(id: number, statut: StatutVoyage): Promise<Voyage> {
    const voyage = await this.repository.findOne({ where: { id } });
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    voyage.statut = statut;
    const updated = await this.repository.save(voyage);
    return this.toDomain(updated);
  }

  /**
   * Maps ORM entity to Domain entity
   */
  private toDomain(orm: VoyageOrmEntity): Voyage {
    const departureLocation = Location.create(
      orm.departureCity,
      orm.departureCountry,
      orm.departureFlag,
    );

    const arrivalLocation = Location.create(
      orm.arrivalCity,
      orm.arrivalCountry,
      orm.arrivalFlag,
    );

    return new Voyage(
      orm.id,
      orm.gpCreateurId,
      departureLocation,
      arrivalLocation,
      orm.departureDate,
      Number(orm.availableKilos),
      orm.pricePerKg ? Number(orm.pricePerKg) : undefined,
      orm.description,
      orm.statut,
      orm.gpCourantId,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  /**
   * Maps Domain entity to ORM entity
   */
  private toOrm(domain: Voyage): VoyageOrmEntity {
    const orm = new VoyageOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.gpCreateurId = domain.gpCreateurId;
    orm.gpCourantId = domain.gpCourantId;
    orm.departureCity = domain.departureLocation.city;
    orm.departureCountry = domain.departureLocation.country;
    orm.departureFlag = domain.departureLocation.flag;
    orm.arrivalCity = domain.arrivalLocation.city;
    orm.arrivalCountry = domain.arrivalLocation.country;
    orm.arrivalFlag = domain.arrivalLocation.flag;
    orm.departureDate = domain.departureDate;
    orm.availableKilos = domain.availableKilos;
    orm.pricePerKg = domain.pricePerKg;
    orm.description = domain.description;
    orm.statut = domain.statut;

    return orm;
  }
}
