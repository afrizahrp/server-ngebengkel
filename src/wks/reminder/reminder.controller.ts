import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { PaginationReminderDto } from './dto/pagination-reminder.dto';
import { BetterJwtAuthGuard } from '../../auth/better-auth/guards/better-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('api/reminders')
@UseGuards(BetterJwtAuthGuard)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  create(
    @Body() createReminderDto: CreateReminderDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.reminderService.create({
      ...createReminderDto,
      createdBy: user.sub.toString(),
    });
  }

  @Get()
  findAll(@Query() paginationDto: PaginationReminderDto) {
    return this.reminderService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.reminderService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Body() updateReminderDto: UpdateReminderDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.reminderService.update(companyId, id, {
      ...updateReminderDto,
      updatedBy: user.sub.toString(),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.reminderService.remove(companyId, id);
  }

  @Post(':id/send')
  send(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.reminderService.sendReminder(companyId, id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.reminderService.cancel(companyId, id);
  }
}
