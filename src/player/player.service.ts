import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlayerDto } from './dto/player.dto';
import { hash } from 'argon2';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlayer(dto: PlayerDto) {
    const hashedPassword = await hash(dto.password);
    if (!dto.nickname) {
      throw new BadRequestException('Nickname обязателен для заполнения.');
    }

    return this.prisma.player.create({
      data: {
        nickname: dto.nickname,
        firstName: dto.firstName,
        lastName: dto.lastName,
        socials: dto.socials,
        password: hashedPassword,
      },
    });
  }

  async getAllPlayers() {
    return this.prisma.player.findMany({
      include: { statistics: true },
    });
  }

  async updatePlayer(id: number, dto: PlayerDto) {
    return this.prisma.player.update({
      where: { id: +id },
      data: {
        nickname: dto.nickname,
        firstName: dto.firstName,
        lastName: dto.lastName,
        socials: dto.socials,
      },
    });
  }

  async deletePlayer(id: number) {
    return this.prisma.player.delete({
      where: { id },
    });
  }

  async createStatistics(playerId: number, data: PlayerDto) {
    const WINRATE = data.win / data.mapCount;
    const KD = data.deaths > 0 ? data.kills / data.deaths : data.kills;
    const KDA =
      data.deaths > 0
        ? (data.kills + data.assists) / data.deaths
        : data.kills + data.assists;
    const svidRating = KD + WINRATE * 0.2 + data.mvp * 0.05 - data.place * 0.02;

    return this.prisma.statistics.create({
      data: {
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        mapCount: data.mapCount,
        maps: data.maps,
        kd: Number(KD.toFixed(2)),
        kda: Number(KDA.toFixed(2)),
        mvp: data.mvp,
        svidRating: Number(svidRating.toFixed(2)),
        win: data.win,
        lose: data.lose,
        place: data.place,
        Player: { connect: { id: +playerId } },
      },
    });
  }

  async updateStatistics(playerId: number, data: PlayerDto) {
    const WINRATE = data.win / data.mapCount;
    const KD = data.deaths > 0 ? data.kills / data.deaths : data.kills;
    const KDA =
      data.deaths > 0
        ? (data.kills + data.assists) / data.deaths
        : data.kills + data.assists;
    const svidRating = KD + WINRATE * 0.2 + data.mvp * 0.05 - data.place * 0.02;

    return this.prisma.statistics.update({
      where: { id: +playerId },
      data: {
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        mapCount: data.mapCount,
        maps: data.maps,
        kd: Number(KD.toFixed(2)),
        kda: Number(KDA.toFixed(2)),
        mvp: data.mvp,
        svidRating: Number(svidRating.toFixed(2)),
        win: data.win,
        lose: data.lose,
        place: data.place,
      },
    });
  }
}
