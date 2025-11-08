import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateDistrictDto } from './dto/sys_CreateDistrict.dto';
import { Sys_UpdateDistrictDto } from './dto/sys_UpdateDistrict.dto';
import { Sys_ResponseDistrictDto } from './dto/sys_ResponseDistrict.dto';

@Injectable()
export class Sys_DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Sys_CreateDistrictDto): Promise<Sys_ResponseDistrictDto> {
    await this.ensureCityCompatibility(dto.city_id, dto.company_id);

    const district = await this.prisma.sys_District.create({
      data: {
        ...dto,
      },
      include: this.defaultDistrictInclude(),
    });

    return this.mapToResponseDto(district);
  }

  async findAll(): Promise<Sys_ResponseDistrictDto[]> {
    const districts = await this.prisma.sys_District.findMany({
      include: this.defaultDistrictInclude(),
      orderBy: { name: 'asc' },
    });

    return districts.map((district) => this.mapToResponseDto(district));
  }

  async findByCityId(city_id: string): Promise<Sys_ResponseDistrictDto[]> {
    const districts = await this.prisma.sys_District.findMany({
      where: { city_id },
      include: this.defaultDistrictInclude(),
      orderBy: { name: 'asc' },
    });

    return districts.map((district) => this.mapToResponseDto(district));
  }

  async findOne(id: string): Promise<Sys_ResponseDistrictDto> {
    const district = await this.prisma.sys_District.findUnique({
      where: { id },
      include: this.defaultDistrictInclude(),
    });

    if (!district) {
      throw new NotFoundException(`District dengan ID ${id} tidak ditemukan`);
    }

    return this.mapToResponseDto(district);
  }

  async update(
    id: string,
    dto: Sys_UpdateDistrictDto,
  ): Promise<Sys_ResponseDistrictDto> {
    const existing = await this.prisma.sys_District.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`District dengan ID ${id} tidak ditemukan`);
    }

    const targetCityId = dto.city_id ?? existing.city_id;
    const targetCompanyId = dto.company_id ?? existing.company_id;

    await this.ensureCityCompatibility(targetCityId, targetCompanyId);

    const district = await this.prisma.sys_District.update({
      where: { id },
      data: {
        ...dto,
        city_id: targetCityId,
        company_id: targetCompanyId,
      },
      include: this.defaultDistrictInclude(),
    });

    return this.mapToResponseDto(district);
  }

  async remove(id: string): Promise<void> {
    await this.ensureDistrictExists(id);

    const subdistrictCount = await this.prisma.sys_SubDistrict.count({
      where: { district_id: id },
    });

    if (subdistrictCount > 0) {
      throw new BadRequestException(
        'District masih memiliki subdistrict yang terkait. Hapus data subdistrict terlebih dahulu.',
      );
    }

    await this.prisma.sys_District.delete({ where: { id } });
  }

  private async ensureCityCompatibility(city_id: string, company_id: string) {
    const city = await this.prisma.sys_City.findUnique({
      where: { id: city_id },
      include: {
        province: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`City dengan ID ${city_id} tidak ditemukan`);
    }

    if (this.normalize(city.company_id) !== this.normalize(company_id)) {
      throw new BadRequestException(
        'City dan District harus berada pada company yang sama.',
      );
    }
  }

  private async ensureDistrictExists(id: string) {
    const district = await this.prisma.sys_District.findUnique({
      where: { id },
    });

    if (!district) {
      throw new NotFoundException(`District dengan ID ${id} tidak ditemukan`);
    }
  }

  private defaultDistrictInclude() {
    return {
      city: {
        select: {
          id: true,
          name: true,
          province: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      subdistricts: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      },
    } as const;
  }

  private mapToResponseDto(district: any): Sys_ResponseDistrictDto {
    return {
      id: this.trim(district.id),
      name: this.trim(district.name),
      company_id: this.trim(district.company_id),
      city_id: this.trim(district.city_id),
      createdAt: district.createdAt,
      updatedAt: district.updatedAt,
      createdBy: this.trimOrNull(district.createdBy),
      updatedBy: this.trimOrNull(district.updatedBy),
      city: district.city
        ? {
            id: this.trim(district.city.id),
            name: this.trim(district.city.name),
            province: district.city.province
              ? {
                  id: this.trim(district.city.province.id),
                  name: this.trim(district.city.province.name),
                }
              : undefined,
          }
        : undefined,
      subdistricts: district.subdistricts?.map((subdistrict: any) => ({
        id: this.trim(subdistrict.id),
        name: this.trim(subdistrict.name),
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
