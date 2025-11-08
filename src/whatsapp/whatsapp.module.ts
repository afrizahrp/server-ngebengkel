import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WablasService } from './wablas.service';
import wablasConfig from './config/wablas.config';

@Module({
  imports: [ConfigModule.forFeature(wablasConfig)],
  providers: [WablasService],
  exports: [WablasService],
})
export class WhatsAppModule {}
