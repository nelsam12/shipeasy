import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CONVERSATION_REPOSITORY,
  IConversationRepository,
} from '../../ports/repositories/conversation.repository';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../ports/repositories/user.repository';
import { Conversation } from '../../domain/entities/conversation.entity';
import { Role } from '../../domain/enums/role.enum';

export interface CreateConversationRequest {
  clientId: number;
  gpId: number;
}

export interface CreateConversationResponse {
  id: number;
  clientId: number;
  gpId: number;
  createdAt: Date;
}

/**
 * Create Conversation Use Case
 * Creates or retrieves an existing conversation between a client and a GP
 */
@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    request: CreateConversationRequest,
  ): Promise<CreateConversationResponse> {
    // Validate users exist
    const client = await this.userRepository.findById(request.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const gp = await this.userRepository.findById(request.gpId);
    if (!gp) {
      throw new NotFoundException('GP not found');
    }

    // Validate roles
    if (client.role !== Role.CLIENT) {
      throw new BadRequestException('User must be a CLIENT');
    }

    if (gp.role !== Role.GP) {
      throw new BadRequestException('Target user must be a GP');
    }

    // Check if conversation already exists
    const existing = await this.conversationRepository.findByClientAndGp(
      request.clientId,
      request.gpId,
    );

    if (existing) {
      return {
        id: existing.id!,
        clientId: existing.clientId,
        gpId: existing.gpId,
        createdAt: existing.createdAt!,
      };
    }

    // Create new conversation
    const conversation = new Conversation(
      undefined,
      request.clientId,
      request.gpId,
    );

    const saved = await this.conversationRepository.save(conversation);

    return {
      id: saved.id!,
      clientId: saved.clientId,
      gpId: saved.gpId,
      createdAt: saved.createdAt!,
    };
  }
}
