import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userFirstName: string;

  @IsNotEmpty()
  @IsString()
  userLastName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsOptional()
  @IsString()
  userImageUrl?: string;

  @IsOptional()
  @IsString()
  imagekit_fileId?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;
}
