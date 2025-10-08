import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchDto } from './dto/match.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Body() dto: MatchDto) {
    return this.matchService.createMatch(dto);
  }

  @Get('tournament/:id')
  getByTournament(@Param('id') id: string) {
    return this.matchService.getMatchesByTournament(id);
  }

  @Get('player/:id')
  getByPlayer(@Param('id') playerId: string) {
    return this.matchService.getMatchesByPlayer(playerId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: MatchDto) {
    return this.matchService.updateMatch(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.deleteMatch(id);
  }
}
