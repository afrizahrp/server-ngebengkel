import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { WaitingListModule } from '../waiting-list/waiting-list.module';

@Module({
  imports: [PrismaModule, WaitingListModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}


