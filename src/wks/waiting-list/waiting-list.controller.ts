import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import {
  ThrottleFormSubmission,
  ThrottleCheckAvailability,
  ThrottleGetEndpoints,
} from '../../auth/decorators/throttle.decorator';
import { RecaptchaGuard } from '../../common/guards/recaptcha.guard';
import { WaitingListService } from './waiting-list.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';
import { WorkshopCategoryResponseDto } from './dto/workshop-category.dto';
import { CheckWaitingListAvailabilityDto } from './dto/check-waiting-list-availability.dto';

@Controller('/waiting-list')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post()
  @Public()
  @UseGuards(RecaptchaGuard) // Require CAPTCHA verification
  @ThrottleFormSubmission() // 10 requests per hour
  async register(
    @Body() createWaitingListDto: CreateWaitingListDto,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    // Remove CAPTCHA token dari DTO sebelum save ke database
    const { recaptchaToken, recaptchaAction, ...dataToSave } = createWaitingListDto;
    const data = await this.waitingListService.create(dataToSave);

    return {
      message: 'Pendaftaran waiting list berhasil',
      data,
    };
  }

  @Get('categories')
  @Public()
  @ThrottleGetEndpoints() // 100 requests per minute
  async categories(): Promise<{
    message: string;
    data: WorkshopCategoryResponseDto[];
  }> {
    const data = await this.waitingListService.getWorkshopCategories();

    return {
      message: 'Daftar kategori bengkel berhasil dimuat',
      data,
    };
  }

  @Post('check-availability')
  @Public()
  @ThrottleCheckAvailability() // 30 requests per minute
  async checkAvailability(
    @Body() payload: CheckWaitingListAvailabilityDto,
  ): Promise<{
    message: string;
    data: Awaited<
      ReturnType<typeof this.waitingListService.checkAvailability>
    >;
  }> {
    const data = await this.waitingListService.checkAvailability(payload);

    return {
      message: 'Validasi ketersediaan berhasil',
      data,
    };
  }

  @Get()
  async findAll(): Promise<WaitingListResponseDto[]> {
    return this.waitingListService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WaitingListResponseDto> {
    return this.waitingListService.findOne(id);
  }

  @Get(':id/promo')
  @Roles('ADMIN','READ')
  async getPromos(@Param('id') id: string): Promise<{
    message: string;
    data: Array<{
      id: string;
      title: string;
      description: string | null;
      promoType: string;
      checklist?: string[] | null;
      valuePercent?: number | null;
      valueNominal?: number | null;
    }>;
  }> {
    const data = await this.waitingListService.findPromosByWaitingList(id);
    return { message: 'Daftar promo berhasil dimuat', data };
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWaitingListDto: UpdateWaitingListDto,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    const data = await this.waitingListService.update(id, updateWaitingListDto);

    return {
      message: 'Data waiting list berhasil diperbarui',
      data,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    const data = await this.waitingListService.softDelete(id);

    return {
      message: 'Data waiting list berhasil dinonaktifkan',
      data,
    };
  }
}
