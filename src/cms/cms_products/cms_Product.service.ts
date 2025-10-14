import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cms_PaginationProductDto } from './dto/cms_PaginationProduct.dto';
import { Cms_ResponseProductDto } from './dto//cms_ResponseProducts.dto';
import { Cms_CreateProductDto } from './dto/cms_CreateProduct.dto';
import { Cms_UpdateProductDto } from './dto/cms_UpdateProducts.dto';
import { productWhereCondition } from 'src/sales/helper/productWhereCondition';
import { buildSearchCondition } from 'src/utils/query-operator/buildSearchConditon';
import { sortFieldBy } from 'src/utils/query-operator/sortFieldBy';
import { ProductFilter } from 'src/sales/helper/productFilter';

@Injectable()
export class cms_ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    cms_CreateProductDto: Cms_CreateProductDto,
  ): Promise<Cms_ResponseProductDto> {
    const product = await this.prisma.imc_Product.create({
      data: cms_CreateProductDto,
    });
    return {
      ...product,
      iShowedStatus: product.iShowedStatus === 'HIDDEN' ? 'HIDDEN' : 'SHOW',
    } as Cms_ResponseProductDto;
  }

  async findAll(
    paginationDto: Cms_PaginationProductDto,
  ): Promise<{ data: Cms_ResponseProductDto[]; totalRecords: number }> {
    const {
      page = 1,
      limit = 20,
      searchBy,
      searchTerm,
      company_id = ['BIP'],
      category,
      catalog_id,
      status,
      iShowedStatus,
      orderBy,
      orderDir,
    } = paginationDto;

    // Allowed sort fields for products - harus sesuai dengan DTO validation
    const allowedSortFields = [
      'id',
      'name',
      'category', // Mengizinkan pengurutan berdasarkan category.name
      'catalog_id',
      'createdAt',
      'updatedAt',
      'iShowedStatus',
      'iStatus',
    ];

    const orderByCondition = sortFieldBy(allowedSortFields, orderBy, orderDir);
    const safeLimit = Math.min(Number(limit) || 10, 100);
    const offset = (Number(page) - 1) * safeLimit;

    // Normalisasi category untuk menghindari nilai tidak valid
    const normalizedCategory = Array.isArray(category)
      ? category.filter((name) => typeof name === 'string' && name !== '')
      : category
        ? [category]
        : undefined;

    const filter: ProductFilter = {
      company_id,
      category: normalizedCategory,
      iShowedStatus,
    };

    const whereCondition = productWhereCondition(filter, {
      requiredFilters: {
        company_id: true,
        category: false, // Category opsional
        iShowedStatus: false, // iShowedStatus opsional
      },
      additionalConditions: {
        isMaterial: false,
      },
    });

    const searchConditions = buildSearchCondition(searchBy, searchTerm);
    if (searchConditions) {
      if (whereCondition.AND) {
        whereCondition.AND = [...whereCondition.AND, ...searchConditions];
      } else {
        whereCondition.AND = searchConditions;
      }
    }

    if (catalog_id) {
      whereCondition.catalog_id = catalog_id;
    }

    if (status) {
      whereCondition.iStatus = status;
    }

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
          uom: {
            select: { name: true },
          },
          images: {
            select: { imageURL: true, isPrimary: true },
          },
          descriptions: {
            select: { descriptions: true },
          },
        },
      }),
    ]);

    // Format data products sesuai dengan DTO response
    const productsWithPrimaryImage = products.map((product) => {
      const primaryImages = product.images.filter((image) => image.isPrimary);
      const primaryImageURL =
        primaryImages.length > 0 ? primaryImages[0].imageURL : null;

      return {
        id: product.id.trim(),
        name: product.name.trim(),
        register_id: product.register_id?.trim(),
        catalog_id: product.catalog_id?.trim(),
        category_id: product.category_id.trim(),
        subCategory_id: product.subCategory_id.trim(),
        brand_id: product.brand_id.trim(),
        iStatus: product.iStatus,
        iShowedStatus: product.iShowedStatus,
        slug: product.slug?.trim(),
        isMaterial: product.isMaterial,
        isService: product.isService,
        isFinishing: product.isFinishing,
        isAccessories: product.isAccessories,
        uom_id: product.uom_id?.trim(),
        createdBy: product.createdBy,
        createdAt: product.createdAt,
        updatedBy: product.updatedBy,
        updatedAt: product.updatedAt,
        company_id: product.company_id,
        branch_id: product.branch_id,
        // Additional fields for display purposes
        category: product.category,
        uom: product.uom,
        images: product.images,
        descriptions: product.descriptions,
        primaryImageURL,
      } as Cms_ResponseProductDto & {
        category: any;
        uom: any;
        images: any;
        descriptions: any;
        primaryImageURL: string | null;
      };
    });

    // console.log('findAll result:', {
    //   data: productsWithPrimaryImage,
    //   totalRecords,
    // }); // Debugging

    return { data: productsWithPrimaryImage, totalRecords };
  }

  async findOne(
    company_id: string,
    id: string,
  ): Promise<Cms_ResponseProductDto> {
    const product = await this.prisma.imc_Product.findUnique({
      where: { company_id_id: { company_id, id } },
      include: {
        category: {
          select: { name: true },
        },
        images: {
          select: { imageURL: true, isPrimary: true },
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
      primaryImages.length > 0 ? primaryImages[0].imageURL : null;

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
    } as Cms_ResponseProductDto;
  }

  async findByName(
    company_id: string,
    name: string,
  ): Promise<Cms_ResponseProductDto[]> {
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
        primaryImages.length > 0 ? primaryImages[0].imageURL : null;

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
      } as Cms_ResponseProductDto;
    });
  }

  async update(
    id: string,
    company_id: string,
    cms_UpdateProductDto: Cms_UpdateProductDto,
  ): Promise<Cms_ResponseProductDto> {
    const product = await this.prisma.imc_Product.findUnique({
      where: { company_id_id: { id, company_id } },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const updatedProduct = await this.prisma.imc_Product.update({
      where: { company_id_id: { id, company_id } },
      data: cms_UpdateProductDto,
    });
    return updatedProduct as Cms_ResponseProductDto;
  }

  async filterByCategory(
    module_id: string,
    paginationDto: Cms_PaginationProductDto,
  ): Promise<{
    data: { id: string; name: string; count: number }[];
    totalRecords: number;
  }> {
    const {
      page = 1,
      limit = 20,
      company_id,
      category,
      searchBy,
      searchTerm,
    } = paginationDto;

    const safeLimit = Math.min(Number(limit) || 10, 100);
    const offset = (Number(page) - 1) * safeLimit;

    const filter: ProductFilter = {
      company_id: company_id?.length ? company_id : undefined,
      category,
    };

    const whereCondition = productWhereCondition(filter, {
      requiredFilters: {
        company_id: true,
        category: false, // Category is optional
      },
      additionalConditions: {
        isMaterial: false,
        iStatus: 'Active',
      },
    });

    // Tambahkan search conditions
    const searchConditions = buildSearchCondition(searchBy, searchTerm);
    if (searchConditions) {
      if (whereCondition.AND) {
        whereCondition.AND = [...whereCondition.AND, ...searchConditions];
      } else {
        whereCondition.AND = searchConditions;
      }
    }

    // Group products by category_id
    const categoryData = await this.prisma.imc_Product.groupBy({
      by: ['category_id'],
      where: whereCondition,
      _count: {
        _all: true,
      },
    });

    if (categoryData.length === 0) {
      return { data: [], totalRecords: 0 };
    }

    // Fetch category names from imc_Category
    const categoryIds = categoryData
      .map((item) => item.category_id)
      .filter(Boolean); // Remove null/undefined category_ids

    let categoryDetails: { id: string; name: string }[] = [];
    if (categoryIds.length > 0) {
      const rawCategoryDetails = await this.prisma.imc_Category.findMany({
        where: {
          id: { in: categoryIds },
        },
        select: {
          id: true,
          name: true,
        },
      });
      categoryDetails = rawCategoryDetails.map((cat) => ({
        id: cat.id,
        name: cat.name?.trim() ?? cat.id, // fallback to id if name is null
      }));
    }

    // Create a mapping of category_id to name
    const categoryMap = new Map(
      categoryDetails.map((cat) => [cat.id, (cat.name ?? cat.id).trim()]),
    );

    // Format results, sort, and apply pagination
    const formattedData = categoryData
      .map((item) => {
        const name =
          categoryMap.get(item.category_id) || item.category_id || 'Unknown';
        return {
          id: item.category_id.trim() || 'unknown',
          name,
          count: item._count._all,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(offset, offset + safeLimit);

    const totalRecords = categoryData.length;

    return { data: formattedData, totalRecords };
  }

  async filterByProductStatus(
    paginationDto: Cms_PaginationProductDto,
  ): Promise<{
    data: { id: string; name: string; count: number }[];
    totalRecords: number;
  }> {
    const {
      page = 1,
      limit = 20,
      company_id,
      iShowedStatus,
      searchBy,
      searchTerm,
    } = paginationDto;

    const safeLimit = Math.min(Number(limit) || 10, 100);
    const offset = (Number(page) - 1) * safeLimit;

    const filter: ProductFilter = {
      company_id: company_id?.length ? company_id : undefined,
      iShowedStatus,
    };
    const whereCondition = productWhereCondition(filter, {
      requiredFilters: {
        company_id: true,
        iShowedStatus: true,
      },
      additionalConditions: {
        isMaterial: false,
      },
    });

    // Tambahkan search conditions
    const searchConditions = buildSearchCondition(searchBy, searchTerm);
    if (searchConditions) {
      if (whereCondition.AND) {
        whereCondition.AND = [...whereCondition.AND, ...searchConditions];
      } else {
        whereCondition.AND = searchConditions;
      }
    }

    const productShowStatusData = await this.prisma.imc_Product.groupBy({
      by: ['iShowedStatus'],
      where: whereCondition,
      _count: {
        _all: true,
      },
    });

    // Format hasil, urutkan, dan terapkan paginasi
    const formattedData = productShowStatusData
      .map((item) => ({
        id: item.iShowedStatus,
        name: item.iShowedStatus === 'HIDDEN' ? 'HIDDEN' : 'SHOW',
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count); // Urutkan descending berdasarkan count

    // Hitung total records
    const totalRecords = productShowStatusData.length;

    console.log('filterByProductStatus result:', {
      data: formattedData.slice(offset, offset + safeLimit),
      totalRecords,
    }); // Debugging

    return {
      data: formattedData,
      totalRecords,
    };
  }
}
