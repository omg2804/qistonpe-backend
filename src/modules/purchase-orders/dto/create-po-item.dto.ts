import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePoItemDto {
  @IsNotEmpty()
  description: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
