import { io, Socket } from "socket.io-client";
import { Message, PieceJointe } from "@/types/chat.types";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to socket server with authentication
   */
  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      query: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
        this.disconnect();
      }
    });

    return this.socket;
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: number): void {
    if (!this.socket) return;
    this.socket.emit("join-conversation", { conversationId });
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: number): void {
    if (!this.socket) return;
    this.socket.emit("leave-conversation", { conversationId });
  }

  /**
   * Send a message
   */
  sendMessage(
    conversationId: number,
    content: string,
    piecesJointes?: PieceJointe[]
  ): void {
    if (!this.socket) return;
    this.socket.emit("send-message", {
      conversationId,
      content,
      piecesJointes,
    });
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId: number): void {
    if (!this.socket) return;
    this.socket.emit("mark-read", { conversationId });
  }

  /**
   * Send typing indicator
   */
  sendTyping(conversationId: number): void {
    if (!this.socket) return;
    this.socket.emit("typing", { conversationId });
  }

  /**
   * Listen for new messages
   */
  onMessageReceived(callback: (message: Message) => void): void {
    if (!this.socket) return;
    this.socket.on("message-received", callback);
  }

  /**
   * Listen for messages read
   */
  onMessagesRead(
    callback: (data: { conversationId: number; userId: number }) => void
  ): void {
    if (!this.socket) return;
    this.socket.on("messages-read", callback);
  }

  /**
   * Listen for user typing
   */
  onUserTyping(
    callback: (data: { conversationId: number; userId: number }) => void
  ): void {
    if (!this.socket) return;
    this.socket.on("user-typing", callback);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  /**
   * Remove specific event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

// Export singleton instance
export const socketService = new SocketService();
