/**
 * AffectationVoyage Domain Entity
 * Represents the assignment history of a voyage to a GP
 */
export class AffectationVoyage {
  constructor(
    public readonly id: number | undefined,
    public readonly voyageId: number,
    public readonly gpId: number,
    public readonly affecteParId: number, // ID of the manager who assigned
    public readonly affecteLe: Date, // Assignment date
    public readonly desaffecteLe?: Date, // Unassignment date (null if currently assigned)
    public readonly note?: string, // Optional note
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    this.validateAffectation();
  }

  /**
   * Validates affectation business rules
   */
  private validateAffectation(): void {
    if (this.desaffecteLe && this.desaffecteLe < this.affecteLe) {
      throw new Error('Unassignment date cannot be before assignment date');
    }
  }

  /**
   * Checks if the affectation is currently active
   */
  isActive(): boolean {
    return this.desaffecteLe === undefined || this.desaffecteLe === null;
  }

  /**
   * Closes the affectation
   */
  close(): AffectationVoyage {
    return new AffectationVoyage(
      this.id,
      this.voyageId,
      this.gpId,
      this.affecteParId,
      this.affecteLe,
      new Date(),
      this.note,
      this.createdAt,
      new Date(),
    );
  }
}
