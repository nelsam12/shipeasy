import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  login: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;
}
