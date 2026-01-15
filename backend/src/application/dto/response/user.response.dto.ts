import { ApiProperty } from '@nestjs/swagger';

/**
 * User Response DTO
 */
export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  isApproved: boolean;
}
