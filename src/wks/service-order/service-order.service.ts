import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { DetailTypeEnum } from '@prisma/client';

import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { ReminderService } from './services/reminder.service';
import { InvoiceGeneratorService } from './services/invoice-generator.service';
import { WablasService } from '../../whatsapp/wablas.service';

@Injectable()
export class ServiceOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reminderService: ReminderService,
    private readonly invoiceGenerator: InvoiceGeneratorService,
    private readonly wablasService: WablasService,
  ) {}

  async generateOrderNumber(companyId: string): Promise<string> {
    // Get document numbering config for Service Order
    const docConfig = await this.prisma.sys_DocumentNumber.findUnique({
      where: {
        company_id_counterCode: {
          company_id: companyId,
          counterCode: 'SO', // Service Order
        },
      },
    });

    if (!docConfig) {
      throw new BadRequestException(
        'Document numbering configuration not found for Service Order',
      );
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Increment current number
    docConfig.currentNumber += 1;

    // Build order number
    const orderNumber = docConfig.format
      .replace('{CODE}', 'SO')
      .replace('{YYYY}', String(year))
      .replace('{MM}', month)
      .replace('{SEQ}', String(docConfig.currentNumber).padStart(5, '0'));

    // Update document number
    await this.prisma.sys_DocumentNumber.update({
      where: {
        company_id_counterCode: {
          company_id: companyId,
          counterCode: 'SO',
        },
      },
      data: {
        currentNumber: docConfig.currentNumber,
        updatedAt: new Date(),
      },
    });

    return orderNumber;
  }

  async create(createServiceOrderDto: CreateServiceOrderDto) {
    const {
      orderDetails,
      company_id,
      branch_id,
      customer_id,
      customerVehicle_id,
      createdBy,
      ...serviceOrderData
    } = createServiceOrderDto;

    // Generate order number
    const orderNumber = await this.generateOrderNumber(company_id);
    // Generate 20-char ID (composite PK requires manual id)
    const id = (
      company_id +
      'SO' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    )
      .toUpperCase()
      .slice(0, 20);

    // Calculate totals if not provided
    const totalAmount =
      serviceOrderData.totalAmount ||
      (serviceOrderData.serviceCost || 0) +
        (serviceOrderData.partsCost || 0) -
        (serviceOrderData.discountAmount || 0) +
        (serviceOrderData.taxAmount || 0);

    return await this.prisma.$transaction(async (tx) => {
      // Create service order
      const serviceOrder = await tx.wks_ServiceOrder.create({
        data: {
          id,
          orderNumber,
          orderDate: new Date(),
          customer_id,
          customerVehicle_id,
          vehicle_customer_id: customer_id,
          company_id,
          branch_id,
          createdBy,
          updatedAt: new Date(),
          ...serviceOrderData,
          totalAmount,
        },
      });

      // Create service order details
      if (orderDetails && orderDetails.length > 0) {
        const detailsData = orderDetails.map((detail, index) => ({
          id: `SOD/${new Date().toISOString().split('T')[0]}/${String(
            index + 1,
          ).padStart(5, '0')}`,
          serviceOrder_id: serviceOrder.id,
          lineNumber: index + 1,
          detailType: detail.serviceType_id
            ? DetailTypeEnum.SERVICE
            : DetailTypeEnum.PART,
          company_id,
          branch_id,
          ...detail,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await tx.wks_ServiceOrderDetail.createMany({
          data: detailsData,
        });
      }

      // Return created service order with details
      return this.findOne(company_id, serviceOrder.id);
    });
  }

  async findAll(
    companyId: string,
    branchId?: string,
    status?: string,
    customerId?: string,
  ) {
    const where: any = {
      company_id: companyId,
    };

    if (branchId) {
      where.branch_id = branchId;
    }

    if (status) {
      where.orderStatus = status;
    }

    if (customerId) {
      where.customer_id = customerId;
    }

    const serviceOrders = await this.prisma.wks_ServiceOrder.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            mobile1: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            brand: {
              select: {
                name: true,
              },
            },
            model: {
              select: {
                name: true,
              },
            },
            vehicleYear: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            employee: {
              select: {
                name: true,
              },
            },
            specialization: true,
          },
        },
        serviceBay: {
          select: {
            id: true,
            name: true,
            bayType: true,
          },
        },
        orderDetails: {
          orderBy: {
            lineNumber: 'asc',
          },
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    return serviceOrders.map((so) => ({
      ...so,
      mechanic: so.mechanic
        ? {
            id: so.mechanic.id,
            name: so.mechanic.employee?.name,
            specialization: so.mechanic.specialization,
          }
        : null,
      vehicle: so.vehicle
        ? {
            id: so.vehicle.id,
            licensePlate: so.vehicle.licensePlate,
            brand: so.vehicle.brand?.name,
            model: so.vehicle.model?.name,
            year: so.vehicle.vehicleYear,
          }
        : null,
    }));
  }

  async findOne(companyId: string, id: string) {
    const serviceOrder = await this.prisma.wks_ServiceOrder.findUnique({
      where: { company_id_id: { company_id: companyId, id } },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            mobile1: true,
            email: true,
            address1: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            brand: {
              select: {
                name: true,
              },
            },
            model: {
              select: {
                name: true,
              },
            },
            vehicleYear: true,
            color: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            employee: {
              select: {
                name: true,
              },
            },
            specialization: true,
          },
        },
        serviceBay: {
          select: {
            id: true,
            name: true,
            bayType: true,
          },
        },
        orderDetails: {
          orderBy: {
            lineNumber: 'asc',
          },
        },
      },
    });

    if (!serviceOrder) {
      throw new NotFoundException(`Service Order with ID ${id} not found`);
    }

    return {
      ...serviceOrder,
      mechanic: serviceOrder.mechanic
        ? {
            id: serviceOrder.mechanic.id,
            name: serviceOrder.mechanic.employee?.name,
            specialization: serviceOrder.mechanic.specialization,
          }
        : null,
      vehicle: serviceOrder.vehicle
        ? {
            id: serviceOrder.vehicle.id,
            licensePlate: serviceOrder.vehicle.licensePlate,
            brand: serviceOrder.vehicle.brand?.name,
            model: serviceOrder.vehicle.model?.name,
            year: serviceOrder.vehicle.vehicleYear,
            color: serviceOrder.vehicle.color,
          }
        : null,
    };
  }

  async update(id: string, updateServiceOrderDto: UpdateServiceOrderDto) {
    // We need company_id for composite key operations
    const existing = await this.prisma.wks_ServiceOrder.findFirst({
      where: { id },
      select: { company_id: true, branch_id: true },
    });
    if (!existing) {
      throw new NotFoundException(`Service Order with ID ${id} not found`);
    }

    const { orderDetails, updatedBy, ...updateData } = updateServiceOrderDto;

    return await this.prisma.$transaction(async (tx) => {
      // Update service order
      await tx.wks_ServiceOrder.update({
        where: {
          company_id_id: { company_id: existing.company_id, id: id },
        },
        data: {
          ...updateData,
          updatedBy,
          updatedAt: new Date(),
        },
      });

      // Update order details if provided
      if (orderDetails && orderDetails.length > 0) {
        // Delete existing details
        await tx.wks_ServiceOrderDetail.deleteMany({
          where: {
            serviceOrder_id: id,
          },
        });

        // Create new details
        const detailsData = orderDetails.map((detail, index) => ({
          id: `SOD/${new Date().toISOString().split('T')[0]}/${String(
            index + 1,
          ).padStart(5, '0')}`,
          serviceOrder_id: id,
          lineNumber: index + 1,
          detailType: detail.serviceType_id
            ? DetailTypeEnum.SERVICE
            : DetailTypeEnum.PART,
          company_id: existing.company_id,
          branch_id: existing.branch_id,
          ...detail,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await tx.wks_ServiceOrderDetail.createMany({
          data: detailsData,
        });
      }

      return this.findOne(existing.company_id, id);
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.wks_ServiceOrder.findFirst({
      where: { id },
      select: { company_id: true },
    });
    if (!existing) {
      throw new NotFoundException(`Service Order with ID ${id} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      // Delete order details
      await tx.wks_ServiceOrderDetail.deleteMany({
        where: {
          serviceOrder_id: id,
        },
      });

      // Delete service order
      await tx.wks_ServiceOrder.delete({
        where: { company_id_id: { company_id: existing.company_id, id } },
      });
    });

    return { message: 'Service Order deleted successfully' };
  }

  /**
   * Kirim reminder untuk service order
   */
  async sendReminder(serviceOrderId: string, companyId: string) {
    return await this.reminderService.sendServiceOrderReminder(
      serviceOrderId,
      companyId,
    );
  }

  /**
   * Kirim invoice via WhatsApp
   */
  async sendInvoice(
    serviceOrderId: string,
    companyId: string,
    type: 'invoice' | 'struk' = 'invoice',
  ) {
    // Get service order dengan relasi lengkap
    const serviceOrder = await this.findOne(companyId, serviceOrderId);

    if (!serviceOrder) {
      throw new NotFoundException('Service Order not found');
    }

    // Cek apakah customer punya nomor telepon
    const customerPhone = serviceOrder.customer?.mobile1;
    if (!customerPhone) {
      throw new BadRequestException('Customer tidak memiliki nomor telepon');
    }

    // Generate invoice/struk text
    const messageText =
      type === 'invoice'
        ? this.invoiceGenerator.generateInvoiceText(serviceOrder)
        : this.invoiceGenerator.generateStrukText(serviceOrder);

    // Kirim via WhatsApp
    const result = await this.wablasService.sendTextMessage(
      customerPhone,
      messageText,
    );

    if (!result.status) {
      throw new BadRequestException(
        result.message || 'Gagal mengirim invoice via WhatsApp',
      );
    }

    return {
      success: true,
      message: `${type === 'invoice' ? 'Invoice' : 'Struk'} berhasil dikirim via WhatsApp`,
      phone: customerPhone,
    };
  }

  /**
   * Generate PDF untuk invoice atau struk
   */
  async generatePDF(
    serviceOrderId: string,
    companyId: string,
    type: 'invoice' | 'struk' = 'invoice',
  ): Promise<Buffer> {
    // Get service order dengan relasi lengkap
    const serviceOrder = await this.findOne(companyId, serviceOrderId);

    if (!serviceOrder) {
      throw new NotFoundException('Service Order not found');
    }

    // Generate PDF
    if (type === 'invoice') {
      return await this.invoiceGenerator.generateInvoicePDF(serviceOrder);
    } else {
      return await this.invoiceGenerator.generateStrukPDF(serviceOrder);
    }
  }
}
