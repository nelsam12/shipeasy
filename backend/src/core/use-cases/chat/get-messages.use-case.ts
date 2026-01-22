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
import {
  IMessageRepository,
  MESSAGE_REPOSITORY,
} from '../../ports/repositories/message.repository';
import { PieceJointe } from '../../domain/entities/message.entity';

export interface MessageResponse {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  estLu: boolean;
  dateEnvoi: Date;
  dateLecture?: Date;
  piecesJointes?: PieceJointe[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get Messages Use Case
 * Retrieves messages for a conversation
 */
@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(
    conversationId: number,
    userId: number,
    limit = 100,
    offset = 0,
  ): Promise<MessageResponse[]> {
    // Validate conversation exists
    const conversation =
      await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is a participant
    if (!conversation.isParticipant(userId)) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    // Get messages
    const messages = await this.messageRepository.findByConversationId(
      conversationId,
      limit,
      offset,
    );

    return messages.map((message) => ({
      id: message.id!,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      estLu: message.estLu,
      dateEnvoi: message.dateEnvoi,
      dateLecture: message.dateLecture,
      piecesJointes: message.piecesJointes,
      createdAt: message.createdAt!,
      updatedAt: message.updatedAt!,
    }));
  }
}
