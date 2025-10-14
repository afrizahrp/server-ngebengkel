import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Sys_WhiteListEmailService } from './sys_WhiteListEmail.service';
import { Sys_CreateWhiteListEmailDto } from './dto/sys_CreateWhiteListEmail.dto';
import { Sys_UpdateWhiteListEmailDto } from './dto/sys_UpdateWhiteListEmail.dto';
import { Sys_ResponseWhiteListEmailDto } from './dto/sys_ResponseWhiteListEmail.dto';
import { Sys_CheckEmailDto } from './dto/sys_CheckEmailDto.dto';

@Controller('sys/whitelist-email')
export class Sys_WhiteListEmailController {
  constructor(
    private readonly whiteListEmailService: Sys_WhiteListEmailService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createWhiteListEmailDto: Sys_CreateWhiteListEmailDto,
  ): Promise<Sys_ResponseWhiteListEmailDto> {
    return this.whiteListEmailService.create(createWhiteListEmailDto);
  }

  @Get()
  async findAll(): Promise<Sys_ResponseWhiteListEmailDto[]> {
    return this.whiteListEmailService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Sys_ResponseWhiteListEmailDto> {
    return this.whiteListEmailService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWhiteListEmailDto: Sys_UpdateWhiteListEmailDto,
  ): Promise<Sys_ResponseWhiteListEmailDto> {
    return this.whiteListEmailService.update(id, updateWhiteListEmailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.whiteListEmailService.remove(id);
  }

  @Public()
  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmail(
    @Body() checkEmailDto: Sys_CheckEmailDto,
  ): Promise<{ isAllowed: boolean; message: string }> {
    const isAllowed = await this.whiteListEmailService.checkEmailInWhiteList(
      checkEmailDto.email,
    );

    return {
      isAllowed,
      message: isAllowed
        ? 'Email terdaftar dalam whitelist'
        : 'Email tidak terdaftar dalam whitelist',
    };
  }
}
