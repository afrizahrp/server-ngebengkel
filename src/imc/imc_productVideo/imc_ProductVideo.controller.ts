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
import { imc_ProductVideoService } from './imc_ProductVideo.service';
import { Imc_CreateProductVideoDto } from './dto/imc_CreateProductVideo.dto';
import { Imc_UpdateProductVideoDto } from './dto/imc_UpdateProductVideo.dto';
import { Imc_ResponseProductVideoDto } from './dto/imc_ResponseProductVideo.dto';

@Controller(':company_id/imc/product-videos')
export class imc_ProductVideoController {
  constructor(
    private readonly imc_ProductVideoService: imc_ProductVideoService,
  ) {}

  @Public()
  @Get()
  async findAll(
    @Param('company_id') company_id: string,
    @Query('product_id') product_id?: string,
  ): Promise<Imc_ResponseProductVideoDto[]> {
    return this.imc_ProductVideoService.findAll(company_id, product_id);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
  ): Promise<Imc_ResponseProductVideoDto> {
    return this.imc_ProductVideoService.findOne(company_id, id);
  }

  @Public()
  @Get('product/:product_id')
  async findByProduct(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
  ): Promise<Imc_ResponseProductVideoDto[]> {
    return this.imc_ProductVideoService.findByProduct(company_id, product_id);
  }

  @Public()
  @Post()
  async create(
    @Param('company_id') company_id: string,
    @Body() imc_CreateProductVideoDto: Imc_CreateProductVideoDto,
  ): Promise<Imc_ResponseProductVideoDto> {
    imc_CreateProductVideoDto.company_id = company_id;
    return this.imc_ProductVideoService.create(imc_CreateProductVideoDto);
  }

  @Public()
  @Patch('reorder')
  async reorderVideos(
    @Param('company_id') company_id: string,
    @Body()
    body: { product_id: string; videos: Array<{ id: string; seq: number }> },
  ): Promise<{
    message: string;
    updatedVideos: Imc_ResponseProductVideoDto[];
  }> {
    console.log('🔄 Controller received reorder request:', {
      company_id,
      body,
    });

    return this.imc_ProductVideoService.reorderVideos(
      company_id,
      body.product_id,
      body.videos,
    );
  }

  @Public()
  @Patch('auto-reorder/:product_id')
  async autoReorderAfterDelete(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
  ): Promise<{
    message: string;
    updatedVideos: Imc_ResponseProductVideoDto[];
  }> {
    return this.imc_ProductVideoService.autoReorderAfterDelete(
      company_id,
      product_id,
    );
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
    @Body() imc_UpdateProductVideoDto: Imc_UpdateProductVideoDto,
  ): Promise<Imc_ResponseProductVideoDto> {
    return this.imc_ProductVideoService.update(
      id,
      company_id,
      imc_UpdateProductVideoDto,
    );
  }

  @Public()
  @Delete(':id')
  async remove(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.imc_ProductVideoService.remove(company_id, id);
  }

  @Public()
  @Patch(':video_id/set-primary/:product_id')
  async setPrimaryVideo(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
    @Param('video_id') video_id: string,
  ): Promise<{
    message: string;
    updatedVideos: Imc_ResponseProductVideoDto[];
  }> {
    console.log('🔄 Controller received setPrimaryVideo request:', {
      company_id,
      product_id,
      video_id,
    });

    return this.imc_ProductVideoService.setPrimaryVideo(
      company_id,
      product_id,
      video_id,
    );
  }

  @Public()
  @Get('primary/:product_id')
  async getPrimaryVideo(
    @Param('company_id') company_id: string,
    @Param('product_id') product_id: string,
  ): Promise<Imc_ResponseProductVideoDto | null> {
    return this.imc_ProductVideoService.getPrimaryVideo(company_id, product_id);
  }
}

