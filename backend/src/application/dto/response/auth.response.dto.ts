import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.response.dto';

/**
 * Auth Response DTO
 */
export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
