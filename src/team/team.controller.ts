import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamService.createTeam(dto);
  }

  @Get(':id')
  getTeamById(@Param('id') id: string) {
    return this.teamService.getTeamById(id);
  }

  @Get('/tournament/:tournamentId')
  getTeamsByTournament(@Param('tournamentId') tournamentId: string) {
    return this.teamService.getTeamsByTournament(tournamentId);
  }

  @Patch(':id')
  updateTeam(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamService.updateTeam(id, dto);
  }

  @Delete(':id')
  deleteTeam(@Param('id') id: string) {
    return this.teamService.deleteTeam(id);
  }
}
