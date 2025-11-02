import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { WablasService } from '../../../whatsapp/wablas.service';
import { InvoiceGeneratorService } from './invoice-generator.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

@Injectable()
export class ServiceOrderReminderService {
  private readonly logger = new Logger(ServiceOrderReminderService.name);

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
      const reminderTime = new Date(
        now.getTime() + hoursBefore * 60 * 60 * 1000,
      );

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

      this.logger.log(`Found ${upcomingOrders.length} upcoming service orders`);

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
