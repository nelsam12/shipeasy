import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'ID of the client' })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ description: 'ID of the GP' })
  @IsNumber()
  @IsNotEmpty()
  gpId: number;
}
