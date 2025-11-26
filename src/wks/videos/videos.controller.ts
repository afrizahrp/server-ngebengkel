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
import { ThrottleGetEndpoints, ThrottleFormSubmission } from '../../auth/decorators/throttle.decorator';
import { RecaptchaGuard } from '../../common/guards/recaptcha.guard';
import { AnonymousIdInterceptor } from '../../common/interceptors/anonymous-id.interceptor';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { CreateBatchVideosDto } from './dto/create-batch-videos.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoResponseDto } from './dto/response-video.dto';

@Controller('/wks/videos')
@UseInterceptors(AnonymousIdInterceptor)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @Public()
  @UseGuards(RecaptchaGuard)
  @ThrottleFormSubmission()
  async create(
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<{ message: string; data: VideoResponseDto }> {
    const data = await this.videosService.create(createVideoDto);

    return {
      message: 'Video berhasil ditambahkan',
      data,
    };
  }

  @Post('batch')
  @Public()
  @UseGuards(RecaptchaGuard) // Verify token sekali untuk seluruh batch
  @ThrottleFormSubmission()
  async createBatch(
    @Body() createBatchVideosDto: CreateBatchVideosDto,
  ): Promise<{ message: string; data: VideoResponseDto[] }> {
    const data = await this.videosService.createBatch(createBatchVideosDto);

    return {
      message: `${data.length} video berhasil ditambahkan`,
      data,
    };
  }

  @Get()
  @Public()
  @ThrottleGetEndpoints()
  async findAll(
    @Query('waitingListId') waitingListId?: string,
    @Query('branchId') branchId?: string,
  ): Promise<VideoResponseDto[]> {
    return this.videosService.findAll(waitingListId, branchId);
  }

  @Get(':id')
  @Public()
  @ThrottleGetEndpoints()
  async findOne(@Param('id') id: string): Promise<VideoResponseDto> {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ThrottleFormSubmission()
  async update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<{ message: string; data: VideoResponseDto }> {
    const data = await this.videosService.update(id, updateVideoDto);

    return {
      message: 'Video berhasil diperbarui',
      data,
    };
  }

  @Delete(':id')
  @Public()
  @ThrottleFormSubmission()
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; data: VideoResponseDto }> {
    const data = await this.videosService.remove(id);

    return {
      message: 'Video berhasil dihapus',
      data,
    };
  }
}

