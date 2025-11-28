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
import { Sys_DistrictService } from './sys_District.service';
import { Sys_CreateDistrictDto } from './dto/sys_CreateDistrict.dto';
import { Sys_UpdateDistrictDto } from './dto/sys_UpdateDistrict.dto';
import { Sys_ResponseDistrictDto } from './dto/sys_ResponseDistrict.dto';

@Controller('sys_district')
@UseInterceptors(AnonymousIdInterceptor) // Extract anonymous_id untuk tracking
export class sys_DistrictController {
  constructor(private readonly districtService: Sys_DistrictService) {}

  @Post()
  async create(
    @Body() dto: Sys_CreateDistrictDto,
  ): Promise<Sys_ResponseDistrictDto> {
    return this.districtService.create(dto);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get()
  async findAll(
    @Query('city_id') city_id?: string,
  ): Promise<Sys_ResponseDistrictDto[]> {
    if (city_id) {
      return this.districtService.findByCityId(city_id);
    }

    return this.districtService.findAll();
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get('city/:city_id')
  async findByCity(
    @Param('city_id') city_id: string,
  ): Promise<Sys_ResponseDistrictDto[]> {
    return this.districtService.findByCityId(city_id);
  }

  @ThrottleBatchEndpoints() // 10000 requests per minute (untuk batch endpoints yang sering dipanggil paralel)
  @Public() // Read operations: public (support anonymous_id)
  @HttpCode(HttpStatus.OK) // 200 OK untuk read operation
  @Post('batch')
  async findManyByIds(
    @Body() body: { ids: string[] },
  ): Promise<Sys_ResponseDistrictDto[]> {
    return this.districtService.findManyByIds(body.ids || []);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
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
