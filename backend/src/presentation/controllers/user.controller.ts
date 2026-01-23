import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../core/domain/enums/role.enum';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtUser } from '../../shared/types/request-with-user';
import { ListGPsUseCase } from '../../core/use-cases/user/list-gps.use-case';
import { ApproveGPUseCase } from '../../core/use-cases/user/approve-gp.use-case';
import { RejectGPUseCase } from '../../core/use-cases/user/reject-gp.use-case';

/**
 * User Controller
 * Handles user-related endpoints
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly listGPsUseCase: ListGPsUseCase,
    private readonly approveGPUseCase: ApproveGPUseCase,
    private readonly rejectGPUseCase: RejectGPUseCase,
  ) {}

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

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Patch('gps/:id/approve')
  @ApiOperation({ summary: 'Approve a GP (GESTIONNAIRE/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'GP approved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or GP already approved' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'GP not found' })
  async approveGP(
    @Param('id', ParseIntPipe) gpId: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.approveGPUseCase.execute({
      gpId,
      approvedBy: user.userId,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GESTIONNAIRE, Role.ADMIN)
  @Patch('gps/:id/reject')
  @ApiOperation({ summary: 'Reject a GP (GESTIONNAIRE/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'GP rejected successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'GP not found' })
  async rejectGP(
    @Param('id', ParseIntPipe) gpId: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.rejectGPUseCase.execute({
      gpId,
      rejectedBy: user.userId,
    });
  }
}
