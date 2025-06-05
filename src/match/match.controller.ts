import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchDto } from './dto/match.dto';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('create')
  async create(@Body() dto: MatchDto) {
    return this.matchService.createMatch(dto);
  }

  @Get('tournament/:id')
  async findByTournament(@Param('id') id: string) {
    return this.matchService.getMatchesByTournament(id);
  }
}
