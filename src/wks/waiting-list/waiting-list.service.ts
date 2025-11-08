import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';

@Injectable()
export class WaitingListService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly waitingListSelect = {
    id: true,
    name: true,
    address: true,
    city: true,
    district: true,
    province: true,
    subdistrict: true,
    email: true,
    phone: true,
    mobile: true,
    specialization: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  } as const;

  async create(
    createWaitingListDto: CreateWaitingListDto,
  ): Promise<WaitingListResponseDto> {
    const normalizedEmail = createWaitingListDto.email;

    const existing = await this.prisma.wks_waitingList.findFirst({
      where: { email: normalizedEmail, isDeleted: false },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar dalam waiting list');
    }

    const id = await this.generateId();

    const data = await this.prisma.wks_waitingList.create({
      data: {
        id,
        name: createWaitingListDto.name,
        address: createWaitingListDto.address,
        city: createWaitingListDto.city,
        district: createWaitingListDto.district,
        province: createWaitingListDto.province,
        subdistrict: createWaitingListDto.subdistrict,
        email: normalizedEmail,
        phone: createWaitingListDto.phone ?? '',
        mobile: createWaitingListDto.mobile ?? '',
        specialization: createWaitingListDto.specialization,
        createdBy: 'website',
        updatedBy: 'website',
      },
      select: this.waitingListSelect,
    });

    return this.toResponse(data);
  }

  async findAll(): Promise<WaitingListResponseDto[]> {
    const waitingLists = await this.prisma.wks_waitingList.findMany({
      where: { isDeleted: false },
      select: this.waitingListSelect,
    });
    return waitingLists.map(this.toResponse);
  }

  async findOne(id: string): Promise<WaitingListResponseDto> {
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id, isDeleted: false },
      select: this.waitingListSelect,
    });

    if (!waitingList) {
      throw new NotFoundException('Data waiting list tidak ditemukan');
    }

    return this.toResponse(waitingList);
  }

  async update(
    id: string,
    updateWaitingListDto: UpdateWaitingListDto,
  ): Promise<WaitingListResponseDto> {
    const existing = await this.prisma.wks_waitingList.findFirst({
      where: { id, isDeleted: false },
      select: { id: true, email: true },
    });

    if (!existing) {
      throw new NotFoundException('Data waiting list tidak ditemukan');
    }

    if (
      updateWaitingListDto.email &&
      updateWaitingListDto.email !== existing.email
    ) {
      const conflict = await this.prisma.wks_waitingList.findFirst({
        where: {
          email: updateWaitingListDto.email,
          isDeleted: false,
          NOT: { id },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new ConflictException('Email sudah terdaftar dalam waiting list');
      }
    }

    const updateData: Prisma.wks_waitingListUpdateInput = {};

    if (updateWaitingListDto.name) {
      updateData.name = updateWaitingListDto.name;
    }

    if (updateWaitingListDto.address) {
      updateData.address = updateWaitingListDto.address;
    }

    if (updateWaitingListDto.city) {
      updateData.city = updateWaitingListDto.city;
    }

    if (updateWaitingListDto.district) {
      updateData.district = updateWaitingListDto.district;
    }

    if (updateWaitingListDto.province) {
      updateData.province = updateWaitingListDto.province;
    }

    if (updateWaitingListDto.subdistrict) {
      updateData.subdistrict = updateWaitingListDto.subdistrict;
    }

    if (updateWaitingListDto.email) {
      updateData.email = updateWaitingListDto.email;
    }

    if (updateWaitingListDto.phone !== undefined) {
      updateData.phone = updateWaitingListDto.phone ?? null;
    }

    if (updateWaitingListDto.mobile !== undefined) {
      updateData.mobile = updateWaitingListDto.mobile ?? null;
    }

    if (updateWaitingListDto.specialization) {
      updateData.specialization = updateWaitingListDto.specialization;
    }

    updateData.updatedBy = 'website';

    const data = await this.prisma.wks_waitingList.update({
      where: { id },
      data: updateData,
      select: this.waitingListSelect,
    });

    return this.toResponse(data);
  }

  async softDelete(id: string): Promise<WaitingListResponseDto> {
    const existing = await this.prisma.wks_waitingList.findFirst({
      where: { id, isDeleted: false },
      select: this.waitingListSelect,
    });

    if (!existing) {
      throw new NotFoundException('Data waiting list tidak ditemukan');
    }

    const data = await this.prisma.wks_waitingList.update({
      where: { id },
      data: { isDeleted: true, updatedBy: 'website' },
      select: this.waitingListSelect,
    });

    return this.toResponse(data);
  }

  private async generateId(): Promise<string> {
    const lastEntry = await this.prisma.wks_waitingList.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    const lastNumber = lastEntry?.id ? Number.parseInt(lastEntry.id, 10) : 0;

    if (Number.isNaN(lastNumber)) {
      throw new InternalServerErrorException(
        'Format ID waiting list tidak valid',
      );
    }

    const nextNumber = lastNumber + 1;

    if (nextNumber > 9999999999) {
      throw new InternalServerErrorException(
        'ID waiting list melebihi batas maksimal',
      );
    }

    return nextNumber.toString().padStart(10, '0');
  }

  private toResponse(data: {
    id: string;
    name: string;
    address: string;
    city: string;
    district: string;
    province: string;
    subdistrict: string;
    email: string;
    phone: string | null;
    mobile: string | null;
    specialization: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
    isDeleted: boolean;
  }): WaitingListResponseDto {
    const { isDeleted, createdAt, updatedAt, ...rest } = data;
    void isDeleted;
    return {
      ...rest,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
