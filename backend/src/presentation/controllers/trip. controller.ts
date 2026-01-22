import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import type { JwtUser } from '../../shared';
import { Role } from '../../core/domain/enums/role.enum';
import { CreateTripDto } from '../../application/dto/request/create-trip.dto';
import { AssignGpDto } from '../../application/dto/request/assign-gp.dto';
import { CreateTripUseCase } from '../../core/use-cases/trip/create-trip.use-case';
import { ListTripsUseCase } from '../../core/use-cases/trip/list-trips.use-case';
import { ListActiveTripsUseCase } from '../../core/use-cases/trip/list-active-trip-use-case';
import { SearchTripsUseCase } from '../../core/use-cases/trip/search-trip.use-case';
import { GetTripUseCase } from '../../core/use-cases/trip/get-trip-use-case';
import { GetMyTripsUseCase } from '../../core/use-cases/trip/get-my-trip-use-case';
import { AssignGpToTripUseCase } from '../../core/use-cases/trip/assign-gp-to-trip.use-case';
import { UnassignGpFromTripUseCase } from '../../core/use-cases/trip/unassign-gp-from-trip.use-case';

/**
 * Trip Controller
 * Handles trip-related endpoints
 */
@ApiTags('Trips')
@Controller('trips')
export class TripController {
  constructor(
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly listTripsUseCase: ListTripsUseCase,
    private readonly listActiveTripsUseCase: ListActiveTripsUseCase,
    private readonly searchTripsUseCase: SearchTripsUseCase,
    private readonly getTripUseCase: GetTripUseCase,
    private readonly getMyTripsUseCase: GetMyTripsUseCase,
    private readonly assignGpToTripUseCase: AssignGpToTripUseCase,
    private readonly unassignGpFromTripUseCase: UnassignGpFromTripUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new trip (GP only)' })
  @ApiResponse({ status: 201, description: 'Trip created successfully' })
  @ApiResponse({ status: 403, description: 'Only GPs can create trips' })
  async createTrip(@CurrentUser() user: JwtUser, @Body() dto: CreateTripDto) {
    return this.createTripUseCase.execute({
      gpId: user.userId,
      departureLocation: {
        city: dto.departureLocation.city,
        country: dto.departureLocation.country,
        flag: dto.departureLocation.flag,
      },
      arrivalLocation: {
        city: dto.arrivalLocation.city,
        country: dto.arrivalLocation.country,
        flag: dto.arrivalLocation.flag,
      },
      departureDate: new Date(dto.departureDate),
      availableKilos: dto.availableKilos,
      pricePerKg: dto.pricePerKg,
      description: dto.description,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all trips' })
  @ApiResponse({ status: 200, description: 'List of all trips' })
  async listTrips() {
    return this.listTripsUseCase.execute();
  }

  @Get('active')
  @ApiOperation({ summary: 'List all active trips' })
  @ApiResponse({ status: 200, description: 'List of active trips' })
  async listActiveTrips() {
    return this.listActiveTripsUseCase.execute();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search trips by departure, arrival, and/or date' })
  @ApiQuery({
    name: 'departureCity',
    required: false,
    description: 'Departure city',
  })
  @ApiQuery({
    name: 'arrivalCity',
    required: false,
    description: 'Arrival city',
  })
  @ApiQuery({
    name: 'departureDate',
    required: false,
    description: 'Departure date (ISO 8601 format)',
  })
  @ApiResponse({ status: 200, description: 'Filtered trips' })
  async searchTrips(
    @Query('departureCity') departureCity?: string,
    @Query('arrivalCity') arrivalCity?: string,
    @Query('departureDate') departureDate?: string,
  ) {
    return this.searchTripsUseCase.execute({
      departureCity,
      arrivalCity,
      departureDate: departureDate ? new Date(departureDate) : undefined,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-trips')
  @ApiOperation({ summary: 'Get my trips (GP only)' })
  @ApiResponse({ status: 200, description: 'List of my trips' })
  async getMyTrips(@CurrentUser() user: JwtUser) {
    return this.getMyTripsUseCase.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip details' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async getTrip(@Param('id', ParseIntPipe) id: number) {
    return this.getTripUseCase.execute(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Patch(':id/assign-gp')
  @ApiOperation({ summary: 'Assign a GP to a trip (GESTIONNAIRE/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'GP assigned successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Trip or GP not found' })
  async assignGpToTrip(
    @Param('id', ParseIntPipe) tripId: number,
    @Body() dto: AssignGpDto,
  ) {
    return this.assignGpToTripUseCase.execute({
      tripId,
      gpId: dto.gpId,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Patch(':id/unassign-gp')
  @ApiOperation({
    summary: 'Unassign a GP from a trip (GESTIONNAIRE/ADMIN only)',
  })
  @ApiResponse({ status: 200, description: 'GP unassigned successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async unassignGpFromTrip(@Param('id', ParseIntPipe) tripId: number) {
    return this.unassignGpFromTripUseCase.execute({ tripId });
  }
}
