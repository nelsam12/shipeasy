import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

/**
 * Affecter Voyage DTO
 * Request body for assigning a GP to a voyage
 */
export class AffecterVoyageDto {
  @ApiProperty({
    description: 'ID of the GP to assign',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  gpId: number;

  @ApiProperty({
    description: 'Optional note about the assignment',
    example: 'Assigned due to proximity',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
