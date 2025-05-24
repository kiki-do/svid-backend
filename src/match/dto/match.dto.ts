import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class MatchDto {
  @IsNumber()
  kills: number;

  @IsNumber()
  deaths: number;

  @IsNumber()
  assists: number;

  @IsNumber()
  mvp: number;

  @IsNumber()
  place: number;

  @IsString()
  map: string;

  @IsNumber()
  playerId: number;

  @IsNumber()
  tournamentId: number;

  @IsBoolean()
  win: boolean;
}
