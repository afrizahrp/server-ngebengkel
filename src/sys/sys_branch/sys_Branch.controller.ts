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
import { Sys_BranchService } from './sys_Branch.service';
import { Sys_CreateBranchDto } from './dto/sys_CreateBranch.dto';
import { Sys_UpdateBranchDto } from './dto/sys_UpdateBranch.dto';
import { Sys_ResponseBranchDto } from './dto/sys_ResponseBranch.dto';

@Controller('sys_branch')
export class sys_BranchController {
  constructor(private readonly branchService: Sys_BranchService) {}

  @Post()
  async create(
    @Body() createBranchDto: Sys_CreateBranchDto,
  ): Promise<Sys_ResponseBranchDto> {
    return this.branchService.create(createBranchDto);
  }

  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  @Get()
  async findAll(): Promise<Sys_ResponseBranchDto[]> {
    console.log('GET /sys_branch - Find all branches');
    return this.branchService.findAll();
  }

  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  @Get('company/:company_id')
  async findByCompanyId(
    @Param('company_id') company_id: string,
  ): Promise<Sys_ResponseBranchDto[]> {
    console.log(
      `GET /sys_branch/company/${company_id} - Find branches by company`,
    );
    return this.branchService.findByCompanyId(company_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sys_ResponseBranchDto> {
    return this.branchService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: Sys_UpdateBranchDto,
  ): Promise<Sys_ResponseBranchDto> {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.branchService.remove(id);
  }
}
