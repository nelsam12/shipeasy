import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../ports/repositories/user.repository.interface';

export interface FindUserResponse {
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
 * Find User Use Case
 * Finds a user by ID
 */
@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number): Promise<FindUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
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
