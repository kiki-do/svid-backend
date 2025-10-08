import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { TournamentModule } from './tournament/tournament.module';
import { MatchModule } from './match/match.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PlayerModule,
    TournamentModule,
    MatchModule,
    TeamModule,
  ],
})
export class AppModule {}
