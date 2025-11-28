import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '../../../prisma.service';
import { WablasService } from '../../../whatsapp/wablas.service';
import { init } from '@paralleldrive/cuid2';
import * as crypto from 'crypto';
import claimConfig from '../config/claim.config';

const createClaimRequestId = init({ length: 21 });

interface InitiateClaimParams {
  waitingListId: string;
  phone: string;
  name: string;
  email?: string;
}

interface VerifyClaimParams {
  waitingListId: string;
  claimRequestId: string;
  verificationCode: string;
}

@Injectable()
export class ClaimService {
  private readonly logger = new Logger(ClaimService.name);
  private readonly otpExpirySeconds: number;
  private readonly otpLength: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
    @Inject(claimConfig.KEY)
    private claimConfiguration: ConfigType<typeof claimConfig>,
  ) {
    this.otpExpirySeconds = this.claimConfiguration.otpExpirySeconds;
    this.otpLength = this.claimConfiguration.otpLength;
  }

  /**
   * Generate OTP dengan panjang sesuai config
   */
  private generateOtp(): string {
    const min = Math.pow(10, this.otpLength - 1);
    const max = Math.pow(10, this.otpLength) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  /**
   * Hash OTP menggunakan SHA-256
   */
  private hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Verify OTP dengan hash comparison
   */
  private verifyOtp(otp: string, hashedOtp: string): boolean {
    const hashed = this.hashOtp(otp);
    return hashed === hashedOtp;
  }

  /**
   * Normalize phone number to international format (62xxxxxxxxxxx)
   * Max length: 20 characters (database constraint)
   */
  private normalizePhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (cleaned.startsWith('+62')) {
      cleaned = cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }

    // Ensure max length 20 characters (database constraint)
    if (cleaned.length > 20) {
      cleaned = cleaned.substring(0, 20);
    }

    return cleaned;
  }

  /**
   * Initiate claim process: Generate OTP, save to DB, send via WhatsApp
   */
  async initiateClaim(params: InitiateClaimParams): Promise<{
    claimRequestId: string;
    message: string;
  }> {
    const { waitingListId, phone, name, email } = params;
    const trimmedId = waitingListId.trim();

    if (!trimmedId) {
      throw new BadRequestException('ID waiting list wajib diisi');
    }

    if (!phone || !name) {
      throw new BadRequestException('Nomor telepon dan nama wajib diisi');
    }

    // Cek waiting list exists
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: trimmedId, isDeleted: false },
      select: {
        id: true,
        name: true,
        claimStatus: true,
      },
    });

    if (!waitingList) {
      throw new NotFoundException('Data waiting list tidak ditemukan');
    }

    // Cek apakah sudah diklaim
    if (waitingList.claimStatus === 'CLAIMED') {
      throw new BadRequestException('Bengkel ini sudah diklaim');
    }

    // Normalize phone (max 20 chars)
    const normalizedPhone = this.normalizePhone(phone);

    if (normalizedPhone.length > 20) {
      throw new BadRequestException(
        'Nomor telepon terlalu panjang. Maksimal 20 karakter.',
      );
    }

    // Generate OTP
    const otp = this.generateOtp();
    const hashedOtp = this.hashOtp(otp);

    // Calculate expiry
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + this.otpExpirySeconds);

    // Generate claim request ID
    let claimRequestId: string;
    for (let attempt = 0; attempt < 5; attempt++) {
      claimRequestId = createClaimRequestId();
      const exists = await this.prisma.wks_ClaimRequest.findUnique({
        where: { id: claimRequestId },
        select: { id: true },
      });
      if (!exists) break;
    }

    if (!claimRequestId!) {
      throw new InternalServerErrorException(
        'Gagal menghasilkan ID claim request',
      );
    }

    // Save claim request
    await this.prisma.wks_ClaimRequest.create({
      data: {
        id: claimRequestId,
        waitingList_id: trimmedId,
        phone: normalizedPhone,
        email: email || null,
        name: name,
        verificationCode: hashedOtp,
        verificationCodeExpiresAt: expiresAt,
        status: 'PENDING',
      },
    });

    // Update waiting list status to PENDING_VERIFICATION
    await this.prisma.wks_waitingList.update({
      where: { id: trimmedId },
      data: {
        claimStatus: 'PENDING_VERIFICATION',
        updatedBy: 'website',
      },
    });

    // Send OTP via WhatsApp
    try {
      const message = this.buildOtpMessage(name, waitingList.name, otp);
      await this.wablasService.sendTextMessage(normalizedPhone, message);
      this.logger.log(
        `✅ OTP sent to ${normalizedPhone} for claim request ${claimRequestId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `❌ Failed to send OTP via WhatsApp: ${error.message}`,
        error.stack,
      );
      // Don't throw error, just log - user can resend OTP later
    }

    return {
      claimRequestId,
      message: 'Kode verifikasi telah dikirim ke WhatsApp Anda',
    };
  }

  /**
   * Verify OTP and complete claim
   */
  async verifyClaim(params: VerifyClaimParams): Promise<{
    message: string;
    waitingListId: string;
  }> {
    const { waitingListId, claimRequestId, verificationCode } = params;

    // Find claim request
    const claimRequest = await this.prisma.wks_ClaimRequest.findFirst({
      where: {
        id: claimRequestId,
        waitingList_id: waitingListId.trim(),
        status: 'PENDING',
      },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        verificationCode: true,
        verificationCodeExpiresAt: true,
        waitingList_id: true,
      },
    });

    if (!claimRequest) {
      throw new NotFoundException(
        'Request klaim tidak ditemukan atau sudah diverifikasi',
      );
    }

    // Check expiry
    if (new Date() > claimRequest.verificationCodeExpiresAt) {
      throw new BadRequestException('Kode verifikasi sudah expired');
    }

    // Verify OTP
    if (!this.verifyOtp(verificationCode, claimRequest.verificationCode)) {
      throw new BadRequestException('Kode verifikasi tidak valid');
    }

    // Update claim request
    await this.prisma.wks_ClaimRequest.update({
      where: { id: claimRequestId },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });

    // Update waiting list
    const updated = await this.prisma.wks_waitingList.update({
      where: { id: waitingListId.trim() },
      data: {
        claimStatus: 'CLAIMED',
        claimedBy: claimRequest.phone,
        claimedAt: new Date(),
        preApprovedPhone: claimRequest.phone,
        preApprovedName: claimRequest.name,
        preApprovedAt: new Date(),
        updatedBy: 'website',
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Send success notification via WhatsApp
    try {
      const successMessage = this.buildSuccessMessage(
        claimRequest.name,
        updated.name,
      );
      await this.wablasService.sendTextMessage(
        claimRequest.phone,
        successMessage,
      );
      this.logger.log(
        `✅ Claim verified successfully for ${updated.name} by ${claimRequest.phone}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to send success notification: ${error.message}`,
      );
      // Don't throw, claim is already successful
    }

    return {
      message: 'Verifikasi berhasil! Bengkel Anda sudah diklaim',
      waitingListId: updated.id,
    };
  }

  /**
   * Resend OTP
   */
  async resendOtp(claimRequestId: string): Promise<{
    message: string;
  }> {
    const claimRequest = await this.prisma.wks_ClaimRequest.findFirst({
      where: {
        id: claimRequestId,
        status: 'PENDING',
      },
      select: {
        id: true,
        phone: true,
        name: true,
        waitingList_id: true,
      },
    });

    if (!claimRequest) {
      throw new NotFoundException(
        'Request klaim tidak ditemukan atau sudah diverifikasi',
      );
    }

    // Get waiting list name
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: claimRequest.waitingList_id },
      select: { name: true },
    });

    if (!waitingList) {
      throw new NotFoundException('Waiting list tidak ditemukan');
    }

    // Generate new OTP
    const otp = this.generateOtp();
    const hashedOtp = this.hashOtp(otp);

    // Calculate new expiry
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + this.otpExpirySeconds);

    // Update claim request with new OTP
    await this.prisma.wks_ClaimRequest.update({
      where: { id: claimRequestId },
      data: {
        verificationCode: hashedOtp,
        verificationCodeExpiresAt: expiresAt,
      },
    });

    // Send new OTP via WhatsApp
    try {
      const message = this.buildOtpMessage(
        claimRequest.name,
        waitingList.name,
        otp,
      );
      await this.wablasService.sendTextMessage(claimRequest.phone, message);
      this.logger.log(`✅ OTP resent to ${claimRequest.phone}`);
    } catch (error: any) {
      this.logger.error(
        `❌ Failed to resend OTP: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Gagal mengirim ulang kode verifikasi',
      );
    }

    return {
      message: 'Kode verifikasi baru telah dikirim ke WhatsApp Anda',
    };
  }

  /**
   * Build OTP message template
   */
  private buildOtpMessage(
    name: string,
    workshopName: string,
    otp: string,
  ): string {
    const expiryMinutes = Math.floor(this.otpExpirySeconds / 60);
    const expirySeconds = this.otpExpirySeconds % 60;
    let expiryText = '';
    if (expiryMinutes > 0 && expirySeconds > 0) {
      expiryText = `${expiryMinutes} menit ${expirySeconds} detik`;
    } else if (expiryMinutes > 0) {
      expiryText = `${expiryMinutes} menit`;
    } else {
      expiryText = `${expirySeconds} detik`;
    }

    return `Halo ${name}!

Anda telah mengklaim bengkel "${workshopName}".

Kode verifikasi Anda: *${otp}*

Kode ini berlaku selama ${expiryText}.

Jika Anda tidak meminta ini, abaikan pesan ini.

Terima kasih,
Tim Ngebengkel`;
  }

  /**
   * Build success message template
   */
  private buildSuccessMessage(name: string, workshopName: string): string {
    return `Selamat ${name}!

Klaim bengkel "${workshopName}" berhasil!

Sekarang Anda dapat:
✅ Menambahkan foto/video bengkel
✅ Membuat promo
✅ Mengupdate informasi bengkel

📩 Silakan kirim foto, detail informasi, permintaan ubah data,
atau jika diinginkan, permintaan hapus listing Anda,
langsung melalui WhatsApp ini.

Terima kasih,
Tim ngebengkel.com`;
  }
}
