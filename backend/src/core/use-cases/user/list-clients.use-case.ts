import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../ports/repositories';
import { USER_REPOSITORY } from '../../ports/repositories';
import { Role } from '../../domain/enums/role.enum';

export interface ListClientsQuery {
  search?: string;
}

export interface ClientResponse {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
}

/**
 * List Clients Use Case
 * Retrieves all users with CLIENT role
 */
@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListClientsQuery = {}): Promise<ClientResponse[]> {
    const users = await this.userRepository.findAll();

    // Filtrer par rôle CLIENT
    let clients = users.filter((user) => user.role === Role.CLIENT);

    // Recherche optionnelle
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      clients = clients.filter(
        (client) =>
          client.fullName.toLowerCase().includes(searchLower) ||
          client.email.value.toLowerCase().includes(searchLower),
      );
    }

    return clients.map((client) => ({
      id: client.id!,
      email: client.email.value,
      fullName: client.fullName,
      phone: client.phone?.value,
    }));
  }
}
