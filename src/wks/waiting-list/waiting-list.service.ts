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
import { QueryWaitingListDto } from './dto/query-waiting-list.dto';
import { generateUniqueSlug } from '../../utils/generateSlug';

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
  // Promo linked field
  isPromoLinked: true,
  // Google Business Profile fields
  gbp_rating: true,
  gbb_reviews_count: true,
  priority: true,
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

    // Generate unique slug from name if not provided
    const slug = createWaitingListDto.slug
      ? createWaitingListDto.slug
      : await generateUniqueSlug(name, this.prisma);

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
          slug,
          address: createWaitingListDto.address,
          city: createWaitingListDto.city,
          district: createWaitingListDto.district,
          province: createWaitingListDto.province,
          subdistrict: createWaitingListDto.subdistrict,
          email: normalizedEmail,
          phone: createWaitingListDto.phone ?? '',
          mobile: createWaitingListDto.mobile ?? '',
          gbp_rating: createWaitingListDto.gbp_rating ?? null,
          gbb_reviews_count: createWaitingListDto.gbb_reviews_count ?? null,
          priority: createWaitingListDto.priority ?? null,
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

  /**
   * Helper function untuk sorting waiting list dengan prioritas promo
   * - Item dengan isPromoLinked = true di atas, di-sort alphabetically
   * - Item dengan isPromoLinked = false di bawah, di-sort alphabetically
   */
  private sortByNameWithPromoPriority(
    items: WaitingListResponseDto[],
  ): WaitingListResponseDto[] {
    // Pisahkan item dengan promo linked dan tanpa promo linked
    const withPromoLinked: WaitingListResponseDto[] = [];
    const withoutPromoLinked: WaitingListResponseDto[] = [];

    items.forEach((item) => {
      // Gunakan isPromoLinked dari database (lebih reliable daripada cek relasi)
      if (item.isPromoLinked) {
        withPromoLinked.push(item);
      } else {
        withoutPromoLinked.push(item);
      }
    });

    // Sort alphabetically untuk masing-masing grup
    withPromoLinked.sort((a, b) =>
      a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }),
    );
    withoutPromoLinked.sort((a, b) =>
      a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }),
    );

    // Gabungkan: dengan promo linked di atas, tanpa promo linked di bawah
    return [...withPromoLinked, ...withoutPromoLinked];
  }

  async findAll(): Promise<WaitingListResponseDto[]> {
    // Gunakan ORDER BY di database untuk performa lebih baik
    // isPromoLinked DESC untuk prioritas promo di atas, lalu name ASC untuk alphabetical
    const waitingLists = await this.prisma.wks_waitingList.findMany({
      where: { isDeleted: false },
      select: this.waitingListSelect,
      orderBy: [
        { isPromoLinked: 'desc' }, // Promo linked items di atas (true > false)
        { name: 'asc' }, // Lalu sort alphabetically
      ],
    });

    return waitingLists.map((entry) => this.toResponse(entry));
  }

  async findAllWithFilters(query: QueryWaitingListDto): Promise<{
    data: WaitingListResponseDto[];
    totalRecords: number;
    total: number;
  }> {
    const {
      searchTerm,
      searchBy = 'name',
      claimStatus,
      category_id,
      province_id,
      city_id,
      start_date,
      end_date,
      page = 1,
      limit = 10,
      orderBy = 'name',
      orderDir = 'asc',
    } = query;

    // Build where clause
    const where: Prisma.wks_waitingListWhereInput = {
      isDeleted: false,
    };

    // Search filter
    if (searchTerm && searchBy) {
      switch (searchBy) {
        case 'name':
          where.name = {
            contains: searchTerm,
            mode: 'insensitive',
          };
          break;
        case 'phone':
          where.OR = [
            { phone: { contains: searchTerm, mode: 'insensitive' } },
            { mobile: { contains: searchTerm, mode: 'insensitive' } },
          ];
          break;
        case 'email':
          where.email = {
            contains: searchTerm,
            mode: 'insensitive',
          };
          break;
        case 'address':
          where.address = {
            contains: searchTerm,
            mode: 'insensitive',
          };
          break;
        case 'city':
          where.city = {
            contains: searchTerm,
            mode: 'insensitive',
          };
          break;
        case 'district':
          where.district = {
            contains: searchTerm,
            mode: 'insensitive',
          };
          break;
        case 'province':
          where.province = {
            contains: searchTerm,
            mode: 'insensitive',
          };
          break;
        default:
          // Default: search in name
          where.name = {
            contains: searchTerm,
            mode: 'insensitive',
          };
      }
    }

    // Claim status filter
    if (claimStatus && claimStatus.length > 0) {
      // Validate claim status values
      const validClaimStatuses = [
        'UNCLAIMED',
        'PRE_APPROVED',
        'PENDING_VERIFICATION',
        'CLAIMED',
        'REJECTED',
      ];
      const filteredStatuses = claimStatus.filter((status) =>
        validClaimStatuses.includes(status),
      );
      if (filteredStatuses.length > 0) {
        where.claimStatus = {
          in: filteredStatuses as any, // Prisma will validate enum values
        };
      }
    }

    // Category filter
    if (category_id && category_id.length > 0) {
      where.category_id = {
        in: category_id,
      };
    }

    // Province filter
    if (province_id && province_id.length > 0) {
      where.province = {
        in: province_id,
      };
    }

    // City filter
    if (city_id && city_id.length > 0) {
      where.city = {
        in: city_id,
      };
    }

    // Date range filter
    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) {
        where.createdAt.gte = new Date(start_date);
      }
      if (end_date) {
        where.createdAt.lte = new Date(end_date);
      }
    }

    // Build orderBy
    // PENTING: Item dengan isPromoLinked = true SELALU di atas dan SELALU di-sort A-Z
    // Item dengan isPromoLinked = false di bawah dan mengikuti orderDir
    const orderByClause: Prisma.wks_waitingListOrderByWithRelationInput[] = [];
    const isSortingByName = orderBy === 'name' || !orderBy;

    if (isSortingByName) {
      // Sorting by name dengan prioritas promo:
      // 1. isPromoLinked DESC (promo di atas)
      // 2. name ASC untuk promo (selalu A-Z, tidak peduli orderDir)
      // 3. name ASC/DESC untuk regular (mengikuti orderDir)
      // Karena Prisma tidak support conditional sorting, kita akan sort di memory setelah fetch
      // Untuk sekarang, kita sort: isPromoLinked DESC, lalu name ASC (promo akan tetap di atas)
      orderByClause.push({ isPromoLinked: 'desc' }); // Promo linked items di atas
      orderByClause.push({ name: 'asc' }); // Default A-Z untuk semua (akan di-adjust di memory jika perlu)
    } else if (orderBy === 'createdAt') {
      // Untuk sorting by createdAt, tetap prioritaskan promo di atas
      orderByClause.push({ isPromoLinked: 'desc' });
      orderByClause.push({ createdAt: orderDir });
    } else if (orderBy === 'claimStatus') {
      // Untuk sorting by claimStatus, tetap prioritaskan promo di atas
      orderByClause.push({ isPromoLinked: 'desc' });
      orderByClause.push({ claimStatus: orderDir });
    } else if (orderBy === 'claimedAt') {
      // Untuk sorting by claimedAt, tetap prioritaskan promo di atas
      orderByClause.push({ isPromoLinked: 'desc' });
      orderByClause.push({ claimedAt: orderDir });
    } else {
      // Default: sorting by name dengan prioritas promo
      orderByClause.push({ isPromoLinked: 'desc' });
      orderByClause.push({ name: 'asc' });
    }

    // Get total count
    const totalRecords = await this.prisma.wks_waitingList.count({
      where,
    });

    let waitingLists: WaitingListWithRelations[];

    // Jika sorting by name, perlu fetch semua data dulu untuk sorting di memory yang benar
    // karena kita perlu sort semua data (promo A-Z, regular sesuai orderDir) sebelum pagination
    if (isSortingByName) {
      // Fetch semua data yang sesuai dengan filter (tanpa pagination)
      const allWaitingLists = await this.prisma.wks_waitingList.findMany({
        where,
        select: this.waitingListSelect,
        orderBy: [{ isPromoLinked: 'desc' }, { name: 'asc' }], // Temporary order untuk fetch
      });

      // Pisahkan item promo dan regular
      const promoLinked: WaitingListWithRelations[] = [];
      const regular: WaitingListWithRelations[] = [];

      allWaitingLists.forEach((item) => {
        if (item.isPromoLinked === true) {
          promoLinked.push(item);
        } else {
          regular.push(item);
        }
      });

      // Sort promo linked items alphabetically (A-Z) - SELALU
      promoLinked.sort((a, b) =>
        a.name.localeCompare(b.name, 'id', {
          sensitivity: 'base',
          numeric: true,
        }),
      );

      // Sort regular items sesuai orderDir
      if (orderDir === 'desc') {
        regular.sort((a, b) =>
          b.name.localeCompare(a.name, 'id', {
            sensitivity: 'base',
            numeric: true,
          }),
        );
      } else {
        regular.sort((a, b) =>
          a.name.localeCompare(b.name, 'id', {
            sensitivity: 'base',
            numeric: true,
          }),
        );
      }

      // Gabungkan: promo di atas, regular di bawah
      const sortedLists = [...promoLinked, ...regular];

      // Lakukan pagination setelah sorting
      const skip = (page - 1) * limit;
      waitingLists = sortedLists.slice(skip, skip + limit);
    } else {
      // Untuk sorting selain name, gunakan database sorting dengan pagination
      const skip = (page - 1) * limit;
      waitingLists = await this.prisma.wks_waitingList.findMany({
        where,
        select: this.waitingListSelect,
        orderBy: orderByClause,
        skip,
        take: limit,
      });
    }

    return {
      data: waitingLists.map((entry) => this.toResponse(entry)),
      totalRecords,
      total: totalRecords,
    };
  }

  async findOne(idOrSlug: string): Promise<WaitingListResponseDto> {
    try {
      const trimmed = idOrSlug?.trim();
      if (!trimmed) {
        throw new BadRequestException('ID atau slug waiting list wajib diisi');
      }

      // Cari berdasarkan ID
      let waitingList = await this.prisma.wks_waitingList.findFirst({
        where: {
          id: trimmed,
          isDeleted: false,
        },
        select: this.waitingListSelect,
      });

      // Cari berdasarkan slug jika tidak ditemukan
      if (!waitingList && trimmed) {
        waitingList = await this.prisma.wks_waitingList.findFirst({
          where: {
            slug: {
              equals: trimmed,
              mode: 'insensitive',
            },
            isDeleted: false,
          },
          select: this.waitingListSelect,
        });
      }

      // Fallback: cari berdasarkan nama atau slug dari input
      if (!waitingList && trimmed) {
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

      // Null-safe mapping
      try {
        return this.toResponse(waitingList);
      } catch (err) {
        this.logger.error('Error mapping waiting list response', err);
        throw new InternalServerErrorException('Gagal memproses data waiting list.');
      }
    } catch (err) {
      if (err instanceof NotFoundException || err instanceof BadRequestException) {
        throw err;
      }
      this.logger.error('Unexpected error in findOne', err);
      throw new InternalServerErrorException('Terjadi kesalahan pada server saat mengambil data waiting list.');
    }
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

      if (updateWaitingListDto.gbp_rating !== undefined) {
        updateData.gbp_rating = updateWaitingListDto.gbp_rating ?? null;
      }

      if (updateWaitingListDto.gbb_reviews_count !== undefined) {
        updateData.gbb_reviews_count = updateWaitingListDto.gbb_reviews_count ?? null;
      }

      if (updateWaitingListDto.priority !== undefined) {
        updateData.priority = updateWaitingListDto.priority ?? null;
      }

      if (updateWaitingListDto.slug) {
        updateData.slug = updateWaitingListDto.slug;
      }
      
      if (updateWaitingListDto.description !== undefined) {
        updateData.description = updateWaitingListDto.description ?? null;
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
      // Promo linked field (from database, lebih reliable)
      isPromoLinked: rest.isPromoLinked ?? false,
      // Google Business Profile fields
      gbp_rating: rest.gbp_rating ? Number(rest.gbp_rating) : null,
      gbb_reviews_count: rest.gbb_reviews_count ?? null,
      priority: rest.priority ?? null,
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

  /**
   * Update isPromoLinked field untuk waiting list berdasarkan promo aktif
   * Dipanggil saat promo dibuat/diaktifkan/dinonaktifkan
   * @param waitingListId ID waiting list yang akan di-update
   */
  async updatePromoLinkedStatus(waitingListId: string): Promise<void> {
    const trimmedId = waitingListId.trim();
    if (!trimmedId) {
      this.logger.warn('[UPDATE PROMO LINKED] Invalid waiting list ID');
      return;
    }

    // Cek apakah ada promo aktif untuk waiting list ini
    const activePromo = await this.prisma.wks_promo.findFirst({
      where: {
        waitingList_id: trimmedId,
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
      select: { id: true },
    });

    const hasActivePromo = Boolean(activePromo);

    // Update isPromoLinked field
    await this.prisma.wks_waitingList.update({
      where: { id: trimmedId },
      data: { isPromoLinked: hasActivePromo },
    });

    this.logger.debug(
      `[UPDATE PROMO LINKED] Waiting list ${trimmedId}: isPromoLinked = ${hasActivePromo}`,
    );
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
