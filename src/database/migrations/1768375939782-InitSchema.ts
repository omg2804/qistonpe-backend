import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1768375939782 implements MigrationInterface {
    name = 'InitSchema1768375939782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase_order_items" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitPrice" numeric(12,2) NOT NULL, "purchaseOrderId" integer, CONSTRAINT "PK_e8b7568d25c41e3290db596b312" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('CASH', 'CHEQUE', 'NEFT', 'RTGS', 'UPI')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "paymentReference" character varying NOT NULL, "paymentDate" date NOT NULL, "amount" numeric(12,2) NOT NULL, "method" "public"."payments_method_enum" NOT NULL, "notes" character varying, "po_id" integer, CONSTRAINT "UQ_609e73477743140ae29ae6de486" UNIQUE ("paymentReference"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_orders_status_enum" AS ENUM('DRAFT', 'APPROVED', 'PARTIALLY_PAID', 'FULLY_PAID')`);
        await queryRunner.query(`CREATE TABLE "purchase_orders" ("id" SERIAL NOT NULL, "poNumber" character varying NOT NULL, "poDate" date NOT NULL, "dueDate" date NOT NULL, "totalAmount" numeric(12,2) NOT NULL, "status" "public"."purchase_orders_status_enum" NOT NULL, "vendor_id" integer, CONSTRAINT "UQ_2e0fc7a6605393a9bd691cdcebe" UNIQUE ("poNumber"), CONSTRAINT "PK_05148947415204a897e8beb2553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vendors_paymentterms_enum" AS ENUM('7', '15', '30', '45', '60')`);
        await queryRunner.query(`CREATE TYPE "public"."vendors_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "vendors" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "contactPerson" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "paymentTerms" "public"."vendors_paymentterms_enum" NOT NULL, "status" "public"."vendors_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_3fe1343dbf2a7d9b7be1c27725a" UNIQUE ("email"), CONSTRAINT "UQ_83065ec2a2c5052786c122e95ba" UNIQUE ("name"), CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_1de7eb246940b05765d2c99a7ec" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_ea3b4b254f16e1dd64d8cf00ed7" FOREIGN KEY ("po_id") REFERENCES "purchase_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_346ae76b48e8f5042cf93b8df26" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_346ae76b48e8f5042cf93b8df26"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_ea3b4b254f16e1dd64d8cf00ed7"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_1de7eb246940b05765d2c99a7ec"`);
        await queryRunner.query(`DROP TABLE "vendors"`);
        await queryRunner.query(`DROP TYPE "public"."vendors_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."vendors_paymentterms_enum"`);
        await queryRunner.query(`DROP TABLE "purchase_orders"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
        await queryRunner.query(`DROP TABLE "purchase_order_items"`);
    }

}
