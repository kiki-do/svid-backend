import { IsInt, IsArray, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class PlayerStatisticsDto {
  @IsInt()
  @Min(0)
  kills: number;

  @IsInt()
  @Min(0)
  deaths: number;

  @IsInt()
  @Min(0)
  assists: number;

  @IsInt()
  @Min(0)
  win: number;

  @IsInt()
  @Min(0)
  lose: number;

  @IsInt()
  @Min(0)
  mapCount: number;

  @IsInt()
  @Min(0)
  place: number;

  @IsInt()
  @Min(0)
  mvp: number;

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  maps?: string[];
}
