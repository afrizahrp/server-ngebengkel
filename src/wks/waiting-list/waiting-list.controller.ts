import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import {
  ThrottleFormSubmission,
  ThrottleCheckAvailability,
  ThrottleGetEndpoints,
} from '../../auth/decorators/throttle.decorator';
import { RecaptchaGuard } from '../../common/guards/recaptcha.guard';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { MenuPermissionGuard } from '../../auth/better-auth/guards/menu-permission.guard';
import { MenuPermission } from '../../auth/better-auth/decorators/menu-permission.decorator';
import { WaitingListService } from './waiting-list.service';
import { ClaimService } from './services/claim.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';
import { WorkshopCategoryResponseDto } from './dto/workshop-category.dto';
import { CheckWaitingListAvailabilityDto } from './dto/check-waiting-list-availability.dto';
import { QueryWaitingListDto } from './dto/query-waiting-list.dto';

@Controller('/waiting-list')
@UseInterceptors(AnonymousIdInterceptor) // Extract anonymous_id untuk tracking
export class WaitingListController {
  constructor(
    private readonly waitingListService: WaitingListService,
    private readonly claimService: ClaimService,
  ) {}

  // Public endpoint for user registration (requires CAPTCHA)
  @Post('register')
  @Public()
  @UseGuards(RecaptchaGuard) // Require CAPTCHA verification
  // @ThrottleFormSubmission() // 10 requests per hour
  async register(
    @Body() createWaitingListDto: CreateWaitingListDto,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    // Remove CAPTCHA token dari DTO sebelum save ke database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recaptchaToken, recaptchaAction, ...dataToSave } =
      createWaitingListDto;
    const data = await this.waitingListService.create(dataToSave);

    return {
      message: 'Pendaftaran waiting list berhasil',
      data,
    };
  }

  // Admin endpoint for creating waiting list (no CAPTCHA required, requires authentication)
  @Post()
  @UseGuards(MenuPermissionGuard)
  @MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'create' })
  async create(
    @Body() createWaitingListDto: CreateWaitingListDto,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    // Remove CAPTCHA token dari DTO sebelum save ke database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recaptchaToken, recaptchaAction, ...dataToSave } =
      createWaitingListDto;
    const data = await this.waitingListService.create(dataToSave);

    return {
      message: 'Waiting list berhasil dibuat',
      data,
    };
  }

  @Get('categories')
  @Public()
  // @ThrottleGetEndpoints() // 100 requests per minute
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
  // @ThrottleCheckAvailability() // 30 requests per minute
  async checkAvailability(
    @Body() payload: CheckWaitingListAvailabilityDto,
  ): Promise<{
    message: string;
    data: Awaited<ReturnType<typeof this.waitingListService.checkAvailability>>;
  }> {
    const data = await this.waitingListService.checkAvailability(payload);

    return {
      message: 'Validasi ketersediaan berhasil',
      data,
    };
  }

  // @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get()
  async findAll(
    @Query('searchTerm') searchTerm?: string,
    @Query('searchBy') searchBy?: string,
    @Query(
      'claimStatus',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    claimStatus?: string[],
    @Query(
      'category_id',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    category_id?: string[],
    @Query(
      'province_id',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    province_id?: string[],
    @Query(
      'city_id',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    city_id?: string[],
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('orderBy') orderBy?: string,
    @Query('orderDir') orderDir?: 'asc' | 'desc',
  ): Promise<
    | WaitingListResponseDto[]
    | { data: WaitingListResponseDto[]; totalRecords: number; total: number }
  > {
    // Build query object
    const query: QueryWaitingListDto = {
      searchTerm,
      searchBy,
      claimStatus,
      category_id,
      province_id,
      city_id,
      start_date,
      end_date,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      orderBy,
      orderDir,
    };

    // Jika ada query params (search, filter, pagination), gunakan findAllWithFilters
    // Jika tidak ada query params, gunakan findAll (backward compatible)
    const hasQueryParams =
      query.searchTerm ||
      query.searchBy ||
      query.claimStatus?.length ||
      query.category_id?.length ||
      query.province_id?.length ||
      query.city_id?.length ||
      query.start_date ||
      query.end_date ||
      query.page ||
      query.limit ||
      query.orderBy ||
      query.orderDir;

    if (hasQueryParams) {
      return this.waitingListService.findAllWithFilters(query);
    }

    // Backward compatible: return array jika tidak ada query params
    return this.waitingListService.findAll();
  }

  // @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WaitingListResponseDto> {
    return this.waitingListService.findOne(id);
  }

  // @ThrottleGetEndpoints() // 100 requests per minute
  @Public() // Read operations: public (support anonymous_id, used for SEO)
  @Get(':id/promo')
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
      startAt?: string | null;
      endAt?: string | null;
    }>;
  }> {
    const data = await this.waitingListService.findPromosByWaitingList(id);
    return { message: 'Daftar promo berhasil dimuat', data };
  }


  @Post(':id/claim')
  @Public()
  // @ThrottleFormSubmission() // 10 requests per hour
  async initiateClaim(
    @Param('id') id: string,
    @Body() body: { phone: string; name: string; email?: string },
  ): Promise<{ message: string; claimRequestId: string }> {
    const trimmedId = id.trim();
    if (!trimmedId) {
      throw new BadRequestException('ID waiting list wajib diisi');
    }

    const result = await this.claimService.initiateClaim({
      waitingListId: trimmedId,
      phone: body.phone,
      name: body.name,
      email: body.email,
    });

    return {
      message: result.message,
      claimRequestId: result.claimRequestId,
    };
  }

  @Post(':id/claim/verify')
  @Public()
  // @ThrottleFormSubmission() // 10 requests per 15 minutes
  async verifyClaim(
    @Param('id') id: string,
    @Body() body: { claimRequestId: string; verificationCode: string },
  ): Promise<{ message: string; waitingListId: string }> {
    const trimmedId = id.trim();
    if (!trimmedId) {
      throw new BadRequestException('ID waiting list wajib diisi');
    }

    if (!body.claimRequestId || !body.verificationCode) {
      throw new BadRequestException(
        'claimRequestId dan verificationCode wajib diisi',
      );
    }

    return await this.claimService.verifyClaim({
      waitingListId: trimmedId,
      claimRequestId: body.claimRequestId,
      verificationCode: body.verificationCode,
    });
  }

  @Post(':id/claim/resend')
  @Public()
  // @ThrottleFormSubmission() // 10 requests per hour
  async resendOtp(
    @Param('id') id: string,
    @Body() body: { claimRequestId: string },
  ): Promise<{ message: string }> {
    if (!body.claimRequestId) {
      throw new BadRequestException('claimRequestId wajib diisi');
    }

    return await this.claimService.resendOtp(body.claimRequestId);
  }
  @Patch(':id')
  @UseGuards(MenuPermissionGuard)
  @MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'edit' })
  async update(
    @Param('id') id: string,
    @Body() updateWaitingListDto: UpdateWaitingListDto,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    // Memerlukan permission edit untuk menu 18, 19, 20, atau 21
    const data = await this.waitingListService.update(id, updateWaitingListDto);

    return {
      message: 'Data waiting list berhasil diperbarui',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(MenuPermissionGuard)
  @MenuPermission({ menuIds: [18, 19, 20, 21], permission: 'delete' })
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    // Memerlukan permission delete untuk menu 18, 19, 20, atau 21
    const data = await this.waitingListService.softDelete(id);

    return {
      message: 'Data waiting list berhasil dinonaktifkan',
      data,
    };
  }
}
