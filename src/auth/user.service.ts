import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllAdmins() {
    return await this.prisma.admin.findMany();
  }

  async getByLogin(login: string) {
    return this.prisma.admin.findUnique({
      where: {
        login,
      },
    });
  }

  async getById(id: number) {
    return this.prisma.admin.findUnique({
      where: {
        id,
      },
    });
  }

  async create(dto: AuthDto) {
    const admins = await this.getAllAdmins();
    const admin = {
      id: admins.length + 1,
      login: dto.login,
      name: dto.name,
      password: await hash(dto.password),
    };

    return this.prisma.admin.create({
      data: admin,
    });
  }
}
