import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import type { IAffectationVoyageRepository } from '../../../core/ports/repositories/affectation-voyage.repository';
import { AffectationVoyageOrmEntity } from '../entities/affectation-voyage.orm-entity';
import { AffectationVoyage } from '../../../core/domain/entities/affectation-voyage.entity';

/**
 * TypeORM AffectationVoyage Repository Implementation
 * Implements the IAffectationVoyageRepository port
 */
@Injectable()
export class TypeOrmAffectationVoyageRepository implements IAffectationVoyageRepository {
  constructor(
    @InjectRepository(AffectationVoyageOrmEntity)
    private readonly repository: Repository<AffectationVoyageOrmEntity>,
  ) {}

  async findById(id: number): Promise<AffectationVoyage | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findActiveByVoyageId(voyageId: number): Promise<AffectationVoyage | null> {
    const entity = await this.repository.findOne({
      where: {
        voyageId,
        desaffecteLe: IsNull(),
      },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByVoyageId(voyageId: number): Promise<AffectationVoyage[]> {
    const entities = await this.repository.find({
      where: { voyageId },
      order: { affecteLe: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(affectation: AffectationVoyage): Promise<AffectationVoyage> {
    const ormEntity = this.toOrm(affectation);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  async closeActiveAffectations(voyageId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(AffectationVoyageOrmEntity)
      .set({ desaffecteLe: new Date() })
      .where('voyage_id = :voyageId', { voyageId })
      .andWhere('desaffecte_le IS NULL')
      .execute();
  }

  /**
   * Maps ORM entity to Domain entity
   */
  private toDomain(orm: AffectationVoyageOrmEntity): AffectationVoyage {
    return new AffectationVoyage(
      orm.id,
      orm.voyageId,
      orm.gpId,
      orm.affecteParId,
      orm.affecteLe,
      orm.desaffecteLe,
      orm.note,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  /**
   * Maps Domain entity to ORM entity
   */
  private toOrm(domain: AffectationVoyage): AffectationVoyageOrmEntity {
    const orm = new AffectationVoyageOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.voyageId = domain.voyageId;
    orm.gpId = domain.gpId;
    orm.affecteParId = domain.affecteParId;
    orm.affecteLe = domain.affecteLe;
    orm.desaffecteLe = domain.desaffecteLe;
    orm.note = domain.note;

    return orm;
  }
}
