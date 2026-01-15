import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { LoginUseCase } from '../../core/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../core/use-cases/auth/register.use-case';
import { GetMeUseCase } from '../../core/use-cases/auth/get-me.use-case';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { HASH_SERVICE } from '../../core/ports/services/hash.service.interface';
import { TOKEN_SERVICE } from '../../core/ports/services/token.service.interface';
import { BcryptHashService } from '../../infrastructure/security/bcrypt-hash.service';
import { JwtTokenService } from '../../infrastructure/security/jwt-token.service';
import { JwtStrategy } from '../../infrastructure/security/jwt.strategy';

/**
 * Auth Module
 * Provides authentication and authorization functionality
 */
@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    GetMeUseCase,
    // Services
    {
      provide: HASH_SERVICE,
      useClass: BcryptHashService,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    // Strategy
    JwtStrategy,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
