import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MatchDto } from './dto/match.dto';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async createMatch(dto: MatchDto) {
    const player = await this.prisma.player.findUnique({
      where: { id: dto.playerId },
      include: { statistics: true },
    });

    if (!player || !player.statistics) {
      throw new BadRequestException('Player or player statistics not found');
    }

    const KD = dto.deaths > 0 ? dto.kills / dto.deaths : dto.kills;
    const KDA =
      dto.deaths > 0
        ? (dto.kills + dto.assists) / dto.deaths
        : dto.kills + dto.assists;
    const svidRating = KD + dto.mvp * 0.05 - dto.place * 0.02;

    await this.prisma.statistics.update({
      where: { id: player.statistics.id },
      data: {
        kills: player.statistics.kills + dto.kills,
        deaths: player.statistics.deaths + dto.deaths,
        assists: player.statistics.assists + dto.assists,
        mapCount: player.statistics.mapCount + 1,
        kd:
          (player.statistics.kills + dto.kills) /
          (player.statistics.deaths + dto.deaths),
        kda:
          (player.statistics.kills +
            dto.kills +
            player.statistics.assists +
            dto.assists) /
          (player.statistics.deaths + dto.deaths),
        win: dto.win ? player.statistics.win + 1 : player.statistics.win,
        lose: dto.win ? player.statistics.lose : player.statistics.lose + 1,
        svidRating: (player.statistics.svidRating + svidRating) / 2,
      },
    });

    const match = await this.prisma.match.create({
      data: {
        kills: dto.kills,
        deaths: dto.deaths,
        assists: dto.assists,
        mvp: dto.mvp,
        place: dto.place,
        map: dto.map,
        playerId: dto.playerId,
        tournamentId: dto.tournamentId,
        win: dto.win,
      },
    });

    await this.prisma.matchStatistics.create({
      data: {
        kills: dto.kills,
        deaths: dto.deaths,
        assists: dto.assists,
        kd: KD,
        kda: KDA,
        mvp: dto.mvp,
        win: dto.win,
        matchId: match.id,
      },
    });

    return match;
  }

  async getMatchesByTournament(tournamentId: string) {
    return this.prisma.match.findMany({
      where: { tournamentId },
      include: { player: true, tournament: true },
    });
  }
}
