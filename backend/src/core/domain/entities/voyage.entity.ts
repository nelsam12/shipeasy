import { StatutVoyage } from '../enums/statut-voyage.enum';
import { Location } from '../value-objects/location.vo';

/**
 * Voyage Domain Entity
 * Represents a voyage created by a GP (Gestionnaire de Point)
 */
export class Voyage {
  constructor(
    public readonly id: number | undefined,
    public readonly gpCreateurId: number, // Creator GP ID
    public readonly departureLocation: Location,
    public readonly arrivalLocation: Location,
    public readonly departureDate: Date,
    public readonly availableKilos: number,
    public readonly pricePerKg?: number,
    public readonly description?: string,
    public readonly statut: StatutVoyage = StatutVoyage.BROUILLON,
    public readonly gpCourantId?: number, // Currently assigned GP ID (can be null)
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validateVoyage();
  }

  /**
   * Validates voyage business rules
   */
  private validateVoyage(): void {
    if (this.availableKilos <= 0) {
      throw new Error('Available kilos must be greater than 0');
    }

    if (this.pricePerKg !== undefined && this.pricePerKg < 0) {
      throw new Error('Price per kg cannot be negative');
    }

    // Allow departure dates from today onwards (with 1-hour grace period for timezone differences)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    if (this.departureDate < oneHourAgo) {
      throw new Error('Departure date cannot be in the past');
    }

    if (this.departureLocation.equals(this.arrivalLocation)) {
      throw new Error('Departure and arrival locations must be different');
    }
  }

  /**
   * Checks if the voyage is published
   */
  isPublie(): boolean {
    return this.statut === StatutVoyage.PUBLIE;
  }

  /**
   * Checks if the voyage is assigned
   */
  isAffecte(): boolean {
    return this.statut === StatutVoyage.AFFECTE;
  }

  /**
   * Checks if the voyage can accept bookings
   */
  canAcceptBooking(requestedKilos: number): boolean {
    return (
      (this.isPublie() || this.isAffecte()) &&
      this.availableKilos >= requestedKilos
    );
  }

  /**
   * Changes the status of the voyage
   */
  changeStatut(newStatut: StatutVoyage): Voyage {
    return new Voyage(
      this.id,
      this.gpCreateurId,
      this.departureLocation,
      this.arrivalLocation,
      this.departureDate,
      this.availableKilos,
      this.pricePerKg,
      this.description,
      newStatut,
      this.gpCourantId,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Assigns a GP to the voyage
   */
  assignGp(gpId: number): Voyage {
    return new Voyage(
      this.id,
      this.gpCreateurId,
      this.departureLocation,
      this.arrivalLocation,
      this.departureDate,
      this.availableKilos,
      this.pricePerKg,
      this.description,
      StatutVoyage.AFFECTE,
      gpId,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Marks the voyage as completed
   */
  complete(): Voyage {
    return new Voyage(
      this.id,
      this.gpCreateurId,
      this.departureLocation,
      this.arrivalLocation,
      this.departureDate,
      this.availableKilos,
      this.pricePerKg,
      this.description,
      StatutVoyage.TERMINE,
      this.gpCourantId,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Cancels the voyage
   */
  cancel(): Voyage {
    return new Voyage(
      this.id,
      this.gpCreateurId,
      this.departureLocation,
      this.arrivalLocation,
      this.departureDate,
      this.availableKilos,
      this.pricePerKg,
      this.description,
      StatutVoyage.ANNULE,
      this.gpCourantId,
      this.createdAt,
      new Date(),
    );
  }
}
