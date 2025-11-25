import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { init } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageResponseDto } from './dto/response-image.dto';

const createImageId = init({ length: 21 });

const IMAGE_SELECT = {
  id: true,
  waitingList_id: true,
  branch_id: true,
  imageURL: true,
  title: true,
  description: true,
  isPrimary: true,
  seq: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
} as const satisfies Prisma.wks_ImagesSelect;

type ImageWithRelations = Prisma.wks_ImagesGetPayload<{
  select: typeof IMAGE_SELECT;
}>;

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly imageSelect = IMAGE_SELECT;

  async create(createImageDto: CreateImageDto): Promise<ImageResponseDto> {
    // Validasi waitingList exists
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: createImageDto.waitingListId, isDeleted: false },
      select: { id: true },
    });

    if (!waitingList) {
      throw new NotFoundException('Waiting list tidak ditemukan');
    }

    // Validasi branch jika disediakan
    if (createImageDto.branchId) {
      const branch = await this.prisma.sys_Branch.findUnique({
        where: { id: createImageDto.branchId },
        select: { id: true },
      });

      if (!branch) {
        throw new NotFoundException('Branch tidak ditemukan');
      }
    }

    // Jika isPrimary = true, set semua image lain dari waitingList yang sama menjadi false
    if (createImageDto.isPrimary) {
      await this.prisma.wks_Images.updateMany({
        where: {
          waitingList_id: createImageDto.waitingListId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    const id = await this.generateId();

    const image = await this.prisma.$transaction(async (tx) => {
      const created = await tx.wks_Images.create({
        data: {
          id,
          waitingList_id: createImageDto.waitingListId,
          branch_id: createImageDto.branchId ?? null,
          imageURL: createImageDto.imageURL,
          title: createImageDto.title ?? null,
          description: createImageDto.description ?? null,
          isPrimary: createImageDto.isPrimary ?? false,
          seq: createImageDto.seq ?? 0,
          createdBy: 'website',
          updatedBy: 'website',
        },
        select: this.imageSelect,
      });

      return created;
    });

    return this.toResponse(image);
  }

  async findAll(waitingListId?: string, branchId?: string): Promise<ImageResponseDto[]> {
    const where: Prisma.wks_ImagesWhereInput = {
      isActive: true,
    };

    if (waitingListId) {
      where.waitingList_id = waitingListId;
    }

    if (branchId) {
      where.branch_id = branchId;
    }

    const images = await this.prisma.wks_Images.findMany({
      where,
      select: this.imageSelect,
      orderBy: [{ seq: 'asc' }, { createdAt: 'desc' }],
    });

    return images.map((image) => this.toResponse(image));
  }

  async findOne(id: string): Promise<ImageResponseDto> {
    const image = await this.prisma.wks_Images.findFirst({
      where: { id, isActive: true },
      select: this.imageSelect,
    });

    if (!image) {
      throw new NotFoundException('Image tidak ditemukan');
    }

    return this.toResponse(image);
  }

  async update(
    id: string,
    updateImageDto: UpdateImageDto,
  ): Promise<ImageResponseDto> {
    const existing = await this.prisma.wks_Images.findFirst({
      where: { id, isActive: true },
      select: { id: true, waitingList_id: true },
    });

    if (!existing) {
      throw new NotFoundException('Image tidak ditemukan');
    }

    // Validasi waitingList jika diupdate
    if (updateImageDto.waitingListId) {
      const waitingList = await this.prisma.wks_waitingList.findFirst({
        where: { id: updateImageDto.waitingListId, isDeleted: false },
        select: { id: true },
      });

      if (!waitingList) {
        throw new NotFoundException('Waiting list tidak ditemukan');
      }
    }

    // Validasi branch jika diupdate
    if (updateImageDto.branchId !== undefined) {
      if (updateImageDto.branchId) {
        const branch = await this.prisma.sys_Branch.findUnique({
          where: { id: updateImageDto.branchId },
          select: { id: true },
        });

        if (!branch) {
          throw new NotFoundException('Branch tidak ditemukan');
        }
      }
    }

    // Jika isPrimary = true, set semua image lain dari waitingList yang sama menjadi false
    const targetWaitingListId = updateImageDto.waitingListId ?? existing.waitingList_id;
    if (updateImageDto.isPrimary === true) {
      await this.prisma.wks_Images.updateMany({
        where: {
          waitingList_id: targetWaitingListId,
          isPrimary: true,
          NOT: { id },
        },
        data: { isPrimary: false },
      });
    }

    const updateData: Prisma.wks_ImagesUpdateInput = {};

    if (updateImageDto.waitingListId !== undefined) {
      updateData.waitingList = {
        connect: { id: updateImageDto.waitingListId },
      };
    }

    if (updateImageDto.branchId !== undefined) {
      if (updateImageDto.branchId) {
        updateData.branch = {
          connect: { id: updateImageDto.branchId },
        };
      } else {
        updateData.branch = {
          disconnect: true,
        };
      }
    }

    if (updateImageDto.imageURL !== undefined) {
      updateData.imageURL = updateImageDto.imageURL;
    }

    if (updateImageDto.title !== undefined) {
      updateData.title = updateImageDto.title ?? null;
    }

    if (updateImageDto.description !== undefined) {
      updateData.description = updateImageDto.description ?? null;
    }

    if (updateImageDto.isPrimary !== undefined) {
      updateData.isPrimary = updateImageDto.isPrimary;
    }

    if (updateImageDto.seq !== undefined) {
      updateData.seq = updateImageDto.seq ?? 0;
    }

    updateData.updatedBy = 'website';

    const updated = await this.prisma.wks_Images.update({
      where: { id },
      data: updateData,
      select: this.imageSelect,
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<ImageResponseDto> {
    const existing = await this.prisma.wks_Images.findFirst({
      where: { id, isActive: true },
      select: this.imageSelect,
    });

    if (!existing) {
      throw new NotFoundException('Image tidak ditemukan');
    }

    // Soft delete
    const deleted = await this.prisma.wks_Images.update({
      where: { id },
      data: { isActive: false, updatedBy: 'website' },
      select: this.imageSelect,
    });

    return this.toResponse(deleted);
  }

  private async generateId(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = createImageId();

      const exists = await this.prisma.wks_Images.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) {
        return id;
      }
    }

    throw new InternalServerErrorException(
      'Gagal menghasilkan ID image unik',
    );
  }

  private toResponse(data: ImageWithRelations): ImageResponseDto {
    return {
      id: data.id,
      waitingListId: data.waitingList_id,
      branchId: data.branch_id,
      imageURL: data.imageURL,
      title: data.title,
      description: data.description,
      isPrimary: data.isPrimary,
      seq: data.seq,
      isActive: data.isActive,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  }
}

