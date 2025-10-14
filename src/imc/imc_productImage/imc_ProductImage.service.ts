import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Imc_CreateProductImageDto } from './dto/imc_CreateProductImage.dto';
import { Imc_UpdateProductImageDto } from './dto/imc_UpdateProductImage.dto';
import { Imc_ResponseProductImageDto } from './dto/imc_ResponseProductImage.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class imc_ProductImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductImageDto: Imc_CreateProductImageDto,
  ): Promise<Imc_ResponseProductImageDto> {
    const { company_id, product_id, id = undefined } = createProductImageDto;

    console.log('🚀 Creating product image with DTO:', createProductImageDto);

    // Validasi id jika dikirim
    if (id) {
      const existingImage = await this.prisma.imc_ProductImage.findUnique({
        where: {
          product_id_company_id_id: {
            product_id,
            company_id,
            id,
          },
        },
      });
      if (existingImage) {
        throw new BadRequestException(`Image with ID ${id} already exists`);
      }
    }

    // Calculate next sequence number based on highest existing seq value
    let nextSeq = 1;
    const existingImages = await this.prisma.imc_ProductImage.findMany({
      where: {
        product_id: createProductImageDto.product_id,
        company_id,
      },
      orderBy: { seq: 'desc' },
      take: 1,
    });

    if (existingImages.length > 0) {
      const maxSeq = existingImages[0].seq || 0;
      nextSeq = maxSeq + 1;
    }

    console.log('🔢 Calculated seq in backend:', {
      existingImagesCount: existingImages.length,
      maxExistingSeq: existingImages.length > 0 ? existingImages[0].seq : 0,
      nextSeq,
    });

    // If this is the first image for the product, make it primary
    if (createProductImageDto.isPrimary) {
      await this.prisma.imc_ProductImage.updateMany({
        where: {
          product_id: createProductImageDto.product_id,
          company_id,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    console.log(
      '📤 Creating product image in database with calculated seq:',
      nextSeq,
    );

    const productImage = await this.prisma.imc_ProductImage.create({
      data: {
        id: id || uuidv4(),
        ...createProductImageDto,
        seq: nextSeq, // Use calculated seq
        updatedAt: new Date(),
        updatedBy: createProductImageDto.updatedBy ?? '',
      },
    });

    console.log(
      '✅ Product image created successfully with seq:',
      productImage.seq,
    );

    return {
      id: productImage.id,
      product_id: productImage.product_id,
      imageURL: productImage.imageURL,
      isPrimary: productImage.isPrimary,
      isBrochure: productImage.isBrochure ?? false,
      seq: productImage.seq ?? 0,
      createdBy:
        productImage.createdBy === null ? undefined : productImage.createdBy,
      createdAt: productImage.createdAt,
      updatedBy: productImage.updatedBy,
      updatedAt: productImage.updatedAt,
      company_id: productImage.company_id,
    };
  }

  async findAll(
    company_id: string,
    product_id?: string,
  ): Promise<Imc_ResponseProductImageDto[]> {
    const where: any = { company_id };

    if (product_id) {
      where.product_id = product_id;
    }

    const images = await this.prisma.imc_ProductImage.findMany({
      where,
      orderBy: [{ isPrimary: 'desc' }, { seq: 'asc' }, { createdAt: 'desc' }],
    });

    return images.map((image) => ({
      id: image.id,
      product_id: image.product_id,
      imageURL: image.imageURL,
      isPrimary: image.isPrimary,
      isBrochure: image.isBrochure ?? false,
      seq: image.seq ?? 0,
      createdBy: image.createdBy === null ? undefined : image.createdBy,
      createdAt: image.createdAt,
      updatedBy: image.updatedBy,
      updatedAt: image.updatedAt,
      company_id: image.company_id,
    }));
  }

  async findOne(
    company_id: string,
    id: string,
  ): Promise<Imc_ResponseProductImageDto> {
    const productImage = await this.prisma.imc_ProductImage.findFirst({
      where: {
        id,
        company_id,
      },
    });

    if (!productImage) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }

    return {
      id: productImage.id,
      product_id: productImage.product_id,
      imageURL: productImage.imageURL,
      isPrimary: productImage.isPrimary,
      isBrochure: productImage.isBrochure ?? false,
      seq: productImage.seq ?? 0,
      createdBy:
        productImage.createdBy === null ? undefined : productImage.createdBy,
      createdAt: productImage.createdAt,
      updatedBy: productImage.updatedBy,
      updatedAt: productImage.updatedAt,
      company_id: productImage.company_id,
    };
  }

  async findByProduct(
    company_id: string,
    product_id: string,
  ): Promise<Imc_ResponseProductImageDto[]> {
    const images = await this.prisma.imc_ProductImage.findMany({
      where: {
        product_id,
        company_id,
      },
      orderBy: [{ isPrimary: 'desc' }, { seq: 'asc' }, { createdAt: 'desc' }],
    });

    return images.map((image) => ({
      id: image.id,
      product_id: image.product_id,
      imageURL: image.imageURL,
      isPrimary: image.isPrimary,
      isBrochure: image.isBrochure ?? false,
      seq: image.seq ?? 0,
      createdBy: image.createdBy === null ? undefined : image.createdBy,
      createdAt: image.createdAt,
      updatedBy: image.updatedBy,
      updatedAt: image.updatedAt,
      company_id: image.company_id,
    }));
  }

  async update(
    id: string,
    company_id: string,
    updateProductImageDto: Imc_UpdateProductImageDto,
  ): Promise<Imc_ResponseProductImageDto> {
    // Check if product image exists
    const existingImage = await this.prisma.imc_ProductImage.findFirst({
      where: {
        id,
        company_id,
      },
    });

    if (!existingImage) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }

    // If setting this image as primary, unset others
    if (updateProductImageDto.isPrimary) {
      await this.prisma.imc_ProductImage.updateMany({
        where: {
          product_id: existingImage.product_id,
          company_id,
          id: { not: id },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const updatedImage = await this.prisma.imc_ProductImage.update({
      where: {
        product_id_company_id_id: {
          product_id: existingImage.product_id,
          company_id: existingImage.company_id,
          id: existingImage.id,
        },
      },
      data: {
        ...updateProductImageDto,
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedImage.id,
      product_id: updatedImage.product_id,
      imageURL: updatedImage.imageURL,
      isPrimary: updatedImage.isPrimary,
      isBrochure: updatedImage.isBrochure ?? false,
      seq: updatedImage.seq ?? 0,
      createdBy:
        updatedImage.createdBy === null ? undefined : updatedImage.createdBy,
      createdAt: updatedImage.createdAt,
      updatedBy: updatedImage.updatedBy,
      updatedAt: updatedImage.updatedAt,
      company_id: updatedImage.company_id,
    };
  }

  async remove(company_id: string, id: string): Promise<void> {
    const productImage = await this.prisma.imc_ProductImage.findFirst({
      where: {
        id,
        company_id,
      },
    });

    if (!productImage) {
      throw new NotFoundException(`Product image with ID ${id} not found`);
    }

    await this.prisma.imc_ProductImage.delete({
      where: {
        product_id_company_id_id: {
          product_id: productImage.product_id,
          company_id: productImage.company_id,
          id: productImage.id,
        },
      },
    });
  }

  async setPrimaryImage(
    company_id: string,
    product_id: string,
    image_id: string,
  ): Promise<{
    message: string;
    updatedImages: Imc_ResponseProductImageDto[];
  }> {
    console.log('🔄 Setting primary image:', {
      company_id,
      product_id,
      image_id,
    });

    try {
      // Use transaction to ensure all updates succeed or fail together
      const result = await this.prisma.$transaction(async (tx) => {
        // First, unset all primary images for this product
        await tx.imc_ProductImage.updateMany({
          where: {
            product_id,
            company_id,
          },
          data: {
            isPrimary: false,
          },
        });

        // Then set the specified image as primary
        const primaryImage = await tx.imc_ProductImage.update({
          where: {
            product_id_company_id_id: {
              product_id,
              company_id,
              id: image_id,
            },
          },
          data: {
            isPrimary: true,
            updatedAt: new Date(),
          },
        });

        // Get all images for this product to reorder them
        const allImages = await tx.imc_ProductImage.findMany({
          where: {
            product_id,
            company_id,
          },
          orderBy: [
            { isPrimary: 'desc' }, // Primary image first
            { createdAt: 'asc' }, // Then by creation date
          ],
        });

        // Reorder images: primary gets seq=1, others get seq=2,3,4...
        const reorderPromises = allImages.map(async (image, idx) => {
          const newSeq = idx + 1;

          const updatedImage = await tx.imc_ProductImage.update({
            where: {
              product_id_company_id_id: {
                product_id,
                company_id,
                id: image.id,
              },
            },
            data: {
              seq: newSeq,
              updatedAt: new Date(),
              updatedBy: 'system',
            },
          });

          return {
            id: updatedImage.id,
            product_id: updatedImage.product_id,
            imageURL: updatedImage.imageURL,
            isPrimary: updatedImage.isPrimary,
            isBrochure: updatedImage.isBrochure ?? false,
            seq: updatedImage.seq ?? 0,
            createdBy:
              updatedImage.createdBy === null
                ? undefined
                : updatedImage.createdBy,
            createdAt: updatedImage.createdAt,
            updatedBy: updatedImage.updatedBy,
            updatedAt: updatedImage.updatedAt,
            company_id: updatedImage.company_id,
          };
        });

        const updatedImages = await Promise.all(reorderPromises);
        return updatedImages;
      });

      console.log(
        '✅ Primary image set and reordering completed:',
        result.map((img) => ({
          id: img.id,
          seq: img.seq,
          isPrimary: img.isPrimary,
        })),
      );

      return {
        message: 'Primary image set successfully and order updated',
        updatedImages: result,
      };
    } catch (error) {
      console.error('❌ Error setting primary image:', error);
      throw new BadRequestException('Failed to set primary image');
    }
  }

  async getPrimaryImage(
    company_id: string,
    product_id: string,
  ): Promise<Imc_ResponseProductImageDto | null> {
    const image = await this.prisma.imc_ProductImage.findFirst({
      where: {
        product_id,
        company_id,
        isPrimary: true,
      },
    });

    if (!image) return null;

    return {
      id: image.id,
      product_id: image.product_id,
      imageURL: image.imageURL,
      isPrimary: image.isPrimary,
      isBrochure: image.isBrochure ?? false,
      seq: image.seq ?? 0,
      createdBy: image.createdBy === null ? undefined : image.createdBy,
      createdAt: image.createdAt,
      updatedBy: image.updatedBy,
      updatedAt: image.updatedAt,
      company_id: image.company_id,
    };
  }

  async reorderImages(
    company_id: string,
    product_id: string,
    images: Array<{ id: string; seq: number }>,
  ): Promise<{
    message: string;
    updatedImages: Imc_ResponseProductImageDto[];
  }> {
    console.log('🔄 Reordering images for product:', {
      company_id,
      product_id,
      images,
    });

    try {
      console.log('🔍 Input validation:', {
        imagesCount: images.length,
        images: images.map((img) => ({
          id: img.id,
          seq: img.seq,
          seqType: typeof img.seq,
        })),
      });

      // Use transaction to ensure all updates succeed or fail together
      const result = await this.prisma.$transaction(async (tx) => {
        // Check if any image is being moved to seq: 1
        const imageMovingToSeq1 = images.find((img) => img.seq === 1);

        if (imageMovingToSeq1) {
          console.log(
            '🔄 Image moving to seq: 1, checking if auto-primary needed:',
            imageMovingToSeq1.id,
          );

          // Get current primary image
          const currentPrimary = await tx.imc_ProductImage.findFirst({
            where: {
              product_id,
              company_id,
              isPrimary: true,
            },
          });

          // If image moving to seq: 1 is NOT currently primary, make it primary
          if (currentPrimary && currentPrimary.id !== imageMovingToSeq1.id) {
            console.log(
              '🔄 Auto-setting image to primary:',
              imageMovingToSeq1.id,
            );

            // Unset current primary
            await tx.imc_ProductImage.update({
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
            await tx.imc_ProductImage.update({
              where: {
                product_id_company_id_id: {
                  product_id,
                  company_id,
                  id: imageMovingToSeq1.id,
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

        // Sort images by seq to ensure proper order
        const sortedImages = [...images].sort((a, b) => a.seq - b.seq);

        console.log(
          '📊 Sorted images for reordering:',
          sortedImages.map((img) => ({ id: img.id, seq: img.seq })),
        );

        const updatePromises = sortedImages.map(async (img) => {
          const updatedImage = await tx.imc_ProductImage.update({
            where: {
              product_id_company_id_id: {
                product_id,
                company_id,
                id: img.id,
              },
            },
            data: {
              seq: img.seq,
              updatedAt: new Date(),
              updatedBy: 'system',
              // Don't update other fields to avoid validation issues
            },
          });

          return {
            id: updatedImage.id,
            product_id: updatedImage.product_id,
            imageURL: updatedImage.imageURL,
            isPrimary: updatedImage.isPrimary,
            isBrochure: updatedImage.isBrochure ?? false,
            seq: updatedImage.seq ?? 0,
            createdBy:
              updatedImage.createdBy === null
                ? undefined
                : updatedImage.createdBy,
            createdAt: updatedImage.createdAt,
            updatedBy: updatedImage.updatedBy,
            updatedAt: updatedImage.updatedAt,
            company_id: updatedImage.company_id,
          };
        });

        const updatedImages = await Promise.all(updatePromises);
        return updatedImages;
      });

      console.log(
        '✅ Images reordered successfully:',
        result.map((img) => ({ id: img.id, seq: img.seq })),
      );

      return {
        message: 'Images reordered successfully',
        updatedImages: result,
      };
    } catch (error) {
      console.error('❌ Error reordering images:', error);
      throw new BadRequestException('Failed to reorder images');
    }
  }

  async autoReorderAfterDelete(
    company_id: string,
    product_id: string,
  ): Promise<{
    message: string;
    updatedImages: Imc_ResponseProductImageDto[];
  }> {
    console.log('🔄 Auto-reordering images after deletion for product:', {
      company_id,
      product_id,
    });

    try {
      // Get all remaining images for this product
      const remainingImages = await this.prisma.imc_ProductImage.findMany({
        where: {
          product_id,
          company_id,
        },
        orderBy: { seq: 'asc' },
      });

      if (remainingImages.length === 0) {
        console.log('ℹ️ No images remaining, nothing to reorder');
        return {
          message: 'No images remaining',
          updatedImages: [],
        };
      }

      // Update seq values to be sequential (1, 2, 3, ...)
      const result = await this.prisma.$transaction(async (tx) => {
        const updatePromises = remainingImages.map(async (image, idx) => {
          const newSeq = idx + 1;

          const updatedImage = await tx.imc_ProductImage.update({
            where: {
              product_id_company_id_id: {
                product_id,
                company_id,
                id: image.id,
              },
            },
            data: {
              seq: newSeq,
              updatedAt: new Date(),
              updatedBy: 'system',
            },
          });

          return {
            id: updatedImage.id,
            product_id: updatedImage.product_id,
            imageURL: updatedImage.imageURL,
            isPrimary: updatedImage.isPrimary,
            isBrochure: updatedImage.isBrochure ?? false,
            seq: updatedImage.seq ?? 0,
            createdBy:
              updatedImage.createdBy === null
                ? undefined
                : updatedImage.createdBy,
            createdAt: updatedImage.createdAt,
            updatedBy: updatedImage.updatedBy,
            updatedAt: updatedImage.updatedAt,
            company_id: updatedImage.company_id,
          };
        });

        const updatedImages = await Promise.all(updatePromises);
        return updatedImages;
      });

      console.log(
        '✅ Auto-reorder completed successfully:',
        result.map((img) => ({ id: img.id, seq: img.seq })),
      );

      return {
        message: 'Images auto-reordered successfully after deletion',
        updatedImages: result,
      };
    } catch (error) {
      console.error('❌ Error in auto-reorder after deletion:', error);
      throw new BadRequestException(
        'Failed to auto-reorder images after deletion',
      );
    }
  }
}












