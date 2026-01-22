import { Voyage } from '../../domain/entities/voyage.entity';
import { StatutVoyage } from '../../domain/enums/statut-voyage.enum';

export const VOYAGE_REPOSITORY = 'VOYAGE_REPOSITORY';

/**
 * Voyage Repository Interface
 * Defines the contract for voyage persistence
 */
export interface IVoyageRepository {
  /**
   * Finds a voyage by ID
   */
  findById(id: number): Promise<Voyage | null>;

  /**
   * Finds all voyages created by a specific GP
   */
  findByGpCreateurId(gpId: number): Promise<Voyage[]>;

  /**
   * Finds all voyages currently assigned to a specific GP
   */
  findByGpCourantId(gpId: number): Promise<Voyage[]>;

  /**
   * Finds all published voyages
   */
  findAllPublie(): Promise<Voyage[]>;

  /**
   * Finds all assigned voyages
   */
  findAllAffecte(): Promise<Voyage[]>;

  /**
   * Searches voyages by departure and/or arrival location
   */
  searchVoyages(
    departureCity?: string,
    arrivalCity?: string,
  ): Promise<Voyage[]>;

  /**
   * Saves a new voyage or updates an existing one
   */
  save(voyage: Voyage): Promise<Voyage>;

  /**
   * Deletes a voyage by ID
   */
  delete(id: number): Promise<void>;

  /**
   * Finds all voyages
   */
  findAll(): Promise<Voyage[]>;

  /**
   * Updates a voyage
   */
  update(id: number, data: Partial<Voyage>): Promise<Voyage>;

  /**
   * Changes the status of a voyage
   */
  changeStatut(id: number, statut: StatutVoyage): Promise<Voyage>;
}
