/**
 * Message Domain Entity
 * Represents a chat message in a conversation
 */
export interface PieceJointe {
  nom: string;
  url: string;
  type: string;
}

export class Message {
  constructor(
    public readonly id: number | undefined,
    public readonly conversationId: number,
    public readonly senderId: number,
    public readonly content: string,
    public readonly estLu: boolean = false,
    public readonly dateEnvoi: Date = new Date(),
    public readonly dateLecture?: Date,
    public readonly piecesJointes?: PieceJointe[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Marks the message as read
   */
  markAsRead(): Message {
    return new Message(
      this.id,
      this.conversationId,
      this.senderId,
      this.content,
      true,
      this.dateEnvoi,
      new Date(),
      this.piecesJointes,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Checks if the message is sent by a specific user
   */
  isSentBy(userId: number): boolean {
    return this.senderId === userId;
  }

  /**
   * Checks if the message has attachments
   */
  hasAttachments(): boolean {
    return !!this.piecesJointes && this.piecesJointes.length > 0;
  }
}
