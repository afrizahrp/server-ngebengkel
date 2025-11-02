import { Module } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { WhatsAppModule } from '../../whatsapp/whatsapp.module';
import { ServiceOrderReminderService } from './services/reminder.service';
import { InvoiceGeneratorService } from './services/invoice-generator.service';

@Module({
  imports: [PrismaModule, WhatsAppModule],
  controllers: [ServiceOrderController],
  providers: [
    ServiceOrderService,
    ServiceOrderReminderService,
    InvoiceGeneratorService,
  ],
  exports: [ServiceOrderService],
})
export class ServiceOrderModule {}
