import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { FindUserUseCase } from '../../core/use-cases/user/find-user.use-case';
import { DeleteUserUseCase } from '../../core/use-cases/user/delete-user.use-case';
import { ListGPsUseCase } from '../../core/use-cases/user/list-gps.use-case';
import { ApproveGPUseCase } from '../../core/use-cases/user/approve-gp.use-case';
import { RejectGPUseCase } from '../../core/use-cases/user/reject-gp.use-case';
import { UserController } from '../../presentation/controllers/user.controller';

/**
 * User Module
 * Provides user management functionality
 */
@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    FindUserUseCase,
    DeleteUserUseCase,
    ListGPsUseCase,
    ApproveGPUseCase,
    RejectGPUseCase,
  ],
  exports: [
    FindUserUseCase,
    DeleteUserUseCase,
    ListGPsUseCase,
    ApproveGPUseCase,
    RejectGPUseCase,
  ],
})
export class UserModule {}
