/**
 * Simple Email Verification Template
 * Designed untuk menghindari spam filters dengan design yang clean dan sederhana
 */

export function getSimpleVerificationTemplate(
  name: string,
  verificationUrl: string,
): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Email - Ngebengkel</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #00b055;">
              <img src="https://ik.imagekit.io/wnhatkskj/logo.webp?updatedAt=1762686364424" alt="Ngebengkel" style="height: 50px; width: auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div style="display: none; color: #045693; font-size: 24px; font-weight: bold;">Ngebengkel</div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 20px;">Halo, ${name}!</h2>
              
              <p style="margin: 0 0 15px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Terima kasih telah mendaftar di Ngebengkel. Untuk melengkapi registrasi Anda, silakan verifikasi email Anda dengan mengklik tombol di bawah ini:
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 40px; background-color: #00b055; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Verifikasi Email</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 10px 0; color: #6B7280; font-size: 14px;">
                Atau copy dan paste link berikut ke browser Anda:
              </p>
              
              <p style="margin: 0; padding: 15px; background-color: #F3F4F6; border-radius: 4px; word-break: break-all; font-size: 13px; color: #4B5563;">
                ${verificationUrl}
              </p>
              
              <p style="margin: 25px 0 0 0; color: #9CA3AF; font-size: 13px; line-height: 1.5;">
                Link verifikasi ini akan kedaluwarsa dalam 1 jam.<br>
                Jika Anda tidak membuat akun di Ngebengkel, silakan abaikan email ini.
              </p>
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
 * Plain text version untuk email clients yang tidak support HTML
 */
export function getSimpleVerificationTextVersion(
  name: string,
  verificationUrl: string,
): string {
  return `
Halo, ${name}!

Terima kasih telah mendaftar di Ngebengkel. 

Untuk melengkapi registrasi Anda, silakan verifikasi email Anda dengan mengklik link berikut:

${verificationUrl}

Link verifikasi ini akan kedaluwarsa dalam 1 jam.

Jika Anda tidak membuat akun di Ngebengkel, silakan abaikan email ini.

---
© ${new Date().getFullYear()} Ngebengkel. All rights reserved.
  `.trim();
}
