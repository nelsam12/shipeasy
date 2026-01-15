import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { JwtUser } from '../../shared/types/request-with-user.type';
import { LoginDto } from '../../application/dto/request/login.dto';
import { RegisterDto } from '../../application/dto/request/register.dto';
import type { Response } from 'express';
import { LoginUseCase } from '../../core/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../core/use-cases/auth/register.use-case';
import { GetMeUseCase } from '../../core/use-cases/auth/get-me.use-case';

/**
 * Auth Controller
 * Handles authentication endpoints
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil complet de l'utilisateur' })
  async getMe(@CurrentUser() userPayload: JwtUser) {
    return this.getMeUseCase.execute(userPayload.userId);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(dto);
    this.setCookie(res, result.accessToken);
    return result.user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription d'un nouvel utilisateur' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.registerUseCase.execute(dto);
    this.setCookie(res, result.accessToken);
    return result.user;
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Déconnexion' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });

    return { success: true, message: 'Déconnecté' };
  }

  private setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });
  }
}
