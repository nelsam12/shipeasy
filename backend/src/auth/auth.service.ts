import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../web/dto/request/login.dto';
import { RegisterDto } from '../web/dto/request/register.dto';
import { Role } from '../user/role.enum';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Connexion de l'utilisateur
   * Retourne le token ET les infos utilisateur pour le frontend
   */
  async login(request: LoginDto): Promise<{ accessToken: string; user: User }> {
    const user = await this.userService.findByEmailWithPassword(request.login);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isValid = await bcrypt.compare(request.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const token = this.generateToken(user.id);

    // On retire le mot de passe de l'objet user avant de le renvoyer
    const { password, ...userWithoutPassword } = user;

    return {
      accessToken: token,
      user: userWithoutPassword as User,
    };
  }

  /**
   * Inscription d'un utilisateur (Client ou GP)
   */
  async register(
    request: RegisterDto,
  ): Promise<{ accessToken: string; user: User }> {
    const exists = await this.userService.existsByEmail(request.email);

    if (exists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // 1. Sécurité : Empêcher l'inscription en tant qu'ADMIN
    if (request.role === Role.ADMIN) {
      throw new BadRequestException('Action non autorisée');
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    // 2. Création de l'utilisateur avec tous les champs (y compris GP)
    const user = await this.userService.create({
      email: request.email,
      password: hashedPassword,
      fullName: request.fullName,
      phone: request.phone,
      role: request.role || Role.CLIENT, // Utilise le rôle envoyé ou CLIENT par défaut
      // Champs spécifiques GP (seront null pour un Client)
      companyName: request.companyName,
      address: request.address,
      description: request.description,
    });

    const token = this.generateToken(user.id);

    return {
      accessToken: token,
      user,
    };
  }

  private generateToken(userId: number): string {
    // Il est conseillé d'inclure le rôle ou l'ID dans le payload
    return this.jwtService.sign({ sub: userId });
  }
}
