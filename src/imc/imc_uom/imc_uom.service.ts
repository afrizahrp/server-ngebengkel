import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateImcUomDto } from './dto/create-imc-uom.dto';
import { UpdateImcUomDto } from './dto/update-imc-uom.dto';

@Injectable()
export class ImcUomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImcUomDto: CreateImcUomDto) {
    return this.prisma.imc_Uom.create({
      data: createImcUomDto,
    });
  }

  async findAll(company_id: string) {
    return this.prisma.imc_Uom.findMany({
      where: {
        company_id,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(company_id: string, id: string) {
    const uom = await this.prisma.imc_Uom.findUnique({
      where: {
        company_id_id: { company_id, id },
      },
    });

    if (!uom) {
      throw new NotFoundException(`UOM with ID ${id} not found`);
    }

    return uom;
  }

  async update(
    company_id: string,
    id: string,
    updateImcUomDto: UpdateImcUomDto,
  ) {
    await this.findOne(company_id, id);

    return this.prisma.imc_Uom.update({
      where: {
        company_id_id: { company_id, id },
      },
      data: updateImcUomDto,
    });
  }

  async remove(company_id: string, id: string) {
    await this.findOne(company_id, id);

    return this.prisma.imc_Uom.delete({
      where: {
        company_id_id: { company_id, id },
      },
    });
  }
}
