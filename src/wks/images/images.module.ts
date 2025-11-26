import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { WaitingListModule } from '../waiting-list/waiting-list.module';

@Module({
  imports: [PrismaModule, WaitingListModule],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}


