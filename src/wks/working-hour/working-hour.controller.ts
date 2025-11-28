import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import {
  ThrottleGetEndpoints,
  ThrottleFormSubmission,
  ThrottleWorkingHours,
} from '../../auth/decorators/throttle.decorator';
import { RecaptchaGuard } from '../../common/guards/recaptcha.guard';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { MenuPermissionGuard } from '../../auth/better-auth/guards/menu-permission.guard';
import { MenuPermission } from '../../auth/better-auth/decorators/menu-permission.decorator';
import { WorkingHourService } from './working-hour.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { CreateBatchWorkingHoursDto } from './dto/create-batch-working-hours.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { WorkingHourResponseDto } from './dto/response-working-hour.dto';

@Controller('/wks/working-hours')
@UseInterceptors(AnonymousIdInterceptor)
export class WorkingHourController {
  constructor(private readonly workingHourService: WorkingHourService) {}

  @Post()
  @Public()
  @UseGuards(RecaptchaGuard)
  @ThrottleFormSubmission()
  async create(
    @Body() createWorkingHourDto: CreateWorkingHourDto,
  ): Promise<{ message: string; data: WorkingHourResponseDto }> {
    const data = await this.workingHourService.create(createWorkingHourDto);

    return {
      message: 'Working hour berhasil ditambahkan',
      data,
    };
  }

  @Post('batch')
  @Public()
  @UseGuards(RecaptchaGuard)
  @ThrottleFormSubmission()
  async createBatch(
    @Body() createBatchWorkingHoursDto: CreateBatchWorkingHoursDto,
  ): Promise<{ message: string; data: WorkingHourResponseDto[] }> {
    const data =
      await this.workingHourService.createBatch(createBatchWorkingHoursDto);

    return {
      message: `${data.length} working hour berhasil ditambahkan`,
      data,
    };
  }

  @Post('admin')
  @UseGuards(MenuPermissionGuard)
  @MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'create' })
  @ThrottleFormSubmission()
  async createAdmin(
    @Body() createWorkingHourDto: CreateWorkingHourDto,
  ): Promise<{ message: string; data: WorkingHourResponseDto }> {
    // Endpoint khusus untuk admin, tidak menggunakan RecaptchaGuard
    const data = await this.workingHourService.create(createWorkingHourDto);

    return {
      message: 'Working hour berhasil ditambahkan',
      data,
    };
  }

  @Post('admin/batch')
  @UseGuards(MenuPermissionGuard)
  @MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'create' })
  @ThrottleFormSubmission()
  async createBatchAdmin(
    @Body() createBatchWorkingHoursDto: CreateBatchWorkingHoursDto,
  ): Promise<{ message: string; data: WorkingHourResponseDto[] }> {
    // Endpoint khusus untuk admin, tidak menggunakan RecaptchaGuard
    const data =
      await this.workingHourService.createBatch(createBatchWorkingHoursDto);

    return {
      message: `${data.length} working hour berhasil ditambahkan`,
      data,
    };
  }

  @Get()
  @Public()
  @ThrottleWorkingHours() // 300 requests per minute (lebih tinggi dari default 100)
  async findAll(
    @Query('waitingListId') waitingListId?: string,
    @Query('branchId') branchId?: string,
    @Query('companyId') companyId?: string,
  ): Promise<WorkingHourResponseDto[]> {
    return this.workingHourService.findAll(waitingListId, branchId, companyId);
  }

  @Get(':id')
  @Public()
  @ThrottleWorkingHours() // 300 requests per minute
  async findOne(
    @Param('id') id: string,
  ): Promise<WorkingHourResponseDto> {
    return this.workingHourService.findOne(id);
  }

  @Get('waiting-list/:waitingListId/weekday/:weekday')
  @Public()
  @ThrottleWorkingHours() // 300 requests per minute
  async findByWaitingListAndWeekday(
    @Param('waitingListId') waitingListId: string,
    @Param('weekday') weekday: string,
  ): Promise<WorkingHourResponseDto | null> {
    const weekdayNum = parseInt(weekday, 10);
    if (isNaN(weekdayNum) || weekdayNum < 0 || weekdayNum > 6) {
      return null;
    }
    return this.workingHourService.findByWaitingListAndWeekday(
      waitingListId,
      weekdayNum,
    );
  }

  @Patch(':id')
  @Public()
  @ThrottleFormSubmission()
  async update(
    @Param('id') id: string,
    @Body() updateWorkingHourDto: UpdateWorkingHourDto,
  ): Promise<{ message: string; data: WorkingHourResponseDto }> {
    const data = await this.workingHourService.update(id, updateWorkingHourDto);

    return {
      message: 'Working hour berhasil diperbarui',
      data,
    };
  }

  @Delete(':id')
  @Public()
  @ThrottleFormSubmission()
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; data: WorkingHourResponseDto }> {
    const data = await this.workingHourService.remove(id);

    return {
      message: 'Working hour berhasil dihapus',
      data,
    };
  }
}

