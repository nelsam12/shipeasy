import { Inject, Injectable } from '@nestjs/common';
import type { IAffectationVoyageRepository } from '../../ports/repositories/affectation-voyage.repository';
import { AFFECTATION_VOYAGE_REPOSITORY } from '../../ports/repositories/affectation-voyage.repository';

/**
 * Get Affectations Voyage Use Case
 * Retrieves the assignment history for a voyage
 */
@Injectable()
export class GetAffectationsVoyageUseCase {
  constructor(
    @Inject(AFFECTATION_VOYAGE_REPOSITORY)
    private readonly affectationRepository: IAffectationVoyageRepository,
  ) {}

  async execute(voyageId: number) {
    const affectations =
      await this.affectationRepository.findByVoyageId(voyageId);

    return affectations.map((affectation) => ({
      id: affectation.id,
      voyageId: affectation.voyageId,
      gpId: affectation.gpId,
      affecteParId: affectation.affecteParId,
      affecteLe: affectation.affecteLe,
      desaffecteLe: affectation.desaffecteLe,
      note: affectation.note,
      isActive: affectation.isActive(),
      createdAt: affectation.createdAt,
      updatedAt: affectation.updatedAt,
    }));
  }
}
