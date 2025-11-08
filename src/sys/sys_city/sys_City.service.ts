import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateCityDto } from './dto/sys_CreateCity.dto';
import { Sys_UpdateCityDto } from './dto/sys_UpdateCity.dto';
import { Sys_ResponseCityDto } from './dto/sys_ResponseCity.dto';

@Injectable()
export class Sys_CityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Sys_CreateCityDto): Promise<Sys_ResponseCityDto> {
    await this.ensureProvinceCompatibility(dto.province_id, dto.company_id);

    const city = await this.prisma.sys_City.create({
      data: {
        ...dto,
      },
      include: this.defaultCityInclude(),
    });

    return this.mapToResponseDto(city);
  }

  async findAll(): Promise<Sys_ResponseCityDto[]> {
    const cities = await this.prisma.sys_City.findMany({
      include: this.defaultCityInclude(),
      orderBy: { name: 'asc' },
    });

    return cities.map((city) => this.mapToResponseDto(city));
  }

  async findByProvinceId(province_id: string): Promise<Sys_ResponseCityDto[]> {
    const cities = await this.prisma.sys_City.findMany({
      where: { province_id },
      include: this.defaultCityInclude(),
      orderBy: { name: 'asc' },
    });

    return cities.map((city) => this.mapToResponseDto(city));
  }

  async findOne(id: string): Promise<Sys_ResponseCityDto> {
    const city = await this.prisma.sys_City.findUnique({
      where: { id },
      include: this.defaultCityInclude(),
    });

    if (!city) {
      throw new NotFoundException(`City dengan ID ${id} tidak ditemukan`);
    }

    return this.mapToResponseDto(city);
  }

  async update(
    id: string,
    dto: Sys_UpdateCityDto,
  ): Promise<Sys_ResponseCityDto> {
    const existing = await this.prisma.sys_City.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`City dengan ID ${id} tidak ditemukan`);
    }

    const targetProvinceId = dto.province_id ?? existing.province_id;
    const targetCompanyId = dto.company_id ?? existing.company_id;

    await this.ensureProvinceCompatibility(targetProvinceId, targetCompanyId);

    const city = await this.prisma.sys_City.update({
      where: { id },
      data: {
        ...dto,
        province_id: targetProvinceId,
        company_id: targetCompanyId,
      },
      include: this.defaultCityInclude(),
    });

    return this.mapToResponseDto(city);
  }

  async remove(id: string): Promise<void> {
    await this.ensureCityExists(id);

    const districtsCount = await this.prisma.sys_District.count({
      where: { city_id: id },
    });

    if (districtsCount > 0) {
      throw new BadRequestException(
        'City masih memiliki district yang terkait. Hapus data district terlebih dahulu.',
      );
    }

    await this.prisma.sys_City.delete({ where: { id } });
  }

  private async ensureProvinceCompatibility(
    province_id: string,
    company_id: string,
  ) {
    const province = await this.prisma.sys_Province.findUnique({
      where: { id: province_id },
    });

    if (!province) {
      throw new NotFoundException(
        `Province dengan ID ${province_id} tidak ditemukan`,
      );
    }

    if (this.normalize(province.company_id) !== this.normalize(company_id)) {
      throw new BadRequestException(
        'Province dan City harus berada pada company yang sama.',
      );
    }
  }

  private async ensureCityExists(id: string) {
    const city = await this.prisma.sys_City.findUnique({ where: { id } });

    if (!city) {
      throw new NotFoundException(`City dengan ID ${id} tidak ditemukan`);
    }
  }

  private defaultCityInclude() {
    return {
      province: {
        select: {
          id: true,
          name: true,
        },
      },
      districts: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      },
    } as const;
  }

  private mapToResponseDto(city: any): Sys_ResponseCityDto {
    return {
      id: this.trim(city.id),
      name: this.trim(city.name),
      company_id: this.trim(city.company_id),
      province_id: this.trim(city.province_id),
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
      createdBy: this.trimOrNull(city.createdBy),
      updatedBy: this.trimOrNull(city.updatedBy),
      province: city.province
        ? {
            id: this.trim(city.province.id),
            name: this.trim(city.province.name),
          }
        : undefined,
      districts: city.districts?.map((district: any) => ({
        id: this.trim(district.id),
        name: this.trim(district.name),
      })),
    };
  }

  private trim(value?: string | null): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private trimOrNull(value?: string | null): string | null {
    return typeof value === 'string' ? value.trim() : null;
  }

  private normalize(value?: string | null): string {
    return typeof value === 'string' ? value.trim() : '';
  }
}
