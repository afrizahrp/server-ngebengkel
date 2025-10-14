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
import { Sys_UserRoleService } from './sys_UserRole.service';
import { Sys_CreateUserRoleDto } from './dto/sys_CreateUserRole.dto';
import { Sys_UpdateUserRoleDto } from './dto/sys_UpdateUserRole.dto';
import { Sys_ResponseUserRoleDto } from './dto/sys_ResponseUserRole.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('sys_user_role')
export class Sys_UserRoleController {
  constructor(private readonly userRoleService: Sys_UserRoleService) {}

  @Post()
  async create(
    @Body() createUserRoleDto: Sys_CreateUserRoleDto,
  ): Promise<Sys_ResponseUserRoleDto> {
    return this.userRoleService.create(createUserRoleDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Sys_ResponseUserRoleDto[]> {
    return this.userRoleService.findAll();
  }

  @Get('user/:user_id')
  async findByUserId(
    @Param('user_id') user_id: number,
  ): Promise<Sys_ResponseUserRoleDto[]> {
    return this.userRoleService.findByUserId(user_id);
  }

  @Get('role/:role_id')
  async findByRoleId(
    @Param('role_id') role_id: string,
  ): Promise<Sys_ResponseUserRoleDto[]> {
    return this.userRoleService.findByRoleId(role_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Sys_ResponseUserRoleDto> {
    return this.userRoleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserRoleDto: Sys_UpdateUserRoleDto,
  ): Promise<Sys_ResponseUserRoleDto> {
    return this.userRoleService.update(id, updateUserRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userRoleService.remove(id);
  }
}


