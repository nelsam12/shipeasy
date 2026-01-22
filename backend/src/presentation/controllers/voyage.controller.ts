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
import { StatutVoyage } from '../../core/domain/enums/statut-voyage.enum';
import { CreateVoyageDto } from '../../application/dto/request/create-voyage.dto';
import { AffecterVoyageDto } from '../../application/dto/request/affecter-voyage.dto';
import { ChangeStatutVoyageDto } from '../../application/dto/request/change-statut-voyage.dto';
import { CreateVoyageUseCase } from '../../core/use-cases/voyage/create-voyage.use-case';
import { ListVoyagesUseCase } from '../../core/use-cases/voyage/list-voyages.use-case';
import { GetVoyageUseCase } from '../../core/use-cases/voyage/get-voyage.use-case';
import { GetMesVoyagesUseCase } from '../../core/use-cases/voyage/get-mes-voyages.use-case';
import { GetVoyagesAffectesUseCase } from '../../core/use-cases/voyage/get-voyages-affectes.use-case';
import { AffecterVoyageUseCase } from '../../core/use-cases/voyage/affecter-voyage.use-case';
import { ChangeStatutVoyageUseCase } from '../../core/use-cases/voyage/change-statut-voyage.use-case';
import { SearchVoyagesUseCase } from '../../core/use-cases/voyage/search-voyages.use-case';
import { GetAffectationsVoyageUseCase } from '../../core/use-cases/voyage/get-affectations-voyage.use-case';

/**
 * Voyage Controller
 * Handles voyage-related endpoints
 */
@ApiTags('Voyages')
@Controller('voyages')
export class VoyageController {
  constructor(
    private readonly createVoyageUseCase: CreateVoyageUseCase,
    private readonly listVoyagesUseCase: ListVoyagesUseCase,
    private readonly getVoyageUseCase: GetVoyageUseCase,
    private readonly getMesVoyagesUseCase: GetMesVoyagesUseCase,
    private readonly getVoyagesAffectesUseCase: GetVoyagesAffectesUseCase,
    private readonly affecterVoyageUseCase: AffecterVoyageUseCase,
    private readonly changeStatutVoyageUseCase: ChangeStatutVoyageUseCase,
    private readonly searchVoyagesUseCase: SearchVoyagesUseCase,
    private readonly getAffectationsVoyageUseCase: GetAffectationsVoyageUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new voyage (GP only)' })
  @ApiResponse({ status: 201, description: 'Voyage created successfully' })
  @ApiResponse({ status: 403, description: 'Only GPs can create voyages' })
  async createVoyage(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateVoyageDto,
  ) {
    return this.createVoyageUseCase.execute({
      gpCreateurId: user.userId,
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

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all voyages with optional filters' })
  @ApiQuery({
    name: 'gpId',
    required: false,
    description: 'Filter by GP creator ID',
  })
  @ApiQuery({
    name: 'statut',
    required: false,
    enum: StatutVoyage,
    description: 'Filter by status',
  })
  @ApiResponse({ status: 200, description: 'List of voyages' })
  async listVoyages(
    @Query('gpId') gpId?: string,
    @Query('statut') statut?: StatutVoyage,
  ) {
    return this.listVoyagesUseCase.execute({
      gpId: gpId ? parseInt(gpId, 10) : undefined,
      statut,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search voyages by departure and/or arrival city' })
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
  @ApiResponse({ status: 200, description: 'Filtered voyages' })
  async searchVoyages(
    @Query('departureCity') departureCity?: string,
    @Query('arrivalCity') arrivalCity?: string,
  ) {
    return this.searchVoyagesUseCase.execute({
      departureCity,
      arrivalCity,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('mes-voyages')
  @ApiOperation({ summary: 'Get my created voyages (GP only)' })
  @ApiResponse({ status: 200, description: 'List of my created voyages' })
  async getMesVoyages(@CurrentUser() user: JwtUser) {
    return this.getMesVoyagesUseCase.execute(user.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('qui-me-sont-affectes')
  @ApiOperation({ summary: 'Get voyages assigned to me (GP only)' })
  @ApiResponse({ status: 200, description: 'List of voyages assigned to me' })
  async getVoyagesAffectes(@CurrentUser() user: JwtUser) {
    return this.getVoyagesAffectesUseCase.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a voyage by ID' })
  @ApiResponse({ status: 200, description: 'Voyage details' })
  @ApiResponse({ status: 404, description: 'Voyage not found' })
  async getVoyage(@Param('id', ParseIntPipe) id: number) {
    return this.getVoyageUseCase.execute(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Patch(':id/statut')
  @ApiOperation({ summary: 'Change voyage status (GESTIONNAIRE/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Status changed successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Voyage not found' })
  async changeStatut(
    @Param('id', ParseIntPipe) voyageId: number,
    @Body() dto: ChangeStatutVoyageDto,
  ) {
    return this.changeStatutVoyageUseCase.execute({
      voyageId,
      statut: dto.statut,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Post(':id/affectations')
  @ApiOperation({ summary: 'Assign a GP to a voyage (GESTIONNAIRE/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'GP assigned successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Voyage or GP not found' })
  async affecterVoyage(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseIntPipe) voyageId: number,
    @Body() dto: AffecterVoyageDto,
  ) {
    return this.affecterVoyageUseCase.execute({
      voyageId,
      gpId: dto.gpId,
      affecteParId: user.userId,
      note: dto.note,
    });
  }

  @Get(':id/affectations')
  @ApiOperation({ summary: 'Get assignment history for a voyage' })
  @ApiResponse({ status: 200, description: 'Assignment history' })
  async getAffectations(@Param('id', ParseIntPipe) voyageId: number) {
    return this.getAffectationsVoyageUseCase.execute(voyageId);
  }
}
