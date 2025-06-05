import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlayerDto } from './dto/player.dto';
import { hash } from 'argon2';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlayer(dto: PlayerDto) {
    const existingPlayer = await this.prisma.player.findUnique({
      where: { nickname: dto.nickname },
    });

    if (existingPlayer) {
      throw new BadRequestException('Игрок с таким nickname уже существует.');
    }

    if (!dto.nickname || !dto.firstName || !dto.lastName) {
      throw new BadRequestException(
        'Nickname, firstName и lastName обязательны для заполнения.',
      );
    }

    const hashedPassword = await hash(dto.password);

    const player = await this.prisma.player.create({
      data: {
        nickname: dto.nickname,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        socials: dto.socials ?? [],
        statistics: {
          create: {
            kills: dto.kills ?? 0,
            deaths: dto.deaths ?? 0,
            assists: dto.assists ?? 0,
            place: dto.place ?? 0,
            maps: dto.maps ?? [],
            mapCount: dto.mapCount ?? 0,
            win: dto.win ?? 0,
            lose: dto.lose ?? 0,
            winrate: dto.winrate ?? 0,
            kd: dto.kd ?? 0,
            kda: dto.kda ?? 0,
            svidRating: dto.svidRating ?? 0,
            mvp: dto.mvp ?? 0,
          },
        },
      },
      include: {
        statistics: true,
      },
    });

    return player;
  }

  async getAllPlayers() {
    return this.prisma.player.findMany({
      select: {
        id: true,
        nickname: true,
        firstName: true,
        lastName: true,
        socials: true,
        statistics: true,
      },
    });
  }

  async updatePlayer(id: string, dto: PlayerDto) {
    return this.prisma.player.update({
      where: { id },
      data: {
        nickname: dto.nickname,
        firstName: dto.firstName,
        lastName: dto.lastName,
        socials: dto.socials,
      },
    });
  }

  async deletePlayer(id: string) {
    return this.prisma.player.delete({
      where: { id },
    });
  }

  async createStatistics(playerId: string, data: PlayerDto) {
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
        winrate: Number(WINRATE.toFixed(2)),
        mvp: data.mvp,
        svidRating: Number(svidRating.toFixed(2)),
        win: data.win,
        lose: data.lose,
        place: data.place,
        Player: { connect: { id: playerId } },
      },
    });
  }

  async updateStatistics(playerId: string, data: PlayerDto) {
    const WINRATE = data.win / data.mapCount;
    const KD = data.deaths > 0 ? data.kills / data.deaths : data.kills;
    const KDA =
      data.deaths > 0
        ? (data.kills + data.assists) / data.deaths
        : data.kills + data.assists;
    const svidRating = KD + WINRATE * 0.2 + data.mvp * 0.05 - data.place * 0.02;

    return this.prisma.statistics.update({
      where: { id: playerId },
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
