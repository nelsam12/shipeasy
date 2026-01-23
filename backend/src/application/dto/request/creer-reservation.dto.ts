import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

/**
 * DTO pour créer une réservation
 * Corps de la requête pour créer une nouvelle réservation
 */
export class CreerReservationDto {
  @ApiProperty({
    description: 'ID du voyage',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  voyageId: number;

  @ApiProperty({
    description: 'Poids du colis en kilogrammes',
    example: 15.5,
    minimum: 0.1,
    maximum: 1000,
  })
  @IsNumber()
  @IsPositive()
  @Min(0.1)
  @Max(1000)
  poidsKg: number;

  @ApiProperty({
    description: 'Description du contenu du colis',
    example: 'Vêtements et livres',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Adresse d'enlèvement du colis",
    example: '123 Rue de la République, Dakar, Sénégal',
  })
  @IsString()
  @IsNotEmpty()
  adresseEnlevement: string;

  @ApiProperty({
    description: 'Adresse de livraison du colis',
    example: '456 Avenue des Champs-Élysées, Paris, France',
  })
  @IsString()
  @IsNotEmpty()
  adresseLivraison: string;

  @ApiProperty({
    description: 'Nom complet du destinataire',
    example: 'Jean Dupont',
  })
  @IsString()
  @IsNotEmpty()
  nomDestinataire: string;

  @ApiProperty({
    description: 'Numéro de téléphone du destinataire',
    example: '+33612345678',
  })
  @IsString()
  @IsNotEmpty()
  telephoneDestinataire: string;
}
