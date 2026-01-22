import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { FindUserUseCase } from '../../core/use-cases/user/find-user.use-case';
import { DeleteUserUseCase } from '../../core/use-cases/user/delete-user.use-case';
import { ListGPsUseCase } from '../../core/use-cases/user/list-gps.use-case';
import { UserController } from '../../presentation/controllers/user.controller';

/**
 * User Module
 * Provides user management functionality
 */
@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [FindUserUseCase, DeleteUserUseCase, ListGPsUseCase],
  exports: [FindUserUseCase, DeleteUserUseCase, ListGPsUseCase],
})
export class UserModule {}
