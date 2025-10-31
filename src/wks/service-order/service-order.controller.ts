import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceOrderService } from './service-order.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('api/service-orders')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  @Post()
  create(
    @Body() createServiceOrderDto: CreateServiceOrderDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.serviceOrderService.create({
      ...createServiceOrderDto,
      createdBy: user.sub.toString(),
    });
  }

  @Get()
  findAll(
    @Query('company_id') companyId: string,
    @Query('branch_id') branchId?: string,
    @Query('status') status?: string,
    @Query('customer_id') customerId?: string,
  ) {
    return this.serviceOrderService.findAll(
      companyId,
      branchId,
      status,
      customerId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.serviceOrderService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceOrderDto: UpdateServiceOrderDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.serviceOrderService.update(id, {
      ...updateServiceOrderDto,
      updatedBy: user.sub.toString(),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceOrderService.remove(id);
  }

  @Post(':id/send-reminder')
  sendReminder(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
  ) {
    return this.serviceOrderService.sendReminder(id, companyId);
  }

  @Post(':id/send-invoice')
  sendInvoice(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Query('type') type?: 'invoice' | 'struk',
  ) {
    return this.serviceOrderService.sendInvoice(
      id,
      companyId,
      type || 'invoice',
    );
  }

  @Get(':id/download-pdf')
  async downloadPDF(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Query('type') type: 'invoice' | 'struk' = 'invoice',
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.serviceOrderService.generatePDF(
      id,
      companyId,
      type,
    );

    const filename =
      type === 'invoice' ? `Invoice-${id}.pdf` : `Struk-${id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  }
}
