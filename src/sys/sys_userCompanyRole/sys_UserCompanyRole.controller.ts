import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Sys_UserCompanyRoleService } from './sys_UserCompanyRole.service';
import { Sys_CreateUserCompanyRoleDto } from './dto/sys_CreateUserCompanyRole.dto';
import { Sys_UpdateUserCompanyRoleDto } from './dto/sys_UpdateUserCompanyRole.dto';
import { Sys_ResponseUserCompanyRoleDto } from './dto/sys_ResponseUserCompanyRole.dto';
import {
  Sys_AssignUserRoleDto,
  Sys_BulkAssignUserRoleDto,
} from './dto/sys_AssignUserRole.dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller(':company_id/sys_user_company_role')
export class Sys_UserCompanyRoleController {
  constructor(
    private readonly userCompanyRoleService: Sys_UserCompanyRoleService,
  ) {}

  @Post()
  async create(
    @Param('company_id') company_id: string,
    @Body() createUserCompanyRoleDto: Sys_CreateUserCompanyRoleDto,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    // Override company_id from URL parameter
    createUserCompanyRoleDto.company_id = company_id;
    return this.userCompanyRoleService.create(createUserCompanyRoleDto);
  }

  @Public()
  @Get()
  async findAll(
    @Param('company_id') company_id: string,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    return this.userCompanyRoleService.findByCompanyId(company_id);
  }

  @Get('user/:user_id')
  async findByUserId(
    @Param('company_id') company_id: string,
    @Param('user_id') user_id: number,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    const userCompanyRoles =
      await this.userCompanyRoleService.findByUserId(user_id);
    // Filter by company_id
    return userCompanyRoles.filter((ucr) => ucr.company_id === company_id);
  }

  @Get('userrole/:userRole_id')
  async findByUserRoleId(
    @Param('company_id') company_id: string,
    @Param('userRole_id') userRole_id: number,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    const userCompanyRoles =
      await this.userCompanyRoleService.findByUserRoleId(userRole_id);
    // Filter by company_id
    return userCompanyRoles.filter((ucr) => ucr.company_id === company_id);
  }

  @Get(':id')
  async findOne(
    @Param('company_id') company_id: string,
    @Param('id') id: number,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    const userCompanyRole = await this.userCompanyRoleService.findOne(id);
    // Verify it belongs to the company
    if (userCompanyRole.company_id !== company_id) {
      throw new Error('UserCompanyRole does not belong to this company');
    }
    return userCompanyRole;
  }

  @Put(':id')
  async update(
    @Param('company_id') company_id: string,
    @Param('id') id: number,
    @Body() updateUserCompanyRoleDto: Sys_UpdateUserCompanyRoleDto,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    // Ensure company_id is not changed
    updateUserCompanyRoleDto.company_id = company_id;
    return this.userCompanyRoleService.update(id, updateUserCompanyRoleDto);
  }

  @Delete(':id')
  async remove(
    @Param('company_id') company_id: string,
    @Param('id') id: number,
  ): Promise<void> {
    // Verify it belongs to the company before deletion
    const userCompanyRole = await this.userCompanyRoleService.findOne(id);
    if (userCompanyRole.company_id !== company_id) {
      throw new Error('UserCompanyRole does not belong to this company');
    }
    return this.userCompanyRoleService.remove(id);
  }

  // Assignment endpoints
  @Post('assign')
  async assignUserRole(
    @Param('company_id') company_id: string,
    @Body() assignUserRoleDto: Sys_AssignUserRoleDto,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    return this.userCompanyRoleService.assignUserRoleToCompany(
      assignUserRoleDto.userRole_id,
      company_id,
      assignUserRoleDto.branch_id,
      assignUserRoleDto.isDefault,
    );
  }

  @Post('bulk-assign')
  async bulkAssignUserRoles(
    @Param('company_id') company_id: string,
    @Body() bulkAssignDto: Sys_BulkAssignUserRoleDto,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    return this.userCompanyRoleService.bulkAssignUserRolesToCompany(
      bulkAssignDto.userRole_ids,
      company_id,
      bulkAssignDto.branch_id,
    );
  }

  @Public()
  @Get('available-user-roles')
  async getAvailableUserRoles(
    @Param('company_id') company_id: string,
  ): Promise<any[]> {
    return this.userCompanyRoleService.getAvailableUserRolesForCompany(
      company_id,
    );
  }
}
