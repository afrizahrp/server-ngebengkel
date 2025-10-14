import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateImcSubCategoryDto } from './dto/create-imc-subcategory.dto';
import { UpdateImcSubCategoryDto } from './dto/update-imc-subcategory.dto';

@Injectable()
export class ImcSubCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImcSubCategoryDto: CreateImcSubCategoryDto) {
    return this.prisma.imc_SubCategory.create({
      data: createImcSubCategoryDto,
      include: {
        category: true,
      },
    });
  }

  async findAll(company_id: string) {
    return this.prisma.imc_SubCategory.findMany({
      where: {
        company_id,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByCategory(company_id: string, category_id: string) {
    return this.prisma.imc_SubCategory.findMany({
      where: {
        company_id,
        category_id,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(company_id: string, category_id: string, id: string) {
    const subCategory = await this.prisma.imc_SubCategory.findUnique({
      where: {
        company_id_category_id_id: {
          company_id,
          category_id,
          id,
        },
      },
      include: {
        category: true,
      },
    });

    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return subCategory;
  }

  async update(
    company_id: string,
    category_id: string,
    id: string,
    updateImcSubCategoryDto: UpdateImcSubCategoryDto,
  ) {
    await this.findOne(company_id, category_id, id);

    return this.prisma.imc_SubCategory.update({
      where: {
        company_id_category_id_id: {
          company_id,
          category_id,
          id,
        },
      },
      data: updateImcSubCategoryDto,
      include: {
        category: true,
      },
    });
  }

  async remove(company_id: string, category_id: string, id: string) {
    await this.findOne(company_id, category_id, id);

    return this.prisma.imc_SubCategory.delete({
      where: {
        company_id_category_id_id: {
          company_id,
          category_id,
          id,
        },
      },
    });
  }
}
