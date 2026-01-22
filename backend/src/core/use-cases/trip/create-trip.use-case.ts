import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import type { ITripRepository } from '../../ports/repositories/trip.repository';
import { TRIP_REPOSITORY } from '../../ports/repositories/trip.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Trip } from '../../domain/entities/trip.entity';
import { Location } from '../../domain/value-objects/location.vo';
import { Role } from '../../domain/enums/role.enum';

export interface CreateTripCommand {
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
}

export interface CreateTripResponse {
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
}

/**
 * Create Trip Use Case
 * Handles the creation of a new trip by a GP
 */
@Injectable()
export class CreateTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateTripCommand): Promise<CreateTripResponse> {
    // Verify user is a GP or GESTIONNAIRE
    const user = await this.userRepository.findById(command.gpId);
    if (!user || (user.role !== Role.GP && user.role !== Role.GESTIONNAIRE)) {
      throw new ForbiddenException(
        'Only GPs and GESTIONNAIREs can create trips',
      );
    }

    // Create location value objects
    const departureLocation = Location.create(
      command.departureLocation.city,
      command.departureLocation.country,
      command.departureLocation.flag,
    );

    const arrivalLocation = Location.create(
      command.arrivalLocation.city,
      command.arrivalLocation.country,
      command.arrivalLocation.flag,
    );

    // Create trip entity
    const trip = new Trip(
      undefined, // ID will be generated
      command.gpId,
      departureLocation,
      arrivalLocation,
      command.departureDate,
      command.availableKilos,
      command.pricePerKg,
      command.description,
    );

    // Save trip
    const savedTrip = await this.tripRepository.save(trip);

    // Return response
    return {
      id: savedTrip.id!,
      gpId: savedTrip.gpId,
      departureLocation: {
        city: savedTrip.departureLocation.city,
        country: savedTrip.departureLocation.country,
        flag: savedTrip.departureLocation.flag,
      },
      arrivalLocation: {
        city: savedTrip.arrivalLocation.city,
        country: savedTrip.arrivalLocation.country,
        flag: savedTrip.arrivalLocation.flag,
      },
      departureDate: savedTrip.departureDate,
      availableKilos: savedTrip.availableKilos,
      pricePerKg: savedTrip.pricePerKg,
      description: savedTrip.description,
      status: savedTrip.status,
      createdAt: savedTrip.createdAt!,
    };
  }
}
