import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class SigninUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  password: string;
}
