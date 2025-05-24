import { IsArray, IsNumber, IsString } from 'class-validator';

export class PlayerDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsNumber()
  kills: number;

  @IsNumber()
  deaths: number;

  @IsNumber()
  assists: number;

  @IsNumber()
  place: number;

  @IsArray()
  maps: string[];

  @IsNumber()
  mapCount: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsArray()
  socials: string[];

  @IsNumber()
  win: number;

  @IsNumber()
  lose: number;

  @IsNumber()
  winrate: number;

  @IsNumber()
  kd: number;

  @IsNumber()
  kda: number;

  @IsNumber()
  svidRating: number;

  @IsNumber()
  mvp: number;
}
