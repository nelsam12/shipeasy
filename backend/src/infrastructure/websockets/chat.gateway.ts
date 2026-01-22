import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendMessageUseCase } from '../../core/use-cases/chat/send-message.use-case';
import { MarkMessagesReadUseCase } from '../../core/use-cases/chat/mark-messages-read.use-case';
import { PieceJointe } from '../../core/domain/entities/message.entity';

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

interface SendMessagePayload {
  conversationId: number;
  content: string;
  piecesJointes?: PieceJointe[];
}

interface MarkReadPayload {
  conversationId: number;
}

interface TypingPayload {
  conversationId: number;
}

/**
 * Chat WebSocket Gateway
 * Handles real-time chat communication
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<number, string>(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly markMessagesReadUseCase: MarkMessagesReadUseCase,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      const user = await this.validateToken(token);

      // Store user connection
      this.connectedUsers.set(user.userId, client.id);
      client.data.userId = user.userId;

      this.logger.log(`User ${user.userId} connected with socket ${client.id}`);

      // Notify user is online
      client.emit('connected', { userId: user.userId });
    } catch (error) {
      this.logger.error('Connection failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join-conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const room = `conversation-${data.conversationId}`;
    client.join(room);
    this.logger.log(`User ${client.data.userId} joined ${room}`);
    return { success: true };
  }

  @SubscribeMessage('leave-conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    const room = `conversation-${data.conversationId}`;
    client.leave(room);
    this.logger.log(`User ${client.data.userId} left ${room}`);
    return { success: true };
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessagePayload,
  ) {
    try {
      const userId = client.data.userId;

      const message = await this.sendMessageUseCase.execute({
        conversationId: data.conversationId,
        senderId: userId,
        content: data.content,
        piecesJointes: data.piecesJointes,
      });

      // Emit to conversation room
      const room = `conversation-${data.conversationId}`;
      this.server.to(room).emit('message-received', message);

      this.logger.log(`Message sent in conversation ${data.conversationId}`);

      return { success: true, message };
    } catch (error) {
      this.logger.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MarkReadPayload,
  ) {
    try {
      const userId = client.data.userId;

      await this.markMessagesReadUseCase.execute(data.conversationId, userId);

      // Notify the conversation room
      const room = `conversation-${data.conversationId}`;
      this.server.to(room).emit('messages-read', {
        conversationId: data.conversationId,
        userId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Error marking messages as read:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: TypingPayload,
  ) {
    const userId = client.data.userId;
    const room = `conversation-${data.conversationId}`;

    // Broadcast to others in the conversation
    client.to(room).emit('user-typing', {
      conversationId: data.conversationId,
      userId,
    });

    return { success: true };
  }

  /**
   * Extracts JWT token from socket handshake
   */
  private extractToken(client: Socket): string {
    // Try query parameter first
    const token = client.handshake.query?.token as string;
    if (token) return token;

    // Try auth header
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try cookies
    const cookies = client.handshake.headers?.cookie;
    if (cookies) {
      const tokenMatch = cookies.match(/accessToken=([^;]+)/);
      if (tokenMatch) return tokenMatch[1];
    }

    throw new UnauthorizedException('No token provided');
  }

  /**
   * Validates JWT token and returns user payload
   */
  private async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Gets socket ID for a user
   */
  getSocketIdForUser(userId: number): string | undefined {
    return this.connectedUsers.get(userId);
  }

  /**
   * Checks if a user is online
   */
  isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }
}
