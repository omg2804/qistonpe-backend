import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { POStatus } from '../../common/enums';

@Injectable()
export class PaymentsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
  ) {}

async create(dto: CreatePaymentDto) {
  return this.dataSource.transaction(async manager => {
    const po = await manager.findOne(PurchaseOrder, {
      where: { id: dto.purchaseOrderId },
    });

    if (!po) throw new NotFoundException('Purchase Order not found');

    const existingPayments = await manager.find(Payment, {
      where: { poId: po.id },
    });

    const totalPaid = existingPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const outstanding = Number(po.totalAmount) - totalPaid;

    if (dto.amount > outstanding)
      throw new BadRequestException('Payment exceeds outstanding amount');

    if (dto.amount <= 0)
      throw new BadRequestException('Payment must be positive');

    // generate payment reference
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await manager.count(Payment);
    const paymentReference = `PAY-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    const payment = manager.create(Payment, {
      paymentReference,
      poId: po.id, // 🔥 DIRECT FK WRITE
      paymentDate: new Date(dto.paymentDate),
      amount: dto.amount,
      method: dto.method,
      notes: dto.notes,
    });

    await manager.save(payment);

    const newTotalPaid = totalPaid + dto.amount;
    const totalAmount = Number(po.totalAmount);

    if (newTotalPaid >= totalAmount) {
      po.status = POStatus.FULLY_PAID;
    } else if (newTotalPaid > 0) {
      po.status = POStatus.PARTIALLY_PAID;
    }

    await manager.save(po);

    return payment;
  });
}


  findAll() {
    return this.paymentRepo.find({ relations: ['purchaseOrder'] });
  }

  async findOne(id: number) {
    const p = await this.paymentRepo.findOne({
      where: { id },
      relations: ['purchaseOrder'],
    });
    if (!p) throw new NotFoundException('Payment not found');
    return p;
  }

  async clearAll() {
  await this.paymentRepo.clear();
  return { message: 'All payments deleted' };
}

async dropTable() {
  await this.paymentRepo.query('DROP TABLE IF EXISTS payments CASCADE');
  return { message: 'payments table dropped' };
}


}
