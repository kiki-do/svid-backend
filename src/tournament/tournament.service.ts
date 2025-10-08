import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TournamentDto } from './dto/tournament.dto';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}

  async createTournament(dto: TournamentDto) {
    return this.prisma.tournament.create({
      data: {
        name: dto.name,
        image: dto.image,
        date: new Date(dto.date),
      },
    });
  }

  async getAllTournaments() {
    return this.prisma.tournament.findMany({
      include: { matches: true },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getTournamentById(id: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            statistics: {
              include: {
                player: true,
              },
            },
          },
        },
        teams: {
          include: {
            members: {
              include: {
                player: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      throw new NotFoundException('Турнир не найден');
    }

    return tournament;
  }

  async updateTournament(id: string, dto: TournamentDto) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
    });
    if (!tournament) throw new NotFoundException('Турнир не найден');

    return this.prisma.tournament.update({
      where: { id },
      data: {
        name: dto.name,
        image: dto.image,
        date: new Date(dto.date),
      },
    });
  }

  async deleteTournament(id: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
    });
    if (!tournament) throw new NotFoundException('Турнир не найден');

    return this.prisma.tournament.delete({ where: { id } });
  }

  async getTournamentStatistics(tournamentId: string) {
    const matches = await this.prisma.match.findMany({
      where: { tournamentId },
      include: {
        statistics: true,
      },
    });

    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalMVP = 0;
    const totalWins = 0;

    for (const match of matches) {
      for (const stat of match.statistics) {
        totalKills += stat.kills;
        totalDeaths += stat.deaths;
        totalAssists += stat.assists;
        totalMVP += stat.mvp;
      }
    }

    const KD = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
    const KDA =
      totalDeaths > 0
        ? (totalKills + totalAssists) / totalDeaths
        : totalKills + totalAssists;
    const svidRating = KD + (totalMVP / matches.length) * 0.05;

    return {
      totalKills,
      totalDeaths,
      totalAssists,
      KD,
      KDA,
      svidRating,
      totalWins,
    };
  }
}
