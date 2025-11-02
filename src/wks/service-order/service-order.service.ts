import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  DetailTypeEnum,
  ReminderEntityTypeEnum,
  ReminderTypeEnum,
  ReminderStatusEnum,
  ReminderChannelEnum,
  ReminderLogTypeEnum,
} from '@prisma/client';

import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { PaginationServiceOrderDto } from './dto/pagination-service-order.dto';
import { InvoiceGeneratorService } from './services/invoice-generator.service';
import { WablasService } from '../../whatsapp/wablas.service';
import { generateDocumentNumber } from '../../utils/generateDocumentNumber';
import {
  buildPagination,
  buildSearchCondition,
  sortFieldBy,
} from '../../utils/query-operator';
import {
  serviceOrderWhereCondition,
  ServiceOrderFilter,
} from './helper/serviceOrderWhereCondition';

@Injectable()
export class ServiceOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceGenerator: InvoiceGeneratorService,
    private readonly wablasService: WablasService,
  ) {}

  async generateOrderNumber(
    companyId: string,
    branchId: string,
  ): Promise<string> {
    // Use helper to generate document number using sys_Numbering
    return await generateDocumentNumber({
      prisma: this.prisma,
      module_id: 'WKS',
      company_id: companyId,
      branch_id: branchId,
      date: new Date(),
      prefix: 'SO', // Service Order prefix
    });
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
    const orderNumber = await this.generateOrderNumber(company_id, branch_id);
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
      isDeleted: false,
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

  async findAllPaginated(paginationDto: PaginationServiceOrderDto): Promise<{
    data: any[];
    totalRecords: number;
  }> {
    const {
      page = 1,
      limit = 20,
      searchBy,
      searchTerm,
      company_id,
      branch_id,
      orderStatus,
      customer_id,
      mechanic_id,
      serviceBay_id,
      start_date,
      end_date,
      orderBy,
      orderDir = 'desc',
    } = paginationDto;

    // Build pagination
    const pagination = buildPagination({ page, limit, maxLimit: 100 });

    // Build sort
    const orderByCondition = sortFieldBy(
      [
        'orderNumber',
        'orderDate',
        'orderStatus',
        'totalAmount',
        'createdAt',
        'updatedAt',
      ],
      orderBy,
      orderDir,
    );

    const filter: ServiceOrderFilter = {
      company_id,
      branch_id: branch_id && branch_id.length > 0 ? branch_id : undefined,
      orderStatus:
        orderStatus && orderStatus.length > 0 ? orderStatus : undefined,
      customer_id,
      mechanic_id,
      serviceBay_id,
      start_date,
      end_date,
    };

    const whereCondition = serviceOrderWhereCondition(filter);
    const searchConditions = buildSearchCondition({ searchBy, searchTerm });

    if (searchConditions) {
      if (Array.isArray(whereCondition.AND)) {
        whereCondition.AND = [...whereCondition.AND, ...searchConditions];
      } else {
        whereCondition.AND = searchConditions;
      }
    }

    const serviceOrderInclude = {
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
          brand: { select: { name: true } },
          model: { select: { name: true } },
          vehicleYear: true,
        },
      },
      mechanic: {
        select: {
          id: true,
          employee: { select: { name: true } },
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
    };

    const [totalRecords, serviceOrders] = await Promise.all([
      this.prisma.wks_ServiceOrder.count({ where: whereCondition }),
      this.prisma.wks_ServiceOrder.findMany({
        where: whereCondition,
        include: serviceOrderInclude,
        orderBy: orderByCondition,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      data: serviceOrders.map((so) => ({
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
      })),
      totalRecords,
    };
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

    // Check if service order is deleted
    if (serviceOrder.isDeleted) {
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
      where: { id, isDeleted: false },
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
      where: { id, isDeleted: false },
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
   * Kirim reminder untuk service order menggunakan sys_Reminder
   */
  async sendReminder(serviceOrderId: string, companyId: string) {
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

    // Generate reminder number
    const reminderNumber = await generateDocumentNumber({
      prisma: this.prisma,
      module_id: 'WKS',
      company_id: companyId,
      branch_id: serviceOrder.branch_id,
      date: new Date(),
      prefix: 'REM', // Reminder prefix
    });

    // Generate reminder ID (max 30 chars)
    const reminderId = (
      companyId +
      'REM' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    )
      .toUpperCase()
      .slice(0, 30);

    // Generate reminder message
    const reminderMessage = this.generateReminderMessage(serviceOrder);

    // Create reminder record
    await this.prisma.sys_Reminder.create({
      data: {
        id: reminderId,
        reminderNumber,
        entityType: ReminderEntityTypeEnum.SERVICE_ORDER,
        entity_id: serviceOrderId,
        reminderType: ReminderTypeEnum.SCHEDULED_SERVICE,
        title: `Reminder Service Order ${serviceOrder.orderNumber}`,
        message: reminderMessage,
        scheduledDate: serviceOrder.scheduledStartDate || new Date(),
        customer_id: serviceOrder.customer_id,
        recipientPhone: customerPhone,
        channels: 'WA', // WhatsApp channel code
        status: ReminderStatusEnum.PENDING,
        company_id: companyId,
        branch_id: serviceOrder.branch_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Kirim via WhatsApp
    const result = await this.wablasService.sendTextMessage(
      customerPhone,
      reminderMessage,
    );

    if (result.status) {
      // Update reminder status dan create log
      const logId = (
        companyId +
        'RML' +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
      )
        .toUpperCase()
        .slice(0, 30);

      await this.prisma.$transaction(async (tx) => {
        await tx.sys_Reminder.update({
          where: {
            company_id_id: {
              company_id: companyId,
              id: reminderId,
            },
          },
          data: {
            status: ReminderStatusEnum.SENT,
            lastSentAt: new Date(),
            sentCount: { increment: 1 },
            updatedAt: new Date(),
          },
        });

        await tx.sys_ReminderLog.create({
          data: {
            id: logId,
            reminder_id: reminderId,
            logType: ReminderLogTypeEnum.SENT,
            channel: ReminderChannelEnum.WHATSAPP,
            sentAt: new Date(),
            message: reminderMessage,
            responseMessage: result.message || 'Success',
            company_id: companyId,
            branch_id: serviceOrder.branch_id,
            createdAt: new Date(),
          },
        });
      });

      return {
        success: true,
        message: 'Reminder berhasil dikirim',
        reminderId,
      };
    } else {
      // Update reminder status failed
      await this.prisma.sys_Reminder.update({
        where: {
          company_id_id: {
            company_id: companyId,
            id: reminderId,
          },
        },
        data: {
          status: ReminderStatusEnum.FAILED,
          lastAttemptAt: new Date(),
          failureReason: result.message || 'Gagal mengirim reminder',
          updatedAt: new Date(),
        },
      });

      throw new BadRequestException(
        result.message || 'Gagal mengirim reminder via WhatsApp',
      );
    }
  }

  /**
   * Generate reminder message text
   */
  private generateReminderMessage(serviceOrder: any): string {
    const {
      orderNumber,
      scheduledStartDate,
      customer,
      vehicle,
      customerComplaint,
      serviceRequest,
    } = serviceOrder;

    let message = `╔══════════════════════════════════╗
║    🔔 REMINDER SERVICE ORDER     ║
╚══════════════════════════════════╝

Halo *${customer?.name || 'Pelanggan'}* 👋

Kami ingin mengingatkan Anda tentang service order:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 No. Order: *${orderNumber}*
🚗 Kendaraan: *${vehicle?.licensePlate || '-'}*`;

    if (scheduledStartDate) {
      const scheduledDate = new Date(scheduledStartDate);
      const dateStr = scheduledDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const timeStr = scheduledDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      message += `\n📅 Jadwal Service: *${dateStr}* pukul *${timeStr}*\n`;
    }

    if (customerComplaint) {
      message += `\n📝 Keluhan:\n${customerComplaint}\n`;
    }

    if (serviceRequest) {
      message += `\n🔧 Service Request:\n${serviceRequest}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mohon datang tepat waktu ya! 🙏

Jika ada perubahan jadwal, silakan hubungi kami.

Terima kasih!

---
🔧 Ngebengkel`;

    return message;
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
