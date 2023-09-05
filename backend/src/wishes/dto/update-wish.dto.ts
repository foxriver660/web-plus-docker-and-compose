import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsString()
  @MaxLength(250)
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  @IsOptional()
  link?: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
