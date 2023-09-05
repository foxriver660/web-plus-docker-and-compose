import {
  IsNumber,
  IsString,
  IsUrl,
  Min,
  MinLength,
  MaxLength,
  IsArray,
  ValidateNested,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Offer } from 'src/offers/entities/offer.entity';
// import { Offer } from './offer.dto';

export class UserWishesDto {
  @IsNumber()
  id: number;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  offers: Offer[];
}
