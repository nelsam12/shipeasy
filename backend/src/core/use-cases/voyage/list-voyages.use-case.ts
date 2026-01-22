import { Inject, Injectable } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';
import { StatutVoyage } from '../../domain/enums/statut-voyage.enum';
import type { Voyage } from '../../domain/entities/voyage.entity';

export interface ListVoyagesQuery {
  gpId?: number;
  statut?: StatutVoyage;
}

/**
 * List Voyages Use Case
 * Lists all voyages with optional filters
 */
@Injectable()
export class ListVoyagesUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
  ) {}

  async execute(query?: ListVoyagesQuery) {
    let voyages: Voyage[];

    // Apply filters if provided
    if (query?.gpId) {
      voyages = await this.voyageRepository.findByGpCreateurId(query.gpId);
    } else if (query?.statut === StatutVoyage.PUBLIE) {
      voyages = await this.voyageRepository.findAllPublie();
    } else if (query?.statut === StatutVoyage.AFFECTE) {
      voyages = await this.voyageRepository.findAllAffecte();
    } else {
      voyages = await this.voyageRepository.findAll();
    }

    // Filter by status if provided and not already filtered
    if (query?.statut && !query.gpId) {
      voyages = voyages.filter((v) => v.statut === query.statut);
    }

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
