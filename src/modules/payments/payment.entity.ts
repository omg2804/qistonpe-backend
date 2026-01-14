import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PaymentMethod } from '../../common/enums';

@Entity('payments')
@Unique(['paymentReference'])
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentReference: string;

  // 🔥 EXPLICIT FK ONLY
  @Column({ name: 'po_id' })
  poId: number;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ nullable: true })
  notes: string;
}
