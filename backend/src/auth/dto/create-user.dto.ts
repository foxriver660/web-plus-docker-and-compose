import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  password: string;

  // ОПЦИОНАЛЬНО
  @IsString()
  @MaxLength(200)
  @IsOptional()
  about?: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  @IsOptional()
  avatar?: string;
}
