import { Inject, Injectable } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';

export interface SearchVoyagesQuery {
  departureCity?: string;
  arrivalCity?: string;
}

/**
 * Search Voyages Use Case
 * Searches voyages by departure and/or arrival city
 */
@Injectable()
export class SearchVoyagesUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
  ) {}

  async execute(query: SearchVoyagesQuery) {
    const voyages = await this.voyageRepository.searchVoyages(
      query.departureCity,
      query.arrivalCity,
    );

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
