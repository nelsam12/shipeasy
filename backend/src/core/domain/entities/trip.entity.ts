import { TripStatus } from '../enums/trip-status.enum';
import { Location } from '../value-objects/location.vo';

/**
 * Trip Domain Entity
 * Represents a trip created by a GP (Gestionnaire de Point)
 */
export class Trip {
  constructor(
    public readonly id: number | undefined,
    public readonly gpId: number,
    public readonly departureLocation: Location,
    public readonly arrivalLocation: Location,
    public readonly departureDate: Date,
    public readonly availableKilos: number,
    public readonly pricePerKg?: number,
    public readonly description?: string,
    public readonly status: TripStatus = TripStatus.ACTIVE,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validateTrip();
  }

  /**
   * Validates trip business rules
   */
  private validateTrip(): void {
    if (this.availableKilos <= 0) {
      throw new Error('Available kilos must be greater than 0');
    }

    if (this.pricePerKg !== undefined && this.pricePerKg < 0) {
      throw new Error('Price per kg cannot be negative');
    }

    if (this.departureDate < new Date()) {
      throw new Error('Departure date cannot be in the past');
    }

    if (this.departureLocation.equals(this.arrivalLocation)) {
      throw new Error('Departure and arrival locations must be different');
    }
  }

  /**
   * Checks if the trip is active
   */
  isActive(): boolean {
    return this.status === TripStatus.ACTIVE;
  }

  /**
   * Checks if the trip can accept bookings
   */
  canAcceptBooking(requestedKilos: number): boolean {
    return this.isActive() && this.availableKilos >= requestedKilos;
  }

  /**
   * Marks the trip as completed
   */
  complete(): Trip {
    return new Trip(
      this.id,
      this.gpId,
      this.departureLocation,
      this.arrivalLocation,
      this.departureDate,
      this.availableKilos,
      this.pricePerKg,
      this.description,
      TripStatus.COMPLETED,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Cancels the trip
   */
  cancel(): Trip {
    return new Trip(
      this.id,
      this.gpId,
      this.departureLocation,
      this.arrivalLocation,
      this.departureDate,
      this.availableKilos,
      this.pricePerKg,
      this.description,
      TripStatus.CANCELLED,
      this.createdAt,
      new Date(),
    );
  }
}
