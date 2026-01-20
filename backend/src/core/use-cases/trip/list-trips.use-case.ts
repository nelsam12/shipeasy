import { Inject, Injectable } from '@nestjs/common';
import type { ITripRepository } from '../../ports/repositories/trip.repository';
import { TRIP_REPOSITORY } from '../../ports/repositories/trip.repository';

export interface TripResponse {
  id: number;
  gpId: number;
  departureLocation: {
    city: string;
    country: string;
    flag: string;
  };
  arrivalLocation: {
    city: string;
    country: string;
    flag: string;
  };
  departureDate: Date;
  availableKilos: number;
  pricePerKg?: number;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * List Trips Use Case
 * Retrieves all trips
 */
@Injectable()
export class ListTripsUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(): Promise<TripResponse[]> {
    const trips = await this.tripRepository.findAll();

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
