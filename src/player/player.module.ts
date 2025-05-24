import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, PrismaService],
})
export class PlayerModule {}
