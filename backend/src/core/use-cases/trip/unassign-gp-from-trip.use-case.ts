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
 * Note: In the current architecture, trips are created by GPs and gpId represents the creator.
 * This use case currently doesn't modify the trip, as removing the creator would break the data model.
 * For a full implementation, consider adding a separate 'assignedGpId' field to distinguish
 * between creator and assigned GP.
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

    // 2. In the current implementation, gpId is the creator and cannot be unassigned
    // If separate assignment tracking is needed, modify the Trip entity to include assignedGpId

    // 3. Return response
    return {
      id: trip.id!,
      gpId: trip.gpId,
      status: trip.status,
      updatedAt: trip.updatedAt || new Date(),
    };
  }
}
