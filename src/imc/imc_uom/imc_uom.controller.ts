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
import { ImcUomService } from './imc_uom.service';
import { CreateImcUomDto } from './dto/create-imc-uom.dto';
import { UpdateImcUomDto } from './dto/update-imc-uom.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller(':company_id/imc/get-uoms')
export class ImcUomController {
  constructor(private readonly imcUomService: ImcUomService) {}

  @Post()
  create(@Body() createImcUomDto: CreateImcUomDto) {
    return this.imcUomService.create(createImcUomDto);
  }

  @Get()
  @Public()
  findAll(@Query('company_id') company_id: string) {
    return this.imcUomService.findAll(company_id);
  }

  @Get(':id')
  findOne(@Query('company_id') company_id: string, @Param('id') id: string) {
    return this.imcUomService.findOne(company_id, id);
  }

  @Patch(':id')
  update(
    @Query('company_id') company_id: string,
    @Param('id') id: string,
    @Body() updateImcUomDto: UpdateImcUomDto,
  ) {
    return this.imcUomService.update(company_id, id, updateImcUomDto);
  }

  @Delete(':id')
  remove(@Query('company_id') company_id: string, @Param('id') id: string) {
    return this.imcUomService.remove(company_id, id);
  }
}
