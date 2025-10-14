import { PartialType } from '@nestjs/mapped-types';
import { CreateImcUomDto } from './create-imc-uom.dto';

export class UpdateImcUomDto extends PartialType(CreateImcUomDto) {}
