import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { POStatus } from '../../common/enums';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,

    @InjectRepository(PurchaseOrderItem)
    private itemRepo: Repository<PurchaseOrderItem>,
  ) {}

  async create(dto: CreatePurchaseOrderDto) {
    // calculate total
    let total = 0;
    for (const item of dto.items) {
      total += item.quantity * item.unitPrice;
    }

    const poDate = new Date(dto.poDate);
    const dueDate = new Date(poDate);
    dueDate.setDate(dueDate.getDate() + 30); // default 30 days

    // generate PO number
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.poRepo.count();
    const poNumber = `PO-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    const po = this.poRepo.create({
      poNumber,
      poDate,
      dueDate,
      totalAmount: total,
      status: POStatus.DRAFT,
      vendor: { id: dto.vendorId } as any, // just set FK
    });

    const savedPO = await this.poRepo.save(po);

    const items = dto.items.map(i =>
      this.itemRepo.create({
        ...i,
        purchaseOrder: savedPO,
      }),
    );

    await this.itemRepo.save(items);

    return savedPO;
  }

  findAll() {
    return this.poRepo.find({ relations: ['vendor'] });
  }

  async findOne(id: number) {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: ['vendor', 'items'],
    });

    if (!po) throw new NotFoundException('PO not found');

    return po;
  }

  async updateStatus(id: number, status: POStatus) {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) throw new NotFoundException('PO not found');

    po.status = status;
    return this.poRepo.save(po);
  }
}
