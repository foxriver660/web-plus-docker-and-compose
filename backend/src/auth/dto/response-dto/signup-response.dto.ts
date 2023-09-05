import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class SignupResponseDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  about: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
