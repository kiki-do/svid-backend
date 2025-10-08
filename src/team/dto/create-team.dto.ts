// src/team/dto/create-team.dto.ts
import { IsUUID, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsUUID()
  tournamentId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  playerIds: string[];
}
