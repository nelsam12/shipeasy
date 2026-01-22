import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../core/ports/services';

/**
 * JWT Token Service Implementation
 * Implements the ITokenService port using JWT
 */
@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: { userId: number; role?: string }): string {
    return this.jwtService.sign({ sub: payload.userId, role: payload.role });
  }

  async verify(token: string): Promise<{ userId: number; role?: string }> {
    const decoded = await this.jwtService.verifyAsync(token);
    return { userId: decoded.sub, role: decoded.role };
  }
}
