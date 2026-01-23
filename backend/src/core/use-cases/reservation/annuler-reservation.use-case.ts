import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { IReservationRepository } from '../../ports/repositories/reservation.repository';
import { RESERVATION_REPOSITORY } from '../../ports/repositories/reservation.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Role } from '../../domain/enums/role.enum';

export interface AnnulerReservationResponse {
  id: number;
  statut: string;
  updatedAt: Date;
}

/**
 * Use Case: Annuler une réservation
 * Permet à un client d'annuler une de ses réservations
 */
@Injectable()
export class AnnulerReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    reservationId: number,
    clientId: number,
  ): Promise<AnnulerReservationResponse> {
    // Vérifier que l'utilisateur est un client
    const user = await this.userRepository.findById(clientId);
    if (!user || user.role !== Role.CLIENT) {
      throw new ForbiddenException(
        'Seuls les clients peuvent annuler des réservations',
      );
    }

    // Récupérer la réservation
    const reservation =
      await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    // Vérifier que la réservation appartient au client
    if (reservation.clientId !== clientId) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à annuler cette réservation",
      );
    }

    // Vérifier que la réservation peut être annulée
    if (!reservation.peutEtreAnnulee()) {
      throw new BadRequestException(
        'Cette réservation ne peut pas être annulée dans son état actuel',
      );
    }

    // Annuler la réservation
    const reservationAnnulee = reservation.annuler();

    // Sauvegarder la réservation annulée
    const savedReservation = await this.reservationRepository.save(
      reservationAnnulee,
    );

    // Retourner la réponse
    return {
      id: savedReservation.id!,
      statut: savedReservation.statut,
      updatedAt: savedReservation.updatedAt!,
    };
  }
}
