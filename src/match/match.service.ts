import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async createMatch(dto: MatchDto) {
    const match = await this.prisma.match.create({
      data: {
        map: dto.map,
        tournamentId: dto.tournamentId,
        winningTeamId: dto.winningTeamId,
        losingTeamId: dto.losingTeamId,
      },
    });

    await this.handlePlayerStatsUpdate(match.id, dto.players);

    return this.getMatchById(match.id);
  }

  async getMatchesByTournament(tournamentId: string) {
    return this.prisma.match.findMany({
      where: { tournamentId },
      include: {
        statistics: true,
        tournament: true,
      },
    });
  }

  async getMatchesByPlayer(playerId: string) {
    return this.prisma.playerMatchStatistics.findMany({
      where: { playerId },
      include: {
        match: true,
      },
    });
  }

  async updateMatch(id: string, dto: MatchDto) {
    const match = await this.prisma.match.update({
      where: { id },
      data: {
        map: dto.map,
        tournamentId: dto.tournamentId,
        winningTeamId: dto.winningTeamId,
        losingTeamId: dto.losingTeamId,
      },
    });

    // Удаляем старую статистику
    await this.prisma.playerMatchStatistics.deleteMany({
      where: { matchId: id },
    });

    await this.handlePlayerStatsUpdate(match.id, dto.players);

    return this.getMatchById(match.id);
  }

  async deleteMatch(id: string) {
    await this.prisma.playerMatchStatistics.deleteMany({
      where: { matchId: id },
    });

    return this.prisma.match.delete({
      where: { id },
    });
  }

  private async getMatchById(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        statistics: {
          include: {
            player: true,
          },
        },
        tournament: true,
      },
    });
  }

  private async handlePlayerStatsUpdate(
    matchId: string,
    players: MatchDto['players'],
  ) {
    for (const stat of players) {
      const player = await this.prisma.player.findUnique({
        where: { id: stat.playerId },
        include: { statistics: true },
      });

      if (!player || !player.statistics) {
        throw new BadRequestException(
          `Нет статистики для игрока ${stat.playerId}`,
        );
      }

      const KD = stat.deaths > 0 ? stat.kills / stat.deaths : stat.kills;
      const KDA =
        stat.deaths > 0
          ? (stat.kills + stat.assists) / stat.deaths
          : stat.kills + stat.assists;
      const svidRating = KD + stat.mvp * 0.05 - stat.place * 0.02;

      const statUpdate = {
        kills: player.statistics.kills + stat.kills,
        deaths: player.statistics.deaths + stat.deaths,
        assists: player.statistics.assists + stat.assists,
        mapCount: player.statistics.mapCount + 1,
        kd:
          (player.statistics.kills + stat.kills) /
          (player.statistics.deaths + stat.deaths || 1),
        kda:
          (player.statistics.kills +
            player.statistics.assists +
            stat.kills +
            stat.assists) /
          (player.statistics.deaths + stat.deaths || 1),
        win: stat.win ? player.statistics.win + 1 : player.statistics.win,
        lose: stat.win ? player.statistics.lose : player.statistics.lose + 1,
        svidRating: (player.statistics.svidRating + svidRating) / 2,
      };

      await this.prisma.playerStatistics.update({
        where: { id: player.statistics.id },
        data: statUpdate,
      });

      await this.prisma.playerMatchStatistics.create({
        data: {
          matchId,
          playerId: stat.playerId,
          teamId: stat.teamId,
          kills: stat.kills,
          deaths: stat.deaths,
          assists: stat.assists,
          score: stat.score,
          mvp: stat.mvp,
        },
      });
    }
  }
}
