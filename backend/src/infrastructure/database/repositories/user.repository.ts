import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../core/ports/repositories/user.repository.interface';
import { User } from '../../../core/domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { Email } from '../../../core/domain/value-objects/email.vo';
import { Phone } from '../../../core/domain/value-objects/phone.vo';
import { Password } from '../../../core/domain/value-objects/password.vo';

/**
 * TypeORM User Repository Implementation
 * Implements the IUserRepository port
 */
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'fullName',
        'phone',
        'isApproved',
        'companyName',
        'address',
        'description',
      ],
    });
    return entity ? this.toDomainWithPassword(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(user: User): Promise<User> {
    const ormEntity = this.toOrm(user);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.repository.remove(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository.findOne({
      where: { email },
      select: ['id'],
    });
    return !!user;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Map domain data to ORM entity
    if (data.email) {
      user.email = data.email.value;
    }
    if (data.fullName) {
      user.fullName = data.fullName;
    }
    if (data.phone) {
      user.phone = data.phone.value;
    }
    if (data.role) {
      user.role = data.role;
    }
    if (data.companyName !== undefined) {
      user.companyName = data.companyName;
    }
    if (data.address !== undefined) {
      user.address = data.address;
    }
    if (data.description !== undefined) {
      user.description = data.description;
    }

    const updated = await this.repository.save(user);
    return this.toDomain(updated);
  }

  /**
   * Maps ORM entity to Domain entity
   */
  private toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      Email.create(orm.email),
      orm.fullName,
      orm.role,
      undefined,
      orm.phone ? Phone.create(orm.phone) : undefined,
      orm.companyName,
      orm.address,
      orm.description,
      orm.isApproved,
    );
  }

  /**
   * Maps ORM entity to Domain entity including password
   */
  private toDomainWithPassword(orm: UserOrmEntity): User {
    const user = new User(
      orm.id,
      Email.create(orm.email),
      orm.fullName,
      orm.role,
      undefined,
      orm.phone ? Phone.create(orm.phone) : undefined,
      orm.companyName,
      orm.address,
      orm.description,
      orm.isApproved,
    );

    if (orm.password) {
      user.setPassword(orm.password);
    }

    return user;
  }

  /**
   * Maps Domain entity to ORM entity
   */
  private toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.email = domain.email.value;
    orm.fullName = domain.fullName;
    orm.role = domain.role;
    orm.phone = domain.phone?.value;
    orm.companyName = domain.companyName;
    orm.address = domain.address;
    orm.description = domain.description;
    orm.isApproved = domain.isApproved;

    const passwordValue = domain.getPasswordValue();
    if (passwordValue) {
      orm.password = passwordValue;
    }

    return orm;
  }
}
