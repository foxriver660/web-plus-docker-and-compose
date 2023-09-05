import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl(
    {
      protocols: ['http', 'https'],
    },
    { message: 'Image should be a valid URL' },
  )
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  itemsId?: number[];
}
