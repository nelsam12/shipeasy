import { AffectationVoyage } from '../../domain/entities/affectation-voyage.entity';

export const AFFECTATION_VOYAGE_REPOSITORY = 'AFFECTATION_VOYAGE_REPOSITORY';

/**
 * AffectationVoyage Repository Interface
 * Defines the contract for affectation voyage persistence
 */
export interface IAffectationVoyageRepository {
  /**
   * Finds an affectation by ID
   */
  findById(id: number): Promise<AffectationVoyage | null>;

  /**
   * Finds the active affectation for a voyage
   */
  findActiveByVoyageId(voyageId: number): Promise<AffectationVoyage | null>;

  /**
   * Finds all affectations for a voyage (history)
   */
  findByVoyageId(voyageId: number): Promise<AffectationVoyage[]>;

  /**
   * Saves a new affectation
   */
  save(affectation: AffectationVoyage): Promise<AffectationVoyage>;

  /**
   * Closes all active affectations for a voyage
   */
  closeActiveAffectations(voyageId: number): Promise<void>;
}
