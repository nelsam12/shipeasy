import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Voyage } from '../../domain/entities/voyage.entity';
import { Location } from '../../domain/value-objects/location.vo';
import { Role } from '../../domain/enums/role.enum';
import { StatutVoyage } from '../../domain/enums/statut-voyage.enum';

export interface CreateVoyageCommand {
  gpCreateurId: number;
  departureLocation: {
    city: string;
    country: string;
    flag: string;
  };
  arrivalLocation: {
    city: string;
    country: string;
    flag: string;
  };
  departureDate: Date;
  availableKilos: number;
  pricePerKg?: number;
  description?: string;
}

export interface CreateVoyageResponse {
  id: number;
  gpCreateurId: number;
  departureLocation: {
    city: string;
    country: string;
    flag: string;
  };
  arrivalLocation: {
    city: string;
    country: string;
    flag: string;
  };
  departureDate: Date;
  availableKilos: number;
  pricePerKg?: number;
  description?: string;
  statut: StatutVoyage;
  createdAt: Date;
}

/**
 * Create Voyage Use Case
 * Handles the creation of a new voyage by a GP
 */
@Injectable()
export class CreateVoyageUseCase {
  constructor(
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateVoyageCommand): Promise<CreateVoyageResponse> {
    // Verify user is a GP
    const user = await this.userRepository.findById(command.gpCreateurId);
    if (!user || user.role !== Role.GP) {
      throw new ForbiddenException('Only GPs can create voyages');
    }

    // Create location value objects
    const departureLocation = Location.create(
      command.departureLocation.city,
      command.departureLocation.country,
      command.departureLocation.flag,
    );

    const arrivalLocation = Location.create(
      command.arrivalLocation.city,
      command.arrivalLocation.country,
      command.arrivalLocation.flag,
    );

    // Create voyage entity with BROUILLON status
    const voyage = new Voyage(
      undefined, // ID will be generated
      command.gpCreateurId,
      departureLocation,
      arrivalLocation,
      command.departureDate,
      command.availableKilos,
      command.pricePerKg,
      command.description,
      StatutVoyage.BROUILLON, // Initial status
      undefined, // No GP assigned yet
    );

    // Save voyage
    const savedVoyage = await this.voyageRepository.save(voyage);

    // Return response
    return {
      id: savedVoyage.id!,
      gpCreateurId: savedVoyage.gpCreateurId,
      departureLocation: {
        city: savedVoyage.departureLocation.city,
        country: savedVoyage.departureLocation.country,
        flag: savedVoyage.departureLocation.flag,
      },
      arrivalLocation: {
        city: savedVoyage.arrivalLocation.city,
        country: savedVoyage.arrivalLocation.country,
        flag: savedVoyage.arrivalLocation.flag,
      },
      departureDate: savedVoyage.departureDate,
      availableKilos: savedVoyage.availableKilos,
      pricePerKg: savedVoyage.pricePerKg,
      description: savedVoyage.description,
      statut: savedVoyage.statut,
      createdAt: savedVoyage.createdAt!,
    };
  }
}
