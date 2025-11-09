import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { ThrottleGetEndpoints } from '../../auth/decorators/throttle.decorator';
import { Sys_CompanyService } from './sys_Company.service';
import { Sys_CreateCompanyDto } from './dto/sys_CreateCompany.dto';
import { Sys_UpdateCompanyDto } from './dto/sys_UpdateCompany.dto';
import { Sys_ResponseCompanyDto } from './dto/sys_ResponseCompany.dto';
import { Sys_ResponseCompanyWithBranchesDto } from './dto/sys_ResponseCompanyWithBranches.dto';
import { Sys_PublicCompanyDto } from './dto/sys_PublicCompanyDto';

@Controller('sys_company')
export class sys_CompanyController {
  constructor(private readonly companyService: Sys_CompanyService) {}

  @Post()
  async create(
    @Body() createCompanyDto: Sys_CreateCompanyDto,
  ): Promise<Sys_ResponseCompanyDto> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  async findAll(): Promise<Sys_PublicCompanyDto[]> {
    // Use public-safe method untuk prevent data exposure
    return this.companyService.findAllPublic();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sys_ResponseCompanyDto> {
    return this.companyService.findOne(id);
  }

  /**
   * Get company with branches
   * Endpoint khusus untuk login flow
   */
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  @Get(':id/with-branches')
  async findOneWithBranches(
    @Param('id') id: string,
  ): Promise<Sys_ResponseCompanyWithBranchesDto> {
    // console.log(
    //   `GET /sys_company/${id}/with-branches - Get company with branches`,
    // );
    return this.companyService.findOneWithBranches(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: Sys_UpdateCompanyDto,
  ): Promise<Sys_ResponseCompanyDto> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.companyService.remove(id);
  }
}
