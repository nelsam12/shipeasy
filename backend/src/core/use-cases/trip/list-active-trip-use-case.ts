import { Inject, Injectable } from '@nestjs/common';
import type { ITripRepository } from '../../ports/repositories/trip.repository';
import { TRIP_REPOSITORY } from '../../ports/repositories/trip.repository';
import type { TripResponse } from './list-trips.use-case';

/**
 * List Active Trips Use Case
 * Retrieves only active trips
 */
@Injectable()
export class ListActiveTripsUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(): Promise<TripResponse[]> {
    const trips = await this.tripRepository.findAllActive();

    return trips.map((trip) => ({
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
    }));
  }
}
