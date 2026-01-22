import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';

/**
 * Get Voyage Use Case
 * Retrieves a single voyage by ID
 */
@Injectable()
export class GetVoyageUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
  ) {}

  async execute(id: number) {
    const voyage = await this.voyageRepository.findById(id);
    
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    return {
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
    };
  }
}
