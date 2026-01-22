export interface PieceJointe {
  nom: string;
  url: string;
  type: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  estLu: boolean;
  dateEnvoi: Date | string;
  dateLecture?: Date | string;
  piecesJointes?: PieceJointe[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Conversation {
  id: number;
  clientId: number;
  gpId: number;
  dernierMessage?: string;
  dernierMessageDate?: Date | string;
  unreadCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateConversationDto {
  clientId: number;
  gpId: number;
}

export interface SendMessageDto {
  conversationId: number;
  content: string;
  piecesJointes?: PieceJointe[];
}
