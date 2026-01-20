import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITripRepository } from '../../ports/repositories/trip.repository';
import { TRIP_REPOSITORY } from '../../ports/repositories/trip.repository';
import type { TripResponse } from './list-trips.use-case';

/**
 * Get Trip Use Case
 * Retrieves a single trip by ID
 */
@Injectable()
export class GetTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(tripId: number): Promise<TripResponse> {
    const trip = await this.tripRepository.findById(tripId);

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return {
      id: trip.id!,
      gpId: trip.gpId,
      departureLocation: {
        city: trip.departureLocation.city,
        country: trip.departureLocation.country,
        flag: trip.departureLocation.flag,
      },
      arrivalLocation: {
        city: trip.arrivalLocation.city,
        country: trip.arrivalLocation.country,
        flag: trip.arrivalLocation.flag,
      },
      departureDate: trip.departureDate,
      availableKilos: trip.availableKilos,
      pricePerKg: trip.pricePerKg,
      description: trip.description,
      status: trip.status,
      createdAt: trip.createdAt!,
      updatedAt: trip.updatedAt!,
    };
  }
}
