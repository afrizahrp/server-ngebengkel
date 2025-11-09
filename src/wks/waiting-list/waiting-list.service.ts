import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { init } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';
import {
  WorkshopCategoryResponseDto,
  WorkshopTypeResponseDto,
} from './dto/workshop-category.dto';

const createWaitingListId = init({ length: 10 });
const WAITING_LIST_SELECT = {
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
  category_id: true,
  category: {
    select: {
      id: true,
      code: true,
      name: true,
    },
  },
  types: {
    select: {
      workshopType_id: true,
      workshopType: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  },
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
} as const satisfies Prisma.wks_waitingListSelect;

type WaitingListWithRelations = Prisma.wks_waitingListGetPayload<{
  select: typeof WAITING_LIST_SELECT;
}>;

type WaitingListTypeRelation = WaitingListWithRelations['types'];

@Injectable()
export class WaitingListService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly waitingListSelect = WAITING_LIST_SELECT;

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

    const waitingList = await this.prisma.$transaction(async (tx) => {
      const category = await tx.wks_WorkshopCategory.findFirst({
        where: { id: createWaitingListDto.categoryId, isActive: true },
        select: { id: true },
      });

      if (!category) {
        throw new NotFoundException('Kategori bengkel tidak ditemukan');
      }

      const workshopTypeIds = await this.validateWorkshopTypes(
        tx,
        createWaitingListDto.workshopTypeIds,
        category.id,
      );

      await tx.wks_waitingList.create({
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
          createdBy: 'website',
          updatedBy: 'website',
          category: {
            connect: { id: category.id },
          },
        },
      });

      if (workshopTypeIds.length > 0) {
        const now = new Date();
        await tx.wks_WaitingListType.createMany({
          data: workshopTypeIds.map((workshopTypeId) => ({
            waitingList_id: id,
            workshopType_id: workshopTypeId,
            assignedAt: now,
            createdAt: now,
            createdBy: 'website',
          })),
          skipDuplicates: true,
        });
      }

      const created = await tx.wks_waitingList.findUnique({
        where: { id },
        select: this.waitingListSelect,
      });

      if (!created) {
        throw new InternalServerErrorException(
          'Gagal membuat data waiting list.',
        );
      }

      return created;
    });

    return this.toResponse(waitingList);
  }

  async getWorkshopCategories(): Promise<WorkshopCategoryResponseDto[]> {
    const categories = await this.prisma.wks_WorkshopCategory.findMany({
      where: { isActive: true },
      orderBy: [{ seq: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        workshopTypes: {
          where: { isActive: true },
          orderBy: [{ seq: 'asc' }, { name: 'asc' }],
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      code: category.code,
      name: category.name,
      description: category.description ?? null,
      types: category.workshopTypes.map((type) => ({
        id: type.id,
        name: type.name,
        description: type.description ?? null,
      })),
    }));
  }

  async findAll(): Promise<WaitingListResponseDto[]> {
    const waitingLists = await this.prisma.wks_waitingList.findMany({
      where: { isDeleted: false },
      select: this.waitingListSelect,
    });

    return waitingLists.map((entry) => this.toResponse(entry));
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
      select: { id: true, email: true, category_id: true },
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

    const waitingList = await this.prisma.$transaction(async (tx) => {
      let targetCategoryId =
        updateWaitingListDto.categoryId ?? existing.category_id ?? null;

      if (updateWaitingListDto.categoryId) {
        const category = await tx.wks_WorkshopCategory.findFirst({
          where: { id: updateWaitingListDto.categoryId, isActive: true },
          select: { id: true },
        });

        if (!category) {
          throw new NotFoundException('Kategori bengkel tidak ditemukan');
        }

        targetCategoryId = category.id;
      }

      const shouldUpdateTypes =
        updateWaitingListDto.workshopTypeIds !== undefined;

      let workshopTypeIds: string[] = [];

      if (shouldUpdateTypes) {
        if (!targetCategoryId) {
          throw new BadRequestException(
            'Kategori bengkel harus dipilih sebelum mengatur jenis bengkel',
          );
        }

        workshopTypeIds = await this.validateWorkshopTypes(
          tx,
          updateWaitingListDto.workshopTypeIds ?? [],
          targetCategoryId,
        );
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
        updateData.phone = updateWaitingListDto.phone ?? '';
      }

      if (updateWaitingListDto.mobile !== undefined) {
        updateData.mobile = updateWaitingListDto.mobile ?? '';
      }

      if (updateWaitingListDto.categoryId !== undefined) {
        if (targetCategoryId) {
          updateData.category = {
            connect: { id: targetCategoryId },
          };
        } else {
          updateData.category = { disconnect: true };
        }
      }

      updateData.updatedBy = 'website';

      await tx.wks_waitingList.update({
        where: { id },
        data: updateData,
      });

      if (shouldUpdateTypes) {
        await tx.wks_WaitingListType.deleteMany({
          where: { waitingList_id: id },
        });

        if (workshopTypeIds.length > 0) {
          const now = new Date();
          await tx.wks_WaitingListType.createMany({
            data: workshopTypeIds.map((workshopTypeId) => ({
              waitingList_id: id,
              workshopType_id: workshopTypeId,
              assignedAt: now,
              createdAt: now,
              createdBy: 'website',
            })),
            skipDuplicates: true,
          });
        }
      }

      const updated = await tx.wks_waitingList.findUnique({
        where: { id },
        select: this.waitingListSelect,
      });

      if (!updated) {
        throw new NotFoundException('Data waiting list tidak ditemukan');
      }

      return updated;
    });

    return this.toResponse(waitingList);
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

  private async validateWorkshopTypes(
    tx: Prisma.TransactionClient,
    workshopTypeIds: string[],
    categoryId: string,
  ): Promise<string[]> {
    if (!workshopTypeIds.length) {
      return [];
    }

    const workshopTypes = await tx.wks_WorkshopType.findMany({
      where: {
        id: { in: workshopTypeIds },
        isActive: true,
      },
      select: {
        id: true,
        category_id: true,
      },
    });

    if (workshopTypes.length !== workshopTypeIds.length) {
      throw new NotFoundException('Jenis bengkel tidak ditemukan');
    }

    const invalidType = workshopTypes.find(
      (type) => type.category_id !== categoryId,
    );

    if (invalidType) {
      throw new BadRequestException(
        'Jenis bengkel tidak sesuai dengan kategori yang dipilih',
      );
    }

    return workshopTypes.map((type) => type.id);
  }

  private async generateId(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = createWaitingListId();

      const exists = await this.prisma.wks_waitingList.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) {
        return id;
      }
    }

    throw new InternalServerErrorException(
      'Gagal menghasilkan ID waiting list unik',
    );
  }

  private mapWorkshopTypes(
    types: WaitingListTypeRelation,
  ): WorkshopTypeResponseDto[] {
    if (!types?.length) {
      return [];
    }

    return types
      .filter((type) => Boolean(type.workshopType))
      .map((type) => ({
        id: type.workshopType!.id,
        name: type.workshopType!.name,
        description: type.workshopType!.description ?? null,
      }));
  }

  private toResponse(data: WaitingListWithRelations): WaitingListResponseDto {
    const {
      isDeleted,
      createdAt,
      updatedAt,
      category,
      category_id,
      types,
      ...rest
    } = data;
    void isDeleted;

    return {
      ...rest,
      categoryId: category_id ?? null,
      categoryCode: category?.code ?? null,
      categoryName: category?.name ?? null,
      workshopTypes: this.mapWorkshopTypes(types),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
