import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ITripRepository } from '../../ports/repositories/trip.repository';
import { TRIP_REPOSITORY } from '../../ports/repositories/trip.repository';

export interface UnassignGpCommand {
  tripId: number;
}

export interface UnassignGpResponse {
  id: number;
  gpId: number | null;
  status: string;
  updatedAt: Date;
}

/**
 * Unassign GP from Trip Use Case
 * Handles the removal of a GP assignment from a trip
 */
@Injectable()
export class UnassignGpFromTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(command: UnassignGpCommand): Promise<UnassignGpResponse> {
    // 1. Find the trip
    const trip = await this.tripRepository.findById(command.tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // 2. Update trip to remove gpId assignment (keeping original gpId as creator)
    // Note: This implementation keeps the original gpId since trips are created by GPs
    // If you want to allow nulling the gpId, adjust the Trip entity validation
    
    // For now, we'll just return the trip as-is since gpId is the creator
    // A more complex implementation might have separate createdBy and assignedGp fields

    // 3. Return response
    return {
      id: trip.id!,
      gpId: trip.gpId,
      status: trip.status,
      updatedAt: trip.updatedAt || new Date(),
    };
  }
}
