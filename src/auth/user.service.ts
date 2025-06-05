import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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

  async getById(id: string) {
    return this.prisma.admin.findUnique({
      where: {
        id,
      },
    });
  }

  // async create(dto: AuthDto) {
  //   const admins = await this.getAllAdmins();
  //   const admin = {
  //     id: admins.length + 1,
  //     login: dto.login,
  //     name: dto.name,
  //     password: await hash(dto.password),
  //   };

  //   return this.prisma.admin.create({
  //     data: admin,
  //   });
  // }
}
