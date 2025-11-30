import { IsString, IsNotEmpty } from 'class-validator';

export class SearchPainPointDto {
  @IsString()
  @IsNotEmpty()
  q!: string; // Search query
}




