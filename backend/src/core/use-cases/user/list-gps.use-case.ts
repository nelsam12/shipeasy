import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Role } from '../../domain/enums/role.enum';

export interface ListGPsQuery {
  search?: string;
  isApproved?: boolean;
}

export interface GPResponse {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  companyName?: string;
  address?: string;
  description?: string;
  isApproved: boolean;
}

/**
 * List GPs Use Case
 * Retrieves all users with GP role
 */
@Injectable()
export class ListGPsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListGPsQuery = {}): Promise<GPResponse[]> {
    // Find all users with GP role
    const users = await this.userRepository.findAll();

    // Filter by role GP
    let gps = users.filter((user) => user.role === Role.GP);

    // Filter by approval status if specified
    if (query.isApproved !== undefined) {
      gps = gps.filter((gp) => gp.isApproved === query.isApproved);
    }

    // Filter by search term if provided
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      gps = gps.filter(
        (gp) =>
          gp.fullName.toLowerCase().includes(searchLower) ||
          gp.email.value.toLowerCase().includes(searchLower) ||
          gp.companyName?.toLowerCase().includes(searchLower),
      );
    }

    // Map to response
    return gps.map((gp) => ({
      id: gp.id!,
      email: gp.email.value,
      fullName: gp.fullName,
      phone: gp.phone?.value,
      companyName: gp.companyName,
      address: gp.address,
      description: gp.description,
      isApproved: gp.isApproved,
    }));
  }
}
