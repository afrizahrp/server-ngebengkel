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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationBookingDto } from './dto/pagination-booking.dto';
import { BetterJwtAuthGuard } from '../../auth/better-auth/guards/better-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('api/bookings')
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
  findAll(@Query() paginationDto: PaginationBookingDto) {
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
