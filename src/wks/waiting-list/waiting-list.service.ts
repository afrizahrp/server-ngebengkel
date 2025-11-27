import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
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
import { EmailService } from '../../email/email.service';
import { CheckWaitingListAvailabilityDto } from './dto/check-waiting-list-availability.dto';

const createWaitingListId = init({ length: 10 });
const WAITING_LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logo: true,
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
      id: true,
      name: true,
      // description mungkin tidak ada di skema baru; akan dihandle di mapper
    },
  },
  promos: {
    where: {
      isActive: true,
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
        { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
      ],
    },
    orderBy: [{ createdAt: 'desc' }],
    take: 1,
    select: {
      id: true,
      title: true,
      promoType: true,
      checklist: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  isDeleted: true,
  // Claim fields
  claimStatus: true,
  claimedBy: true,
  claimedAt: true,
  isPublicData: true,
} as const satisfies Prisma.wks_waitingListSelect;

type WaitingListWithRelations = Prisma.wks_waitingListGetPayload<{
  select: typeof WAITING_LIST_SELECT;
}>;

type WaitingListTypeRelation = { id: string; name: string | null } | null;

@Injectable()
export class WaitingListService {
  private readonly logger = new Logger(WaitingListService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private readonly waitingListSelect = WAITING_LIST_SELECT;

  async create(
    createWaitingListDto: CreateWaitingListDto,
  ): Promise<WaitingListResponseDto> {
    const { name, email: normalizedEmail } = this.validateNameAndEmail(
      createWaitingListDto.name,
      createWaitingListDto.email,
    );

    // const existing = await this.prisma.wks_waitingList.findFirst({
    //   where: { email: normalizedEmail, isDeleted: false },
    //   select: { id: true },
    // });

    // if (existing) {
    //   throw new ConflictException('Email sudah terdaftar dalam waiting list');
    // }

    const id = await this.generateId();

    const waitingList = await this.prisma.$transaction(async (tx) => {
      const category = await tx.wks_WorkshopCategory.findFirst({
        where: { id: createWaitingListDto.categoryId, isActive: true },
        select: { id: true },
      });

      if (!category) {
        throw new NotFoundException('Kategori bengkel tidak ditemukan');
      }

      // Schema baru: single relation type via type_id (optional), mengikuti pola seperti categoryId.
      let selectedTypeId: string | null = null;
      if (createWaitingListDto.typeId) {
        const typeData = await tx.wks_WorkshopType.findFirst({
          where: { id: createWaitingListDto.typeId, isActive: true },
          select: { id: true, category_id: true },
        });
        if (!typeData) {
          throw new NotFoundException('Jenis bengkel tidak ditemukan');
        }
        if (typeData.category_id !== category.id) {
          throw new BadRequestException(
            'Jenis bengkel tidak sesuai dengan kategori yang dipilih',
          );
        }
        selectedTypeId = typeData.id;
      }

      await tx.wks_waitingList.create({
        data: {
          id,
          name,
          description: createWaitingListDto.description,
          slug: createWaitingListDto.slug,
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
          types: selectedTypeId
            ? { connect: { id: selectedTypeId } }
            : undefined,
          category: {
            connect: { id: category.id },
          },
        },
      });

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

    const response = this.toResponse(waitingList);

    const workshopTypeNames = response.workshopTypes
      .map((type) => type.name)
      .filter((name): name is string => Boolean(name));

    void this.emailService
      .sendWaitingListThankYouEmail({
        email: response.email,
        name: response.name,
        categoryName: response.categoryName ?? null,
        workshopTypeNames,
      })
      .catch((error) => {
        console.error(
          '❌ Error sending waiting list thank you email after submission:',
          error,
        );
      });

    return response;
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
      orderBy: { name: 'asc' }, // Urutkan berdasarkan nama, bukan ID
    });

    return waitingLists.map((entry) => this.toResponse(entry));
  }

  async findOne(idOrSlug: string): Promise<WaitingListResponseDto> {
    const trimmed = idOrSlug.trim();

    // Coba cari berdasarkan ID dulu (format CUID biasanya 21 karakter)
    let waitingList = await this.prisma.wks_waitingList.findFirst({
      where: {
        id: trimmed,
        isDeleted: false,
      },
      select: this.waitingListSelect,
    });

    // Jika tidak ditemukan berdasarkan ID, coba cari berdasarkan slug (case-insensitive)
    if (!waitingList) {
      waitingList = await this.prisma.wks_waitingList.findFirst({
        where: {
          slug: {
            equals: trimmed,
            mode: 'insensitive', // Case-insensitive search
          },
          isDeleted: false,
        },
        select: this.waitingListSelect,
      });
    }

    // Jika masih tidak ditemukan, coba cari berdasarkan nama (fallback)
    // Ini untuk backward compatibility jika slug belum di-generate
    if (!waitingList) {
      // Generate slug dari input untuk matching
      const slugFromInput = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      waitingList = await this.prisma.wks_waitingList.findFirst({
        where: {
          OR: [
            {
              slug: {
                equals: slugFromInput,
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: trimmed,
                mode: 'insensitive',
              },
            },
          ],
          isDeleted: false,
        },
        select: this.waitingListSelect,
      });
    }

    if (!waitingList) {
      this.logger.warn(
        `Waiting list not found for: ${trimmed} (tried ID, slug, and name)`,
      );
      throw new NotFoundException('Data waiting list tidak ditemukan');
    }

    return this.toResponse(waitingList);
  }

  /**
   * Klaim bengkel (MVP): langsung set status menjadi CLAIMED
   * dan simpan informasi dasar pemilik (name, phone, email).
   * Verifikasi via WhatsApp akan ditambahkan di tahap berikutnya.
   */
  async claim(
    id: string,
    payload: { phone: string; name: string; email?: string },
  ): Promise<WaitingListResponseDto> {
    const trimmedId = id.trim();

    if (!trimmedId) {
      throw new BadRequestException('ID waiting list wajib diisi');
    }

    const existing = await this.prisma.wks_waitingList.findFirst({
      where: { id: trimmedId, isDeleted: false },
      select: {
        id: true,
        claimStatus: true,
        claimedAt: true,
        claimedBy: true,
        preApprovedPhone: true,
        preApprovedName: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Data waiting list tidak ditemukan');
    }

    // Untuk MVP: allow re-claim, tapi nanti bisa dibatasi
    const now = new Date();

    const updated = await this.prisma.wks_waitingList.update({
      where: { id: trimmedId },
      data: {
        // Simpan informasi pemilik sementara menggunakan phone & name
        claimedBy: payload.phone || existing.claimedBy || null,
        claimedAt: existing.claimedAt ?? now,
        claimStatus: 'CLAIMED',
        preApprovedPhone: payload.phone || existing.preApprovedPhone || null,
        preApprovedName: payload.name || existing.preApprovedName || null,
        preApprovedAt: now,
        updatedBy: 'website',
      },
      select: this.waitingListSelect,
    });

    return this.toResponse(updated);
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

    // if (
    //   updateWaitingListDto.email &&
    //   updateWaitingListDto.email !== existing.email
    // ) {
    //   const conflict = await this.prisma.wks_waitingList.findFirst({
    //     where: {
    //       email: updateWaitingListDto.email,
    //       isDeleted: false,
    //       NOT: { id },
    //     },
    //     select: { id: true },
    //   });

    //   if (conflict) {
    //     throw new ConflictException('Email sudah terdaftar dalam waiting list');
    //   }
    // }

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

      // Update type mengikuti pola category: jika disediakan typeId, validasi dan set; jika tidak disediakan, tidak diubah
      const hasTypeUpdate = Object.prototype.hasOwnProperty.call(
        updateWaitingListDto,
        'typeId',
      );
      let selectedTypeId: string | null | undefined = undefined;
      if (hasTypeUpdate) {
        if (
          updateWaitingListDto.typeId === undefined ||
          updateWaitingListDto.typeId === null
        ) {
          selectedTypeId = null;
        } else if (updateWaitingListDto.typeId === '') {
          selectedTypeId = null;
        } else {
          if (!targetCategoryId) {
            throw new BadRequestException(
              'Kategori bengkel harus dipilih sebelum mengatur jenis bengkel',
            );
          }
          const typeData = await tx.wks_WorkshopType.findFirst({
            where: { id: updateWaitingListDto.typeId, isActive: true },
            select: { id: true, category_id: true },
          });
          if (!typeData) {
            throw new NotFoundException('Jenis bengkel tidak ditemukan');
          }
          if (typeData.category_id !== targetCategoryId) {
            throw new BadRequestException(
              'Jenis bengkel tidak sesuai dengan kategori yang dipilih',
            );
          }
          selectedTypeId = typeData.id;
        }
      }

      const updateData: Prisma.wks_waitingListUpdateInput = {};

      if (updateWaitingListDto.name) {
        updateData.name = updateWaitingListDto.name;
      }

      if (updateWaitingListDto.slug) {
        updateData.slug = updateWaitingListDto.slug;
      }

      if (updateWaitingListDto.description) {
        updateData.description = updateWaitingListDto.description;
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

      if (hasTypeUpdate) {
        // Atur relasi types via connect/disconnect agar konsisten dengan category
        if (selectedTypeId === null) {
          updateData.types = { disconnect: true };
        } else if (selectedTypeId !== undefined) {
          updateData.types = { connect: { id: selectedTypeId } };
        }
      }

      updateData.updatedBy = 'website';

      await tx.wks_waitingList.update({
        where: { id },
        data: updateData,
      });

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
    if (!types) return [];
    return [
      {
        id: types.id,
        name: types.name ?? '',
        description: null,
      },
    ];
  }

  private toResponse(data: WaitingListWithRelations): WaitingListResponseDto {
    const {
      isDeleted,
      createdAt,
      updatedAt,
      category,
      category_id,
      types,
      promos,
      ...rest
    } = data;
    void isDeleted;

    const firstPromo =
      Array.isArray(promos) && promos.length > 0 ? promos[0] : null;

    return {
      ...rest,
      slug: rest.slug ?? '',
      description: rest.description ?? '',
      typeId: types ? types.id : null,
      categoryId: category_id ?? null,
      categoryCode: category?.code ?? null,
      categoryName: category?.name ?? null,
      workshopTypes: this.mapWorkshopTypes(types),
      hasPromo: Boolean(firstPromo),
      promoPreview: firstPromo
        ? {
            id: firstPromo.id,
            title: firstPromo.title,
            promoType: firstPromo.promoType,
            checklist: Array.isArray(firstPromo.checklist)
              ? (firstPromo.checklist as unknown as string[]).slice(0, 5)
              : null,
          }
        : null,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      // Claim fields
      claimStatus: rest.claimStatus ?? null,
      claimedBy: rest.claimedBy ?? null,
      claimedAt: rest.claimedAt ? rest.claimedAt.toISOString() : null,
      isPublicData: rest.isPublicData ?? true,
    };
  }

  async checkAvailability(payload: CheckWaitingListAvailabilityDto): Promise<{
    nameAvailable: boolean;
    // emailAvailable: boolean;
    conflicts: Array<{ field: 'name' | 'email'; message: string }>;
  }> {
    const trimmedName = payload.name?.trim();
    if (!trimmedName) {
      throw new BadRequestException('Nama wajib diisi');
    }

    const conflicts: Array<{ field: 'name' | 'email'; message: string }> = [];

    const existingName = await this.prisma.wks_waitingList.findFirst({
      where: { name: trimmedName, isDeleted: false },
      select: { id: true },
    });

    if (existingName) {
      conflicts.push({
        field: 'name',
        message: 'Nama bengkel sudah terdaftar dalam waiting list.',
      });
    }

    // Skip validasi existingEmail untuk tahap pendaftaran listing by public data
    // const existingEmail = await this.prisma.wks_waitingList.findFirst({
    //   where: { email, isDeleted: false },
    //   select: { id: true },
    // });

    // if (existingEmail) {
    //   conflicts.push({
    //     field: 'email',
    //     message: 'Email sudah terdaftar dalam waiting list.',
    //   });
    // }

    return {
      nameAvailable: !existingName,
      // emailAvailable: !existingEmail,
      conflicts,
    };
  }

  async findPromosByWaitingList(id: string): Promise<
    Array<{
      id: string;
      title: string;
      description: string | null;
      promoType: string;
      checklist?: string[] | null;
      valuePercent?: number | null;
      valueNominal?: number | null;
    }>
  > {
    const promos = await this.prisma.wks_promo.findMany({
      where: {
        waitingList_id: id,
        isActive: true,
        AND: [
          {
            OR: [{ startAt: null }, { startAt: { lte: new Date() } }],
          },
          {
            OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
          },
        ],
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        promoType: true,
        checklist: true,
        valuePercent: true,
        valueNominal: true,
        startAt: true,
        endAt: true,
      },
    });

    return promos.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? null,
      promoType: p.promoType,
      checklist: Array.isArray(p.checklist)
        ? (p.checklist as unknown as string[])
        : null,
      valuePercent: p.valuePercent ? Number(p.valuePercent) : null,
      valueNominal: p.valueNominal ?? null,
      startAt: p.startAt ? p.startAt.toISOString() : null,
      endAt: p.endAt ? p.endAt.toISOString() : null,
    }));
  }

  private validateNameAndEmail(
    name: string | undefined,
    email: string | undefined,
  ): { name: string; email: string } {
    const trimmedName = name?.trim();
    if (!trimmedName) {
      throw new BadRequestException('Nama wajib diisi');
    }

    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Email wajib diisi');
    }

    if (!isEmail(normalizedEmail)) {
      throw new BadRequestException('Format email tidak valid');
    }

    return { name: trimmedName, email: normalizedEmail };
  }
}
