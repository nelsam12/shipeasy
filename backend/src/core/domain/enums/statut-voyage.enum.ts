/**
 * Statut Voyage Enum
 * Represente les differents etats d'un voyage
 */
export enum StatutVoyage {
  BROUILLON = 'BROUILLON', // Voyage en cours de creation
  PUBLIE = 'PUBLIE', // Voyage publie, visible et disponible
  AFFECTE = 'AFFECTE', // Voyage affecte a un GP
  ANNULE = 'ANNULE', // Voyage annule
  TERMINE = 'TERMINE', // Voyage termine
}
