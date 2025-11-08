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
import { Sys_CityService } from './sys_City.service';
import { Sys_CreateCityDto } from './dto/sys_CreateCity.dto';
import { Sys_UpdateCityDto } from './dto/sys_UpdateCity.dto';
import { Sys_ResponseCityDto } from './dto/sys_ResponseCity.dto';

@Controller('sys_city')
export class sys_CityController {
  constructor(private readonly cityService: Sys_CityService) {}

  @Post()
  async create(@Body() dto: Sys_CreateCityDto): Promise<Sys_ResponseCityDto> {
    return this.cityService.create(dto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Sys_ResponseCityDto[]> {
    return this.cityService.findAll();
  }

  @Public()
  @Get('province/:province_id')
  async findByProvince(
    @Param('province_id') province_id: string,
  ): Promise<Sys_ResponseCityDto[]> {
    return this.cityService.findByProvinceId(province_id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sys_ResponseCityDto> {
    return this.cityService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Sys_UpdateCityDto,
  ): Promise<Sys_ResponseCityDto> {
    return this.cityService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.cityService.remove(id);
  }
}
