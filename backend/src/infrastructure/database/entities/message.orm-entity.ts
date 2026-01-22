import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Message ORM Entity (TypeORM mapping)
 * Represents the messages table
 */
@Entity({ name: 'messages' })
@Index(['conversationId', 'dateEnvoi'])
export class MessageOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  conversationId: number;

  @Column()
  @Index()
  senderId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  estLu: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateEnvoi: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateLecture?: Date;

  @Column({ type: 'jsonb', nullable: true })
  piecesJointes?: Array<{
    nom: string;
    url: string;
    type: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
