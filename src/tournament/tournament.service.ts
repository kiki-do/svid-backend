import { Injectable } from '@nestjs/common';
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

  async getTournamentStatistics(tournamentId: string) {
    const matches = await this.prisma.match.findMany({
      where: { tournamentId },
      include: { player: true, statistics: true },
    });

    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalMVP = 0;
    let totalPlace = 0;
    let totalWins = 0;

    matches.forEach((match) => {
      totalKills += match.kills;
      totalDeaths += match.deaths;
      totalAssists += match.assists;
      totalMVP += match.mvp;
      totalPlace += match.place;
      totalWins += match.win ? 1 : 0;
    });

    const KD = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
    const KDA =
      totalDeaths > 0
        ? (totalKills + totalAssists) / totalDeaths
        : totalKills + totalAssists;
    const svidRating =
      KD +
      (totalMVP / matches.length) * 0.05 -
      (totalPlace / matches.length) * 0.02;

    await this.prisma.tournamentStatistics.create({
      data: {
        kills: totalKills,
        deaths: totalDeaths,
        assists: totalAssists,
        mapCount: matches.length,
        place: totalPlace,
        win: totalWins,
        lose: matches.length - totalWins,
        kd: Number(KD.toFixed(2)),
        kda: Number(KDA.toFixed(2)),
        svidRating: Number(KD.toFixed(2)),
        mvp: totalMVP,
        tournamentId: tournamentId,
      },
    });

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
