import { Inject, Injectable } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';

/**
 * Get Mes Voyages Use Case
 * Retrieves all voyages created by a specific GP
 */
@Injectable()
export class GetMesVoyagesUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
  ) {}

  async execute(gpCreateurId: number) {
    const voyages =
      await this.voyageRepository.findByGpCreateurId(gpCreateurId);

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
