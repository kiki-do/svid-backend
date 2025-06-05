import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TournamentDto } from './dto/tournament.dto';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post('create')
  async create(@Body() dto: TournamentDto) {
    return this.tournamentService.createTournament(dto);
  }

  @Get('all')
  async findAll() {
    return this.tournamentService.getAllTournaments();
  }

  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string) {
    return this.tournamentService.getTournamentStatistics(id);
  }
}
