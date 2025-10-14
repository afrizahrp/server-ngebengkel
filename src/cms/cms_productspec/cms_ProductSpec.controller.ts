import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Cms_CreateProductSpecDto } from './dto/cms_CreateProductSpec.dto';
import { Cms_ProductSpecResponseDto } from './dto/cms_ResponseProductSpec.dto';
import { Cms_UpdateProductSpecDto } from './dto/cms_UpdateProductSpec.dto';
import { cms_ProductSpecService } from './cms_ProductSpec.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller(':company_id/cms/productspecs')
export class cms_ProductSpecController {
  constructor(
    private readonly cms_ProductSpecService: cms_ProductSpecService,
  ) {}

  @Public()
  @Post()
  async create(
    @Param('company_id') company_id: string,
    @Body() cms_CreateProductSpecDto: Cms_CreateProductSpecDto,
  ): Promise<Cms_ProductSpecResponseDto> {
    cms_CreateProductSpecDto.company_id = company_id;
    return this.cms_ProductSpecService.create(cms_CreateProductSpecDto);
  }

  @Public()
  @Get()
  async findAll(
    @Param('company_id') company_id: string,
  ): Promise<Cms_ProductSpecResponseDto[]> {
    return this.cms_ProductSpecService.findAll(company_id);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
  ): Promise<Cms_ProductSpecResponseDto> {
    return this.cms_ProductSpecService.findOne(company_id, id);
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('company_id') company_id: string,
    @Param('id') id: string,
    @Body() cms_UpdateProductSpecDto: Cms_UpdateProductSpecDto,
  ): Promise<Cms_ProductSpecResponseDto> {
    return this.cms_ProductSpecService.update(
      id,
      company_id,
      cms_UpdateProductSpecDto,
    );
  }
}
