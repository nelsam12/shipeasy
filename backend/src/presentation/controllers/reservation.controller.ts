import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import type { JwtUser } from '../../shared';
import { Role } from '../../core/domain/enums/role.enum';
import { CreerReservationDto } from '../../application/dto/request/creer-reservation.dto';
import { ReservationResponseDto } from '../../application/dto/response/reservation.response.dto';
import { CreerReservationUseCase } from '../../core/use-cases/reservation/creer-reservation.use-case';
import { ListerMesReservationsUseCase } from '../../core/use-cases/reservation/lister-mes-reservations.use-case';
import { AnnulerReservationUseCase } from '../../core/use-cases/reservation/annuler-reservation.use-case';

/**
 * Contrôleur des réservations
 * Gère les endpoints liés aux réservations de colis
 */
@ApiTags('Réservations')
@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly creerReservationUseCase: CreerReservationUseCase,
    private readonly listerMesReservationsUseCase: ListerMesReservationsUseCase,
    private readonly annulerReservationUseCase: AnnulerReservationUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une nouvelle réservation (CLIENT uniquement)' })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Seuls les clients peuvent créer des réservations',
  })
  @ApiResponse({
    status: 404,
    description: 'Voyage non trouvé',
  })
  @ApiResponse({
    status: 400,
    description: 'Capacité insuffisante ou validation échouée',
  })
  async creerReservation(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreerReservationDto,
  ): Promise<ReservationResponseDto> {
    return this.creerReservationUseCase.execute({
      clientId: user.userId,
      voyageId: dto.voyageId,
      poidsKg: dto.poidsKg,
      description: dto.description,
      adresseEnlevement: dto.adresseEnlevement,
      adresseLivraison: dto.adresseLivraison,
      nomDestinataire: dto.nomDestinataire,
      telephoneDestinataire: dto.telephoneDestinataire,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('mes-reservations')
  @ApiOperation({
    summary: 'Lister mes réservations (CLIENT uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des réservations du client',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Seuls les clients peuvent consulter leurs réservations',
  })
  async listerMesReservations(
    @CurrentUser() user: JwtUser,
  ): Promise<ReservationResponseDto[]> {
    return this.listerMesReservationsUseCase.execute(user.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Patch(':id/annuler')
  @ApiOperation({ summary: 'Annuler une réservation (CLIENT uniquement)' })
  @ApiResponse({
    status: 200,
    description: 'Réservation annulée avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé à annuler cette réservation',
  })
  @ApiResponse({
    status: 404,
    description: 'Réservation non trouvée',
  })
  @ApiResponse({
    status: 400,
    description: 'La réservation ne peut pas être annulée dans son état actuel',
  })
  async annulerReservation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.annulerReservationUseCase.execute(id, user.userId);
  }
}
