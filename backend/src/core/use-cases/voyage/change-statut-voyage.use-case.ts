import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';
import { StatutVoyage } from '../../domain/enums/statut-voyage.enum';

export interface ChangeStatutVoyageCommand {
  voyageId: number;
  statut: StatutVoyage;
}

/**
 * Change Statut Voyage Use Case
 * Changes the status of a voyage
 * Only GESTIONNAIRE and ADMIN can perform this action
 */
@Injectable()
export class ChangeStatutVoyageUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
  ) {}

  async execute(command: ChangeStatutVoyageCommand) {
    // Find the voyage
    const voyage = await this.voyageRepository.findById(command.voyageId);
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    // Change the status
    const updatedVoyage = voyage.changeStatut(command.statut);
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
