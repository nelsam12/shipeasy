import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../ports/repositories/user.repository';
import { USER_REPOSITORY } from '../../ports/repositories/user.repository';

/**
 * Delete User Use Case
 * Deletes a user by ID
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
