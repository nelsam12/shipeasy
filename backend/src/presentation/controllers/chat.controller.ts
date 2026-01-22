import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtUser } from '../../shared/types/request-with-user';
import { CreateConversationDto } from '../../application/dto/request/create-conversation.dto';
import { SendMessageDto } from '../../application/dto/request/send-message.dto';
import { CreateConversationUseCase } from '../../core/use-cases/chat/create-conversation.use-case';
import { GetConversationUseCase } from '../../core/use-cases/chat/get-conversation.use-case';
import { ListConversationsUseCase } from '../../core/use-cases/chat/list-conversations.use-case';
import { SendMessageUseCase } from '../../core/use-cases/chat/send-message.use-case';
import { GetMessagesUseCase } from '../../core/use-cases/chat/get-messages.use-case';
import { MarkMessagesReadUseCase } from '../../core/use-cases/chat/mark-messages-read.use-case';

/**
 * Chat Controller
 * Handles chat REST API endpoints
 */
@ApiTags('Chat')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ChatController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly getConversationUseCase: GetConversationUseCase,
    private readonly listConversationsUseCase: ListConversationsUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly markMessagesReadUseCase: MarkMessagesReadUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create or get existing conversation' })
  async createConversation(
    @Body() dto: CreateConversationDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.createConversationUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all conversations for current user' })
  async listConversations(@CurrentUser() user: JwtUser) {
    return this.listConversationsUseCase.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific conversation' })
  async getConversation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.getConversationUseCase.execute(id, user.userId);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.getMessagesUseCase.execute(
      id,
      user.userId,
      limit ? Number(limit) : 100,
      offset ? Number(offset) : 0,
    );
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message (REST fallback)' })
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.sendMessageUseCase.execute({
      conversationId: id,
      senderId: user.userId,
      content: dto.content,
      piecesJointes: dto.piecesJointes,
    });
  }

  @Post(':id/mark-read')
  @ApiOperation({ summary: 'Mark all messages in conversation as read' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtUser,
  ) {
    await this.markMessagesReadUseCase.execute(id, user.userId);
    return { success: true };
  }
}
