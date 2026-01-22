import { Conversation } from '../../domain/entities/conversation.entity';

/**
 * Conversation Repository Interface (Port)
 * Defines contract for conversation data access
 */
export interface IConversationRepository {
  /**
   * Finds a conversation by ID
   */
  findById(id: number): Promise<Conversation | null>;

  /**
   * Finds a conversation between a client and a GP
   */
  findByClientAndGp(clientId: number, gpId: number): Promise<Conversation | null>;

  /**
   * Finds all conversations for a user (as client or GP)
   */
  findByUserId(userId: number): Promise<Conversation[]>;

  /**
   * Saves a conversation (create or update)
   */
  save(conversation: Conversation): Promise<Conversation>;

  /**
   * Updates a conversation
   */
  update(id: number, data: Partial<Conversation>): Promise<Conversation>;
}

// Injection token for DI
export const CONVERSATION_REPOSITORY = Symbol('IConversationRepository');
