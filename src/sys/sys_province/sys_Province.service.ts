import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateProvinceDto } from './dto/sys_CreateProvince.dto';
import { Sys_UpdateProvinceDto } from './dto/sys_UpdateProvince.dto';
import { Sys_ResponseProvinceDto } from './dto/sys_ResponseProvince.dto';

@Injectable()
export class Sys_ProvinceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Sys_CreateProvinceDto): Promise<Sys_ResponseProvinceDto> {
    const province = await this.prisma.sys_Province.create({
      data: {
        ...dto,
      },
      include: this.defaultProvinceInclude(),
    });

    return this.mapToResponseDto(province);
  }

  async findAll(): Promise<Sys_ResponseProvinceDto[]> {
    const provinces = await this.prisma.sys_Province.findMany({
      include: this.defaultProvinceInclude(),
      orderBy: { name: 'asc' },
    });

    return provinces.map((province) => this.mapToResponseDto(province));
  }

  async findOne(id: string): Promise<Sys_ResponseProvinceDto> {
    const province = await this.prisma.sys_Province.findUnique({
      where: { id },
      include: this.defaultProvinceInclude(),
    });

    if (!province) {
      throw new NotFoundException(`Province dengan ID ${id} tidak ditemukan`);
    }

    return this.mapToResponseDto(province);
  }

  async findManyByIds(ids: string[]): Promise<Sys_ResponseProvinceDto[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    // Remove duplicates and filter empty strings
    const uniqueIds = Array.from(new Set(ids.filter(id => id && id.trim().length > 0)));

    if (uniqueIds.length === 0) {
      return [];
    }

    const provinces = await this.prisma.sys_Province.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
      include: this.defaultProvinceInclude(),
      orderBy: { name: 'asc' },
    });

    return provinces.map((province) => this.mapToResponseDto(province));
  }

  async update(
    id: string,
    dto: Sys_UpdateProvinceDto,
  ): Promise<Sys_ResponseProvinceDto> {
    await this.ensureProvinceExists(id);

    const province = await this.prisma.sys_Province.update({
      where: { id },
      data: {
        ...dto,
      },
      include: this.defaultProvinceInclude(),
    });

    return this.mapToResponseDto(province);
  }

  async remove(id: string): Promise<void> {
    await this.ensureProvinceExists(id);

    const citiesCount = await this.prisma.sys_City.count({
      where: { province_id: id },
    });

    if (citiesCount > 0) {
      throw new BadRequestException(
        'Province masih memiliki city yang terkait. Hapus data city terlebih dahulu.',
      );
    }

    await this.prisma.sys_Province.delete({
      where: { id },
    });
  }

  private async ensureProvinceExists(id: string) {
    const province = await this.prisma.sys_Province.findUnique({
      where: { id },
    });

    if (!province) {
      throw new NotFoundException(`Province dengan ID ${id} tidak ditemukan`);
    }
  }

  private defaultProvinceInclude() {
    return {
      cities: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      },
    } as const;
  }

  private mapToResponseDto(province: any): Sys_ResponseProvinceDto {
    return {
      id: this.trim(province.id),
      name: this.trim(province.name),
      company_id: this.trim(province.company_id),
      createdAt: province.createdAt,
      updatedAt: province.updatedAt,
      createdBy: this.trimOrNull(province.createdBy),
      updatedBy: this.trimOrNull(province.updatedBy),
      cities: province.cities?.map((city: any) => ({
        id: this.trim(city.id),
        name: this.trim(city.name),
      })),
    };
  }

  private trim(value?: string | null): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private trimOrNull(value?: string | null): string | null {
    return typeof value === 'string' ? value.trim() : null;
  }
}
