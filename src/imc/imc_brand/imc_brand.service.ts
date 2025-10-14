import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreateImcBrandDto } from './dto/create-imc-brand.dto';
import { UpdateImcBrandDto } from './dto/update-imc-brand.dto';

@Injectable()
export class ImcBrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImcBrandDto: CreateImcBrandDto) {
    return this.prisma.imc_Brand.create({
      data: createImcBrandDto,
    });
  }

  async findAll(company_id: string) {
    return this.prisma.imc_Brand.findMany({
      where: {
        company_id,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(company_id: string, id: string) {
    const brand = await this.prisma.imc_Brand.findUnique({
      where: {
        company_id_id: { company_id, id },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async update(
    company_id: string,
    id: string,
    updateImcBrandDto: UpdateImcBrandDto,
  ) {
    await this.findOne(company_id, id);

    return this.prisma.imc_Brand.update({
      where: {
        company_id_id: { company_id, id },
      },
      data: updateImcBrandDto,
    });
  }

  async remove(company_id: string, id: string) {
    await this.findOne(company_id, id);

    return this.prisma.imc_Brand.delete({
      where: {
        company_id_id: { company_id, id },
      },
    });
  }
}
