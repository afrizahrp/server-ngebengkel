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
