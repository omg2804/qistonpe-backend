import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { POStatus } from '../../common/enums';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Payment } from '../payments/payment.entity';

@Entity('purchase_orders')
@Unique(['poNumber'])
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  poNumber: string;

  @ManyToOne(() => Vendor, vendor => vendor.purchaseOrders)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ type: 'date' })
  poDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: POStatus })
  status: POStatus;

  @OneToMany(() => PurchaseOrderItem, item => item.purchaseOrder, { cascade: true })
  items: PurchaseOrderItem[];

  
}
