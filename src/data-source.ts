import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Vendor } from './modules/vendors/vendor.entity';
import { PurchaseOrder } from './modules/purchase-orders/purchase-order.entity';
import { PurchaseOrderItem } from './modules/purchase-orders/purchase-order-item.entity';
import { Payment } from './modules/payments/payment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Omg@2804',
  database: 'qistonpe',
  entities: [Vendor, PurchaseOrder, PurchaseOrderItem, Payment],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
