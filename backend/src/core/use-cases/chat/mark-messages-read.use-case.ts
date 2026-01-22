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

/**
 * Mark Messages Read Use Case
 * Marks all messages in a conversation as read for a user
 */
@Injectable()
export class MarkMessagesReadUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(conversationId: number, userId: number): Promise<void> {
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

    // Mark all messages as read (except those sent by the user)
    await this.messageRepository.markAllAsReadInConversation(
      conversationId,
      userId,
    );
  }
}
