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
import { Sys_SubDistrictService } from './sys_SubDistrict.service';
import { Sys_CreateSubDistrictDto } from './dto/sys_CreateSubDistrict.dto';
import { Sys_UpdateSubDistrictDto } from './dto/sys_UpdateSubDistrict.dto';
import { Sys_ResponseSubDistrictDto } from './dto/sys_ResponseSubDistrict.dto';

@Controller('sys_subdistrict')
export class sys_SubDistrictController {
  constructor(private readonly subdistrictService: Sys_SubDistrictService) {}

  @Post()
  async create(
    @Body() dto: Sys_CreateSubDistrictDto,
  ): Promise<Sys_ResponseSubDistrictDto> {
    return this.subdistrictService.create(dto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('district_id') district_id?: string,
    @Query('city_id') city_id?: string,
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    if (district_id) {
      return this.subdistrictService.findByDistrictId(district_id);
    }

    if (city_id) {
      return this.subdistrictService.findByCityId(city_id);
    }

    return this.subdistrictService.findAll();
  }

  @Public()
  @Get('district/:district_id')
  async findByDistrict(
    @Param('district_id') district_id: string,
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    return this.subdistrictService.findByDistrictId(district_id);
  }

  @Public()
  @Get('city/:city_id')
  async findByCity(
    @Param('city_id') city_id: string,
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    return this.subdistrictService.findByCityId(city_id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sys_ResponseSubDistrictDto> {
    return this.subdistrictService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Sys_UpdateSubDistrictDto,
  ): Promise<Sys_ResponseSubDistrictDto> {
    return this.subdistrictService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.subdistrictService.remove(id);
  }
}
