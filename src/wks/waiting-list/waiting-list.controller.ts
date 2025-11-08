import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { WaitingListService } from './waiting-list.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';
import { UpdateWaitingListDto } from './dto/update-waiting-list.dto';

@Controller('/waiting-list')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post()
  @Public()
  async register(
    @Body() createWaitingListDto: CreateWaitingListDto,
  ): Promise<{ message: string; data: WaitingListResponseDto }> {
    const data = await this.waitingListService.create(createWaitingListDto);

    return {
      message: 'Pendaftaran waiting list berhasil',
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
