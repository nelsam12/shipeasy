import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoyageOrmEntity } from '../../infrastructure/database/entities/voyage.orm-entity';
import { AffectationVoyageOrmEntity } from '../../infrastructure/database/entities/affectation-voyage.orm-entity';
import { TypeOrmVoyageRepository } from '../../infrastructure/database/repositories/voyage.repository';
import { TypeOrmAffectationVoyageRepository } from '../../infrastructure/database/repositories/affectation-voyage.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { VoyageController } from '../../presentation/controllers/voyage.controller';
import { VOYAGE_REPOSITORY } from '../../core/ports/repositories/voyage.repository';
import { AFFECTATION_VOYAGE_REPOSITORY } from '../../core/ports/repositories/affectation-voyage.repository';
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
 * Voyage Module
 * Provides voyage management functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([VoyageOrmEntity, AffectationVoyageOrmEntity]),
    DatabaseModule,
  ],
  controllers: [VoyageController],
  providers: [
    // Repositories
    {
      provide: VOYAGE_REPOSITORY,
      useClass: TypeOrmVoyageRepository,
    },
    {
      provide: AFFECTATION_VOYAGE_REPOSITORY,
      useClass: TypeOrmAffectationVoyageRepository,
    },
    // Use Cases
    CreateVoyageUseCase,
    ListVoyagesUseCase,
    GetVoyageUseCase,
    GetMesVoyagesUseCase,
    GetVoyagesAffectesUseCase,
    AffecterVoyageUseCase,
    ChangeStatutVoyageUseCase,
    SearchVoyagesUseCase,
    GetAffectationsVoyageUseCase,
  ],
  exports: [
    VOYAGE_REPOSITORY,
    AFFECTATION_VOYAGE_REPOSITORY,
    CreateVoyageUseCase,
  ],
})
export class VoyageModule {}
