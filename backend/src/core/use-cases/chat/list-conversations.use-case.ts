import { Inject, Injectable } from '@nestjs/common';
import {
  CONVERSATION_REPOSITORY,
  IConversationRepository,
} from '../../ports/repositories/conversation.repository';
import {
  IMessageRepository,
  MESSAGE_REPOSITORY,
} from '../../ports/repositories/message.repository';

export interface ConversationListItem {
  id: number;
  clientId: number;
  gpId: number;
  dernierMessage?: string;
  dernierMessageDate?: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * List Conversations Use Case
 * Lists all conversations for a user
 */
@Injectable()
export class ListConversationsUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(userId: number): Promise<ConversationListItem[]> {
    const conversations = await this.conversationRepository.findByUserId(userId);

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await this.messageRepository.countUnread(
          conversation.id!,
          userId,
        );

        return {
          id: conversation.id!,
          clientId: conversation.clientId,
          gpId: conversation.gpId,
          dernierMessage: conversation.dernierMessage,
          dernierMessageDate: conversation.dernierMessageDate,
          unreadCount,
          createdAt: conversation.createdAt!,
          updatedAt: conversation.updatedAt!,
        };
      }),
    );

    return conversationsWithUnread;
  }
}
