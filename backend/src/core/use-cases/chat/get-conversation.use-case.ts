import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CONVERSATION_REPOSITORY,
  IConversationRepository,
} from '../../ports/repositories/conversation.repository';

export interface GetConversationResponse {
  id: number;
  clientId: number;
  gpId: number;
  dernierMessage?: string;
  dernierMessageDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get Conversation Use Case
 * Retrieves a single conversation by ID
 */
@Injectable()
export class GetConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async execute(
    conversationId: number,
    userId: number,
  ): Promise<GetConversationResponse> {
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is a participant
    if (!conversation.isParticipant(userId)) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    return {
      id: conversation.id!,
      clientId: conversation.clientId,
      gpId: conversation.gpId,
      dernierMessage: conversation.dernierMessage,
      dernierMessageDate: conversation.dernierMessageDate,
      createdAt: conversation.createdAt!,
      updatedAt: conversation.updatedAt!,
    };
  }
}
