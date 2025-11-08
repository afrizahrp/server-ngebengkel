import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { Sys_ProvinceService } from './sys_Province.service';
import { Sys_CreateProvinceDto } from './dto/sys_CreateProvince.dto';
import { Sys_UpdateProvinceDto } from './dto/sys_UpdateProvince.dto';
import { Sys_ResponseProvinceDto } from './dto/sys_ResponseProvince.dto';

@Controller('sys_province')
export class sys_ProvinceController {
  constructor(private readonly provinceService: Sys_ProvinceService) {}

  @Post()
  async create(
    @Body() dto: Sys_CreateProvinceDto,
  ): Promise<Sys_ResponseProvinceDto> {
    return this.provinceService.create(dto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Sys_ResponseProvinceDto[]> {
    return this.provinceService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sys_ResponseProvinceDto> {
    return this.provinceService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Sys_UpdateProvinceDto,
  ): Promise<Sys_ResponseProvinceDto> {
    return this.provinceService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.provinceService.remove(id);
  }
}
