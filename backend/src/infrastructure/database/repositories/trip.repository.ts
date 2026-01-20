import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ITripRepository } from '../../../core/ports/repositories/trip.repository';
import { TripOrmEntity } from '../entities/trip.orm-entity';
import { Location } from '../../../core/domain/value-objects/location.vo';
import { TripStatus } from '../../../core/domain/enums/trip-status.enum';
import { Trip } from '../../../core/domain/entities/trip.entity';

/**
 * TypeORM Trip Repository Implementation
 * Implements the ITripRepository port
 */
@Injectable()
export class TypeOrmTripRepository implements ITripRepository {
  constructor(
    @InjectRepository(TripOrmEntity)
    private readonly repository: Repository<TripOrmEntity>,
  ) {}

  async findById(id: number): Promise<Trip | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByGpId(gpId: number): Promise<Trip[]> {
    const entities = await this.repository.find({ where: { gpId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findAllActive(): Promise<Trip[]> {
    const entities = await this.repository.find({
      where: { status: TripStatus.ACTIVE },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async searchTrips(
    departureCity?: string,
    arrivalCity?: string,
  ): Promise<Trip[]> {
    const query = this.repository.createQueryBuilder('trip');

    if (departureCity) {
      query.andWhere('LOWER(trip.departure_city) LIKE LOWER(:departureCity)', {
        departureCity: `%${departureCity}%`,
      });
    }

    if (arrivalCity) {
      query.andWhere('LOWER(trip.arrival_city) LIKE LOWER(:arrivalCity)', {
        arrivalCity: `%${arrivalCity}%`,
      });
    }

    query.andWhere('trip.status = : status', { status: TripStatus.ACTIVE });

    const entities = await query.getMany();
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(trip: Trip): Promise<Trip> {
    const ormEntity = this.toOrm(trip);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const trip = await this.repository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.repository.remove(trip);
  }

  async findAll(): Promise<Trip[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(id: number, data: Partial<Trip>): Promise<Trip> {
    const trip = await this.repository.findOne({ where: { id } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Update fields
    if (data.availableKilos !== undefined) {
      trip.availableKilos = data.availableKilos;
    }
    if (data.pricePerKg !== undefined) {
      trip.pricePerKg = data.pricePerKg;
    }
    if (data.description !== undefined) {
      trip.description = data.description;
    }
    if (data.status !== undefined) {
      trip.status = data.status;
    }

    const updated = await this.repository.save(trip);
    return this.toDomain(updated);
  }

  /**
   * Maps ORM entity to Domain entity
   */
  private toDomain(orm: TripOrmEntity): Trip {
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

    return new Trip(
      orm.id,
      orm.gpId,
      departureLocation,
      arrivalLocation,
      orm.departureDate,
      Number(orm.availableKilos),
      orm.pricePerKg ? Number(orm.pricePerKg) : undefined,
      orm.description,
      orm.status,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  /**
   * Maps Domain entity to ORM entity
   */
  private toOrm(domain: Trip): TripOrmEntity {
    const orm = new TripOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.gpId = domain.gpId;
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
    orm.status = domain.status;

    return orm;
  }
}
