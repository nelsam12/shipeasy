import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Conversation ORM Entity (TypeORM mapping)
 * Represents the conversations table
 */
@Entity({ name: 'conversations' })
@Index(['clientId', 'gpId'], { unique: true })
export class ConversationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  clientId: number;

  @Column()
  @Index()
  gpId: number;

  @Column({ type: 'text', nullable: true })
  dernierMessage?: string;

  @Column({ type: 'timestamp', nullable: true })
  dernierMessageDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
