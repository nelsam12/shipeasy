import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsDateString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Location DTO
 * Represents a location with city, country, and flag
 */
export class LocationDto {
  @ApiProperty({ example: 'Dakar' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Sénégal' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '🇸🇳' })
  @IsString()
  @IsNotEmpty()
  flag: string;
}

/**
 * Create Trip DTO
 * Request body for creating a new trip
 */
export class CreateTripDto {
  @ApiProperty({
    description: 'Departure location (city, country, flag)',
    type: LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  departureLocation: LocationDto;

  @ApiProperty({
    description: 'Arrival location (city, country, flag)',
    type: LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  arrivalLocation: LocationDto;

  @ApiProperty({
    description: 'Departure date (ISO 8601 format)',
    example: '2026-02-01T10:00:00Z',
  })
  @IsDateString()
  departureDate: string;

  @ApiProperty({
    description: 'Available kilos for transport',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  availableKilos: number;

  @ApiProperty({
    description: 'Price per kilogram (optional)',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerKg?: number;

  @ApiProperty({
    description: 'Additional description (optional)',
    example: 'Je peux transporter des colis fragiles',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
