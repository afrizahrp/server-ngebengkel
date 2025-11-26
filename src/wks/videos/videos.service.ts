import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { init } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { CreateBatchVideosDto } from './dto/create-batch-videos.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/response-video.dto';
import { UploadNotificationService } from '../waiting-list/services/upload-notification.service';

const createVideoId = init({ length: 21 });

const VIDEO_SELECT = {
  id: true,
  waitingList_id: true,
  branch_id: true,
  videoURL: true,
  thumbnailURL: true,
  title: true,
  description: true,
  duration: true,
  isPrimary: true,
  seq: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
} as const satisfies Prisma.wks_videosSelect;

type VideoWithRelations = Prisma.wks_videosGetPayload<{
  select: typeof VIDEO_SELECT;
}>;

@Injectable()
export class VideosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadNotificationService: UploadNotificationService,
  ) {}

  private readonly videoSelect = VIDEO_SELECT;

  async create(createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    // Validasi waitingList exists
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: createVideoDto.waitingListId, isDeleted: false },
      select: { id: true },
    });

    if (!waitingList) {
      throw new NotFoundException('Waiting list tidak ditemukan');
    }

    // Validasi branch jika disediakan
    if (createVideoDto.branchId) {
      const branch = await this.prisma.sys_Branch.findUnique({
        where: { id: createVideoDto.branchId },
        select: { id: true },
      });

      if (!branch) {
        throw new NotFoundException('Branch tidak ditemukan');
      }
    }

    // Jika isPrimary = true, set semua video lain dari waitingList yang sama menjadi false
    if (createVideoDto.isPrimary) {
      await this.prisma.wks_videos.updateMany({
        where: {
          waitingList_id: createVideoDto.waitingListId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    const id = await this.generateId();

    const video = await this.prisma.$transaction(async (tx) => {
      const created = await tx.wks_videos.create({
        data: {
          id,
          waitingList_id: createVideoDto.waitingListId,
          branch_id: createVideoDto.branchId ?? null,
          videoURL: createVideoDto.videoURL,
          thumbnailURL: createVideoDto.thumbnailURL ?? null,
          title: createVideoDto.title ?? null,
          description: createVideoDto.description ?? null,
          duration: createVideoDto.duration ?? null,
          isPrimary: createVideoDto.isPrimary ?? false,
          seq: createVideoDto.seq ?? 0,
          createdBy: 'website',
          updatedBy: 'website',
        },
        select: this.videoSelect,
      });

      return created;
    });

    // TODO: Konfirmasi WhatsApp otomatis - sementara di-comment untuk manual confirmation
    // Kirim konfirmasi WhatsApp setelah upload berhasil (async, tidak blocking)
    // this.uploadNotificationService
    //   .sendVideoUploadConfirmation(createVideoDto.waitingListId)
    //   .catch((error) => {
    //     // Error sudah di-handle di service, hanya log di sini jika perlu
    //     console.error('Failed to send upload confirmation:', error);
    //   });

    return this.toResponse(video);
  }

  async createBatch(createBatchVideosDto: CreateBatchVideosDto): Promise<VideoResponseDto[]> {
    const { waitingListId, branchId, videos } = createBatchVideosDto;

    // Validasi waitingList exists
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: waitingListId, isDeleted: false },
      select: { id: true },
    });

    if (!waitingList) {
      throw new NotFoundException('Waiting list tidak ditemukan');
    }

    // Validasi branch jika disediakan
    if (branchId) {
      const branch = await this.prisma.sys_Branch.findUnique({
        where: { id: branchId },
        select: { id: true },
      });

      if (!branch) {
        throw new NotFoundException('Branch tidak ditemukan');
      }
    }

    // Cek apakah ada video dengan isPrimary = true
    const hasPrimary = videos.some((vid) => vid.isPrimary === true);
    if (hasPrimary) {
      // Set semua video lain dari waitingList yang sama menjadi false
      await this.prisma.wks_videos.updateMany({
        where: {
          waitingList_id: waitingListId,
          isPrimary: true,
        },
        data: { isPrimary: false },
      });
    }

    // Generate IDs untuk semua videos
    const ids = await Promise.all(
      Array.from({ length: videos.length }, () => this.generateId()),
    );

    // Create semua videos dalam transaction
    const createdVideos = await this.prisma.$transaction(async (tx) => {
      const results: VideoWithRelations[] = [];
      for (let i = 0; i < videos.length; i++) {
        const videoData = videos[i];
        const created = await tx.wks_videos.create({
          data: {
            id: ids[i],
            waitingList_id: waitingListId,
            branch_id: branchId ?? null,
            videoURL: videoData.videoURL,
            thumbnailURL: videoData.thumbnailURL ?? null,
            title: videoData.title ?? null,
            description: videoData.description ?? null,
            duration: videoData.duration ?? null,
            isPrimary: videoData.isPrimary ?? false,
            seq: videoData.seq ?? i,
            createdBy: 'website',
            updatedBy: 'website',
          },
          select: this.videoSelect,
        });
        results.push(created);
      }
      return results;
    });

    // TODO: Konfirmasi WhatsApp otomatis - sementara di-comment untuk manual confirmation
    // Kirim konfirmasi WhatsApp setelah batch upload berhasil (async, tidak blocking)
    // Hanya kirim sekali untuk seluruh batch
    // this.uploadNotificationService
    //   .sendVideoUploadConfirmation(waitingListId)
    //   .catch((error) => {
    //     // Error sudah di-handle di service, hanya log di sini jika perlu
    //     console.error('Failed to send batch upload confirmation:', error);
    //   });

    return createdVideos.map((video) => this.toResponse(video));
  }

  async findAll(waitingListId?: string, branchId?: string): Promise<VideoResponseDto[]> {
    const where: Prisma.wks_videosWhereInput = {
      isActive: true,
    };

    if (waitingListId) {
      where.waitingList_id = waitingListId;
    }

    if (branchId) {
      where.branch_id = branchId;
    }

    const videos = await this.prisma.wks_videos.findMany({
      where,
      select: this.videoSelect,
      orderBy: [{ seq: 'asc' }, { createdAt: 'desc' }],
    });

    return videos.map((video) => this.toResponse(video));
  }

  async findOne(id: string): Promise<VideoResponseDto> {
    const video = await this.prisma.wks_videos.findFirst({
      where: { id, isActive: true },
      select: this.videoSelect,
    });

    if (!video) {
      throw new NotFoundException('Video tidak ditemukan');
    }

    return this.toResponse(video);
  }

  async update(
    id: string,
    updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    const existing = await this.prisma.wks_videos.findFirst({
      where: { id, isActive: true },
      select: { id: true, waitingList_id: true },
    });

    if (!existing) {
      throw new NotFoundException('Video tidak ditemukan');
    }

    // Validasi waitingList jika diupdate
    if (updateVideoDto.waitingListId) {
      const waitingList = await this.prisma.wks_waitingList.findFirst({
        where: { id: updateVideoDto.waitingListId, isDeleted: false },
        select: { id: true },
      });

      if (!waitingList) {
        throw new NotFoundException('Waiting list tidak ditemukan');
      }
    }

    // Validasi branch jika diupdate
    if (updateVideoDto.branchId !== undefined) {
      if (updateVideoDto.branchId) {
        const branch = await this.prisma.sys_Branch.findUnique({
          where: { id: updateVideoDto.branchId },
          select: { id: true },
        });

        if (!branch) {
          throw new NotFoundException('Branch tidak ditemukan');
        }
      }
    }

    // Jika isPrimary = true, set semua video lain dari waitingList yang sama menjadi false
    const targetWaitingListId = updateVideoDto.waitingListId ?? existing.waitingList_id;
    if (updateVideoDto.isPrimary === true) {
      await this.prisma.wks_videos.updateMany({
        where: {
          waitingList_id: targetWaitingListId,
          isPrimary: true,
          NOT: { id },
        },
        data: { isPrimary: false },
      });
}

    const updateData: Prisma.wks_videosUpdateInput = {};

    if (updateVideoDto.waitingListId !== undefined) {
      updateData.waitingList = {
        connect: { id: updateVideoDto.waitingListId },
      };
    }

    if (updateVideoDto.branchId !== undefined) {
      if (updateVideoDto.branchId) {
        updateData.branch = {
          connect: { id: updateVideoDto.branchId },
        };
      } else {
        updateData.branch = {
          disconnect: true,
        };
      }
    }

    if (updateVideoDto.videoURL !== undefined) {
      updateData.videoURL = updateVideoDto.videoURL;
    }

    if (updateVideoDto.thumbnailURL !== undefined) {
      updateData.thumbnailURL = updateVideoDto.thumbnailURL ?? null;
    }

    if (updateVideoDto.title !== undefined) {
      updateData.title = updateVideoDto.title ?? null;
    }

    if (updateVideoDto.description !== undefined) {
      updateData.description = updateVideoDto.description ?? null;
    }

    if (updateVideoDto.duration !== undefined) {
      updateData.duration = updateVideoDto.duration ?? null;
    }

    if (updateVideoDto.isPrimary !== undefined) {
      updateData.isPrimary = updateVideoDto.isPrimary;
    }

    if (updateVideoDto.seq !== undefined) {
      updateData.seq = updateVideoDto.seq ?? 0;
    }

    updateData.updatedBy = 'website';

    const updated = await this.prisma.wks_videos.update({
      where: { id },
      data: updateData,
      select: this.videoSelect,
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<VideoResponseDto> {
    const existing = await this.prisma.wks_videos.findFirst({
      where: { id, isActive: true },
      select: this.videoSelect,
    });

    if (!existing) {
      throw new NotFoundException('Video tidak ditemukan');
    }

    // Soft delete
    const deleted = await this.prisma.wks_videos.update({
      where: { id },
      data: { isActive: false, updatedBy: 'website' },
      select: this.videoSelect,
    });

    return this.toResponse(deleted);
  }

  private async generateId(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = createVideoId();

      const exists = await this.prisma.wks_videos.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) {
        return id;
      }
    }

    throw new InternalServerErrorException(
      'Gagal menghasilkan ID video unik',
    );
  }

  private toResponse(data: VideoWithRelations): VideoResponseDto {
    return {
      id: data.id,
      waitingListId: data.waitingList_id,
      branchId: data.branch_id,
      videoURL: data.videoURL,
      thumbnailURL: data.thumbnailURL,
      title: data.title,
      description: data.description,
      duration: data.duration,
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

