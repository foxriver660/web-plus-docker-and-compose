import { IsArray, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  itemsId?: number[];
}
