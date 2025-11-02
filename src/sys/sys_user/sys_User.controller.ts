import { Controller, Get, Param } from '@nestjs/common';
import { sys_UserService } from './sys_User.service';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller(':user')
export class sys_UserController {
  constructor(private readonly sys_userService: sys_UserService) {}

  // Guards sudah global di BetterAuthModule, tidak perlu @UseGuards()
  @Roles('ADMIN')
  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return await this.sys_userService.findById(id);
  }
}
