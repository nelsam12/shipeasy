import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseBoolPipe,
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
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { ListGPsUseCase } from '../../core/use-cases/user/list-gps.use-case';

/**
 * User Controller
 * Handles user-related endpoints
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly listGPsUseCase: ListGPsUseCase) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Get('gps')
  @ApiOperation({ summary: 'List all GPs (GESTIONNAIRE/ADMIN only)' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, email, or company',
  })
  @ApiQuery({
    name: 'isApproved',
    required: false,
    description: 'Filter by approval status',
    type: Boolean,
  })
  @ApiResponse({ status: 200, description: 'List of GPs' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async listGPs(
    @Query('search') search?: string,
    @Query('isApproved') isApproved?: string,
  ) {
    const isApprovedBool =
      isApproved !== undefined ? isApproved === 'true' : undefined;
    return this.listGPsUseCase.execute({ search, isApproved: isApprovedBool });
  }
}
