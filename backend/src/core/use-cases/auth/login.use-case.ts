import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../ports/repositories/user.repository.interface';
import {
  HASH_SERVICE,
  IHashService,
} from '../../ports/services/hash.service.interface';
import {
  ITokenService,
  TOKEN_SERVICE,
} from '../../ports/services/token.service.interface';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: string;
    isApproved: boolean;
  };
}

/**
 * Login Use Case
 * Handles user authentication
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // 1. Find user by email with password
    const user = await this.userRepository.findByEmailWithPassword(
      request.login,
    );

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 2. Verify password
    const passwordValue = user.getPasswordValue();
    if (!passwordValue) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isValid = await this.hashService.compare(
      request.password,
      passwordValue,
    );

    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 3. Generate token
    const token = this.tokenService.generate({ userId: user.id! });

    // 4. Return response
    return {
      accessToken: token,
      user: {
        id: user.id!,
        email: user.email.value,
        fullName: user.fullName,
        phone: user.phone?.value,
        role: user.role,
        isApproved: user.isApproved,
      },
    };
  }
}
