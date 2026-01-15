import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../ports/repositories/user.repository.interface';

export interface GetMeResponse {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  companyName?: string;
  address?: string;
  description?: string;
  isApproved: boolean;
}

/**
 * Get Me Use Case
 * Retrieves the current authenticated user's profile
 */
@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number): Promise<GetMeResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return {
      id: user.id!,
      email: user.email.value,
      fullName: user.fullName,
      phone: user.phone?.value,
      role: user.role,
      companyName: user.companyName,
      address: user.address,
      description: user.description,
      isApproved: user.isApproved,
    };
  }
}
