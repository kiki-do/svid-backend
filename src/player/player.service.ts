import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlayerDto } from './dto/player.dto';
import { hash } from 'argon2';
import { PlayerStatisticsDto } from './dto/player-statistics.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPlayers() {
    return this.prisma.player.findMany({
      select: {
        id: true,
        nickname: true,
        firstName: true,
        lastName: true,
        statistics: true,
      },
    });
  }

  async createPlayer(dto: PlayerDto) {
    const existingPlayer = await this.prisma.player.findUnique({
      where: { nickname: dto.nickname },
    });

    if (existingPlayer) {
      throw new BadRequestException('Игрок с таким nickname уже существует.');
    }

    if (!dto.nickname || !dto.firstName || !dto.lastName || !dto.password) {
      throw new BadRequestException(
        'Nickname, firstName, lastName и password обязательны.',
      );
    }

    const hashedPassword = await hash(dto.password);

    const player = await this.prisma.player.create({
      data: {
        nickname: dto.nickname,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: hashedPassword,
        statistics: {
          create: {
            kills: 0,
            deaths: 0,
            assists: 0,
            place: 0,
            mapCount: 0,
            win: 0,
            lose: 0,
            winrate: 0,
            kd: 0,
            kda: 0,
            svidRating: 0,
            mvp: 0,
            maps: [],
          },
        },
      },
      select: {
        id: true,
        nickname: true,
        firstName: true,
        lastName: true,
        statistics: true,
      },
    });

    return player;
  }

  async updatePlayer(id: string, dto: Partial<PlayerDto>) {
    const existingPlayer = await this.prisma.player.findUnique({
      where: { id },
      include: { statistics: true },
    });

    if (!existingPlayer) {
      throw new BadRequestException('Игрок с указанным ID не найден');
    }

    return this.prisma.player.update({
      where: { id },
      data: {
        nickname: dto.nickname,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      include: {
        statistics: true,
      },
    });
  }

  async deletePlayer(id: string) {
    return this.prisma.player.delete({
      where: { id },
    });
  }

  async createStatistics(playerId: string, data: PlayerStatisticsDto) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { statistics: true },
    });

    if (!player) {
      throw new BadRequestException('Игрок с указанным ID не найден');
    }

    if (player.statistics) {
      throw new BadRequestException('У игрока уже есть статистика');
    }

    const WINRATE = data.mapCount > 0 ? data.win / data.mapCount : 0;
    const KD = data.deaths > 0 ? data.kills / data.deaths : data.kills;
    const KDA =
      data.deaths > 0
        ? (data.kills + data.assists) / data.deaths
        : data.kills + data.assists;
    const svidRating = KD + WINRATE * 0.2 + data.mvp * 0.05 - data.place * 0.02;

    return this.prisma.playerStatistics.create({
      data: {
        player: { connect: { id: playerId } },
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        win: data.win,
        lose: data.lose,
        kd: Number(KD.toFixed(2)),
        kda: Number(KDA.toFixed(2)),
        mapCount: data.mapCount,
        winrate: Number(WINRATE.toFixed(2)),
        svidRating: Number(svidRating.toFixed(2)),
        place: data.place,
        mvp: data.mvp,
        maps: data.maps ?? [],
      },
    });
  }

  async updateStatistics(playerId: string, data: Partial<PlayerStatisticsDto>) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { statistics: true },
    });

    if (!player || !player.statistics) {
      throw new BadRequestException('Игрок или его статистика не найдены');
    }

    const current = {
      kills: data.kills ?? player.statistics.kills,
      deaths: data.deaths ?? player.statistics.deaths,
      assists: data.assists ?? player.statistics.assists,
      win: data.win ?? player.statistics.win,
      lose: data.lose ?? player.statistics.lose,
      mapCount: data.mapCount ?? player.statistics.mapCount,
      place: data.place ?? player.statistics.place,
      mvp: data.mvp ?? player.statistics.mvp,
      maps: data.maps ?? player.statistics.maps,
    };

    const WINRATE = current.mapCount > 0 ? current.win / current.mapCount : 0;
    const KD =
      current.deaths > 0 ? current.kills / current.deaths : current.kills;
    const KDA =
      current.deaths > 0
        ? (current.kills + current.assists) / current.deaths
        : current.kills + current.assists;
    const svidRating =
      KD + WINRATE * 0.2 + current.mvp * 0.05 - current.place * 0.02;

    return this.prisma.playerStatistics.update({
      where: { id: player.statistics.id },
      data: {
        kills: current.kills,
        deaths: current.deaths,
        assists: current.assists,
        win: current.win,
        lose: current.lose,
        mapCount: current.mapCount,
        kd: Number(KD.toFixed(2)),
        kda: Number(KDA.toFixed(2)),
        winrate: Number(WINRATE.toFixed(2)),
        svidRating: Number(svidRating.toFixed(2)),
        place: current.place,
        mvp: current.mvp,
        maps: current.maps,
      },
    });
  }
}
