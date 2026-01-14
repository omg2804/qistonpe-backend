import { IsDateString, IsEnum, IsInt, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { PaymentMethod } from '../../../common/enums';

export class CreatePaymentDto {
  @IsInt()
  purchaseOrderId: number;

  @IsDateString()
  paymentDate: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  notes?: string;
}
