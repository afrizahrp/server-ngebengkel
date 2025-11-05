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
import { BookingSlotService } from './booking-slot.service';
import { CreateBookingSlotDto } from './dto/create-booking-slot.dto';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';
import { PaginationBookingSlotDto } from './dto/pagination-booking-slot.dto';
import { BetterJwtAuthGuard } from '../../auth/better-auth/guards/better-jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthJwtPayload } from '../../auth/types/auth-jwtPayload';

@Controller('/booking-slots')
@UseGuards(BetterJwtAuthGuard)
export class BookingSlotController {
  constructor(private readonly bookingSlotService: BookingSlotService) {}

  @Post()
  create(@Body() createBookingSlotDto: CreateBookingSlotDto) {
    return this.bookingSlotService.create(createBookingSlotDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationBookingSlotDto) {
    return this.bookingSlotService.findAll(paginationDto);
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
  ) {
    return this.bookingSlotService.update(companyId, id, updateBookingSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('company_id') companyId: string) {
    return this.bookingSlotService.remove(companyId, id);
  }
}
