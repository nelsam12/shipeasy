/**
 * Conversation Domain Entity
 * Represents a chat conversation between a client and a GP
 */
export class Conversation {
  constructor(
    public readonly id: number | undefined,
    public readonly clientId: number,
    public readonly gpId: number,
    public readonly dernierMessage?: string,
    public readonly dernierMessageDate?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Updates the last message information
   */
  updateDernierMessage(message: string, date: Date): Conversation {
    return new Conversation(
      this.id,
      this.clientId,
      this.gpId,
      message,
      date,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Checks if a user is participant in this conversation
   */
  isParticipant(userId: number): boolean {
    return this.clientId === userId || this.gpId === userId;
  }

  /**
   * Gets the other user ID in the conversation
   */
  getOtherUserId(currentUserId: number): number | null {
    if (this.clientId === currentUserId) return this.gpId;
    if (this.gpId === currentUserId) return this.clientId;
    return null;
  }
}
