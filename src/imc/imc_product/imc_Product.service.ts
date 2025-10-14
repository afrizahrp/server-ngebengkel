import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Imc_CreateProductDto } from './dto/imc_CreateProduct.dto';
import { Imc_UpdateProductDto } from './dto/imc_UpdateProducts.dto';
import { Imc_ResponseProductDto } from './dto/imc_ResponseProducts.dto';
import { Imc_PaginationProductDto } from './dto/imc_PaginationProduct.dto';
import { sortFieldBy } from 'src/utils/query-operator/sortFieldBy';
import { Prisma, MasterRecordStatusEnum } from '@prisma/client';

@Injectable()
export class imc_ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    imc_CreateProductDto: Imc_CreateProductDto,
  ): Promise<Imc_ResponseProductDto> {
    const product = await this.prisma.imc_Product.create({
      data: imc_CreateProductDto,
    });
    return {
      ...product,
      iShowedStatus: product.iShowedStatus === 'HIDDEN' ? 'HIDDEN' : 'SHOW',
    } as Imc_ResponseProductDto;
  }

  async findAll(
    paginationDto: Imc_PaginationProductDto,
  ): Promise<{ data: Imc_ResponseProductDto[]; totalRecords: number }> {
    console.log('🔍 IMC Product Service - Received params:', paginationDto);

    const {
      page = 1,
      limit = 20,
      searchBy,
      searchTerm,
      company_id,
      branch_id,
      category_id,
      subCategory_id,
      status,
      orderBy,
      orderDir,
    } = paginationDto;

    // Allowed sort fields for products
    const allowedSortFields = [
      'id',
      'name',
      'category_id',
      'subCategory_id',
      'brand_id',
      'sellingPrice',
      'qty',
      'iStatus',
      'createdAt',
      'updatedAt',
    ];

    const orderByCondition = sortFieldBy(allowedSortFields, orderBy, orderDir);

    const safeLimit = Math.min(Number(limit) || 10, 100);
    const offset = (Number(page) - 1) * safeLimit;

    // Build where condition
    const whereCondition: Prisma.imc_ProductWhereInput = {
      isMaterial: false, // Filter for non-material products
      // Temporarily removed iShowedStatus filter for debugging
    };

    // Handle company_id array or single value
    if (company_id) {
      if (Array.isArray(company_id)) {
        whereCondition.company_id = { in: company_id };
      } else {
        whereCondition.company_id = company_id;
      }
    }

    // Add optional filters
    // if (branch_id) {
    //   whereCondition.branch_id = branch_id;
    // }

    if (category_id) {
      whereCondition.category_id = category_id;
    }

    if (subCategory_id) {
      whereCondition.subCategory_id = subCategory_id;
    }

    if (status) {
      whereCondition.iStatus = status as MasterRecordStatusEnum;
    }

    // Add search conditions
    if (searchBy && searchTerm) {
      console.log('🔍 Search by:', searchBy, 'Term:', searchTerm);

      // Create Prisma-compatible search condition
      const searchCondition: Prisma.imc_ProductWhereInput = {
        [searchBy]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };

      if (whereCondition.AND) {
        whereCondition.AND = [
          ...(whereCondition.AND as Prisma.imc_ProductWhereInput[]),
          searchCondition,
        ];
      } else {
        whereCondition.AND = [searchCondition];
      }
    }

    console.log(
      '🔍 Final whereCondition:',
      JSON.stringify(whereCondition, null, 2),
    );

    console.log('🔍 Query parameters:', {
      page,
      limit,
      offset,
      orderByCondition,
      company_id,
      branch_id,
      category_id,
      subCategory_id,
      status,
    });

    // Execute queries in parallel
    const [totalRecords, products] = await Promise.all([
      this.prisma.imc_Product.count({ where: whereCondition }),
      this.prisma.imc_Product.findMany({
        where: whereCondition,
        orderBy: orderByCondition,
        skip: offset,
        take: safeLimit,
        include: {
          category: {
            select: { name: true },
          },
          images: {
            select: { imageURL: true, isPrimary: true },
          },
          videos: {
            select: { videoURL: true, isPrimary: true },
          },
          descriptions: {
            select: { descriptions: true },
          },
        },
      }),
    ]);

    console.log('🔍 Query results:', {
      totalRecords,
      productsFound: products.length,
      firstProduct: products[0]
        ? { id: products[0].id, name: products[0].name }
        : null,
    });

    const productsWithPrimaryImage = products.map((product) => {
      const primaryImages = product.images.filter((image) => image.isPrimary);
      const primaryImageURL =
        primaryImages.length > 0 ? primaryImages[0].imageURL : undefined;

      const primaryVideos = product.videos.filter((video) => video.isPrimary);
      const primaryVideoURL =
        primaryVideos.length > 0 ? primaryVideos[0].videoURL : undefined;

      return {
        ...product,
        id: product.id.trim(),
        name: product.name.trim(),
        slug: product.slug?.trim(),
        catalog_id: product.catalog_id?.trim(),
        register_id: product.register_id?.trim(),
        category_id: product.category_id.trim(),
        subCategory_id: product.subCategory_id.trim(),
        brand_id: product.brand_id.trim(),
        uom_id: product.uom_id?.trim(),
        createdBy: product.createdBy || undefined, // Convert null to undefined
        updatedBy: product.updatedBy || undefined, // Convert null to undefined
        primaryImageURL,
        primaryVideoURL,
      };
    });

    return { data: productsWithPrimaryImage, totalRecords };
  }

  async findOne(
    company_id: string,
    id: string,
  ): Promise<Imc_ResponseProductDto> {
    const product = await this.prisma.imc_Product.findUnique({
      where: { company_id_id: { company_id, id } },
      include: {
        category: {
          select: { name: true },
        },
        images: {
          select: { imageURL: true, isPrimary: true },
        },
        videos: {
          select: { videoURL: true, isPrimary: true },
        },
        descriptions: {
          select: { descriptions: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const primaryImages = product.images.filter((image) => image.isPrimary);
    const primaryImageURL =
      primaryImages.length > 0 ? primaryImages[0].imageURL : undefined;

    const primaryVideos = product.videos.filter((video) => video.isPrimary);
    const primaryVideoURL =
      primaryVideos.length > 0 ? primaryVideos[0].videoURL : undefined;

    return {
      ...product,
      id: product.id.trim(),
      name: product.name.trim(),
      slug: product.slug?.trim(),
      catalog_id: product.catalog_id?.trim(),
      register_id: product.register_id?.trim(),
      category_id: product.category_id.trim(),
      subCategory_id: product.subCategory_id.trim(),
      brand_id: product.brand_id.trim(),
      uom_id: product.uom_id?.trim(),
      createdBy: product.createdBy || undefined, // Convert null to undefined
      updatedBy: product.updatedBy || undefined, // Convert null to undefined
      primaryImageURL,
      primaryVideoURL,
    } as Imc_ResponseProductDto;
  }

  async findByName(
    company_id: string,
    name: string,
  ): Promise<Imc_ResponseProductDto[]> {
    const products = await this.prisma.imc_Product.findMany({
      where: {
        company_id,
        // Temporarily removed iShowedStatus filter for debugging
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        category: {
          select: { name: true },
        },
        images: {
          select: { imageURL: true, isPrimary: true },
        },
        videos: {
          select: { videoURL: true, isPrimary: true },
        },
        descriptions: {
          select: { descriptions: true },
        },
      },
    });

    if (products.length === 0) {
      throw new NotFoundException(`Products with name ${name} not found`);
    }

    return products.map((product) => {
      const primaryImages = product.images.filter((image) => image.isPrimary);
      const primaryImageURL =
        primaryImages.length > 0 ? primaryImages[0].imageURL : undefined;

      const primaryVideos = product.videos.filter((video) => video.isPrimary);
      const primaryVideoURL =
        primaryVideos.length > 0 ? primaryVideos[0].videoURL : undefined;

      return {
        ...product,
        id: product.id.trim(),
        name: product.name.trim(),
        slug: product.slug?.trim(),
        catalog_id: product.catalog_id?.trim(),
        register_id: product.register_id?.trim(),
        category_id: product.category_id.trim(),
        subCategory_id: product.subCategory_id.trim(),
        brand_id: product.brand_id.trim(),
        uom_id: product.uom_id?.trim(),
        createdBy: product.createdBy || undefined, // Convert null to undefined
        updatedBy: product.updatedBy || undefined, // Convert null to undefined
        primaryImageURL,
        primaryVideoURL,
      } as Imc_ResponseProductDto;
    });
  }

  async update(
    id: string,
    company_id: string,
    imc_UpdateProductDto: Imc_UpdateProductDto,
  ): Promise<Imc_ResponseProductDto> {
    const product = await this.prisma.imc_Product.findUnique({
      where: { company_id_id: { id, company_id } },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const updatedProduct = await this.prisma.imc_Product.update({
      where: { company_id_id: { id, company_id } },
      data: imc_UpdateProductDto,
    });
    return updatedProduct as Imc_ResponseProductDto;
  }
}
