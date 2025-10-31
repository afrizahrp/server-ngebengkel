# Bisakah kamu membaca document saya?
_Exported on 10/31/2025 at 14:35:25 GMT+7 from Cursor (1.7.54)_

---

**User**

Hai, bisakah kamu membaca dan mempelajari document yg sedang saya buka?

---

**Cursor**


Membaca dan mempelajari dokumen yang sedang dibuka.


Saya sudah membaca dan mempelajari dokumen yang Anda buka. Dokumen ini berisi dokumentasi lengkap pembuatan MVP untuk **Service Order** di aplikasi ngeBengkel.

## Ringkasan isi dokumen

### Yang sudah diimplementasikan

1. Backend API (NestJS + Prisma)
   - CRUD Service Order
   - Auto-generate order number (`SO/YYYY/MM/XXXXX`)
   - DTO (Create, Update, Response)
   - Service layer dengan business logic
   - Controller dengan JWT authentication
   - Integrasi dengan Prisma schema

2. Frontend UI (Next.js + shadcn/ui)
   - Halaman daftar service orders dengan tabel
   - Dialog create/edit
   - Status badges dan priority indicators
   - Responsive design dengan dark mode support

3. Booking system
   - Calendar menggunakan `react-day-picker` (alternatif Google Calendar)
   - Time slots (08:00–17:00)
   - Visual booking indicators
   - Dummy data untuk testing

4. Data & tools
   - Seeder dengan customer, vehicle, dan service order dummy
   - React hooks dengan TanStack Query
   - Error handling dan loading states

### Alternatif booking
Dokumen menjelaskan bahwa dipilih `react-day-picker` sebagai alternatif Google Calendar karena:
- Lebih ringan
- Sudah terpasang (bagian dari shadcn/ui)
- Mudah dikustomisasi
- Mendukung aksesibilitas

### File yang dibuat
- Backend: `src/wks/service-order/` (service, controller, module, DTOs)
- Frontend: Halaman, komponen, dan hooks
- Seeder: `prisma/seed-service-order.ts`
- Dokumentasi: `SERVICE_ORDER_MVP_README.md`

Apakah ada bagian spesifik yang ingin Anda diskusikan atau kembangkan lebih lanjut?

---

**User**

Ok masih dalam tahap mvp, bisakah kamu bantu saya untuk menambah 1 fungsi lagi yaitu:

1. Reminder, notif via wa (Wablas)
2. Sending Invoice dan Struk via wa

---

**Cursor**


Memeriksa struktur proyek dan mencari integrasi WhatsApp/Wablas yang sudah ada sebelum menambahkan reminder dan pengiriman invoice/struk via WhatsApp.


Membuat integrasi WhatsApp (Wablas) untuk reminder dan pengiriman invoice/struk. Memulai dengan membuat struktur yang diperlukan.


Membuat modul WhatsApp dengan Wablas untuk reminder dan pengiriman invoice/struk.


```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('wablas', () => ({
  apiUrl: process.env.WABLAS_API_URL || 'https://api.wablas.com/api/v2',
  apiKey: process.env.WABLAS_API_KEY || '',
  senderName: process.env.WABLAS_SENDER_NAME || 'Ngebengkel',
  enabled: process.env.WABLAS_ENABLED === 'true',
}));

```

```typescript
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import wablasConfig from './config/wablas.config';

interface SendMessageParams {
  phone: string;
  message: string;
  imageUrl?: string;
  documentUrl?: string;
  fileName?: string;
}

interface SendMessageResponse {
  status: boolean;
  message?: string;
  data?: any;
}

@Injectable()
export class WablasService {
  private readonly logger = new Logger(WablasService.name);
  private readonly httpClient: AxiosInstance;

  constructor(
    @Inject(wablasConfig.KEY)
    private wablasConfiguration: ConfigType<typeof wablasConfig>,
  ) {
    this.httpClient = axios.create({
      baseURL: this.wablasConfiguration.apiUrl,
      headers: {
        'Authorization': this.wablasConfiguration.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });
  }

  /**
   * Format nomor telepon ke format internasional (62xxxxxxxxxxx)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    // If starts with 62, keep it
    else if (cleaned.startsWith('62')) {
      // Already correct
    }
    // If starts with +62, remove the +
    else if (cleaned.startsWith('+62')) {
      cleaned = cleaned.substring(1);
    }
    // Otherwise, assume it's local number and add 62
    else {
      cleaned = '62' + cleaned;
    }

    return cleaned;
  }

  /**
   * Kirim pesan teks via WhatsApp
   */
  async sendTextMessage(
    phone: string,
    message: string,
  ): Promise<SendMessageResponse> {
    if (!this.wablasConfiguration.enabled) {
      this.logger.warn('Wablas is disabled. Skipping message send.');
      return {
        status: false,
        message: 'Wablas is disabled',
      };
    }

    if (!this.wablasConfiguration.apiKey) {
      this.logger.error('Wablas API key is not configured');
      throw new InternalServerErrorException('Wablas API key is not configured');
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await this.httpClient.post('/send-message', {
        phone: formattedPhone,
        message: message,
      });

      this.logger.log(`✅ WhatsApp message sent to ${formattedPhone}`);
      return {
        status: true,
        message: 'Message sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending WhatsApp message: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to send WhatsApp message: ${error.message}`,
      );
    }
  }

  /**
   * Kirim pesan dengan gambar via WhatsApp
   */
  async sendImageMessage(
    phone: string,
    message: string,
    imageUrl: string,
  ): Promise<SendMessageResponse> {
    if (!this.wablasConfiguration.enabled) {
      this.logger.warn('Wablas is disabled. Skipping image message send.');
      return {
        status: false,
        message: 'Wablas is disabled',
      };
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await this.httpClient.post('/send-image', {
        phone: formattedPhone,
        caption: message,
        image: imageUrl,
      });

      this.logger.log(`✅ WhatsApp image sent to ${formattedPhone}`);
      return {
        status: true,
        message: 'Image sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending WhatsApp image: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to send WhatsApp image: ${error.message}`,
      );
    }
  }

  /**
   * Kirim dokumen (PDF/struk) via WhatsApp
   */
  async sendDocumentMessage(
    phone: string,
    message: string,
    documentUrl: string,
    fileName: string = 'document.pdf',
  ): Promise<SendMessageResponse> {
    if (!this.wablasConfiguration.enabled) {
      this.logger.warn('Wablas is disabled. Skipping document send.');
      return {
        status: false,
        message: 'Wablas is disabled',
      };
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await this.httpClient.post('/send-document', {
        phone: formattedPhone,
        message: message,
        document: documentUrl,
        fileName: fileName,
      });

      this.logger.log(`✅ WhatsApp document sent to ${formattedPhone}`);
      return {
        status: true,
        message: 'Document sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending WhatsApp document: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to send WhatsApp document: ${error.message}`,
      );
    }
  }

  /**
   * Kirim pesan dengan opsi lengkap
   */
  async sendMessage(params: SendMessageParams): Promise<SendMessageResponse> {
    const { phone, message, imageUrl, documentUrl, fileName } = params;

    if (documentUrl) {
      return this.sendDocumentMessage(phone, message, documentUrl, fileName);
    }

    if (imageUrl) {
      return this.sendImageMessage(phone, message, imageUrl);
    }

    return this.sendTextMessage(phone, message);
  }

  /**
   * Check apakah Wablas sudah dikonfigurasi dengan benar
   */
  isConfigured(): boolean {
    return (
      this.wablasConfiguration.enabled &&
      !!this.wablasConfiguration.apiKey &&
      !!this.wablasConfiguration.apiUrl
    );
  }
}

```

```typescript
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

```

```typescript
import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

@Injectable()
export class InvoiceGeneratorService {
  /**
   * Generate invoice text untuk WhatsApp
   */
  generateInvoiceText(serviceOrder: any): string {
    const {
      orderNumber,
      orderDate,
      customer,
      vehicle,
      orderDetails = [],
      serviceCost = 0,
      partsCost = 0,
      discountAmount = 0,
      taxAmount = 0,
      totalAmount = 0,
    } = serviceOrder;

    const formattedDate = format(new Date(orderDate), 'dd MMMM yyyy', {
      locale: id,
    });
    const formattedTime = format(new Date(orderDate), 'HH:mm', { locale: id });

    let invoiceText = `╔══════════════════════════════════╗
║     🔧 INVOICE SERVICE ORDER     ║
╚══════════════════════════════════╝

📋 *INFORMASI ORDER*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 No. Order    : ${orderNumber}
📅 Tanggal      : ${formattedDate}
⏰ Waktu        : ${formattedTime}

👤 *DATA CUSTOMER*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nama           : ${customer?.name || '-'}
No. HP         : ${customer?.mobile1 || '-'}
Email          : ${customer?.email || '-'}

🚗 *DATA KENDARAAN*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plat Nomor     : ${vehicle?.licensePlate || '-'}
Merek/Model    : ${vehicle?.brand || '-'} ${vehicle?.model || ''}
Tahun          : ${vehicle?.year || '-'}
Warna          : ${vehicle?.color || '-'}

📦 *DETAIL SERVICE & PART*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    orderDetails.forEach((detail: any, index: number) => {
      const itemName =
        detail.serviceName ||
        detail.partName ||
        detail.serviceDescription ||
        'Item';
      const qty = detail.quantity || 1;
      const price = detail.unitPrice || 0;
      const subtotal = detail.subtotal || qty * price;

      invoiceText += `${index + 1}. ${itemName}
   Qty: ${qty} x ${this.formatCurrency(price)}
   Subtotal: ${this.formatCurrency(subtotal)}

`;
    });

    invoiceText += `💰 *RINGKASAN PEMBAYARAN*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Biaya Service    : ${this.formatCurrency(serviceCost)}
Biaya Part       : ${this.formatCurrency(partsCost)}
Diskon           : ${this.formatCurrency(discountAmount)}
Pajak            : ${this.formatCurrency(taxAmount)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*TOTAL PEMBAYARAN* : ${this.formatCurrency(totalAmount)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${serviceOrder.remarks ? `📝 *Catatan:*\n${serviceOrder.remarks}\n\n` : ''}Terima kasih atas kepercayaan Anda! 🙏

---
🔧 Ngebengkel
Generated: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id })}`;

    return invoiceText;
  }

  /**
   * Generate struk text untuk WhatsApp (format lebih sederhana)
   */
  generateStrukText(serviceOrder: any): string {
    const {
      orderNumber,
      orderDate,
      customer,
      vehicle,
      orderDetails = [],
      totalAmount = 0,
    } = serviceOrder;

    const formattedDate = format(new Date(orderDate), 'dd/MM/yyyy HH:mm', {
      locale: id,
    });

    let strukText = `╔══════════════════════════════════╗
║        🔧 STRUK SERVICE          ║
╚══════════════════════════════════╝

No. Order: ${orderNumber}
Tanggal  : ${formattedDate}
Customer : ${customer?.name || '-'}
Kendaraan: ${vehicle?.licensePlate || '-'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    orderDetails.forEach((detail: any, index: number) => {
      const itemName =
        detail.serviceName ||
        detail.partName ||
        detail.serviceDescription ||
        'Item';
      const qty = detail.quantity || 1;
      const price = detail.unitPrice || 0;
      const subtotal = detail.subtotal || qty * price;

      strukText += `${index + 1}. ${itemName}
   ${qty}x ${this.formatCurrency(price)} = ${this.formatCurrency(subtotal)}

`;
    });

    strukText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ${this.formatCurrency(totalAmount)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Terima kasih! 🙏`;

    return strukText;
  }

  /**
   * Format currency ke Rupiah
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

```

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { WablasService } from '../../../whatsapp/wablas.service';
import { InvoiceGeneratorService } from './invoice-generator.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
    private readonly invoiceGenerator: InvoiceGeneratorService,
  ) {}

  /**
   * Kirim reminder untuk service order yang akan datang
   */
  async sendServiceOrderReminder(
    serviceOrderId: string,
    companyId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get service order dengan relasi
      const serviceOrder = await this.prisma.wks_ServiceOrder.findUnique({
        where: {
          company_id_id: {
            company_id: companyId,
            id: serviceOrderId,
          },
        },
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
          orderDetails: {
            orderBy: {
              lineNumber: 'asc',
            },
          },
        },
      });

      if (!serviceOrder) {
        throw new Error('Service order not found');
      }

      // Cek apakah customer punya nomor WhatsApp
      const customerPhone = serviceOrder.customer?.mobile1;
      if (!customerPhone) {
        return {
          success: false,
          message: 'Customer tidak memiliki nomor telepon',
        };
      }

      // Generate reminder message
      const reminderMessage = this.generateReminderMessage(serviceOrder);

      // Kirim via WhatsApp
      const result = await this.wablasService.sendTextMessage(
        customerPhone,
        reminderMessage,
      );

      if (result.status) {
        this.logger.log(
          `✅ Reminder sent to ${customerPhone} for order ${serviceOrder.orderNumber}`,
        );
        return {
          success: true,
          message: 'Reminder berhasil dikirim',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Gagal mengirim reminder',
        };
      }
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending reminder: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengirim reminder',
      };
    }
  }

  /**
   * Generate reminder message text
   */
  private generateReminderMessage(serviceOrder: any): string {
    const {
      orderNumber,
      scheduledStartDate,
      scheduledEndDate,
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
🚗 Kendaraan: *${vehicle?.licensePlate || '-'}*
`;

    if (scheduledStartDate) {
      const scheduledDate = format(
        new Date(scheduledStartDate),
        'dd MMMM yyyy',
        { locale: id },
      );
      const scheduledTime = format(new Date(scheduledStartDate), 'HH:mm', {
        locale: id,
      });
      message += `📅 Jadwal Service: *${scheduledDate}* pukul *${scheduledTime}*\n`;
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
   * Kirim reminder untuk service order yang akan datang dalam X jam
   * (untuk scheduled jobs)
   */
  async sendUpcomingServiceReminders(hoursBefore: number = 24): Promise<void> {
    try {
      const now = new Date();
      const reminderTime = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);

      // Cari service order yang scheduledStartDate antara sekarang dan reminderTime
      const upcomingOrders = await this.prisma.wks_ServiceOrder.findMany({
        where: {
          scheduledStartDate: {
            gte: now,
            lte: reminderTime,
          },
          orderStatus: {
            in: ['CONFIRMED', 'IN_PROGRESS'],
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              mobile1: true,
            },
          },
          vehicle: {
            select: {
              licensePlate: true,
            },
        },
        },
      });

      this.logger.log(
        `Found ${upcomingOrders.length} upcoming service orders`,
      );

      for (const order of upcomingOrders) {
        if (order.customer?.mobile1) {
          await this.sendServiceOrderReminder(order.id, order.company_id);
          // Delay sedikit untuk avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Error in sendUpcomingServiceReminders: ${error.message}`,
        error.stack,
      );
    }
  }
}

```

Memperbarui service-order untuk menambahkan fungsi reminder dan invoice:


Memperbarui modul dan menambahkan endpoint baru:


```typescript
import { Module } from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderController } from './service-order.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { WhatsAppModule } from '../../whatsapp/whatsapp.module';
import { ReminderService } from './services/reminder.service';
import { InvoiceGeneratorService } from './services/invoice-generator.service';

@Module({
  imports: [PrismaModule, WhatsAppModule],
  controllers: [ServiceOrderController],
  providers: [
    ServiceOrderService,
    ReminderService,
    InvoiceGeneratorService,
  ],
  exports: [ServiceOrderService],
})
export class ServiceOrderModule {}





```

```typescript
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
}

```

```typescript
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
      throw new BadRequestException(
        'Customer tidak memiliki nomor telepon',
      );
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
}

```

```typescript
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
} from '@nestjs/common';
import { ServiceOrderService } from './service-order.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';
import { BetterJwtAuthGuard } from '../../auth/better-auth/guards/better-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('api/service-orders')
@UseGuards(BetterJwtAuthGuard)
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  @Post()
  create(
    @Body() createServiceOrderDto: CreateServiceOrderDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.serviceOrderService.create({
      ...createServiceOrderDto,
      createdBy: user.userId,
    });
  }

  @Get()
  findAll(
    @Query('company_id') companyId: string,
    @Query('branch_id') branchId?: string,
    @Query('status') status?: string,
    @Query('customer_id') customerId?: string,
  ) {
    return this.serviceOrderService.findAll(companyId, branchId, status, customerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceOrderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceOrderDto: UpdateServiceOrderDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.serviceOrderService.update(id, {
      ...updateServiceOrderDto,
      updatedBy: user.userId,
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
}





```

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { sys_UserModule } from './sys/sys_user/sys_User.module';
import { Sys_UserRoleModule } from './sys/sys_userRole/sys_UserRole.module';
import { Sys_UserCompanyRoleModule } from './sys/sys_userCompanyRole/sys_UserCompanyRole.module';

import { BetterAuthModule } from './auth/better-auth/better-auth.module';
import { PrismaService } from './prisma.service';

import { sys_CompanyModule } from './sys/sys_company/sys_Company.module';
import { sys_BranchModule } from './sys/sys_branch/sys_Branch.module';
import { sys_MenuModule } from './sys/sys_menu/sys_Menu.module';
import { sys_MenuPermissionModule } from './sys/sys_menu_permission/sys_Menu_Permission.module';
import { EmailModule } from './email/email.module';
import { CleanupModule } from './auth/cleanup/cleanup.module';
import { BookingModule } from './wks/booking/booking.module';
import { ServiceOrderModule } from './wks/service-order/service-order.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    BetterAuthModule,
    CleanupModule,
    sys_CompanyModule,
    sys_BranchModule,
    sys_UserModule,
    Sys_UserRoleModule,
    Sys_UserCompanyRoleModule,
    sys_MenuModule,
    sys_MenuPermissionModule,
    BookingModule,
    ServiceOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

```

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { sys_UserModule } from './sys/sys_user/sys_User.module';
import { Sys_UserRoleModule } from './sys/sys_userRole/sys_UserRole.module';
import { Sys_UserCompanyRoleModule } from './sys/sys_userCompanyRole/sys_UserCompanyRole.module';

import { BetterAuthModule } from './auth/better-auth/better-auth.module';
import { PrismaService } from './prisma.service';

import { sys_CompanyModule } from './sys/sys_company/sys_Company.module';
import { sys_BranchModule } from './sys/sys_branch/sys_Branch.module';
import { sys_MenuModule } from './sys/sys_menu/sys_Menu.module';
import { sys_MenuPermissionModule } from './sys/sys_menu_permission/sys_Menu_Permission.module';
import { EmailModule } from './email/email.module';
import { CleanupModule } from './auth/cleanup/cleanup.module';
import { BookingModule } from './wks/booking/booking.module';
import { ServiceOrderModule } from './wks/service-order/service-order.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    WhatsAppModule,
    BetterAuthModule,
    CleanupModule,
    sys_CompanyModule,
    sys_BranchModule,
    sys_UserModule,
    Sys_UserRoleModule,
    Sys_UserCompanyRoleModule,
    sys_MenuModule,
    sys_MenuPermissionModule,
    BookingModule,
    ServiceOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

```

Memperbaiki beberapa masalah dan memeriksa error:


Memperbaiki error formatting:


```typescript
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
}

```

Memperbaiki query di reminder service untuk mendapatkan data vehicle dengan benar:


```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { WablasService } from '../../../whatsapp/wablas.service';
import { InvoiceGeneratorService } from './invoice-generator.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
    private readonly invoiceGenerator: InvoiceGeneratorService,
  ) {}

  /**
   * Kirim reminder untuk service order yang akan datang
   */
  async sendServiceOrderReminder(
    serviceOrderId: string,
    companyId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get service order dengan relasi
      const serviceOrder = await this.prisma.wks_ServiceOrder.findUnique({
        where: {
          company_id_id: {
            company_id: companyId,
            id: serviceOrderId,
          },
        },
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
              color: true,
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
        throw new Error('Service order not found');
      }

      // Cek apakah customer punya nomor WhatsApp
      const customerPhone = serviceOrder.customer?.mobile1;
      if (!customerPhone) {
        return {
          success: false,
          message: 'Customer tidak memiliki nomor telepon',
        };
      }

      // Generate reminder message
      const reminderMessage = this.generateReminderMessage(serviceOrder);

      // Kirim via WhatsApp
      const result = await this.wablasService.sendTextMessage(
        customerPhone,
        reminderMessage,
      );

      if (result.status) {
        this.logger.log(
          `✅ Reminder sent to ${customerPhone} for order ${serviceOrder.orderNumber}`,
        );
        return {
          success: true,
          message: 'Reminder berhasil dikirim',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Gagal mengirim reminder',
        };
      }
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending reminder: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengirim reminder',
      };
    }
  }

  /**
   * Generate reminder message text
   */
  private generateReminderMessage(serviceOrder: any): string {
    const {
      orderNumber,
      scheduledStartDate,
      scheduledEndDate,
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
🚗 Kendaraan: *${vehicle?.licensePlate || '-'}*
`;

    if (scheduledStartDate) {
      const scheduledDate = format(
        new Date(scheduledStartDate),
        'dd MMMM yyyy',
        { locale: id },
      );
      const scheduledTime = format(new Date(scheduledStartDate), 'HH:mm', {
        locale: id,
      });
      message += `📅 Jadwal Service: *${scheduledDate}* pukul *${scheduledTime}*\n`;
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
   * Kirim reminder untuk service order yang akan datang dalam X jam
   * (untuk scheduled jobs)
   */
  async sendUpcomingServiceReminders(hoursBefore: number = 24): Promise<void> {
    try {
      const now = new Date();
      const reminderTime = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);

      // Cari service order yang scheduledStartDate antara sekarang dan reminderTime
      const upcomingOrders = await this.prisma.wks_ServiceOrder.findMany({
        where: {
          scheduledStartDate: {
            gte: now,
            lte: reminderTime,
          },
          orderStatus: {
            in: ['CONFIRMED', 'IN_PROGRESS'],
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              mobile1: true,
            },
          },
          vehicle: {
            select: {
              licensePlate: true,
            },
        },
        },
      });

      this.logger.log(
        `Found ${upcomingOrders.length} upcoming service orders`,
      );

      for (const order of upcomingOrders) {
        if (order.customer?.mobile1) {
          await this.sendServiceOrderReminder(order.id, order.company_id);
          // Delay sedikit untuk avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Error in sendUpcomingServiceReminders: ${error.message}`,
        error.stack,
      );
    }
  }
}


```

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { WablasService } from '../../../whatsapp/wablas.service';
import { InvoiceGeneratorService } from './invoice-generator.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
    private readonly invoiceGenerator: InvoiceGeneratorService,
  ) {}

  /**
   * Kirim reminder untuk service order yang akan datang
   */
  async sendServiceOrderReminder(
    serviceOrderId: string,
    companyId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get service order dengan relasi
      const serviceOrder = await this.prisma.wks_ServiceOrder.findUnique({
        where: {
          company_id_id: {
            company_id: companyId,
            id: serviceOrderId,
          },
        },
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
              color: true,
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
        throw new Error('Service order not found');
      }

      // Cek apakah customer punya nomor WhatsApp
      const customerPhone = serviceOrder.customer?.mobile1;
      if (!customerPhone) {
        return {
          success: false,
          message: 'Customer tidak memiliki nomor telepon',
        };
      }

      // Generate reminder message
      const reminderMessage = this.generateReminderMessage(serviceOrder);

      // Kirim via WhatsApp
      const result = await this.wablasService.sendTextMessage(
        customerPhone,
        reminderMessage,
      );

      if (result.status) {
        this.logger.log(
          `✅ Reminder sent to ${customerPhone} for order ${serviceOrder.orderNumber}`,
        );
        return {
          success: true,
          message: 'Reminder berhasil dikirim',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Gagal mengirim reminder',
        };
      }
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending reminder: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengirim reminder',
      };
    }
  }

  /**
   * Generate reminder message text
   */
  private generateReminderMessage(serviceOrder: any): string {
    const {
      orderNumber,
      scheduledStartDate,
      scheduledEndDate,
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
🚗 Kendaraan: *${vehicle?.licensePlate || '-'}*
`;

    if (scheduledStartDate) {
      const scheduledDate = format(
        new Date(scheduledStartDate),
        'dd MMMM yyyy',
        { locale: id },
      );
      const scheduledTime = format(new Date(scheduledStartDate), 'HH:mm', {
        locale: id,
      });
      message += `📅 Jadwal Service: *${scheduledDate}* pukul *${scheduledTime}*\n`;
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
   * Kirim reminder untuk service order yang akan datang dalam X jam
   * (untuk scheduled jobs)
   */
  async sendUpcomingServiceReminders(hoursBefore: number = 24): Promise<void> {
    try {
      const now = new Date();
      const reminderTime = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);

      // Cari service order yang scheduledStartDate antara sekarang dan reminderTime
      const upcomingOrders = await this.prisma.wks_ServiceOrder.findMany({
        where: {
          scheduledStartDate: {
            gte: now,
            lte: reminderTime,
          },
          orderStatus: {
            in: ['CONFIRMED', 'IN_PROGRESS'],
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              mobile1: true,
            },
          },
          vehicle: {
            select: {
              licensePlate: true,
            },
          },
        },
      });

      this.logger.log(
        `Found ${upcomingOrders.length} upcoming service orders`,
      );

      for (const order of upcomingOrders) {
        if (order.customer?.mobile1) {
          await this.sendServiceOrderReminder(order.id, order.company_id);
          // Delay sedikit untuk avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Error in sendUpcomingServiceReminders: ${error.message}`,
        error.stack,
      );
    }
  }
}


```

Membuat dokumentasi penggunaan fitur baru:


```markdown
# 📱 WhatsApp Integration dengan Wablas - Setup Guide

## 📋 Overview

Fitur integrasi WhatsApp menggunakan **Wablas API** untuk:
1. ✅ **Reminder Notification** - Kirim reminder untuk service order yang akan datang
2. ✅ **Invoice & Struk** - Kirim invoice dan struk via WhatsApp

## 🚀 Setup

### 1. Daftar Wablas Account

1. Kunjungi [https://www.wablas.com](https://www.wablas.com)
2. Daftar akun dan pilih paket yang sesuai
3. Dapatkan **API Key** dari dashboard Wablas

### 2. Konfigurasi Environment Variables

Tambahkan ke file `.env`:

```env
# Wablas Configuration
WABLAS_API_URL=https://api.wablas.com/api/v2
WABLAS_API_KEY=your_wablas_api_key_here
WABLAS_SENDER_NAME=Ngebengkel
WABLAS_ENABLED=true
```

### 3. Cara Menggunakan

#### A. Kirim Reminder Service Order

**Endpoint:**
```
POST /api/service-orders/:id/send-reminder?company_id=XXX
```

**Contoh Request:**
```bash
curl -X POST "http://localhost:8000/api/service-orders/SO001/send-reminder?company_id=COMP01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Reminder berhasil dikirim"
}
```

#### B. Kirim Invoice via WhatsApp

**Endpoint:**
```
POST /api/service-orders/:id/send-invoice?company_id=XXX&type=invoice
```

**Query Parameters:**
- `company_id` (required) - Company ID
- `type` (optional) - `invoice` atau `struk` (default: `invoice`)

**Contoh Request:**
```bash
# Kirim Invoice
curl -X POST "http://localhost:8000/api/service-orders/SO001/send-invoice?company_id=COMP01&type=invoice" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Kirim Struk
curl -X POST "http://localhost:8000/api/service-orders/SO001/send-invoice?company_id=COMP01&type=struk" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice berhasil dikirim via WhatsApp",
  "phone": "6281234567890"
}
```

## 📱 Format Pesan

### Reminder Message Format

```
╔══════════════════════════════════╗
║    🔔 REMINDER SERVICE ORDER     ║
╚══════════════════════════════════╝

Halo *Nama Customer* 👋

Kami ingin mengingatkan Anda tentang service order:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 No. Order: *SO/2025/10/00001*
🚗 Kendaraan: *B 1234 XYZ*
📅 Jadwal Service: *15 Januari 2025* pukul *10:00*

📝 Keluhan:
Mesin agak kasar, rem bunyi

🔧 Service Request:
Perlu ganti oli dan kampas rem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mohon datang tepat waktu ya! 🙏

Jika ada perubahan jadwal, silakan hubungi kami.

Terima kasih!

---
🔧 Ngebengkel
```

### Invoice Format

Invoice dikirim dalam format text yang sudah diformat dengan baik, termasuk:
- Informasi order (nomor, tanggal, waktu)
- Data customer
- Data kendaraan
- Detail service & part
- Ringkasan pembayaran

### Struk Format

Struk adalah versi sederhana dari invoice, cocok untuk pengiriman cepat.

## 🔧 Technical Details

### File Structure

```
src/
├── whatsapp/
│   ├── config/
│   │   └── wablas.config.ts       # Config untuk Wablas
│   ├── wablas.service.ts          # Service untuk API Wablas
│   └── whatsapp.module.ts         # WhatsApp Module
└── wks/
    └── service-order/
        ├── services/
        │   ├── reminder.service.ts           # Reminder service
        │   └── invoice-generator.service.ts   # Invoice generator
        └── service-order.service.ts          # Updated dengan fungsi WA
```

### Services

#### WablasService
- `sendTextMessage(phone, message)` - Kirim pesan teks
- `sendImageMessage(phone, message, imageUrl)` - Kirim gambar
- `sendDocumentMessage(phone, message, documentUrl, fileName)` - Kirim dokumen
- `formatPhoneNumber(phone)` - Format nomor ke format internasional (62xxx)

#### ReminderService
- `sendServiceOrderReminder(serviceOrderId, companyId)` - Kirim reminder
- `sendUpcomingServiceReminders(hoursBefore)` - Kirim reminder untuk semua order yang akan datang

#### InvoiceGeneratorService
- `generateInvoiceText(serviceOrder)` - Generate invoice text
- `generateStrukText(serviceOrder)` - Generate struk text

## 📞 Format Nomor Telepon

Service ini otomatis memformat nomor telepon ke format internasional:
- `081234567890` → `6281234567890`
- `+6281234567890` → `6281234567890`
- `81234567890` → `6281234567890`

## ⚠️ Important Notes

1. **Wablas API Key**: Pastikan API key valid dan aktif
2. **Phone Number**: Customer harus memiliki nomor telepon (`mobile1`) di database
3. **Rate Limiting**: Wablas memiliki rate limit, gunakan delay jika mengirim banyak pesan
4. **Disabled Mode**: Set `WABLAS_ENABLED=false` untuk disable (untuk development)

## 🧪 Testing

### Test dengan Dummy Data

1. Pastikan service order sudah dibuat dengan customer yang punya nomor telepon
2. Test kirim reminder:
```bash
POST /api/service-orders/{orderId}/send-reminder?company_id={companyId}
```
3. Test kirim invoice:
```bash
POST /api/service-orders/{orderId}/send-invoice?company_id={companyId}&type=invoice
```

### Error Handling

Service akan return error jika:
- Wablas tidak dikonfigurasi dengan benar
- Customer tidak memiliki nomor telepon
- Service order tidak ditemukan
- API Wablas mengembalikan error

## 🔐 Security

- ✅ Semua endpoint protected dengan JWT authentication
- ✅ API key disimpan di environment variables
- ✅ Validasi nomor telepon
- ✅ Error logging untuk debugging

## 📊 Scheduled Reminders (Future Enhancement)

Untuk mengirim reminder otomatis, bisa menggunakan NestJS Schedule:

```typescript
@Cron('0 9 * * *') // Setiap hari jam 9 pagi
async sendDailyReminders() {
  await this.reminderService.sendUpcomingServiceReminders(24);
}
```

## 🐛 Troubleshooting

### Error: "Wablas API key is not configured"
- Pastikan `WABLAS_API_KEY` sudah di-set di `.env`
- Restart server setelah update `.env`

### Error: "Customer tidak memiliki nomor telepon"
- Pastikan customer memiliki field `mobile1` yang terisi
- Update customer data jika perlu

### Error: "Failed to send WhatsApp message"
- Cek koneksi internet
- Verifikasi API key masih valid
- Cek dashboard Wablas untuk status akun

## 📚 Resources

- [Wablas Documentation](https://doc.wablas.com)
- [Wablas Dashboard](https://www.wablas.com/dashboard)
- [NestJS Documentation](https://docs.nestjs.com)

---

**Last Updated**: 2025-01-31
**Version**: 1.0.0-MVP

```

```typescript
import { IsEnum, IsOptional } from 'class-validator';

export enum InvoiceType {
  INVOICE = 'invoice',
  STRUK = 'struk',
}

export class SendInvoiceDto {
  @IsEnum(InvoiceType)
  @IsOptional()
  type?: InvoiceType = InvoiceType.INVOICE;
}

```

Ringkasan implementasi:

## Yang sudah dibuat

### 1. WhatsApp/Wablas integration
- **WablasService** (`src/whatsapp/wablas.service.ts`)
  - Kirim pesan teks
  - Kirim gambar
  - Kirim dokumen (PDF/struk)
  - Format nomor telepon otomatis ke format internasional (62xxx)

- **Config** (`src/whatsapp/config/wablas.config.ts`)
  - Environment variables untuk API key, URL, dll

### 2. Reminder service
- **ReminderService** (`src/wks/service-order/services/reminder.service.ts`)
  - Kirim reminder untuk service order yang akan datang
  - Generate pesan reminder otomatis
  - Support scheduled reminders (untuk future enhancement)

### 3. Invoice generator
- **InvoiceGeneratorService** (`src/wks/service-order/services/invoice-generator.service.ts`)
  - Generate invoice text untuk WhatsApp
  - Generate struk text (format sederhana)
  - Format currency Rupiah otomatis

### 4. API endpoints baru
- `POST /api/service-orders/:id/send-reminder?company_id=XXX`
  - Kirim reminder untuk service order tertentu

- `POST /api/service-orders/:id/send-invoice?company_id=XXX&type=invoice|struk`
  - Kirim invoice atau struk via WhatsApp

### 5. Dokumentasi
- **WHATSAPP_WABLAS_SETUP.md** - Setup guide lengkap

## Setup yang diperlukan

Tambahkan ke file `.env`:

```env
# Wablas Configuration
WABLAS_API_URL=https://api.wablas.com/api/v2
WABLAS_API_KEY=your_wablas_api_key_here
WABLAS_SENDER_NAME=Ngebengkel
WABLAS_ENABLED=true
```

## Cara menggunakan

### 1. Setup Wablas
- Daftar di [wablas.com](https://www.wablas.com)
- Dapatkan API key
- Masukkan ke `.env`

### 2. Test kirim reminder
```bash
POST /api/service-orders/{orderId}/send-reminder?company_id={companyId}
```

### 3. Test kirim invoice
```bash
POST /api/service-orders/{orderId}/send-invoice?company_id={companyId}&type=invoice
```

## Fitur

- Auto-format nomor telepon (0812xxx → 62812xxx)
- Format invoice/struk rapi dengan emoji
- Error handling dan logging
- Support untuk invoice dan struk
- Reminder message dengan detail lengkap

## Catatan penting

1. Customer harus punya nomor telepon (`mobile1`) di database
2. Set `WABLAS_ENABLED=false` untuk disable (development)
3. Semua endpoint protected dengan JWT authentication

Semua file sudah dibuat dan tidak ada error lint. Siap digunakan setelah setup Wablas API key. Perlu penjelasan lebih detail atau ada yang perlu ditambahkan?

```dotenv
# Wablas Configuration
WABLAS_API_URL=https://api.wablas.com/api/v2
WABLAS_API_KEY=your_wablas_api_key_here
WABLAS_SENDER_NAME=Ngebengkel
WABLAS_ENABLED=true
```

```shellscript
POST /api/service-orders/{orderId}/send-reminder?company_id={companyId}
```

```shellscript
POST /api/service-orders/{orderId}/send-invoice?company_id={companyId}&type=invoice
```

