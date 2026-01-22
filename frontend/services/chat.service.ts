import { http } from "./http.service";
import {
  Conversation,
  CreateConversationDto,
  Message,
  SendMessageDto,
} from "@/types/chat.types";

const API_URL = "/conversations";

export const chatService = {
  /**
   * Create or get existing conversation
   */
  createConversation: async (
    dto: CreateConversationDto
  ): Promise<Conversation> => {
    return http<Conversation, CreateConversationDto>(API_URL, {
      method: "POST",
      body: dto,
    });
  },

  /**
   * Get all conversations for current user
   */
  getConversations: async (): Promise<Conversation[]> => {
    return http<Conversation[], undefined>(API_URL, {
      method: "GET",
    });
  },

  /**
   * Get a specific conversation
   */
  getConversation: async (id: number): Promise<Conversation> => {
    return http<Conversation, undefined>(`${API_URL}/${id}`, {
      method: "GET",
    });
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (
    conversationId: number,
    limit = 100,
    offset = 0
  ): Promise<Message[]> => {
    return http<Message[], undefined>(
      `${API_URL}/${conversationId}/messages?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Send a message via REST (fallback)
   */
  sendMessage: async (
    conversationId: number,
    content: string,
    piecesJointes?: any[]
  ): Promise<Message> => {
    return http<Message, { content: string; piecesJointes?: any[] }>(
      `${API_URL}/${conversationId}/messages`,
      {
        method: "POST",
        body: { content, piecesJointes },
      }
    );
  },

  /**
   * Mark all messages in a conversation as read
   */
  markAsRead: async (conversationId: number): Promise<void> => {
    await http<{ success: boolean }, undefined>(
      `${API_URL}/${conversationId}/mark-read`,
      {
        method: "POST",
      }
    );
  },
};
