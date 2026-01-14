import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsModule } from './modules/vendors/vendors.module';
import { Vendor } from './modules/vendors/vendor.entity';
import { PurchaseOrder } from './modules/purchase-orders/purchase-order.entity';
import { PurchaseOrderItem } from './modules/purchase-orders/purchase-order-item.entity';
import { Payment } from './modules/payments/payment.entity';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Omg@2804',
      database: 'qistonpe',
      autoLoadEntities: true,
      entities: [Vendor, PurchaseOrder, PurchaseOrderItem, Payment],
      synchronize: true, // IMPORTANT
    }),
    VendorsModule,
    PurchaseOrdersModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
