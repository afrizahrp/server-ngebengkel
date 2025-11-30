import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { WablasService } from '../../../whatsapp/wablas.service';

@Injectable()
export class UploadNotificationService {
  private readonly logger = new Logger(UploadNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
  ) {}

  /**
   * Format nomor telepon untuk normalisasi
   */
  private normalizePhone(phone: string): string {
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
   * Get owner phone number dari waiting list
   */
  private async getOwnerPhone(waitingListId: string): Promise<string | null> {
    const waitingList = await this.prisma.wks_waitingList.findUnique({
      where: { id: waitingListId },
      select: {
        mobile: true,
        phone: true,
        claimedBy: true,
        preApprovedPhone: true,
        claimStatus: true,
      },
    });

    if (!waitingList) {
      return null;
    }

    // Priority: preApprovedPhone > claimedBy (phone) > mobile > phone
    if (waitingList.preApprovedPhone) {
      return waitingList.preApprovedPhone;
    }

    // Jika claimedBy adalah phone number (bukan user ID)
    if (waitingList.claimedBy && /^[0-9+]+$/.test(waitingList.claimedBy)) {
      return waitingList.claimedBy;
    }

    if (waitingList.mobile) {
      return waitingList.mobile;
    }

    if (waitingList.phone) {
      return waitingList.phone;
    }

    return null;
  }

  /**
   * Generate listing URL untuk workshop
   */
  private getListingUrl(waitingListId: string, slug?: string | null): string {
    const baseUrl = process.env.LISTING_BASE_URL || 'https://listing.ngebengkel.com';
    const identifier = slug || waitingListId;
    return `${baseUrl}/workshop/${identifier}`;
  }

  /**
   * Kirim konfirmasi setelah upload image
   */
  async sendImageUploadConfirmation(waitingListId: string): Promise<void> {
    try {
      const ownerPhone = await this.getOwnerPhone(waitingListId);
      if (!ownerPhone) {
        this.logger.warn(
          `No phone number found for waiting list ${waitingListId}, skipping notification`,
        );
        return;
      }

      // Get waiting list info
      const waitingList = await this.prisma.wks_waitingList.findUnique({
        where: { id: waitingListId },
        select: {
          name: true,
          slug: true,
        },
      });

      if (!waitingList) {
        this.logger.warn(
          `Waiting list ${waitingListId} not found, skipping notification`,
        );
        return;
      }

      // Count images
      const imageCount = await this.prisma.wks_Images.count({
        where: {
          waitingList_id: waitingListId,
          isActive: true,
        },
      });

      // Count videos
      const videoCount = await this.prisma.wks_videos.count({
        where: {
          waitingList_id: waitingListId,
          isActive: true,
        },
      });

      const listingUrl = this.getListingUrl(waitingListId, waitingList.slug);
      const normalizedPhone = this.normalizePhone(ownerPhone);

      const message = `✅ Foto bengkel Anda berhasil diupload!

📸 Total foto: ${imageCount}/5
📹 Video: ${videoCount}/1

Foto sudah tampil di listing:
${listingUrl}

Terima kasih!
Tim Ngebengkel`;

      await this.wablasService.sendTextMessage(normalizedPhone, message);
      this.logger.log(
        `Image upload confirmation sent to ${normalizedPhone} for workshop ${waitingList.name}`,
      );
    } catch (error: any) {
      // Log error tapi jangan throw, karena ini opsional notification
      this.logger.error(
        `Failed to send image upload confirmation for ${waitingListId}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Kirim konfirmasi setelah upload video
   */
  async sendVideoUploadConfirmation(waitingListId: string): Promise<void> {
    try {
      const ownerPhone = await this.getOwnerPhone(waitingListId);
      if (!ownerPhone) {
        this.logger.warn(
          `No phone number found for waiting list ${waitingListId}, skipping notification`,
        );
        return;
      }

      // Get waiting list info
      const waitingList = await this.prisma.wks_waitingList.findUnique({
        where: { id: waitingListId },
        select: {
          name: true,
          slug: true,
        },
      });

      if (!waitingList) {
        this.logger.warn(
          `Waiting list ${waitingListId} not found, skipping notification`,
        );
        return;
      }

      // Count images
      const imageCount = await this.prisma.wks_Images.count({
        where: {
          waitingList_id: waitingListId,
          isActive: true,
        },
      });

      // Count videos
      const videoCount = await this.prisma.wks_videos.count({
        where: {
          waitingList_id: waitingListId,
          isActive: true,
        },
      });

      const listingUrl = this.getListingUrl(waitingListId, waitingList.slug);
      const normalizedPhone = this.normalizePhone(ownerPhone);

      const message = `✅ Video bengkel Anda berhasil diupload!

📹 Video sudah aktif
📸 Foto: ${imageCount}/5

Video sudah tampil di listing:
${listingUrl}

Terima kasih!
Tim Ngebengkel`;

      await this.wablasService.sendTextMessage(normalizedPhone, message);
      this.logger.log(
        `Video upload confirmation sent to ${normalizedPhone} for workshop ${waitingList.name}`,
      );
    } catch (error: any) {
      // Log error tapi jangan throw, karena ini opsional notification
      this.logger.error(
        `Failed to send video upload confirmation for ${waitingListId}: ${error.message}`,
        error.stack,
      );
    }
  }
}









