import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatutVoyage } from '../../../core/domain/enums/statut-voyage.enum';

/**
 * Change Statut Voyage DTO
 * Request body for changing the status of a voyage
 */
export class ChangeStatutVoyageDto {
  @ApiProperty({
    description: 'New status for the voyage',
    enum: StatutVoyage,
    example: StatutVoyage.PUBLIE,
  })
  @IsEnum(StatutVoyage)
  statut: StatutVoyage;
}
