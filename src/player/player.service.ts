import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlayerDto, PlayerStatisticsDto } from './dto/player.dto';
import { hash } from 'argon2';

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
        socials: true,
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

    if (!dto.nickname || !dto.firstName || !dto.lastName) {
      throw new BadRequestException(
        'Nickname, firstName и lastName обязательны для заполнения.',
      );
    }

    const hashedPassword = await hash(dto.password);

    // Создаем игрока с дефолтной статистикой (все нули)
    return this.prisma.player.create({
      data: {
        nickname: dto.nickname,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        socials: dto.socials ?? [],
        statistics: {
          create: {
            kills: 0,
            deaths: 0,
            assists: 0,
            place: 0,
            maps: [],
            mapCount: 0,
            win: 0,
            lose: 0,
            winrate: 0,
            kd: 0,
            kda: 0,
            svidRating: 0,
            mvp: 0,
          },
        },
      },
      include: {
        statistics: true,
      },
    });
  }

  async updatePlayer(id: string, dto: Partial<PlayerDto>) {
    const existingPlayer = await this.prisma.player.findUnique({
      where: { id },
      include: { statistics: true },
    });

    if (!existingPlayer) {
      throw new BadRequestException('Игрок с указанным ID не найден');
    }

    const playerData: Partial<{
      nickname: string;
      firstName: string;
      lastName: string;
      socials: string[];
    }> = {};

    if (dto.nickname !== undefined) playerData.nickname = dto.nickname;
    if (dto.firstName !== undefined) playerData.firstName = dto.firstName;
    if (dto.lastName !== undefined) playerData.lastName = dto.lastName;
    if (dto.socials !== undefined) playerData.socials = dto.socials;

    return this.prisma.player.update({
      where: { id },
      data: playerData,
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
    // Проверяем существование игрока
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new BadRequestException('Игрок с указанным ID не найден');
    }

    if (player.statisticsId) {
      throw new BadRequestException('У игрока уже есть статистика');
    }

    // Валидация обязательных полей
    if (
      data.kills === undefined ||
      data.deaths === undefined ||
      data.assists === undefined ||
      data.mapCount === undefined ||
      data.win === undefined ||
      data.lose === undefined ||
      data.place === undefined ||
      data.mvp === undefined
    ) {
      throw new BadRequestException(
        'Все основные поля статистики обязательны для заполнения',
      );
    }

    // Проверка на отрицательные значения
    if (
      data.kills < 0 ||
      data.deaths < 0 ||
      data.assists < 0 ||
      data.mapCount < 0 ||
      data.win < 0 ||
      data.lose < 0 ||
      data.place < 0 ||
      data.mvp < 0
    ) {
      throw new BadRequestException(
        'Значения статистики не могут быть отрицательными',
      );
    }

    // Проверка maps (если передано)
    if (data.maps && !Array.isArray(data.maps)) {
      throw new BadRequestException('Поле maps должно быть массивом');
    }

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
        maps: data.maps || [],
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

  async updateStatistics(playerId: string, data: PlayerStatisticsDto) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { statistics: true },
    });

    if (!player) {
      throw new BadRequestException('Игрок с указанным ID не найден');
    }

    if (!player.statistics) {
      throw new BadRequestException('У игрока нет статистики для обновления');
    }

    if (
      (data.kills !== undefined && data.kills < 0) ||
      (data.deaths !== undefined && data.deaths < 0) ||
      (data.assists !== undefined && data.assists < 0) ||
      (data.mapCount !== undefined && data.mapCount < 0) ||
      (data.win !== undefined && data.win < 0) ||
      (data.lose !== undefined && data.lose < 0) ||
      (data.place !== undefined && data.place < 0) ||
      (data.mvp !== undefined && data.mvp < 0)
    ) {
      throw new BadRequestException(
        'Значения статистики не могут быть отрицательными',
      );
    }

    // Проверка maps (если передано)
    if (data.maps && !Array.isArray(data.maps)) {
      throw new BadRequestException('Поле maps должно быть массивом');
    }

    // Берем текущие значения для не переданных полей
    const currentStats = {
      kills: data.kills ?? player.statistics.kills,
      deaths: data.deaths ?? player.statistics.deaths,
      assists: data.assists ?? player.statistics.assists,
      mapCount: data.mapCount ?? player.statistics.mapCount,
      maps: data.maps ?? player.statistics.maps,
      win: data.win ?? player.statistics.win,
      lose: data.lose ?? player.statistics.lose,
      place: data.place ?? player.statistics.place,
      mvp: data.mvp ?? player.statistics.mvp,
    };

    const WINRATE = currentStats.win / currentStats.mapCount;
    const KD =
      currentStats.deaths > 0
        ? currentStats.kills / currentStats.deaths
        : currentStats.kills;
    const KDA =
      currentStats.deaths > 0
        ? (currentStats.kills + currentStats.assists) / currentStats.deaths
        : currentStats.kills + currentStats.assists;
    const svidRating =
      KD + WINRATE * 0.2 + currentStats.mvp * 0.05 - currentStats.place * 0.02;

    return this.prisma.statistics.update({
      where: { id: player.statistics.id },
      data: {
        kills: currentStats.kills,
        deaths: currentStats.deaths,
        assists: currentStats.assists,
        mapCount: currentStats.mapCount,
        maps: currentStats.maps,
        kd: Number(KD.toFixed(2)),
        kda: Number(KDA.toFixed(2)),
        winrate: Number(WINRATE.toFixed(2)),
        mvp: currentStats.mvp,
        svidRating: Number(svidRating.toFixed(2)),
        win: currentStats.win,
        lose: currentStats.lose,
        place: currentStats.place,
      },
    });
  }
}
