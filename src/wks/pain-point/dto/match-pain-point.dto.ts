import { IsString, IsNotEmpty } from 'class-validator';

export class MatchPainPointDto {
  @IsString()
  @IsNotEmpty()
  query!: string; // Query untuk matching
}




