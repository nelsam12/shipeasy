import { Reservation } from '../../domain/entities/reservation.entity';
import { StatutReservation } from '../../domain/enums/statut-reservation.enum';

export const RESERVATION_REPOSITORY = 'RESERVATION_REPOSITORY';

/**
 * Interface du repository pour les réservations
 * Définit le contrat pour la persistance des réservations
 */
export interface IReservationRepository {
  /**
   * Trouve une réservation par son ID
   */
  findById(id: number): Promise<Reservation | null>;

  /**
   * Trouve toutes les réservations d'un client
   */
  findByClientId(clientId: number): Promise<Reservation[]>;

  /**
   * Trouve toutes les réservations d'un voyage
   */
  findByVoyageId(voyageId: number): Promise<Reservation[]>;

  /**
   * Trouve les réservations par statut
   */
  findByStatut(statut: StatutReservation): Promise<Reservation[]>;

  /**
   * Calcule le poids total réservé pour un voyage
   */
  calculerPoidsReservePourVoyage(voyageId: number): Promise<number>;

  /**
   * Sauvegarde une nouvelle réservation ou met à jour une existante
   */
  save(reservation: Reservation): Promise<Reservation>;

  /**
   * Met à jour une réservation
   */
  update(id: number, data: Partial<Reservation>): Promise<Reservation>;

  /**
   * Supprime une réservation par son ID
   */
  delete(id: number): Promise<void>;

  /**
   * Trouve toutes les réservations
   */
  findAll(): Promise<Reservation[]>;
}
