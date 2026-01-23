import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../ports/repositories/user.repository';
import { Role } from '../../domain/enums/role.enum';

export interface RejectGPCommand {
  gpId: number;
  rejectedBy: number; // ID du gestionnaire qui rejette
}

export interface RejectGPResponse {
  id: number;
  email: string;
  fullName: string;
  isApproved: boolean;
}

/**
 * Reject GP Use Case
 * Rejects a GP user (keeps isApproved as false or sets it back to false)
 * Only GESTIONNAIRE or ADMIN can perform this action
 */
@Injectable()
export class RejectGPUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: RejectGPCommand): Promise<RejectGPResponse> {
    // Find the GP user
    const gp = await this.userRepository.findById(command.gpId);

    if (!gp) {
      throw new NotFoundException('GP not found');
    }

    // Validate GP role
    if (gp.role !== Role.GP) {
      throw new BadRequestException('User is not a GP');
    }

    // Update isApproved to false
    const updatedGP = await this.userRepository.update(command.gpId, {
      isApproved: false,
    } as any);

    return {
      id: updatedGP.id!,
      email: updatedGP.email.value,
      fullName: updatedGP.fullName,
      isApproved: updatedGP.isApproved,
    };
  }
}
