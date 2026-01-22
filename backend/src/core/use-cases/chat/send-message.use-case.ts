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
import { Message, PieceJointe } from '../../domain/entities/message.entity';

export interface SendMessageRequest {
  conversationId: number;
  senderId: number;
  content: string;
  piecesJointes?: PieceJointe[];
}

export interface SendMessageResponse {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  estLu: boolean;
  dateEnvoi: Date;
  piecesJointes?: PieceJointe[];
  createdAt: Date;
}

/**
 * Send Message Use Case
 * Sends a message in a conversation
 */
@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(request: SendMessageRequest): Promise<SendMessageResponse> {
    // Validate conversation exists
    const conversation = await this.conversationRepository.findById(
      request.conversationId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if sender is a participant
    if (!conversation.isParticipant(request.senderId)) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    // Create message
    const message = new Message(
      undefined,
      request.conversationId,
      request.senderId,
      request.content,
      false,
      new Date(),
      undefined,
      request.piecesJointes,
    );

    const savedMessage = await this.messageRepository.save(message);

    // Update conversation's last message
    await this.conversationRepository.update(request.conversationId, {
      dernierMessage: request.content.substring(0, 100),
      dernierMessageDate: savedMessage.dateEnvoi,
      updatedAt: new Date(),
    } as any);

    return {
      id: savedMessage.id!,
      conversationId: savedMessage.conversationId,
      senderId: savedMessage.senderId,
      content: savedMessage.content,
      estLu: savedMessage.estLu,
      dateEnvoi: savedMessage.dateEnvoi,
      piecesJointes: savedMessage.piecesJointes,
      createdAt: savedMessage.createdAt!,
    };
  }
}
