import { Inject, Injectable } from '@nestjs/common';
import {
  ITripRepository,
  TRIP_REPOSITORY,
} from '../../ports/repositories/trip.repository';
import { TripResponse } from './list-trips.use-case';

export interface SearchTripsQuery {
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: Date;
}

/**
 * Search Trips Use Case
 * Searches trips by departure city, arrival city, and/or departure date
 */
@Injectable()
export class SearchTripsUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(query: SearchTripsQuery): Promise<TripResponse[]> {
    // Get trips matching city criteria
    let trips = await this.tripRepository.searchTrips(
      query.departureCity,
      query.arrivalCity,
    );

    // Filter by departure date if provided
    if (query.departureDate) {
      const searchDate = new Date(query.departureDate);
      searchDate.setHours(0, 0, 0, 0);

      trips = trips.filter((trip) => {
        const tripDate = new Date(trip.departureDate);
        tripDate.setHours(0, 0, 0, 0);
        return tripDate.getTime() === searchDate.getTime();
      });
    }

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
