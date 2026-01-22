import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IConversationRepository } from '../../../core/ports/repositories/conversation.repository';
import { Conversation } from '../../../core/domain/entities/conversation.entity';
import { ConversationOrmEntity } from '../entities/conversation.orm-entity';

/**
 * TypeORM implementation of Conversation Repository
 */
@Injectable()
export class TypeOrmConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(ConversationOrmEntity)
    private readonly repository: Repository<ConversationOrmEntity>,
  ) {}

  async findById(id: number): Promise<Conversation | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByClientAndGp(
    clientId: number,
    gpId: number,
  ): Promise<Conversation | null> {
    const entity = await this.repository.findOne({
      where: { clientId, gpId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: number): Promise<Conversation[]> {
    const entities = await this.repository.find({
      where: [{ clientId: userId }, { gpId: userId }],
      order: { dernierMessageDate: 'DESC', createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const entity = this.toOrm(conversation);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, data: Partial<Conversation>): Promise<Conversation> {
    const updateData: Partial<ConversationOrmEntity> = {};
    if (data.dernierMessage !== undefined) {
      updateData.dernierMessage = data.dernierMessage;
    }
    if (data.dernierMessageDate !== undefined) {
      updateData.dernierMessageDate = data.dernierMessageDate;
    }
    await this.repository.update(id, updateData);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Conversation not found after update');
    }
    return this.toDomain(updated);
  }

  /**
   * Maps ORM entity to Domain entity
   */
  private toDomain(entity: ConversationOrmEntity): Conversation {
    return new Conversation(
      entity.id,
      entity.clientId,
      entity.gpId,
      entity.dernierMessage,
      entity.dernierMessageDate,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  /**
   * Maps Domain entity to ORM entity
   */
  private toOrm(domain: Conversation): ConversationOrmEntity {
    const entity = new ConversationOrmEntity();
    if (domain.id) entity.id = domain.id;
    entity.clientId = domain.clientId;
    entity.gpId = domain.gpId;
    entity.dernierMessage = domain.dernierMessage;
    entity.dernierMessageDate = domain.dernierMessageDate;
    return entity;
  }
}
