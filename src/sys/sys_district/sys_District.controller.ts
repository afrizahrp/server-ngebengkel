import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { Sys_DistrictService } from './sys_District.service';
import { Sys_CreateDistrictDto } from './dto/sys_CreateDistrict.dto';
import { Sys_UpdateDistrictDto } from './dto/sys_UpdateDistrict.dto';
import { Sys_ResponseDistrictDto } from './dto/sys_ResponseDistrict.dto';

@Controller('sys_district')
export class sys_DistrictController {
  constructor(private readonly districtService: Sys_DistrictService) {}

  @Post()
  async create(
    @Body() dto: Sys_CreateDistrictDto,
  ): Promise<Sys_ResponseDistrictDto> {
    return this.districtService.create(dto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('city_id') city_id?: string,
  ): Promise<Sys_ResponseDistrictDto[]> {
    if (city_id) {
      return this.districtService.findByCityId(city_id);
    }

    return this.districtService.findAll();
  }

  @Public()
  @Get('city/:city_id')
  async findByCity(
    @Param('city_id') city_id: string,
  ): Promise<Sys_ResponseDistrictDto[]> {
    return this.districtService.findByCityId(city_id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sys_ResponseDistrictDto> {
    return this.districtService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Sys_UpdateDistrictDto,
  ): Promise<Sys_ResponseDistrictDto> {
    return this.districtService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.districtService.remove(id);
  }
}
