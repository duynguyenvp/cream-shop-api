import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateModels1733471557334 implements MigrationInterface {
    name = 'UpdateModels1733471557334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9b451675cd9fe227a0dd5120e53"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_8167a065e6dd44e1a81bb11592b"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_20dc4152c040ab2173989493bd4"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_07b20a180cc41bd585ccc435905"`);
        await queryRunner.query(`ALTER TABLE "loyalty_point" DROP CONSTRAINT "FK_459d7cb0f005a23c1732b4bd921"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "inventoryInventoryId"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "menuItemMenuItemId"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "ingredientInventoryId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "paymentId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "inventoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD "menuItemId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD "ingredientId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "orderId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "employeeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_detail" ALTER COLUMN "orderId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loyalty_point" ALTER COLUMN "customerId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_point" ALTER COLUMN "customerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_detail" ALTER COLUMN "orderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "employeeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "ingredientId"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "menuItemId"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "inventoryId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentId"`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD "ingredientInventoryId" integer`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD "menuItemMenuItemId" integer`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD "inventoryInventoryId" integer`);
        await queryRunner.query(`ALTER TABLE "loyalty_point" ADD CONSTRAINT "FK_459d7cb0f005a23c1732b4bd921" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_07b20a180cc41bd585ccc435905" FOREIGN KEY ("ingredientInventoryId") REFERENCES "inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_20dc4152c040ab2173989493bd4" FOREIGN KEY ("menuItemMenuItemId") REFERENCES "menu_items"("menu_item_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_8167a065e6dd44e1a81bb11592b" FOREIGN KEY ("inventoryInventoryId") REFERENCES "inventory"("inventory_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9b451675cd9fe227a0dd5120e53" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
