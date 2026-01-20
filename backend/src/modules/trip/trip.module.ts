import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripOrmEntity } from '../../infrastructure/database/entities/trip.orm-entity';
import { TypeOrmTripRepository } from '../../infrastructure/database/repositories/trip.repository';

import { CreateTripUseCase } from '../../core/use-cases/trip/create-trip.use-case';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { TripController } from '../../presentation/controllers/trip. controller';
import { TRIP_REPOSITORY } from '../../core/ports/repositories/trip.repository';
import { ListTripsUseCase } from '../../core/use-cases/trip/list-trips.use-case';
import { ListActiveTripsUseCase } from '../../core/use-cases/trip/list-active-trip-use-case';
import { SearchTripsUseCase } from '../../core/use-cases/trip/search-trip.use-case';
import { GetTripUseCase } from '../../core/use-cases/trip/get-trip-use-case';
import { GetMyTripsUseCase } from '../../core/use-cases/trip/get-my-trip-use-case';

/**
 * Trip Module
 * Provides trip management functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([TripOrmEntity]), DatabaseModule],
  controllers: [TripController],
  providers: [
    // Repository
    {
      provide: TRIP_REPOSITORY,
      useClass: TypeOrmTripRepository,
    },
    // Use Cases
    CreateTripUseCase,
    ListTripsUseCase,
    ListActiveTripsUseCase,
    SearchTripsUseCase,
    GetTripUseCase,
    GetMyTripsUseCase,
  ],
  exports: [TRIP_REPOSITORY, CreateTripUseCase],
})
export class TripModule {}
