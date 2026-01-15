import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    return this.userRepository.save(data);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'fullName',
        'phone',
        'isApproved',
      ],
    });
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.findOne(id);
    const { password, ...safeData } = data;
    Object.assign(user, safeData);
    return this.userRepository.save(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id'],
    });
    return !!user;
  }

  async updatePassword(id: number, password: string) {}
}
