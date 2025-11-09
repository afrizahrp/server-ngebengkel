export function getWaitingListThankYouTemplate(
  name: string,
  categoryName?: string | null,
  workshopTypeNames: string[] = [],
): string {
  const hasWorkshopTypes = workshopTypeNames.length > 0;

  const workshopTypeListHtml = hasWorkshopTypes
    ? `
              <p style="margin: 20px 0 10px 0; color: #4B5563; font-size: 15px;">
                Jenis bengkel yang kamu pilih:
              </p>
              <ul style="margin: 0; padding: 0 0 0 18px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                ${workshopTypeNames
                  .map(
                    (typeName) =>
                      `<li style="margin-bottom: 6px; list-style: circle;">${typeName}</li>`,
                  )
                  .join('')}
              </ul>`
    : '';

  const categoryHtml = categoryName
    ? `
              <p style="margin: 0 0 15px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Kami mencatat kebutuhan bengkelmu dalam kategori <strong>${categoryName}</strong>.
              </p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terima Kasih - Waiting List Ngebengkel</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #045693;">
              <img src="https://ik.imagekit.io/wnhatkskj/logo.webp?updatedAt=1762686364424" alt="Ngebengkel" style="height: 50px; width: auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div style="display: none; color: #045693; font-size: 24px; font-weight: bold;">Ngebengkel</div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 20px;">Halo, ${name}!</h2>
              
              <p style="margin: 0 0 15px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Terima kasih sudah bergabung dalam waiting list program kemitraan Ngebengkel. Tim kami akan menghubungi kamu segera setelah slot terbaru tersedia.
              </p>
              ${categoryHtml}
              ${workshopTypeListHtml}
              <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                Jangan ragu untuk membalas email ini jika ada pertanyaan tambahan. Kami siap membantu kebutuhan bengkelmu!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 13px;">
                Ikuti perkembangan terbaru Ngebengkel di media sosial kami.
              </p>
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

export function getWaitingListThankYouTextVersion(
  name: string,
  categoryName?: string | null,
  workshopTypeNames: string[] = [],
): string {
  const lines: string[] = [
    `Halo, ${name}!`,
    '',
    'Terima kasih sudah bergabung dalam waiting list program kemitraan Ngebengkel.',
    'Kami akan segera menghubungi kamu setelah slot terbaru tersedia.',
  ];

  if (categoryName) {
    lines.push(
      '',
      `Kategori bengkel yang kamu pilih: ${categoryName}`,
    );
  }

  if (workshopTypeNames.length > 0) {
    lines.push(
      '',
      'Jenis bengkel yang kamu minati:',
      ...workshopTypeNames.map((typeName) => `- ${typeName}`),
    );
  }

  lines.push(
    '',
    'Jika ada pertanyaan, balas saja email ini ya.',
    '',
    `© ${new Date().getFullYear()} Ngebengkel. All rights reserved.`,
  );

  return lines.join('\n');
}

