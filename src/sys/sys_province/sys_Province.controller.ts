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
import { Sys_ProvinceService } from './sys_Province.service';
import { Sys_CreateProvinceDto } from './dto/sys_CreateProvince.dto';
import { Sys_UpdateProvinceDto } from './dto/sys_UpdateProvince.dto';
import { Sys_ResponseProvinceDto } from './dto/sys_ResponseProvince.dto';

@Controller('sys_province')
@UseInterceptors(AnonymousIdInterceptor) // Extract anonymous_id untuk tracking
export class sys_ProvinceController {
  constructor(private readonly provinceService: Sys_ProvinceService) {}

  @Post()
  async create(
    @Body() dto: Sys_CreateProvinceDto,
  ): Promise<Sys_ResponseProvinceDto> {
    return this.provinceService.create(dto);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get()
  async findAll(): Promise<Sys_ResponseProvinceDto[]> {
    return this.provinceService.findAll();
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @HttpCode(HttpStatus.OK) // 200 OK untuk read operation
  @Post('batch')
  async findManyByIds(
    @Body() body: { ids: string[] },
  ): Promise<Sys_ResponseProvinceDto[]> {
    return this.provinceService.findManyByIds(body.ids || []);
  }

  @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
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
