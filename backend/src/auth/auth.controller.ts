import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtUser } from './type/jwt-user.type';
import { LoginDto } from '../web/dto/request/login.dto';
import { RegisterDto } from '../web/dto/request/register.dto';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil complet de l’utilisateur' })
  async getMe(@CurrentUser() userPayload: JwtUser) {
    // On s'assure que le service récupère bien le 'role' en base
    const user = await this.userService.findOne(userPayload.userId);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return user; // Le front recevra directement l'objet avec .role
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);

    // Vérification de sécurité pour le front
    if (!user.role) {
      throw new UnauthorizedException(
        'Rôle utilisateur non défini dans la base de données',
      );
    }

    this.setCookie(res, accessToken);
    return user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription d’un nouvel utilisateur' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(dto);
    const { accessToken, user } = await this.authService.register(dto);
    this.setCookie(res, accessToken);
    return user;
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

    return { success: true, message: 'Déconnecté' }; // Plus propre pour le front
  }

  private setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
      path: '/',
    });
  }
}
