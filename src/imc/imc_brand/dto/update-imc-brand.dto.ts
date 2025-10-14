import { PartialType } from '@nestjs/mapped-types';
import { CreateImcBrandDto } from './create-imc-brand.dto';

export class UpdateImcBrandDto extends PartialType(CreateImcBrandDto) {}
