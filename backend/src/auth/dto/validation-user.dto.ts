import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ValidationUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  id: number;
}
