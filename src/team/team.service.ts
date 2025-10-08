import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async createTeam(dto: CreateTeamDto) {
    return this.prisma.$transaction(async (tx) => {
      // Проверяем, существуют ли игроки
      const players = await tx.player.findMany({
        where: { id: { in: dto.playerIds } },
      });

      if (players.length !== dto.playerIds.length) {
        throw new BadRequestException('Некоторые игроки не найдены');
      }

      const team = await tx.team.create({
        data: {
          name: dto.name,
          tournamentId: dto.tournamentId,
        },
      });

      const playerLinks = dto.playerIds.map((playerId) => ({
        playerId,
        teamId: team.id,
      }));

      await tx.playerOnTeam.createMany({
        data: playerLinks,
        skipDuplicates: true,
      });

      // Возвращаем созданную команду с игроками
      return tx.team.findUnique({
        where: { id: team.id },
        include: {
          members: { include: { player: true } },
          tournament: true,
        },
      });
    });
  }

  async getTeamById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            player: true,
          },
        },
        tournament: true,
        PlayerMatchStatistics: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    return team;
  }

  async getTeamsByTournament(tournamentId: string) {
    return this.prisma.team.findMany({
      where: { tournamentId },
      include: {
        members: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  async updateTeam(id: string, dto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTeam(id: string) {
    return this.prisma.team.delete({
      where: { id },
    });
  }
}
