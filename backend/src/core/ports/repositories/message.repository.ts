import { Message } from '../../domain/entities/message.entity';

/**
 * Message Repository Interface (Port)
 * Defines contract for message data access
 */
export interface IMessageRepository {
  /**
   * Finds a message by ID
   */
  findById(id: number): Promise<Message | null>;

  /**
   * Finds all messages for a conversation
   */
  findByConversationId(
    conversationId: number,
    limit?: number,
    offset?: number,
  ): Promise<Message[]>;

  /**
   * Saves a message (create or update)
   */
  save(message: Message): Promise<Message>;

  /**
   * Marks a message as read
   */
  markAsRead(messageId: number): Promise<Message>;

  /**
   * Marks all messages in a conversation as read for a specific user
   */
  markAllAsReadInConversation(
    conversationId: number,
    userId: number,
  ): Promise<void>;

  /**
   * Counts unread messages in a conversation for a specific user
   */
  countUnread(conversationId: number, userId: number): Promise<number>;

  /**
   * Counts total unread messages for a user across all conversations
   */
  countTotalUnreadForUser(userId: number): Promise<number>;
}

// Injection token for DI
export const MESSAGE_REPOSITORY = Symbol('IMessageRepository');
