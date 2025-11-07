import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../../auth/decorators/public.decorator';
import { WaitingListService } from './waiting-list.service';
import { CreateWaitingListDto } from './dto/create-waiting-list.dto';
import { WaitingListResponseDto } from './dto/response-waiting-list.dto';

@Controller('public/wks/waiting-list')
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
}

