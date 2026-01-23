import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import type { IReservationRepository } from '../../ports/repositories/reservation.repository';
import { RESERVATION_REPOSITORY } from '../../ports/repositories/reservation.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Role } from '../../domain/enums/role.enum';
import { StatutReservation } from '../../domain/enums/statut-reservation.enum';

export interface ReservationDto {
  id: number;
  clientId: number;
  voyageId: number;
  poidsKg: number;
  description?: string;
  adresseEnlevement?: string;
  adresseLivraison?: string;
  nomDestinataire: string;
  telephoneDestinataire: string;
  statut: StatutReservation;
  montantTotal?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Use Case: Lister mes réservations
 * Permet à un client de lister toutes ses réservations
 */
@Injectable()
export class ListerMesReservationsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(clientId: number): Promise<ReservationDto[]> {
    // Vérifier que l'utilisateur est un client
    const user = await this.userRepository.findById(clientId);
    if (!user || user.role !== Role.CLIENT) {
      throw new ForbiddenException(
        'Seuls les clients peuvent consulter leurs réservations',
      );
    }

    // Récupérer les réservations du client
    const reservations =
      await this.reservationRepository.findByClientId(clientId);

    // Mapper vers les DTOs
    return reservations.map((reservation) => ({
      id: reservation.id!,
      clientId: reservation.clientId,
      voyageId: reservation.voyageId,
      poidsKg: reservation.poidsKg,
      description: reservation.description,
      adresseEnlevement: reservation.adresseEnlevement,
      adresseLivraison: reservation.adresseLivraison,
      nomDestinataire: reservation.nomDestinataire,
      telephoneDestinataire: reservation.telephoneDestinataire,
      statut: reservation.statut,
      montantTotal: reservation.montantTotal,
      createdAt: reservation.createdAt!,
      updatedAt: reservation.updatedAt!,
    }));
  }
}
