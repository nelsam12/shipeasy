import { Inject, Injectable } from '@nestjs/common';
import {
  ITripRepository,
  TRIP_REPOSITORY,
} from '../../ports/repositories/trip.repository';
import type { TripResponse } from './list-trips.use-case';

/**
 * Get My Trips Use Case
 * Retrieves all trips created by the authenticated GP
 */
@Injectable()
export class GetMyTripsUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(gpId: number): Promise<TripResponse[]> {
    const trips = await this.tripRepository.findByGpId(gpId);

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
