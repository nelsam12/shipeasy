import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { IMessageRepository } from '../../../core/ports/repositories/message.repository';
import { Message } from '../../../core/domain/entities/message.entity';
import { MessageOrmEntity } from '../entities/message.orm-entity';

/**
 * TypeORM implementation of Message Repository
 */
@Injectable()
export class TypeOrmMessageRepository implements IMessageRepository {
  constructor(
    @InjectRepository(MessageOrmEntity)
    private readonly repository: Repository<MessageOrmEntity>,
  ) {}

  async findById(id: number): Promise<Message | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByConversationId(
    conversationId: number,
    limit = 100,
    offset = 0,
  ): Promise<Message[]> {
    const entities = await this.repository.find({
      where: { conversationId },
      order: { dateEnvoi: 'ASC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(message: Message): Promise<Message> {
    const entity = this.toOrm(message);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async markAsRead(messageId: number): Promise<Message> {
    await this.repository.update(messageId, {
      estLu: true,
      dateLecture: new Date(),
    });
    const updated = await this.repository.findOne({ where: { id: messageId } });
    if (!updated) {
      throw new Error('Message not found after update');
    }
    return this.toDomain(updated);
  }

  async markAllAsReadInConversation(
    conversationId: number,
    userId: number,
  ): Promise<void> {
    await this.repository.update(
      {
        conversationId,
        senderId: Not(userId),
        estLu: false,
      },
      {
        estLu: true,
        dateLecture: new Date(),
      },
    );
  }

  async countUnread(conversationId: number, userId: number): Promise<number> {
    return await this.repository.count({
      where: {
        conversationId,
        senderId: Not(userId),
        estLu: false,
      },
    });
  }

  async countTotalUnreadForUser(userId: number): Promise<number> {
    return await this.repository.count({
      where: {
        senderId: Not(userId),
        estLu: false,
      },
    });
  }

  /**
   * Maps ORM entity to Domain entity
   */
  private toDomain(entity: MessageOrmEntity): Message {
    return new Message(
      entity.id,
      entity.conversationId,
      entity.senderId,
      entity.content,
      entity.estLu,
      entity.dateEnvoi,
      entity.dateLecture,
      entity.piecesJointes,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  /**
   * Maps Domain entity to ORM entity
   */
  private toOrm(domain: Message): MessageOrmEntity {
    const entity = new MessageOrmEntity();
    if (domain.id) entity.id = domain.id;
    entity.conversationId = domain.conversationId;
    entity.senderId = domain.senderId;
    entity.content = domain.content;
    entity.estLu = domain.estLu;
    entity.dateEnvoi = domain.dateEnvoi;
    entity.dateLecture = domain.dateLecture;
    entity.piecesJointes = domain.piecesJointes;
    return entity;
  }
}
