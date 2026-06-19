import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateHoldingDto {
  @IsString()
  @MinLength(1)
  ticker: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  initial_price: number;

  @IsNumber()
  initial_total: number;

  @IsNumber()
  user_id: number;
}
