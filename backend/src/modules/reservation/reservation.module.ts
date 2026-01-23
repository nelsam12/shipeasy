import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationOrmEntity } from '../../infrastructure/database/entities/reservation.orm-entity';
import { TypeOrmReservationRepository } from '../../infrastructure/database/repositories/reservation.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ReservationController } from '../../presentation/controllers/reservation.controller';
import { RESERVATION_REPOSITORY } from '../../core/ports/repositories/reservation.repository';
import { CreerReservationUseCase } from '../../core/use-cases/reservation/creer-reservation.use-case';
import { ListerMesReservationsUseCase } from '../../core/use-cases/reservation/lister-mes-reservations.use-case';
import { AnnulerReservationUseCase } from '../../core/use-cases/reservation/annuler-reservation.use-case';
import { VoyageModule } from '../voyage/voyage.module';

/**
 * Module de gestion des réservations
 * Fournit les fonctionnalités de réservation de colis
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationOrmEntity]),
    DatabaseModule,
    VoyageModule,
  ],
  controllers: [ReservationController],
  providers: [
    // Repository
    {
      provide: RESERVATION_REPOSITORY,
      useClass: TypeOrmReservationRepository,
    },
    // Use Cases
    CreerReservationUseCase,
    ListerMesReservationsUseCase,
    AnnulerReservationUseCase,
  ],
  exports: [RESERVATION_REPOSITORY],
})
export class ReservationModule {}
