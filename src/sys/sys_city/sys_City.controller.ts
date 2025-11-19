import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ThrottleGetEndpoints } from '../../auth/decorators/throttle.decorator';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { Sys_CityService } from './sys_City.service';
import { Sys_CreateCityDto } from './dto/sys_CreateCity.dto';
import { Sys_UpdateCityDto } from './dto/sys_UpdateCity.dto';
import { Sys_ResponseCityDto } from './dto/sys_ResponseCity.dto';

@Controller('sys_city')
@UseInterceptors(AnonymousIdInterceptor) // Extract anonymous_id untuk tracking
export class sys_CityController {
  constructor(private readonly cityService: Sys_CityService) {}

  @Post()
  async create(@Body() dto: Sys_CreateCityDto): Promise<Sys_ResponseCityDto> {
    return this.cityService.create(dto);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get()
  async findAll(): Promise<Sys_ResponseCityDto[]> {
    return this.cityService.findAll();
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get('province/:province_id')
  async findByProvince(
    @Param('province_id') province_id: string,
  ): Promise<Sys_ResponseCityDto[]> {
    return this.cityService.findByProvinceId(province_id);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @HttpCode(HttpStatus.OK) // 200 OK untuk read operation
  @Post('batch')
  async findManyByIds(
    @Body() body: { ids: string[] },
  ): Promise<Sys_ResponseCityDto[]> {
    return this.cityService.findManyByIds(body.ids || []);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
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
