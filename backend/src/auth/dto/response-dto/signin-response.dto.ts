import { IsNotEmpty, IsString } from 'class-validator';

export class SigninResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
