import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cms_CreateProductSpecDto } from './dto/cms_CreateProductSpec.dto';
import { Cms_UpdateProductSpecDto } from './dto/cms_UpdateProductSpec.dto';
import { Cms_ProductSpecResponseDto } from './dto/cms_ResponseProductSpec.dto';

@Injectable()
export class cms_ProductSpecService {
  constructor(private prisma: PrismaService) {}

  async create(
    cms_CreateProductSpecDto: Cms_CreateProductSpecDto,
  ): Promise<Cms_ProductSpecResponseDto> {
    const productSpec = await this.prisma.imc_ProductSpec.create({
      data: {
        ...cms_CreateProductSpecDto,
        branch_id: cms_CreateProductSpecDto.branch_id ?? '',
      },
    });
    return productSpec as Cms_ProductSpecResponseDto;
  }

  async findAll(company_id: string): Promise<Cms_ProductSpecResponseDto[]> {
    const products = await this.prisma.imc_ProductSpec.findMany({
      where: { company_id },
    });
    return products as Cms_ProductSpecResponseDto[];
  }

  async findOne(
    company_id: string,
    id: string,
  ): Promise<Cms_ProductSpecResponseDto> {
    try {
      const product = await this.prisma.imc_ProductSpec.findUnique({
        where: { id_company_id: { company_id, id } },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${id} for company ${company_id} not found`,
        );
      }

      return product as Cms_ProductSpecResponseDto;
    } catch (error) {
      // Log error untuk debugging
      console.error(
        `Error fetching product with ID ${id} for company ${company_id}:`,
        error,
      );
      throw error; // Lempar kembali error agar ditangani oleh middleware
    }
  }

  async update(
    id: string,
    company_id: string,
    cms_UpdateProductSpecDto: Cms_UpdateProductSpecDto,
  ): Promise<Cms_ProductSpecResponseDto> {
    // console.log('🔍 [DEBUG] Updating ProductSpec with ID:', id);
    // console.log('🔍 [DEBUG] company_id:', company_id);
    // console.log(
    //   '🔍 [DEBUG] cms_UpdateProductSpecDto:',
    //   JSON.stringify(cms_UpdateProductSpecDto, null, 2),
    // );

    const productSpec = await this.prisma.imc_ProductSpec.findUnique({
      where: { id_company_id: { id, company_id } },
    });
    if (!productSpec) {
      throw new NotFoundException(
        `Product specification with ID ${id} not found`,
      );
    }
    const updateProductSpec = await this.prisma.imc_ProductSpec.update({
      where: { id_company_id: { id, company_id } },
      data: cms_UpdateProductSpecDto,
    });
    return updateProductSpec as Cms_ProductSpecResponseDto;
  }
}
