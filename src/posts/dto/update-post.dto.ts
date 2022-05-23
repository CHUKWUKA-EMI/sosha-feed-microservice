import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  content: string;
}
