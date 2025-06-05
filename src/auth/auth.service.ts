import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { AdminAuthDto, AuthDto } from './dto/auth.dto';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByLogin(dto.login);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async adminLogin(dto: AdminAuthDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { login: dto.login },
    });

    if (!admin) throw new BadRequestException('Admin not found');

    const isValid = await verify(admin.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    return this.issueTokens(admin.id, 'admin');
  }

  async adminRegister(dto: AdminAuthDto) {
    const existingUser = await this.prisma.admin.findUnique({
      where: { login: dto.login },
    });
    if (existingUser) throw new BadRequestException('Login already exists');

    const hashedPassword = await hash(dto.password);

    const user = await this.prisma.admin.create({
      data: {
        password: hashedPassword,
        login: dto.login,
      },
    });

    return this.issueTokens(user.id, 'admin');
  }

  async adminInfo(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    return this.issueTokens(user.id, 'user');
  }

  async register(dto: AuthDto) {
    const existingUser = await this.prisma.player.findUnique({
      where: { nickname: dto.name },
    });
    if (existingUser) throw new BadRequestException('Login already exists');

    const hashedPassword = await hash(dto.password);

    const user = await this.prisma.player.create({
      data: {
        password: hashedPassword,
        nickname: dto.login,
      },
    });

    return this.issueTokens(user.id, 'user');
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (result.role === 'user') {
      return this.issueTokens(result.id, 'user');
    }
  }

  async getNewAdminTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (result.role === 'admin') {
      return this.issueTokens(result.id, 'admin');
    }
  }

  private issueTokens(userId: string, role: 'user' | 'admin') {
    const payload = {
      id: userId,
      role: role,
    };

    return {
      accessToken: this.jwt.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwt.sign(payload, { expiresIn: '7d' }),
    };
  }
}
