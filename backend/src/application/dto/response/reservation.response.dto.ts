import { ApiProperty } from '@nestjs/swagger';
import { StatutReservation } from '../../../core/domain/enums/statut-reservation.enum';

/**
 * DTO de réponse pour une réservation
 */
export class ReservationResponseDto {
  @ApiProperty({ description: 'ID de la réservation', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID du client', example: 5 })
  clientId: number;

  @ApiProperty({ description: 'ID du voyage', example: 3 })
  voyageId: number;

  @ApiProperty({ description: 'Poids du colis en kg', example: 15.5 })
  poidsKg: number;

  @ApiProperty({
    description: 'Description du colis',
    example: 'Vêtements et livres',
  })
  description: string;

  @ApiProperty({
    description: "Adresse d'enlèvement",
    example: '123 Rue de la République, Dakar, Sénégal',
  })
  adresseEnlevement: string;

  @ApiProperty({
    description: 'Adresse de livraison',
    example: '456 Avenue des Champs-Élysées, Paris, France',
  })
  adresseLivraison: string;

  @ApiProperty({
    description: 'Nom du destinataire',
    example: 'Jean Dupont',
  })
  nomDestinataire: string;

  @ApiProperty({
    description: 'Téléphone du destinataire',
    example: '+33612345678',
  })
  telephoneDestinataire: string;

  @ApiProperty({
    description: 'Statut de la réservation',
    enum: StatutReservation,
    example: StatutReservation.EN_ATTENTE,
  })
  statut: StatutReservation;

  @ApiProperty({
    description: 'Montant total de la réservation',
    example: 77500,
    required: false,
  })
  montantTotal?: number;

  @ApiProperty({ description: 'Date de création', example: '2026-01-23T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2026-01-23T10:00:00Z',
  })
  updatedAt: Date;
}
