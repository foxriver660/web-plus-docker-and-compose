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

export class UpdateRaiseWishDto extends PartialType(CreateWishDto) {
  @IsNumber()
  @Min(1)
  raised: number;
}
