import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '../../../core/ports/services/hash.service.interface';

/**
 * Bcrypt Hash Service Implementation
 * Implements the IHashService port using bcrypt
 */
@Injectable()
export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
