import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { FindUserUseCase } from '../../core/use-cases/user/find-user.use-case';
import { DeleteUserUseCase } from '../../core/use-cases/user/delete-user.use-case';

/**
 * User Module
 * Provides user management functionality
 */
@Module({
  imports: [DatabaseModule],
  providers: [FindUserUseCase, DeleteUserUseCase],
  exports: [FindUserUseCase, DeleteUserUseCase],
})
export class UserModule {}
