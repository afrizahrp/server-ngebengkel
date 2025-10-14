import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  BadRequestException,
  Req,
} from '@nestjs/common';

import { Public } from '../../auth/decorators/public.decorator';
import { cms_ProductService } from './cms_Product.service';
import { Cms_ResponseProductDto } from './dto/cms_ResponseProducts.dto';
import { Cms_PaginationProductDto } from './dto/cms_PaginationProduct.dto';

import { Cms_ProductFilterDto } from './dto/cms_ProductFilterDto';
import { Cms_UpdateProductDto } from './dto/cms_UpdateProducts.dto';
import { UpdateProductStatusDto } from './dto/updateProductStatus.dto';
import { Cms_CreateProductDto } from './dto/cms_CreateProduct.dto';

// class UpdateProductStatusDto {
//   iShowedStatus: 'SHOW' | 'HIDDEN';
//   updatedBy?: string;
// }

@Controller(':company_id/cms/products')
export class cms_ProductController {
  constructor(private readonly cmsProductService: cms_ProductService) {}

  @Public()
  @Patch(':id/status')
  async updateProductStatus(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateProductStatusDto,
    // @Req() request: any,
  ): Promise<Cms_ResponseProductDto> {
    // console.log('Raw request body:', request.body);
    // console.log('Received updateStatusDto:', updateStatusDto);
    // console.log('iShowedStatus:', updateStatusDto.iShowedStatus);
    // console.log('iShowedStatus type:', typeof updateStatusDto.iShowedStatus);
    try {
      const updateData: Cms_UpdateProductDto = {
        iShowedStatus: updateStatusDto.iShowedStatus,
        updatedBy: updateStatusDto.updatedBy || 'system',
      };
      console.log('updateData:', updateData);
      const updatedProduct = await this.cmsProductService.update(
        id,
        company_id,
        updateData,
      );
      return updatedProduct;
    } catch (error) {
      console.error('Error:', error);
      throw new BadRequestException(
        `Failed to update product status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Public()
  @Get()
  async findAll(
    @Param('company_id') company_id: string,
    @Query() paginationDto: Cms_PaginationProductDto,
  ): Promise<{ data: Cms_ResponseProductDto[]; totalRecords: number }> {
    if (!paginationDto.company_id) {
      paginationDto.company_id = [company_id];
    }

    // console.log('🔍 Controller - Final paginationDto:', paginationDto);
    const result = await this.cmsProductService.findAll(paginationDto);
    return {
      data: result.data.map((item: Cms_ResponseProductDto) => ({
        ...item,
        description: item.description ?? undefined,
      })),
      totalRecords: result.totalRecords,
    };
  }

  @Public()
  @Get('getdisplaystatus')
  async getProductStatus(
    @Param('company_id') company_id: string,
    @Query() query: Cms_ProductFilterDto,
  ): Promise<{
    data: { id: string; name: string; count: number }[];
    totalRecords: number;
  }> {
    // Merge company_id from route param into query if not provided
    const paginationDto: Cms_PaginationProductDto = {
      ...query,
      company_id: Array.isArray(query.company_id)
        ? query.company_id
        : [query.company_id ?? company_id],
    };

    try {
      const result =
        await this.cmsProductService.filterByProductStatus(paginationDto);
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch product status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Public()
  @Get('getCategories')
  async getCategories(
    @Param('company_id') company_id: string,
    @Query() query: Cms_PaginationProductDto,
  ): Promise<{
    data: { id: string; name: string; count: number }[];
    totalRecords: number;
  }> {
    // Merge company_id from route param into query if not provided
    const paginationDto: Cms_PaginationProductDto = {
      ...query,
      company_id: Array.isArray(query.company_id)
        ? query.company_id
        : [query.company_id ?? company_id],
    };

    const module_id = 'CMS';

    try {
      const result = await this.cmsProductService.filterByCategory(
        module_id,
        paginationDto,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Public()
  @Get('by-name/:name')
  async findByName(
    @Param('company_id') company_id: string,
    @Param('name') name: string,
  ): Promise<Cms_ResponseProductDto[]> {
    return this.cmsProductService.findByName(company_id, name);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
  ): Promise<Cms_ResponseProductDto> {
    return this.cmsProductService.findOne(company_id, id);
  }

  @Public()
  @Post()
  async create(
    @Param('company_id') company_id: string,
    @Body() createProductDto: Cms_CreateProductDto,
  ): Promise<Cms_ResponseProductDto> {
    return this.cmsProductService.create(createProductDto);
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
    @Body() updateProductDto: Cms_UpdateProductDto,
  ): Promise<Cms_ResponseProductDto> {
    return this.cmsProductService.update(id, company_id, updateProductDto);
  }

  // @Public()
  // @Patch(':id/status')
  // async updateProductStatus(
  //   @Param('company_id') company_id: string,
  //   @Param('id') id: string,
  //   @Body() updateStatusDto: UpdateProductStatusDto,
  //   @Req() request: any, // Add this to log raw body
  // ): Promise<Cms_ResponseProductDto> {
  //   console.log('Raw request body:', request.body);
  //   console.log('Received updateStatusDto:', updateStatusDto);
  //   console.log('iShowedStatus:', updateStatusDto.iShowedStatus);
  //   console.log('iShowedStatus type:', typeof updateStatusDto.iShowedStatus);
  //   try {
  //     const updateData: Cms_UpdateProductDto = {
  //       iShowedStatus: updateStatusDto.iShowedStatus,
  //       updatedBy: updateStatusDto.updatedBy || 'system',
  //       updatedAt: new Date(),
  //     };
  //     console.log('updateData:', updateData);
  //     const updatedProduct = await this.cmsProductService.update(
  //       id,
  //       company_id,
  //       updateData,
  //     );
  //     return updatedProduct;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     throw new BadRequestException(
  //       `Failed to update product status: ${error instanceof Error ? error.message : 'Unknown error'}`,
  //     );
  //   }
  // }
}
