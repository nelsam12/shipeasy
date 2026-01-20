/**
 * Trip Status Enum
 * Represents the different states of a trip
 */
export enum TripStatus {
  ACTIVE = 'ACTIVE', // Voyage actif, accepte des réservations
  COMPLETED = 'COMPLETED', // Voyage terminé
  CANCELLED = 'CANCELLED', // Voyage annulé
}
