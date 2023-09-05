import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MaxLength(250)
  @IsNotEmpty()
  name: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  link: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsString()
  description: string;
}
