import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseOrder, po => po.items, { onDelete: 'CASCADE' })
  purchaseOrder: PurchaseOrder;

  @Column()
  description: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  unitPrice: number;
}
