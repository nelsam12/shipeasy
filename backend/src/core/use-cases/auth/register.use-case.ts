import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { IUserRepository } from '../../ports/repositories/user.repository';
import { USER_REPOSITORY } from '../../ports/repositories/user.repository';
import type { IHashService } from '../../ports/services/hash.service';
import { HASH_SERVICE } from '../../ports/services/hash.service';
import type { ITokenService } from '../../ports/services/token.service';
import { TOKEN_SERVICE } from '../../ports/services/token.service';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Phone } from '../../domain/value-objects/phone.vo';
import { Role } from '../../domain/enums/role.enum';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: Role;
  companyName?: string;
  address?: string;
  description?: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: string;
    companyName?: string;
    address?: string;
    description?: string;
    isApproved: boolean;
  };
}

/**
 * Register Use Case
 * Handles new user registration
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(request: RegisterRequest): Promise<RegisterResponse> {
    // 1. Security: Prevent ADMIN registration
    if (request.role === Role.ADMIN) {
      throw new BadRequestException('Action non autorisée');
    }

    // 2. Check if email already exists
    const exists = await this.userRepository.existsByEmail(request.email);
    if (exists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // 3. Create value objects
    const email = Email.create(request.email);
    const phone = Phone.create(request.phone);

    // 4. Hash password
    const hashedPassword = await this.hashService.hash(request.password);

    // 5. Create user domain entity
    const user = new User(
      undefined,
      email,
      request.fullName,
      request.role || Role.CLIENT,
      undefined,
      phone,
      request.companyName,
      request.address,
      request.description,
      false,
    );

    user.setPassword(hashedPassword);

    // 6. Save user
    const savedUser = await this.userRepository.save(user);

    // 7. Generate token
    const token = this.tokenService.generate({
      userId: savedUser.id!,
      role: savedUser.role,
    });

    // 8. Return response
    return {
      accessToken: token,
      user: {
        id: savedUser.id!,
        email: savedUser.email.value,
        fullName: savedUser.fullName,
        phone: savedUser.phone?.value,
        role: savedUser.role,
        companyName: savedUser.companyName,
        address: savedUser.address,
        description: savedUser.description,
        isApproved: savedUser.isApproved,
      },
    };
  }
}
