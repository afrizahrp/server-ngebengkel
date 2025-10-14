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
import { ImcSubCategoryService } from './imc_subcategory.service';
import { CreateImcSubCategoryDto } from './dto/create-imc-subcategory.dto';
import { UpdateImcSubCategoryDto } from './dto/update-imc-subcategory.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
// import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller(':company_id/imc/get-subcategories')

// @UseGuards(JwtAuthGuard, RolesGuard)
export class ImcSubCategoryController {
  constructor(private readonly imcSubCategoryService: ImcSubCategoryService) {}

  @Post()
  @Roles('admin', 'manager')
  create(@Body() createImcSubCategoryDto: CreateImcSubCategoryDto) {
    return this.imcSubCategoryService.create(createImcSubCategoryDto);
  }

  @Get()
  @Public()
  // @Roles('admin', 'manager', 'user')
  findAll(@Query('company_id') company_id: string) {
    return this.imcSubCategoryService.findAll(company_id);
  }

  @Get('by-category/:category_id')
  @Public()
  // @Roles('admin', 'manager', 'user')
  findByCategory(
    @Query('company_id') company_id: string,
    @Param('category_id') category_id: string,
  ) {
    return this.imcSubCategoryService.findByCategory(company_id, category_id);
  }

  @Get(':category_id/:id')
  @Public()
  @Roles('admin', 'manager', 'user')
  findOne(
    @Query('company_id') company_id: string,
    @Param('category_id') category_id: string,
    @Param('id') id: string,
  ) {
    return this.imcSubCategoryService.findOne(company_id, category_id, id);
  }

  @Patch(':category_id/:id')
  @Public()

  // @Roles('admin', 'manager')
  update(
    @Query('company_id') company_id: string,
    @Param('category_id') category_id: string,
    @Param('id') id: string,
    @Body() updateImcSubCategoryDto: UpdateImcSubCategoryDto,
  ) {
    return this.imcSubCategoryService.update(
      company_id,
      category_id,
      id,
      updateImcSubCategoryDto,
    );
  }

  @Delete(':category_id/:id')
  @Public()
  // @Roles('admin')
  remove(
    @Query('company_id') company_id: string,
    @Param('category_id') category_id: string,
    @Param('id') id: string,
  ) {
    return this.imcSubCategoryService.remove(company_id, category_id, id);
  }
}
