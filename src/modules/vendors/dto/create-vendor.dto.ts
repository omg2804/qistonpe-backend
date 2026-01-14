import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentTerms, VendorStatus } from '../../../common/enums';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  contactPerson: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsEnum(PaymentTerms)
  paymentTerms: PaymentTerms;

  @IsEnum(VendorStatus)
  status: VendorStatus;
}
