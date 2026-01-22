import { Inject, Injectable } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';

/**
 * Get Voyages Affectes Use Case
 * Retrieves all voyages currently assigned to a specific GP
 */
@Injectable()
export class GetVoyagesAffectesUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
  ) {}

  async execute(gpCourantId: number) {
    const voyages = await this.voyageRepository.findByGpCourantId(gpCourantId);

    return voyages.map((voyage) => ({
      id: voyage.id,
      gpCreateurId: voyage.gpCreateurId,
      gpCourantId: voyage.gpCourantId,
      departureLocation: {
        city: voyage.departureLocation.city,
        country: voyage.departureLocation.country,
        flag: voyage.departureLocation.flag,
      },
      arrivalLocation: {
        city: voyage.arrivalLocation.city,
        country: voyage.arrivalLocation.country,
        flag: voyage.arrivalLocation.flag,
      },
      departureDate: voyage.departureDate,
      availableKilos: voyage.availableKilos,
      pricePerKg: voyage.pricePerKg,
      description: voyage.description,
      statut: voyage.statut,
      createdAt: voyage.createdAt,
      updatedAt: voyage.updatedAt,
    }));
  }
}
