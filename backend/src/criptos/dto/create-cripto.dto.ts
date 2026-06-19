import { IsString, IsNumber, MinLength } from 'class-validator';

export class CreateCriptoDto {
  @IsString()
  @MinLength(1)
  ticker: string;

  @IsNumber()
  price: number;
}
