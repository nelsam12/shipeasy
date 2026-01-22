import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { ITripRepository } from '../../ports/repositories/trip.repository';
import { TRIP_REPOSITORY } from '../../ports/repositories/trip.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Role } from '../../domain/enums/role.enum';
import { Trip } from '../../domain/entities/trip.entity';

export interface AssignGpCommand {
  tripId: number;
  gpId: number;
}

export interface AssignGpResponse {
  id: number;
  gpId: number;
  status: string;
  updatedAt: Date;
}

/**
 * Assign GP to Trip Use Case
 * Handles the assignment of a GP to a trip
 */
@Injectable()
export class AssignGpToTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: AssignGpCommand): Promise<AssignGpResponse> {
    // 1. Find the trip
    const trip = await this.tripRepository.findById(command.tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // 2. Find the GP user
    const gp = await this.userRepository.findById(command.gpId);
    if (!gp) {
      throw new NotFoundException('GP not found');
    }

    // 3. Validate user is GP and approved
    if (gp.role !== Role.GP) {
      throw new BadRequestException('User is not a GP');
    }

    if (!gp.isApproved) {
      throw new BadRequestException('GP is not approved');
    }

    // 4. Update trip with gpId (create new Trip entity with updated gpId)
    const updatedTrip = new Trip(
      trip.id,
      command.gpId,
      trip.departureLocation,
      trip.arrivalLocation,
      trip.departureDate,
      trip.availableKilos,
      trip.pricePerKg,
      trip.description,
      trip.status,
      trip.createdAt,
      new Date(),
    );

    // Save the updated trip
    const savedTrip = await this.tripRepository.save(updatedTrip);

    // 5. Return response
    return {
      id: savedTrip.id!,
      gpId: savedTrip.gpId,
      status: savedTrip.status,
      updatedAt: savedTrip.updatedAt || new Date(),
    };
  }
}
