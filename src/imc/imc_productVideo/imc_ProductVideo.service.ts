import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Imc_CreateProductVideoDto } from './dto/imc_CreateProductVideo.dto';
import { Imc_UpdateProductVideoDto } from './dto/imc_UpdateProductVideo.dto';
import { Imc_ResponseProductVideoDto } from './dto/imc_ResponseProductVideo.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class imc_ProductVideoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductVideoDto: Imc_CreateProductVideoDto,
  ): Promise<Imc_ResponseProductVideoDto> {
    const { company_id, product_id, id = undefined } = createProductVideoDto;

    console.log('🚀 Creating product video with DTO:', createProductVideoDto);

    // Validasi id jika dikirim
    if (id) {
      const existingVideo = await this.prisma.imc_ProductVideo.findUnique({
        where: {
          product_id_company_id_id: {
            product_id,
            company_id,
            id,
          },
        },
      });
      if (existingVideo) {
        throw new BadRequestException(`Video with ID ${id} already exists`);
      }
    }

    // Calculate next sequence number based on highest existing seq value
    let nextSeq = 1;
    const existingVideos = await this.prisma.imc_ProductVideo.findMany({
      where: {
        product_id: createProductVideoDto.product_id,
        company_id,
      },
      orderBy: { seq: 'desc' },
      take: 1,
    });

    if (existingVideos.length > 0) {
      const maxSeq = existingVideos[0].seq || 0;
      nextSeq = maxSeq + 1;
    }

    console.log('🔢 Calculated seq in backend:', {
      existingVideosCount: existingVideos.length,
      maxExistingSeq: existingVideos.length > 0 ? existingVideos[0].seq : 0,
      nextSeq,
    });

    // If this is the first video for the product, make it primary
    if (createProductVideoDto.isPrimary) {
      await this.prisma.imc_ProductVideo.updateMany({
        where: {
          product_id: createProductVideoDto.product_id,
          company_id,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    console.log(
      '📤 Creating product video in database with calculated seq:',
      nextSeq,
    );

    const productVideo = await this.prisma.imc_ProductVideo.create({
      data: {
        id: id || uuidv4(),
        ...createProductVideoDto,
        seq: nextSeq, // Use calculated seq
        updatedAt: new Date(),
        updatedBy: createProductVideoDto.updatedBy ?? '',
      },
    });

    console.log(
      '✅ Product video created successfully with seq:',
      productVideo.seq,
    );

    return {
      id: productVideo.id,
      product_id: productVideo.product_id,
      videoURL: productVideo.videoURL,
      isPrimary: productVideo.isPrimary,
      seq: productVideo.seq ?? 0,
      createdBy:
        productVideo.createdBy === null ? undefined : productVideo.createdBy,
      createdAt: productVideo.createdAt,
      updatedBy: productVideo.updatedBy,
      updatedAt: productVideo.updatedAt,
      company_id: productVideo.company_id,
    };
  }

  async findAll(
    company_id: string,
    product_id?: string,
  ): Promise<Imc_ResponseProductVideoDto[]> {
    const where: any = { company_id };

    if (product_id) {
      where.product_id = product_id;
    }

    const videos = await this.prisma.imc_ProductVideo.findMany({
      where,
      orderBy: [{ isPrimary: 'desc' }, { seq: 'asc' }, { createdAt: 'desc' }],
    });

    return videos.map((video) => ({
      id: video.id,
      product_id: video.product_id,
      videoURL: video.videoURL,
      isPrimary: video.isPrimary,
      seq: video.seq ?? 0,
      createdBy: video.createdBy === null ? undefined : video.createdBy,
      createdAt: video.createdAt,
      updatedBy: video.updatedBy,
      updatedAt: video.updatedAt,
      company_id: video.company_id,
    }));
  }

  async findOne(
    company_id: string,
    id: string,
  ): Promise<Imc_ResponseProductVideoDto> {
    const productVideo = await this.prisma.imc_ProductVideo.findFirst({
      where: {
        id,
        company_id,
      },
    });

    if (!productVideo) {
      throw new NotFoundException(`Product video with ID ${id} not found`);
    }

    return {
      id: productVideo.id,
      product_id: productVideo.product_id,
      videoURL: productVideo.videoURL,
      isPrimary: productVideo.isPrimary,
      seq: productVideo.seq ?? 0,
      createdBy:
        productVideo.createdBy === null ? undefined : productVideo.createdBy,
      createdAt: productVideo.createdAt,
      updatedBy: productVideo.updatedBy,
      updatedAt: productVideo.updatedAt,
      company_id: productVideo.company_id,
    };
  }

  async findByProduct(
    company_id: string,
    product_id: string,
  ): Promise<Imc_ResponseProductVideoDto[]> {
    const videos = await this.prisma.imc_ProductVideo.findMany({
      where: {
        product_id,
        company_id,
      },
      orderBy: [{ isPrimary: 'desc' }, { seq: 'asc' }, { createdAt: 'desc' }],
    });

    return videos.map((video) => ({
      id: video.id,
      product_id: video.product_id,
      videoURL: video.videoURL,
      isPrimary: video.isPrimary,
      seq: video.seq ?? 0,
      createdBy: video.createdBy === null ? undefined : video.createdBy,
      createdAt: video.createdAt,
      updatedBy: video.updatedBy,
      updatedAt: video.updatedAt,
      company_id: video.company_id,
    }));
  }

  async update(
    id: string,
    company_id: string,
    updateProductVideoDto: Imc_UpdateProductVideoDto,
  ): Promise<Imc_ResponseProductVideoDto> {
    // Check if product video exists
    const existingVideo = await this.prisma.imc_ProductVideo.findFirst({
      where: {
        id,
        company_id,
      },
    });

    if (!existingVideo) {
      throw new NotFoundException(`Product video with ID ${id} not found`);
    }

    // If setting this video as primary, unset others
    if (updateProductVideoDto.isPrimary) {
      await this.prisma.imc_ProductVideo.updateMany({
        where: {
          product_id: existingVideo.product_id,
          company_id,
          id: { not: id },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const updatedVideo = await this.prisma.imc_ProductVideo.update({
      where: {
        product_id_company_id_id: {
          product_id: existingVideo.product_id,
          company_id: existingVideo.company_id,
          id: existingVideo.id,
        },
      },
      data: {
        ...updateProductVideoDto,
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedVideo.id,
      product_id: updatedVideo.product_id,
      videoURL: updatedVideo.videoURL,
      isPrimary: updatedVideo.isPrimary,
      seq: updatedVideo.seq ?? 0,
      createdBy:
        updatedVideo.createdBy === null ? undefined : updatedVideo.createdBy,
      createdAt: updatedVideo.createdAt,
      updatedBy: updatedVideo.updatedBy,
      updatedAt: updatedVideo.updatedAt,
      company_id: updatedVideo.company_id,
    };
  }

  async remove(company_id: string, id: string): Promise<void> {
    const productVideo = await this.prisma.imc_ProductVideo.findFirst({
      where: {
        id,
        company_id,
      },
    });

    if (!productVideo) {
      throw new NotFoundException(`Product video with ID ${id} not found`);
    }

    await this.prisma.imc_ProductVideo.delete({
      where: {
        product_id_company_id_id: {
          product_id: productVideo.product_id,
          company_id: productVideo.company_id,
          id: productVideo.id,
        },
      },
    });
  }

  async setPrimaryVideo(
    company_id: string,
    product_id: string,
    video_id: string,
  ): Promise<{
    message: string;
    updatedVideos: Imc_ResponseProductVideoDto[];
  }> {
    console.log('🔄 Setting primary video:', {
      company_id,
      product_id,
      video_id,
    });

    try {
      // Use transaction to ensure all updates succeed or fail together
      const result = await this.prisma.$transaction(async (tx) => {
        // First, unset all primary videos for this product
        await tx.imc_ProductVideo.updateMany({
          where: {
            product_id,
            company_id,
          },
          data: {
            isPrimary: false,
          },
        });

        // Then set the specified video as primary
        const primaryVideo = await tx.imc_ProductVideo.update({
          where: {
            product_id_company_id_id: {
              product_id,
              company_id,
              id: video_id,
            },
          },
          data: {
            isPrimary: true,
            updatedAt: new Date(),
          },
        });

        // Get all videos for this product to reorder them
        const allVideos = await tx.imc_ProductVideo.findMany({
          where: {
            product_id,
            company_id,
          },
          orderBy: [
            { isPrimary: 'desc' }, // Primary video first
            { createdAt: 'asc' }, // Then by creation date
          ],
        });

        // Reorder videos: primary gets seq=1, others get seq=2,3,4...
        const reorderPromises = allVideos.map(async (video, idx) => {
          const newSeq = idx + 1;

          const updatedVideo = await tx.imc_ProductVideo.update({
            where: {
              product_id_company_id_id: {
                product_id,
                company_id,
                id: video.id,
              },
            },
            data: {
              seq: newSeq,
              updatedAt: new Date(),
              updatedBy: 'system',
            },
          });

          return {
            id: updatedVideo.id,
            product_id: updatedVideo.product_id,
            videoURL: updatedVideo.videoURL,
            isPrimary: updatedVideo.isPrimary,
            seq: updatedVideo.seq ?? 0,
            createdBy:
              updatedVideo.createdBy === null
                ? undefined
                : updatedVideo.createdBy,
            createdAt: updatedVideo.createdAt,
            updatedBy: updatedVideo.updatedBy,
            updatedAt: updatedVideo.updatedAt,
            company_id: updatedVideo.company_id,
          };
        });

        const updatedVideos = await Promise.all(reorderPromises);
        return updatedVideos;
      });

      console.log(
        '✅ Primary video set and reordering completed:',
        result.map((vid) => ({
          id: vid.id,
          seq: vid.seq,
          isPrimary: vid.isPrimary,
        })),
      );

      return {
        message: 'Primary video set successfully and order updated',
        updatedVideos: result,
      };
    } catch (error) {
      console.error('❌ Error setting primary video:', error);
      throw new BadRequestException('Failed to set primary video');
    }
  }

  async getPrimaryVideo(
    company_id: string,
    product_id: string,
  ): Promise<Imc_ResponseProductVideoDto | null> {
    const video = await this.prisma.imc_ProductVideo.findFirst({
      where: {
        product_id,
        company_id,
        isPrimary: true,
      },
    });

    if (!video) return null;

    return {
      id: video.id,
      product_id: video.product_id,
      videoURL: video.videoURL,
      isPrimary: video.isPrimary,
      seq: video.seq ?? 0,
      createdBy: video.createdBy === null ? undefined : video.createdBy,
      createdAt: video.createdAt,
      updatedBy: video.updatedBy,
      updatedAt: video.updatedAt,
      company_id: video.company_id,
    };
  }

  async reorderVideos(
    company_id: string,
    product_id: string,
    videos: Array<{ id: string; seq: number }>,
  ): Promise<{
    message: string;
    updatedVideos: Imc_ResponseProductVideoDto[];
  }> {
    console.log('🔄 Reordering videos for product:', {
      company_id,
      product_id,
      videos,
    });

    try {
      console.log('🔍 Input validation:', {
        videosCount: videos.length,
        videos: videos.map((vid) => ({
          id: vid.id,
          seq: vid.seq,
          seqType: typeof vid.seq,
        })),
      });

      // Use transaction to ensure all updates succeed or fail together
      const result = await this.prisma.$transaction(async (tx) => {
        // Check if any video is being moved to seq: 1
        const videoMovingToSeq1 = videos.find((vid) => vid.seq === 1);

        if (videoMovingToSeq1) {
          console.log(
            '🔄 Video moving to seq: 1, checking if auto-primary needed:',
            videoMovingToSeq1.id,
          );

          // Get current primary video
          const currentPrimary = await tx.imc_ProductVideo.findFirst({
            where: {
              product_id,
              company_id,
              isPrimary: true,
            },
          });

          // If video moving to seq: 1 is NOT currently primary, make it primary
          if (currentPrimary && currentPrimary.id !== videoMovingToSeq1.id) {
            console.log(
              '🔄 Auto-setting video to primary:',
              videoMovingToSeq1.id,
            );

            // Unset current primary
            await tx.imc_ProductVideo.update({
              where: {
                product_id_company_id_id: {
                  product_id,
                  company_id,
                  id: currentPrimary.id,
                },
              },
              data: {
                isPrimary: false,
                updatedAt: new Date(),
                updatedBy: 'system',
              },
            });

            // Set new primary
            await tx.imc_ProductVideo.update({
              where: {
                product_id_company_id_id: {
                  product_id,
                  company_id,
                  id: videoMovingToSeq1.id,
                },
              },
              data: {
                isPrimary: true,
                updatedAt: new Date(),
                updatedBy: 'system',
              },
            });
          }
        }

        // Sort videos by seq to ensure proper order
        const sortedVideos = [...videos].sort((a, b) => a.seq - b.seq);

        console.log(
          '📊 Sorted videos for reordering:',
          sortedVideos.map((vid) => ({ id: vid.id, seq: vid.seq })),
        );

        const updatePromises = sortedVideos.map(async (vid) => {
          const updatedVideo = await tx.imc_ProductVideo.update({
            where: {
              product_id_company_id_id: {
                product_id,
                company_id,
                id: vid.id,
              },
            },
            data: {
              seq: vid.seq,
              updatedAt: new Date(),
              updatedBy: 'system',
              // Don't update other fields to avoid validation issues
            },
          });

          return {
            id: updatedVideo.id,
            product_id: updatedVideo.product_id,
            videoURL: updatedVideo.videoURL,
            isPrimary: updatedVideo.isPrimary,
            seq: updatedVideo.seq ?? 0,
            createdBy:
              updatedVideo.createdBy === null
                ? undefined
                : updatedVideo.createdBy,
            createdAt: updatedVideo.createdAt,
            updatedBy: updatedVideo.updatedBy,
            updatedAt: updatedVideo.updatedAt,
            company_id: updatedVideo.company_id,
          };
        });

        const updatedVideos = await Promise.all(updatePromises);
        return updatedVideos;
      });

      console.log(
        '✅ Videos reordered successfully:',
        result.map((vid) => ({ id: vid.id, seq: vid.seq })),
      );

      return {
        message: 'Videos reordered successfully',
        updatedVideos: result,
      };
    } catch (error) {
      console.error('❌ Error reordering videos:', error);
      throw new BadRequestException('Failed to reorder videos');
    }
  }

  async autoReorderAfterDelete(
    company_id: string,
    product_id: string,
  ): Promise<{
    message: string;
    updatedVideos: Imc_ResponseProductVideoDto[];
  }> {
    console.log('🔄 Auto-reordering videos after deletion for product:', {
      company_id,
      product_id,
    });

    try {
      // Get all remaining videos for this product
      const remainingVideos = await this.prisma.imc_ProductVideo.findMany({
        where: {
          product_id,
          company_id,
        },
        orderBy: { seq: 'asc' },
      });

      if (remainingVideos.length === 0) {
        console.log('ℹ️ No videos remaining, nothing to reorder');
        return {
          message: 'No videos remaining',
          updatedVideos: [],
        };
      }

      // Update seq values to be sequential (1, 2, 3, ...)
      const result = await this.prisma.$transaction(async (tx) => {
        const updatePromises = remainingVideos.map(async (video, idx) => {
          const newSeq = idx + 1;

          const updatedVideo = await tx.imc_ProductVideo.update({
            where: {
              product_id_company_id_id: {
                product_id,
                company_id,
                id: video.id,
              },
            },
            data: {
              seq: newSeq,
              updatedAt: new Date(),
              updatedBy: 'system',
            },
          });

          return {
            id: updatedVideo.id,
            product_id: updatedVideo.product_id,
            videoURL: updatedVideo.videoURL,
            isPrimary: updatedVideo.isPrimary,
            seq: updatedVideo.seq ?? 0,
            createdBy:
              updatedVideo.createdBy === null
                ? undefined
                : updatedVideo.createdBy,
            createdAt: updatedVideo.createdAt,
            updatedBy: updatedVideo.updatedBy,
            updatedAt: updatedVideo.updatedAt,
            company_id: updatedVideo.company_id,
          };
        });

        const updatedVideos = await Promise.all(updatePromises);
        return updatedVideos;
      });

      console.log(
        '✅ Auto-reorder completed successfully:',
        result.map((vid) => ({ id: vid.id, seq: vid.seq })),
      );

      return {
        message: 'Videos auto-reordered successfully after deletion',
        updatedVideos: result,
      };
    } catch (error) {
      console.error('❌ Error in auto-reorder after deletion:', error);
      throw new BadRequestException(
        'Failed to auto-reorder videos after deletion',
      );
    }
  }
}

