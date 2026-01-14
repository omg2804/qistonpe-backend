import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { PaymentTerms, VendorStatus } from '../../common/enums';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';


@Entity('vendors')
@Unique(['name'])
@Unique(['email'])
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contactPerson: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: PaymentTerms })
  paymentTerms: PaymentTerms;

  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.ACTIVE })
  status: VendorStatus;

  @OneToMany(() => PurchaseOrder, po => po.vendor)
  purchaseOrders: PurchaseOrder[];
}
