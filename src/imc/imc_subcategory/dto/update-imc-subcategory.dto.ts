import { PartialType } from '@nestjs/mapped-types';
import { CreateImcSubCategoryDto } from './create-imc-subcategory.dto';

export class UpdateImcSubCategoryDto extends PartialType(
  CreateImcSubCategoryDto,
) {}
