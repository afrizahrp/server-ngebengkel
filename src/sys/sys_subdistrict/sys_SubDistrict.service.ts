import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateSubDistrictDto } from './dto/sys_CreateSubDistrict.dto';
import { Sys_UpdateSubDistrictDto } from './dto/sys_UpdateSubDistrict.dto';
import { Sys_ResponseSubDistrictDto } from './dto/sys_ResponseSubDistrict.dto';

@Injectable()
export class Sys_SubDistrictService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: Sys_CreateSubDistrictDto,
  ): Promise<Sys_ResponseSubDistrictDto> {
    await this.ensureDistrictAndCityCompatibility(
      dto.district_id,
      dto.city_id,
      dto.company_id,
    );

    const subdistrict = await this.prisma.sys_SubDistrict.create({
      data: {
        ...dto,
      },
      include: this.defaultSubDistrictInclude(),
    });

    return this.mapToResponseDto(subdistrict);
  }

  async findAll(): Promise<Sys_ResponseSubDistrictDto[]> {
    const subdistricts = await this.prisma.sys_SubDistrict.findMany({
      include: this.defaultSubDistrictInclude(),
      orderBy: { name: 'asc' },
    });

    return subdistricts.map((subdistrict) =>
      this.mapToResponseDto(subdistrict),
    );
  }

  async findByDistrictId(
    district_id: string,
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    const subdistricts = await this.prisma.sys_SubDistrict.findMany({
      where: { district_id },
      include: this.defaultSubDistrictInclude(),
      orderBy: { name: 'asc' },
    });

    return subdistricts.map((subdistrict) =>
      this.mapToResponseDto(subdistrict),
    );
  }

  async findByCityId(city_id: string): Promise<Sys_ResponseSubDistrictDto[]> {
    const subdistricts = await this.prisma.sys_SubDistrict.findMany({
      where: { city_id },
      include: this.defaultSubDistrictInclude(),
      orderBy: { name: 'asc' },
    });

    return subdistricts.map((subdistrict) =>
      this.mapToResponseDto(subdistrict),
    );
  }

  async findOne(id: string): Promise<Sys_ResponseSubDistrictDto> {
    const subdistrict = await this.prisma.sys_SubDistrict.findUnique({
      where: { id },
      include: this.defaultSubDistrictInclude(),
    });

    if (!subdistrict) {
      throw new NotFoundException(
        `SubDistrict dengan ID ${id} tidak ditemukan`,
      );
    }

    return this.mapToResponseDto(subdistrict);
  }

  async update(
    id: string,
    dto: Sys_UpdateSubDistrictDto,
  ): Promise<Sys_ResponseSubDistrictDto> {
    const existing = await this.prisma.sys_SubDistrict.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(
        `SubDistrict dengan ID ${id} tidak ditemukan`,
      );
    }

    const targetDistrictId = dto.district_id ?? existing.district_id;
    const targetCityId = dto.city_id ?? existing.city_id;
    const targetCompanyId = dto.company_id ?? existing.company_id;

    await this.ensureDistrictAndCityCompatibility(
      targetDistrictId,
      targetCityId,
      targetCompanyId,
    );

    const subdistrict = await this.prisma.sys_SubDistrict.update({
      where: { id },
      data: {
        ...dto,
        district_id: targetDistrictId,
        city_id: targetCityId,
        company_id: targetCompanyId,
      },
      include: this.defaultSubDistrictInclude(),
    });

    return this.mapToResponseDto(subdistrict);
  }

  async remove(id: string): Promise<void> {
    await this.ensureSubDistrictExists(id);
    await this.prisma.sys_SubDistrict.delete({ where: { id } });
  }

  private async ensureDistrictAndCityCompatibility(
    district_id: string,
    city_id: string,
    company_id: string,
  ) {
    const district = await this.prisma.sys_District.findUnique({
      where: { id: district_id },
      include: {
        city: true,
      },
    });

    if (!district) {
      throw new NotFoundException(
        `District dengan ID ${district_id} tidak ditemukan`,
      );
    }

    if (this.normalize(district.company_id) !== this.normalize(company_id)) {
      throw new BadRequestException(
        'District dan SubDistrict harus berada pada company yang sama.',
      );
    }

    if (this.normalize(district.city_id) !== this.normalize(city_id)) {
      throw new BadRequestException(
        'District yang dipilih tidak berada pada city yang sama.',
      );
    }

    const city = district.city
      ? district.city
      : await this.prisma.sys_City.findUnique({ where: { id: city_id } });

    if (!city) {
      throw new NotFoundException(`City dengan ID ${city_id} tidak ditemukan`);
    }

    if (this.normalize(city.company_id) !== this.normalize(company_id)) {
      throw new BadRequestException(
        'City dan SubDistrict harus berada pada company yang sama.',
      );
    }
  }

  private async ensureSubDistrictExists(id: string) {
    const subdistrict = await this.prisma.sys_SubDistrict.findUnique({
      where: { id },
    });

    if (!subdistrict) {
      throw new NotFoundException(
        `SubDistrict dengan ID ${id} tidak ditemukan`,
      );
    }
  }

  private defaultSubDistrictInclude() {
    return {
      district: {
        select: {
          id: true,
          name: true,
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
        },
      },
    } as const;
  }

  private mapToResponseDto(subdistrict: any): Sys_ResponseSubDistrictDto {
    const cityFromDistrict = subdistrict.district?.city;
    const provinceFromCity = cityFromDistrict?.province;

    return {
      id: this.trim(subdistrict.id),
      name: this.trim(subdistrict.name),
      company_id: this.trim(subdistrict.company_id),
      district_id: this.trim(subdistrict.district_id),
      city_id: this.trim(subdistrict.city_id),
      createdAt: subdistrict.createdAt,
      updatedAt: subdistrict.updatedAt,
      createdBy: this.trimOrNull(subdistrict.createdBy),
      updatedBy: this.trimOrNull(subdistrict.updatedBy),
      district: subdistrict.district
        ? {
            id: this.trim(subdistrict.district.id),
            name: this.trim(subdistrict.district.name),
            city: cityFromDistrict
              ? {
                  id: this.trim(cityFromDistrict.id),
                  name: this.trim(cityFromDistrict.name),
                }
              : undefined,
          }
        : undefined,
      city: cityFromDistrict
        ? {
            id: this.trim(cityFromDistrict.id),
            name: this.trim(cityFromDistrict.name),
            province: provinceFromCity
              ? {
                  id: this.trim(provinceFromCity.id),
                  name: this.trim(provinceFromCity.name),
                }
              : undefined,
          }
        : undefined,
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
