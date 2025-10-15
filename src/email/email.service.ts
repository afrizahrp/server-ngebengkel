import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import emailConfig from './config/email.config';
import {
  getSimpleVerificationTemplate,
  getSimpleVerificationTextVersion,
} from './templates/simple-verification.template';
import {
  getTwoFactorOtpTemplate,
  getTwoFactorOtpTextVersion,
} from './templates/two-factor-otp.template';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(emailConfig.KEY)
    private emailConfiguration: ConfigType<typeof emailConfig>,
  ) {
    // Create reusable transporter
    this.transporter = nodemailer.createTransport({
      host: this.emailConfiguration.host,
      port: this.emailConfiguration.port,
      secure: this.emailConfiguration.secure,
      auth: this.emailConfiguration.auth,
    });

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        console.error('❌ Error configuring email transporter:', error);
      } else {
        console.log('✅ Email server is ready to send messages');
      }
    });
  }

  /**
   * Kirim email verifikasi ke user
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const verificationUrl = `${this.emailConfiguration.verificationUrl}?token=${token}`;

    const mailOptions = {
      from: `"${this.emailConfiguration.from.name}" <${this.emailConfiguration.from.address}>`,
      to: email,
      subject: 'Konfirmasi Email - Ngebengkel', // Changed: lebih friendly
      text: getSimpleVerificationTextVersion(name, verificationUrl), // Added: plain text version
      html: getSimpleVerificationTemplate(name, verificationUrl), // Using simple template
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

  /**
   * Kirim 2FA OTP code ke user
   */
  async sendTwoFactorOtp(
    email: string,
    name: string,
    otpCode: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.emailConfiguration.from.name}" <${this.emailConfiguration.from.address}>`,
      to: email,
      subject: 'Kode Verifikasi Login - Ngebengkel',
      text: getTwoFactorOtpTextVersion(name, otpCode),
      html: getTwoFactorOtpTemplate(name, otpCode),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ 2FA OTP sent to ${email}`);
    } catch (error) {
      console.error('❌ Error sending 2FA OTP email:', error);
      throw new InternalServerErrorException('Failed to send 2FA OTP email');
    }
  }

  /**
   * Template HTML untuk verification email
   */
  private getVerificationEmailTemplate(
    name: string,
    verificationUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Email</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #667eea;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            margin-bottom: 15px;
            color: #555;
            font-size: 16px;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .verify-button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
          }
          .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          .divider {
            margin: 30px 0;
            border-top: 1px solid #e0e0e0;
          }
          .alternative-link {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            word-break: break-all;
          }
          .alternative-link p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }
          .alternative-link a {
            color: #667eea;
            text-decoration: none;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .warning p {
            margin: 0;
            color: #856404;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔧 Ngebengkel</h1>
          </div>
          
          <div class="content">
            <h2>Halo, ${name}!</h2>
            
            <p>Terima kasih telah mendaftar di <strong>Ngebengkel</strong>. Kami sangat senang Anda bergabung dengan kami!</p>
            
            <p>Untuk melengkapi proses registrasi Anda, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:</p>
            
            <div class="button-container">
              <a href="${verificationUrl}" class="verify-button">
                ✓ Verifikasi Email Saya
              </a>
            </div>
            
            <div class="warning">
              <p>⏱️ Link verifikasi ini akan kedaluwarsa dalam <strong>1 jam</strong>.</p>
            </div>
            
            <div class="divider"></div>
            
            <p><strong>Tidak bisa klik tombol di atas?</strong></p>
            <p>Salin dan tempel link berikut ke browser Anda:</p>
            
            <div class="alternative-link">
              <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #999; font-size: 14px;">
              Jika Anda tidak membuat akun di Ngebengkel, silakan abaikan email ini.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ngebengkel. All rights reserved.</p>
            <p>Email ini dikirim secara otomatis, mohon jangan membalas email ini.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Kirim email reset password (untuk future use)
   */
  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.emailConfiguration.from.name}" <${this.emailConfiguration.from.address}>`,
      to: email,
      subject: 'Reset Password - Ngebengkel',
      html: this.getPasswordResetEmailTemplate(name, resetUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }

  /**
   * Template HTML untuk password reset email
   */
  private getPasswordResetEmailTemplate(
    name: string,
    resetUrl: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #f5576c;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            margin-bottom: 15px;
            color: #555;
            font-size: 16px;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .reset-button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            transition: all 0.3s ease;
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .warning p {
            margin: 0;
            color: #856404;
            font-size: 14px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Password</h1>
          </div>
          
          <div class="content">
            <h2>Halo, ${name}!</h2>
            
            <p>Kami menerima permintaan untuk mereset password akun Anda di Ngebengkel.</p>
            
            <p>Klik tombol di bawah ini untuk mereset password Anda:</p>
            
            <div class="button-container">
              <a href="${resetUrl}" class="reset-button">
                Reset Password
              </a>
            </div>
            
            <div class="warning">
              <p>⏱️ Link reset password ini akan kedaluwarsa dalam <strong>1 jam</strong>.</p>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Jika Anda tidak meminta reset password, silakan abaikan email ini dan password Anda akan tetap aman.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Ngebengkel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
