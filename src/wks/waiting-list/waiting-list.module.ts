import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WaitingListController } from './waiting-list.controller';
import { WaitingListService } from './waiting-list.service';

@Module({
  imports: [PrismaModule],
  controllers: [WaitingListController],
  providers: [WaitingListService],
})
export class WaitingListModule {}
