import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';

// Fonts definition untuk pdfmake (built-in fonts)
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

const printer = new PdfPrinter(fonts);

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
   * Generate PDF Invoice
   */
  async generateInvoicePDF(serviceOrder: any): Promise<Buffer> {
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
      remarks,
    } = serviceOrder;

    const formattedDate = format(new Date(orderDate), 'dd MMMM yyyy', {
      locale: id,
    });
    const formattedTime = format(new Date(orderDate), 'HH:mm', { locale: id });

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        // Header
        {
          text: 'INVOICE SERVICE ORDER',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },
        {
          text: 'Ngebengkel',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 30] as [number, number, number, number],
        },

        // Informasi Order
        {
          text: 'INFORMASI ORDER',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10] as [number, number, number, number],
        },
        {
          columns: [
            {
              width: '*',
              text: [{ text: 'No. Order: ', bold: true }, orderNumber],
            },
            {
              width: '*',
              text: [{ text: 'Tanggal: ', bold: true }, formattedDate],
            },
            {
              width: '*',
              text: [{ text: 'Waktu: ', bold: true }, formattedTime],
            },
          ],
          margin: [0, 0, 0, 15] as [number, number, number, number],
        },

        // Data Customer
        {
          text: 'DATA CUSTOMER',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        {
          columns: [
            {
              width: '*',
              text: [{ text: 'Nama: ', bold: true }, customer?.name || '-'],
            },
            {
              width: '*',
              text: [
                { text: 'No. HP: ', bold: true },
                customer?.mobile1 || '-',
              ],
            },
          ],
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          text: [{ text: 'Email: ', bold: true }, customer?.email || '-'],
          margin: [0, 0, 0, 15] as [number, number, number, number],
        },

        // Data Kendaraan
        {
          text: 'DATA KENDARAAN',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Plat Nomor: ', bold: true },
                vehicle?.licensePlate || '-',
              ],
            },
            {
              width: '*',
              text: [
                { text: 'Merek/Model: ', bold: true },
                `${vehicle?.brand || '-'} ${vehicle?.model || ''}`,
              ],
            },
          ],
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Tahun: ', bold: true },
                vehicle?.year?.toString() || '-',
              ],
            },
            {
              width: '*',
              text: [{ text: 'Warna: ', bold: true }, vehicle?.color || '-'],
            },
          ],
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Detail Service & Part
        {
          text: 'DETAIL SERVICE & PART',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 80, 100],
            body: [
              [
                { text: 'Item', style: 'tableHeader', bold: true },
                { text: 'Qty', style: 'tableHeader', bold: true },
                { text: 'Harga', style: 'tableHeader', bold: true },
                { text: 'Subtotal', style: 'tableHeader', bold: true },
              ],
              ...orderDetails.map((detail: any) => {
                const itemName =
                  detail.serviceName ||
                  detail.partName ||
                  detail.serviceDescription ||
                  'Item';
                const qty = detail.quantity || 1;
                const price = detail.unitPrice || 0;
                const subtotal = detail.subtotal || qty * price;

                return [
                  itemName,
                  qty.toString(),
                  this.formatCurrencyPlain(price),
                  this.formatCurrencyPlain(subtotal),
                ];
              }),
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0),
            vLineWidth: () => 0,
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Ringkasan Pembayaran
        {
          text: 'RINGKASAN PEMBAYARAN',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: 200,
              table: {
                widths: [120, 80],
                body: [
                  [
                    { text: 'Biaya Service:', alignment: 'right' },
                    {
                      text: this.formatCurrencyPlain(serviceCost),
                      alignment: 'right',
                    },
                  ],
                  [
                    { text: 'Biaya Part:', alignment: 'right' },
                    {
                      text: this.formatCurrencyPlain(partsCost),
                      alignment: 'right',
                    },
                  ],
                  [
                    { text: 'Diskon:', alignment: 'right' },
                    {
                      text: this.formatCurrencyPlain(discountAmount),
                      alignment: 'right',
                    },
                  ],
                  [
                    { text: 'Pajak:', alignment: 'right' },
                    {
                      text: this.formatCurrencyPlain(taxAmount),
                      alignment: 'right',
                    },
                  ],
                  [
                    {
                      text: 'TOTAL PEMBAYARAN:',
                      bold: true,
                      alignment: 'right',
                    },
                    {
                      text: this.formatCurrencyPlain(totalAmount),
                      bold: true,
                      alignment: 'right',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Catatan
        ...(remarks
          ? [
              {
                text: 'CATATAN',
                style: 'sectionHeader',
                margin: [0, 10, 0, 10] as [number, number, number, number],
              },
              {
                text: remarks,
                margin: [0, 0, 0, 20] as [number, number, number, number],
              },
            ]
          : []),

        // Footer
        {
          text: 'Terima kasih atas kepercayaan Anda!',
          style: 'footer',
          alignment: 'center',
          margin: [0, 30, 0, 0] as [number, number, number, number],
        },
        {
          text: `Generated: ${format(new Date(), 'dd MMMM yyyy HH:mm', {
            locale: id,
          })}`,
          style: 'footer',
          alignment: 'center',
          fontSize: 8,
          color: '#666',
          margin: [0, 5, 0, 0] as [number, number, number, number],
        },
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#1a1a1a',
        },
        subheader: {
          fontSize: 14,
          color: '#666',
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          color: '#333',
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          fontSize: 10,
          color: '#333',
        },
        footer: {
          fontSize: 10,
          color: '#666',
        },
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 10,
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];

        pdfDoc.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate PDF Struk (format lebih sederhana)
   */
  async generateStrukPDF(serviceOrder: any): Promise<Buffer> {
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

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      content: [
        // Header
        {
          text: 'STRUK SERVICE',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Informasi Order
        {
          text: [{ text: 'No. Order: ', bold: true }, orderNumber],
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          text: [{ text: 'Tanggal: ', bold: true }, formattedDate],
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          text: [{ text: 'Customer: ', bold: true }, customer?.name || '-'],
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        {
          text: [
            { text: 'Kendaraan: ', bold: true },
            vehicle?.licensePlate || '-',
          ],
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Detail Items
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 100],
            body: [
              [
                { text: 'Item', style: 'tableHeader', bold: true },
                { text: 'Qty', style: 'tableHeader', bold: true },
                { text: 'Subtotal', style: 'tableHeader', bold: true },
              ],
              ...orderDetails.map((detail: any) => {
                const itemName =
                  detail.serviceName ||
                  detail.partName ||
                  detail.serviceDescription ||
                  'Item';
                const qty = detail.quantity || 1;
                const price = detail.unitPrice || 0;
                const subtotal = detail.subtotal || qty * price;

                return [
                  itemName,
                  qty.toString(),
                  this.formatCurrencyPlain(subtotal),
                ];
              }),
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0),
            vLineWidth: () => 0,
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Total
        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: 160,
              text: [
                { text: 'TOTAL: ', bold: true, fontSize: 14 },
                {
                  text: this.formatCurrencyPlain(totalAmount),
                  bold: true,
                  fontSize: 14,
                },
              ],
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 30] as [number, number, number, number],
        },

        // Footer
        {
          text: 'Terima kasih!',
          style: 'footer',
          alignment: 'center',
          margin: [0, 20, 0, 0] as [number, number, number, number],
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#1a1a1a',
        },
        tableHeader: {
          fontSize: 9,
          color: '#333',
        },
        footer: {
          fontSize: 10,
          color: '#666',
        },
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 9,
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];

        pdfDoc.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        pdfDoc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Format currency ke Rupiah (untuk text)
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Format currency ke Rupiah (untuk PDF, tanpa symbol)
   */
  private formatCurrencyPlain(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
