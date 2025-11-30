import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateWorkingHourDto } from './create-working-hour.dto';

export class CreateBatchWorkingHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHourDto)
  workingHours!: CreateWorkingHourDto[];
}









