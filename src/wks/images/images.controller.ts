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
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageResponseDto } from './dto/response-image.dto';

@Controller('/wks/images')
@UseInterceptors(AnonymousIdInterceptor)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @Public()
  @UseGuards(RecaptchaGuard)
  @ThrottleFormSubmission()
  async create(
    @Body() createImageDto: CreateImageDto,
  ): Promise<{ message: string; data: ImageResponseDto }> {
    const data = await this.imagesService.create(createImageDto);

    return {
      message: 'Image berhasil ditambahkan',
      data,
    };
  }

  @Get()
  @Public()
  @ThrottleGetEndpoints()
  async findAll(
    @Query('waitingListId') waitingListId?: string,
    @Query('branchId') branchId?: string,
  ): Promise<ImageResponseDto[]> {
    return this.imagesService.findAll(waitingListId, branchId);
  }

  @Get(':id')
  @Public()
  @ThrottleGetEndpoints()
  async findOne(@Param('id') id: string): Promise<ImageResponseDto> {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ThrottleFormSubmission()
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ): Promise<{ message: string; data: ImageResponseDto }> {
    const data = await this.imagesService.update(id, updateImageDto);

    return {
      message: 'Image berhasil diperbarui',
      data,
    };
  }

  @Delete(':id')
  @Public()
  @ThrottleFormSubmission()
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; data: ImageResponseDto }> {
    const data = await this.imagesService.remove(id);

    return {
      message: 'Image berhasil dihapus',
      data,
    };
  }
}

