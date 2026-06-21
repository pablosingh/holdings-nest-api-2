import { IsString, IsNumber, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateOperationDto {
  @IsString()
  @MinLength(1)
  ticker: string;

  @IsNumber()
  number: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;

  @IsBoolean()
  buy: boolean;

  @IsOptional()
  @IsString()
  exchange?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNumber()
  user_id: number;
}
