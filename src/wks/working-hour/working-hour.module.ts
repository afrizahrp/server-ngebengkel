import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkingHourController } from './working-hour.controller';
import { WorkingHourService } from './working-hour.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkingHourController],
  providers: [WorkingHourService],
  exports: [WorkingHourService],
})
export class WorkingHourModule {}









