import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { imc_ProductImageService } from './imc_ProductImage.service';
import { Imc_CreateProductImageDto } from './dto/imc_CreateProductImage.dto';
import { Imc_UpdateProductImageDto } from './dto/imc_UpdateProductImage.dto';
import { Imc_ResponseProductImageDto } from './dto/imc_ResponseProductImage.dto';

@Controller(':company_id/imc/product-images')
export class imc_ProductImageController {
  constructor(
    private readonly imc_ProductImageService: imc_ProductImageService,
  ) {}

  @Public()
  @Get()
  async findAll(
    @Param('company_id') company_id: string,
    @Query('product_id') product_id?: string,
  ): Promise<Imc_ResponseProductImageDto[]> {
    return this.imc_ProductImageService.findAll(company_id, product_id);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
  ): Promise<Imc_ResponseProductImageDto> {
    return this.imc_ProductImageService.findOne(company_id, id);
  }

  @Public()
  @Get('product/:product_id')
  async findByProduct(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
  ): Promise<Imc_ResponseProductImageDto[]> {
    return this.imc_ProductImageService.findByProduct(company_id, product_id);
  }

  @Public()
  @Post()
  async create(
    @Param('company_id') company_id: string,
    @Body() imc_CreateProductImageDto: Imc_CreateProductImageDto,
  ): Promise<Imc_ResponseProductImageDto> {
    imc_CreateProductImageDto.company_id = company_id;
    return this.imc_ProductImageService.create(imc_CreateProductImageDto);
  }

  @Public()
  @Patch('reorder')
  async reorderImages(
    @Param('company_id') company_id: string,
    @Body()
    body: { product_id: string; images: Array<{ id: string; seq: number }> },
  ): Promise<{
    message: string;
    updatedImages: Imc_ResponseProductImageDto[];
  }> {
    console.log('🔄 Controller received reorder request:', {
      company_id,
      body,
    });

    return this.imc_ProductImageService.reorderImages(
      company_id,
      body.product_id,
      body.images,
    );
  }

  @Public()
  @Patch('auto-reorder/:product_id')
  async autoReorderAfterDelete(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
  ): Promise<{
    message: string;
    updatedImages: Imc_ResponseProductImageDto[];
  }> {
    return this.imc_ProductImageService.autoReorderAfterDelete(
      company_id,
      product_id,
    );
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
    @Body() imc_UpdateProductImageDto: Imc_UpdateProductImageDto,
  ): Promise<Imc_ResponseProductImageDto> {
    return this.imc_ProductImageService.update(
      id,
      company_id,
      imc_UpdateProductImageDto,
    );
  }

  @Public()
  @Delete(':id')
  async remove(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.imc_ProductImageService.remove(company_id, id);
  }

  @Public()
  @Patch(':image_id/set-primary/:product_id')
  async setPrimaryImage(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
    @Param('image_id') image_id: string,
  ): Promise<{
    message: string;
    updatedImages: Imc_ResponseProductImageDto[];
  }> {
    console.log('🔄 Controller received setPrimaryImage request:', {
      company_id,
      product_id,
      image_id,
    });

    return this.imc_ProductImageService.setPrimaryImage(
      company_id,
      product_id,
      image_id,
    );
  }

  @Public()
  @Get('primary/:product_id')
  async getPrimaryImage(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
  ): Promise<Imc_ResponseProductImageDto | null> {
    return this.imc_ProductImageService.getPrimaryImage(company_id, product_id);
  }
}
