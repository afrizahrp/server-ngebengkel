/**
 * Two-Factor Authentication OTP Email Template
 * Simple design untuk menghindari spam filters
 */

export function getTwoFactorOtpTemplate(name: string, otpCode: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode Verifikasi - Ngebengkel</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #00b055;">
              <img src="https://res.cloudinary.com/ngebengkel/image/upload/v1760515547/logo_oli2ld.webp" alt="Ngebengkel" style="height: 50px; width: auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div style="display: none; color: #00b055; font-size: 24px; font-weight: bold;">🔒 Ngebengkel</div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 20px;">Halo, ${name}!</h2>
              
              <p style="margin: 0 0 15px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Anda mencoba untuk login ke akun Ngebengkel Anda. Untuk melanjutkan, masukkan kode verifikasi berikut:
              </p>
              
              <!-- OTP Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 25px; background-color: #F3F4F6; border-radius: 8px; border: 2px dashed #D1D5DB;">
                    <div style="font-size: 36px; font-weight: bold; color: #00b055; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otpCode}
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 10px 0; color: #DC2626; font-size: 14px; font-weight: bold;">
                ⚠️ Kode ini akan kedaluwarsa dalam 10 menit
              </p>
              
              <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.5;">
                Jika Anda tidak mencoba untuk login, abaikan email ini dan pastikan akun Anda aman.
              </p>
              
              <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0; color: #9CA3AF; font-size: 13px; line-height: 1.5;">
                  <strong>Tips Keamanan:</strong><br>
                  • Jangan bagikan kode ini kepada siapapun<br>
                  • Tim Ngebengkel tidak akan pernah meminta kode OTP Anda<br>
                  • Jika Anda mencurigai aktivitas tidak biasa, segera ubah password Anda
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                © ${new Date().getFullYear()} Ngebengkel. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Plain text version untuk OTP email
 */
export function getTwoFactorOtpTextVersion(
  name: string,
  otpCode: string,
): string {
  return `
Halo, ${name}!

Anda mencoba untuk login ke akun Ngebengkel Anda.

KODE VERIFIKASI: ${otpCode}

⚠️ Kode ini akan kedaluwarsa dalam 10 menit.

Jika Anda tidak mencoba untuk login, abaikan email ini dan pastikan akun Anda aman.

Tips Keamanan:
• Jangan bagikan kode ini kepada siapapun
• Tim Ngebengkel tidak akan pernah meminta kode OTP Anda
• Jika Anda mencurigai aktivitas tidak biasa, segera ubah password Anda

---
© ${new Date().getFullYear()} Ngebengkel. All rights reserved.
  `.trim();
}
