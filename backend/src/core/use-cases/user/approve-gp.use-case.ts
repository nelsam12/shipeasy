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

export interface ApproveGPCommand {
  gpId: number;
  approvedBy: number; // ID du gestionnaire qui approuve
}

export interface ApproveGPResponse {
  id: number;
  email: string;
  fullName: string;
  isApproved: boolean;
}

/**
 * Approve GP Use Case
 * Approves a GP user (changes isApproved to true)
 * Only GESTIONNAIRE or ADMIN can perform this action
 */
@Injectable()
export class ApproveGPUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: ApproveGPCommand): Promise<ApproveGPResponse> {
    // Find the GP user
    const gp = await this.userRepository.findById(command.gpId);

    if (!gp) {
      throw new NotFoundException('GP not found');
    }

    // Validate GP role
    if (gp.role !== Role.GP) {
      throw new BadRequestException('User is not a GP');
    }

    // Check if already approved
    if (gp.isApproved) {
      throw new BadRequestException('GP is already approved');
    }

    // Update isApproved to true using repository update method
    const updatedGP = await this.userRepository.update(command.gpId, {
      isApproved: true,
    } as any);

    return {
      id: updatedGP.id!,
      email: updatedGP.email.value,
      fullName: updatedGP.fullName,
      isApproved: updatedGP.isApproved,
    };
  }
}
