import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(64)
  @IsOptional()
  username?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  about?: string;

  @IsUrl(
    {
      protocols: ['http', 'https'],
    },
    { message: 'Avatar should be a valid URL' },
  )
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  password?: string;
}
