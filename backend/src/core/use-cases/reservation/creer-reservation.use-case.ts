import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { IReservationRepository } from '../../ports/repositories/reservation.repository';
import { RESERVATION_REPOSITORY } from '../../ports/repositories/reservation.repository';
import type { IVoyageRepository } from '../../ports/repositories/voyage.repository';
import { VOYAGE_REPOSITORY } from '../../ports/repositories/voyage.repository';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Role } from '../../domain/enums/role.enum';
import { StatutReservation } from '../../domain/enums/statut-reservation.enum';

export interface CreerReservationCommand {
  clientId: number;
  voyageId: number;
  poidsKg: number;
  description?: string;
  adresseEnlevement?: string;
  adresseLivraison?: string;
  nomDestinataire: string;
  telephoneDestinataire: string;
}

export interface CreerReservationResponse {
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
 * Use Case: Créer une réservation
 * Gère la création d'une nouvelle réservation par un client
 */
@Injectable()
export class CreerReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(VOYAGE_REPOSITORY)
    private readonly voyageRepository: IVoyageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    command: CreerReservationCommand,
  ): Promise<CreerReservationResponse> {
    // Vérifier que l'utilisateur est un client
    const user = await this.userRepository.findById(command.clientId);
    if (!user || user.role !== Role.CLIENT) {
      throw new ForbiddenException(
        'Seuls les clients peuvent créer des réservations',
      );
    }

    // Vérifier que le voyage existe
    const voyage = await this.voyageRepository.findById(command.voyageId);
    if (!voyage) {
      throw new NotFoundException('Voyage non trouvé');
    }

    // Vérifier que le voyage peut accepter la réservation
    if (!voyage.canAcceptBooking(command.poidsKg)) {
      throw new BadRequestException(
        'Le voyage ne peut pas accepter cette réservation (capacité insuffisante ou statut invalide)',
      );
    }

    // Calculer le poids déjà réservé pour ce voyage
    const poidsReserve =
      await this.reservationRepository.calculerPoidsReservePourVoyage(
        command.voyageId,
      );

    // Vérifier la capacité disponible
    const capaciteDisponible = voyage.availableKilos - poidsReserve;
    if (command.poidsKg > capaciteDisponible) {
      throw new BadRequestException(
        `Capacité insuffisante. Disponible: ${capaciteDisponible} kg, Demandé: ${command.poidsKg} kg`,
      );
    }

    // Calculer le montant total si un prix est défini
    const montantTotal = voyage.pricePerKg
      ? voyage.pricePerKg * command.poidsKg
      : undefined;

    // Créer l'entité réservation
    const reservation = new Reservation(
      undefined, // ID sera généré
      command.clientId,
      command.voyageId,
      command.poidsKg,
      command.description,
      command.adresseEnlevement,
      command.adresseLivraison,
      command.nomDestinataire,
      command.telephoneDestinataire,
      undefined, // Statut par défaut: EN_ATTENTE
      montantTotal,
    );

    // Sauvegarder la réservation
    const savedReservation = await this.reservationRepository.save(reservation);

    // Retourner la réponse
    return {
      id: savedReservation.id!,
      clientId: savedReservation.clientId,
      voyageId: savedReservation.voyageId,
      poidsKg: savedReservation.poidsKg,
      description: savedReservation.description,
      adresseEnlevement: savedReservation.adresseEnlevement,
      adresseLivraison: savedReservation.adresseLivraison,
      nomDestinataire: savedReservation.nomDestinataire,
      telephoneDestinataire: savedReservation.telephoneDestinataire,
      statut: savedReservation.statut,
      montantTotal: savedReservation.montantTotal,
      createdAt: savedReservation.createdAt!,
      updatedAt: savedReservation.updatedAt!,
    };
  }
}
