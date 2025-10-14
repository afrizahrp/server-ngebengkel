import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ImcBrandService } from './imc_brand.service';
import { CreateImcBrandDto } from './dto/create-imc-brand.dto';
import { UpdateImcBrandDto } from './dto/update-imc-brand.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller(':company_id/imc/get-brands')
export class ImcBrandController {
  constructor(private readonly imcBrandService: ImcBrandService) {}

  @Post()
  create(@Body() createImcBrandDto: CreateImcBrandDto) {
    return this.imcBrandService.create(createImcBrandDto);
  }

  @Get()
  @Public()
  findAll(@Query('company_id') company_id: string) {
    return this.imcBrandService.findAll(company_id);
  }

  @Get(':id')
  findOne(@Query('company_id') company_id: string, @Param('id') id: string) {
    return this.imcBrandService.findOne(company_id, id);
  }

  @Patch(':id')
  update(
    @Query('company_id') company_id: string,
    @Param('id') id: string,
    @Body() updateImcBrandDto: UpdateImcBrandDto,
  ) {
    return this.imcBrandService.update(company_id, id, updateImcBrandDto);
  }

  @Delete(':id')
  remove(@Query('company_id') company_id: string, @Param('id') id: string) {
    return this.imcBrandService.remove(company_id, id);
  }
}
