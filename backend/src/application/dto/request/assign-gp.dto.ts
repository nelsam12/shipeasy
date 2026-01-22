import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for assigning a GP to a trip
 */
export class AssignGpDto {
  @ApiProperty({
    description: 'ID of the GP to assign to the trip',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  gpId: number;
}
