import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PlayerDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsArray()
  @IsOptional()
  socials?: string[];

  @IsNumber()
  @IsOptional()
  kills?: number;

  @IsNumber()
  @IsOptional()
  deaths?: number;

  @IsNumber()
  @IsOptional()
  assists?: number;

  @IsNumber()
  @IsOptional()
  place?: number;

  @IsArray()
  @IsOptional()
  maps?: string[];

  @IsNumber()
  @IsOptional()
  mapCount?: number;

  @IsNumber()
  @IsOptional()
  win?: number;

  @IsNumber()
  @IsOptional()
  lose?: number;

  @IsNumber()
  @IsOptional()
  winrate?: number;

  @IsNumber()
  @IsOptional()
  kd?: number;

  @IsNumber()
  @IsOptional()
  kda?: number;

  @IsNumber()
  @IsOptional()
  svidRating?: number;

  @IsNumber()
  @IsOptional()
  mvp?: number;
}
