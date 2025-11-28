import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  ThrottleGetEndpoints,
  ThrottleBatchEndpoints,
} from '../../auth/decorators/throttle.decorator';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { Sys_SubDistrictService } from './sys_SubDistrict.service';
import { Sys_CreateSubDistrictDto } from './dto/sys_CreateSubDistrict.dto';
import { Sys_UpdateSubDistrictDto } from './dto/sys_UpdateSubDistrict.dto';
import { Sys_ResponseSubDistrictDto } from './dto/sys_ResponseSubDistrict.dto';

@Controller('sys_subdistrict')
@UseInterceptors(AnonymousIdInterceptor) // Extract anonymous_id untuk tracking
export class sys_SubDistrictController {
  constructor(private readonly subdistrictService: Sys_SubDistrictService) {}

  @Post()
  async create(
    @Body() dto: Sys_CreateSubDistrictDto,
  ): Promise<Sys_ResponseSubDistrictDto> {
    return this.subdistrictService.create(dto);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
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

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get('district/:district_id')
  async findByDistrict(
    @Param('district_id') district_id: string,
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    return this.subdistrictService.findByDistrictId(district_id);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get('city/:city_id')
  async findByCity(
    @Param('city_id') city_id: string,
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    return this.subdistrictService.findByCityId(city_id);
  }

  @ThrottleBatchEndpoints() // 10000 requests per minute (untuk batch endpoints yang sering dipanggil paralel)
  @Public() // Read operations: public (support anonymous_id)
  @HttpCode(HttpStatus.OK) // 200 OK untuk read operation
  @Post('batch')
  async findManyByIds(
    @Body() body: { ids: string[] },
  ): Promise<Sys_ResponseSubDistrictDto[]> {
    return this.subdistrictService.findManyByIds(body.ids || []);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
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
