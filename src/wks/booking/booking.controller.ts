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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationBookingDto } from './dto/pagination-booking.dto';
import { BetterJwtAuthGuard } from '../../auth/better-auth/guards/better-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('/bookings')
@UseGuards(BetterJwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.bookingService.create({
      ...createBookingDto,
      createdBy: user.sub.toString(),
    });
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationBookingDto,
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

    return this.bookingService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.bookingService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: AuthJwtPayload,
  ) {
    return this.bookingService.update(companyId, id, {
      ...updateBookingDto,
      updatedBy: user.sub.toString(),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.bookingService.remove(companyId, id);
  }

  @Post(':id/confirm')
  confirm(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Body('durationMinutes') durationMinutes: number,
  ) {
    return this.bookingService.confirmBooking(id, companyId, durationMinutes);
  }

  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Query('company_id') companyId: string,
    @Body('cancelReason') cancelReason?: string,
  ) {
    return this.bookingService.cancel(companyId, id, cancelReason);
  }
}
