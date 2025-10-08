import {
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlayerStatDto {
  @IsUUID()
  playerId: string;

  @IsUUID()
  teamId: string;

  @IsNumber()
  kills: number;

  @IsNumber()
  deaths: number;

  @IsNumber()
  assists: number;

  @IsNumber()
  mvp: number;

  @IsNumber()
  score: number;

  @IsNumber()
  place: number;

  @IsBoolean()
  win: boolean;
}

export class MatchDto {
  @IsString()
  map: string;

  @IsUUID()
  tournamentId: string;

  @IsUUID()
  @IsOptional()
  winningTeamId?: string;

  @IsUUID()
  @IsOptional()
  losingTeamId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerStatDto)
  players: PlayerStatDto[];
}
