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
  BadRequestException,
} from '@nestjs/common';
import { BookingSlotService } from './booking-slot.service';
import { CreateBookingSlotDto } from './dto/create-booking-slot.dto';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';
import { PaginationBookingSlotDto } from './dto/pagination-booking-slot.dto';
import {
  BookingSlotStatsQueryDto,
  BookingSlotStatsResponseDto,
} from './dto/stats-booking-slot.dto';
import { BetterJwtAuthGuard } from '../../auth/better-auth/guards/better-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('/booking-slots')
@UseGuards(BetterJwtAuthGuard)
export class BookingSlotController {
  constructor(private readonly bookingSlotService: BookingSlotService) {}

  @Post()
  create(
    @Body() createBookingSlotDto: CreateBookingSlotDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.bookingSlotService.create(
      createBookingSlotDto,
      user.sub.toString(),
    );
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationBookingSlotDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    // company_id dan branch_id adalah 1 paket mandatory yang harus ada
    // Fallback: gunakan dari token jika tidak ada di query params
    // Ini lebih aman karena berasal dari authenticated token, bukan dari client
    // Query params masih bisa digunakan untuk override jika diperlukan

    // Fallback company_id dari token
    paginationDto.company_id = paginationDto.company_id || user.company_id;

    // Fallback branch_id dari token (isMain branch)
    // Jika branch_id tidak ada di query params, gunakan branch_id dari token
    if (!paginationDto.branch_id || paginationDto.branch_id.length === 0) {
      if (user.branch_id) {
        paginationDto.branch_id = [user.branch_id];
      }
    }

    // Validasi: pastikan company_id dan branch_id ada (mandatory)
    // Seharusnya selalu ada karena guard sudah verify token
    if (!paginationDto.company_id) {
      throw new BadRequestException(
        'company_id is required. Please ensure you are authenticated with a valid token.',
      );
    }

    if (!paginationDto.branch_id || paginationDto.branch_id.length === 0) {
      throw new BadRequestException(
        'branch_id is required. Please ensure you are authenticated with a valid token or select a branch.',
      );
    }

    return this.bookingSlotService.findAll(paginationDto);
  }

  @Get('stats')
  getStats(
    @Query() statsQuery: BookingSlotStatsQueryDto,
    @CurrentUser() user: AuthJwtPayload,
  ): Promise<BookingSlotStatsResponseDto> {
    // Fallback: ambil company_id dan branch_id default dari token
    statsQuery.company_id = statsQuery.company_id || user.company_id;
    if (!statsQuery.branch_id || statsQuery.branch_id.length === 0) {
      if (user.branch_id) statsQuery.branch_id = [user.branch_id];
    }

    if (!statsQuery.company_id) {
      throw new BadRequestException('company_id is required');
    }

    if (!statsQuery.branch_id || statsQuery.branch_id.length === 0) {
      throw new BadRequestException('branch_id is required');
    }

    return this.bookingSlotService.getStats(statsQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.bookingSlotService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Body() updateBookingSlotDto: UpdateBookingSlotDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.bookingSlotService.update(
      companyId,
      id,
      updateBookingSlotDto,
      user.sub.toString(),
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.bookingSlotService.remove(companyId, id, user.sub.toString());
  }
}
