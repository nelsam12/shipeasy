import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { UserModule } from '../user/user.module';

// ORM Entities
import { ConversationOrmEntity } from '../../infrastructure/database/entities/conversation.orm-entity';
import { MessageOrmEntity } from '../../infrastructure/database/entities/message.orm-entity';

// Repositories
import { CONVERSATION_REPOSITORY } from '../../core/ports/repositories/conversation.repository';
import { MESSAGE_REPOSITORY } from '../../core/ports/repositories/message.repository';
import { TypeOrmConversationRepository } from '../../infrastructure/database/repositories/conversation.repository';
import { TypeOrmMessageRepository } from '../../infrastructure/database/repositories/message.repository';

// Use Cases
import { CreateConversationUseCase } from '../../core/use-cases/chat/create-conversation.use-case';
import { GetConversationUseCase } from '../../core/use-cases/chat/get-conversation.use-case';
import { ListConversationsUseCase } from '../../core/use-cases/chat/list-conversations.use-case';
import { SendMessageUseCase } from '../../core/use-cases/chat/send-message.use-case';
import { GetMessagesUseCase } from '../../core/use-cases/chat/get-messages.use-case';
import { MarkMessagesReadUseCase } from '../../core/use-cases/chat/mark-messages-read.use-case';

// Gateway & Controller
import { ChatGateway } from '../../infrastructure/websockets/chat.gateway';
import { ChatController } from '../../presentation/controllers/chat.controller';

/**
 * Chat Module
 * Provides real-time chat functionality
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationOrmEntity, MessageOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [
    // Repositories
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: TypeOrmConversationRepository,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: TypeOrmMessageRepository,
    },
    // Use Cases
    CreateConversationUseCase,
    GetConversationUseCase,
    ListConversationsUseCase,
    SendMessageUseCase,
    GetMessagesUseCase,
    MarkMessagesReadUseCase,
    // Gateway
    ChatGateway,
  ],
  exports: [
    CreateConversationUseCase,
    GetConversationUseCase,
    ListConversationsUseCase,
    SendMessageUseCase,
    GetMessagesUseCase,
    MarkMessagesReadUseCase,
  ],
})
export class ChatModule {}
