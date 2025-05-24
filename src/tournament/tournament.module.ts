import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  controllers: [TournamentController],
  providers: [TournamentService, PrismaService],
})
export class TournamentModule {}
