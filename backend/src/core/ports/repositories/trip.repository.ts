import { Trip } from '../../domain/entities/trip.entity';

export const TRIP_REPOSITORY = 'TRIP_REPOSITORY';

/**
 * Trip Repository Interface
 * Defines the contract for trip persistence
 */
export interface ITripRepository {
  /**
   * Finds a trip by ID
   */
  findById(id: number): Promise<Trip | null>;

  /**
   * Finds all trips created by a specific GP
   */
  findByGpId(gpId: number): Promise<Trip[]>;

  /**
   * Finds all active trips
   */
  findAllActive(): Promise<Trip[]>;

  /**
   * Searches trips by departure and/or arrival location
   */
  searchTrips(departureCity?: string, arrivalCity?: string): Promise<Trip[]>;

  /**
   * Saves a new trip or updates an existing one
   */
  save(trip: Trip): Promise<Trip>;

  /**
   * Deletes a trip by ID
   */
  delete(id: number): Promise<void>;

  /**
   * Finds all trips
   */
  findAll(): Promise<Trip[]>;

  /**
   * Updates a trip
   */
  update(id: number, data: Partial<Trip>): Promise<Trip>;
}
