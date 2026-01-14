import { IsArray, IsDateString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePoItemDto } from './create-po-item.dto';

export class CreatePurchaseOrderDto {
  @IsInt()
  vendorId: number;

  @IsDateString()
  poDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePoItemDto)
  items: CreatePoItemDto[];
}
