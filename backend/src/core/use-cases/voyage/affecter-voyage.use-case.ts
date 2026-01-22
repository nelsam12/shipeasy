import { Inject, Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';
import type { IAffectationVoyageRepository } from '../../ports/repositories/affectation-voyage.repository';
import { AFFECTATION_VOYAGE_REPOSITORY } from '../../ports/repositories/affectation-voyage.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Role } from '../../domain/enums/role.enum';
import { StatutVoyage } from '../../domain/enums/statut-voyage.enum';
import { AffectationVoyage } from '../../domain/entities/affectation-voyage.entity';

export interface AffecterVoyageCommand {
  voyageId: number;
  gpId: number;
  affecteParId: number;
  note?: string;
}

/**
 * Affecter Voyage Use Case
 * Assigns a GP to a voyage
 * Only GESTIONNAIRE and ADMIN can perform this action
 */
@Injectable()
export class AffecterVoyageUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
    @Inject(AFFECTATION_VOYAGE_REPOSITORY)
    private readonly affectationRepository: IAffectationVoyageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: AffecterVoyageCommand) {
    // Find the voyage
    const voyage = await this.voyageRepository.findById(command.voyageId);
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    // Find the GP to assign
    const gp = await this.userRepository.findById(command.gpId);
    if (!gp) {
      throw new NotFoundException('GP not found');
    }

    // Validate GP role and approval status
    if (gp.role !== Role.GP) {
      throw new BadRequestException('User must have GP role');
    }

    if (!gp.isApproved) {
      throw new BadRequestException('GP must be approved');
    }

    // Close all active affectations for this voyage
    await this.affectationRepository.closeActiveAffectations(command.voyageId);

    // Create new affectation
    const affectation = new AffectationVoyage(
      undefined,
      command.voyageId,
      command.gpId,
      command.affecteParId,
      new Date(),
      undefined, // Not closed yet
      command.note,
    );

    await this.affectationRepository.save(affectation);

    // Update voyage with the assigned GP and change status to AFFECTE
    const updatedVoyage = voyage.assignGp(command.gpId);
    await this.voyageRepository.save(updatedVoyage);

    return {
      id: updatedVoyage.id,
      gpCreateurId: updatedVoyage.gpCreateurId,
      gpCourantId: updatedVoyage.gpCourantId,
      departureLocation: {
        city: updatedVoyage.departureLocation.city,
        country: updatedVoyage.departureLocation.country,
        flag: updatedVoyage.departureLocation.flag,
      },
      arrivalLocation: {
        city: updatedVoyage.arrivalLocation.city,
        country: updatedVoyage.arrivalLocation.country,
        flag: updatedVoyage.arrivalLocation.flag,
      },
      departureDate: updatedVoyage.departureDate,
      availableKilos: updatedVoyage.availableKilos,
      pricePerKg: updatedVoyage.pricePerKg,
      description: updatedVoyage.description,
      statut: updatedVoyage.statut,
      createdAt: updatedVoyage.createdAt,
      updatedAt: updatedVoyage.updatedAt,
    };
  }
}
